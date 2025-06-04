
import { useState, useEffect, useRef, useCallback } from 'react';

interface Voice {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female';
}

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('es-ES');
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenTextRef = useRef('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Función mejorada para detectar género basándose en nombres
  const detectGender = useCallback((voiceName: string): 'male' | 'female' => {
    const name = voiceName.toLowerCase();
    
    // Nombres femeninos comunes en voces de síntesis
    const femaleNames = [
      'helena', 'maria', 'sofia', 'elena', 'carmen', 'pilar', 'ana', 'lucia',
      'female', 'mujer', 'woman', 'sabina', 'ines', 'paulina', 'monica',
      'zira', 'cortana', 'hazel', 'susan', 'karen', 'samantha', 'victoria',
      'serena', 'alex', 'allison', 'ava', 'nicky', 'zoë', 'amelie', 'anna',
      'carmit', 'damayanti', 'ellen', 'fiona', 'ioana', 'joana', 'kanya',
      'kyoko', 'laura', 'lekha', 'luca', 'luciana', 'mariska', 'melina',
      'milena', 'moira', 'nora', 'paulina', 'raveena', 'salli', 'sin-ji',
      'tatyana', 'valentina', 'veena', 'vicki', 'yuki'
    ];
    
    // Nombres masculinos comunes en voces de síntesis
    const maleNames = [
      'diego', 'jorge', 'pablo', 'carlos', 'miguel', 'alberto', 'fernando',
      'male', 'hombre', 'man', 'david', 'mark', 'daniel', 'francisco',
      'ricardo', 'manuel', 'antonio', 'jose', 'juan', 'luis', 'pedro',
      'alex', 'joey', 'justin', 'matthew', 'brian', 'russell', 'geraint',
      'giorgio', 'hans', 'karl', 'mathieu', 'takumi', 'aditi', 'ravi',
      'christian', 'felipe', 'ivan', 'maxim', 'ricardo', 'ruben'
    ];
    
    // Verificar si contiene algún nombre femenino
    for (const femaleName of femaleNames) {
      if (name.includes(femaleName)) {
        return 'female';
      }
    }
    
    // Verificar si contiene algún nombre masculino
    for (const maleName of maleNames) {
      if (name.includes(maleName)) {
        return 'male';
      }
    }
    
    return 'male';
  }, []);

  // Función para limpiar recursos de síntesis anteriores
  const cleanupSynthesis = useCallback(() => {
    if (utteranceRef.current) {
      utteranceRef.current.onstart = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
      utteranceRef.current = null;
    }
    speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const voiceList: Voice[] = availableVoices
        .filter(voice => voice.lang.startsWith('es') || voice.lang.startsWith('en'))
        .map(voice => ({
          id: voice.voiceURI || voice.name,
          name: voice.name,
          lang: voice.lang,
          gender: detectGender(voice.name)
        }));
      
      setVoices(voiceList);
      
      if (voiceList.length > 0 && !selectedVoice) {
        const defaultVoice = voiceList.find(v => v.lang.startsWith('es')) || voiceList[0];
        setSelectedVoice(defaultVoice);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      cleanupSynthesis();
    };
  }, [selectedVoice, detectGender, cleanupSynthesis]);

  const speak = useCallback((textToSpeak: string) => {
    if (!textToSpeak.trim()) return;
    
    // Limpiar síntesis anterior
    cleanupSynthesis();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    
    if (selectedVoice) {
      const voice = speechSynthesis.getVoices().find(v => 
        v.voiceURI === selectedVoice.id || v.name === selectedVoice.name
      );
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    speechSynthesis.speak(utterance);
    lastSpokenTextRef.current = textToSpeak;
  }, [selectedVoice, language, cleanupSynthesis]);

  const stopSpeaking = useCallback(() => {
    cleanupSynthesis();
    setIsSpeaking(false);
  }, [cleanupSynthesis]);

  const handleAutoSpeak = useCallback((newText: string, autoSpeak: boolean) => {
    if (!autoSpeak) return;
    
    // Limpiar el timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Si el texto está vacío, no hacer nada
    if (!newText.trim()) {
      lastSpokenTextRef.current = '';
      return;
    }
    
    // Detectar si se terminó una palabra (espacio o puntuación al final)
    const lastChar = newText[newText.length - 1];
    const isWordEnding = /[\s.,;:!?]/.test(lastChar);
    
    if (isWordEnding) {
      // Obtener la última palabra completa
      const words = newText.trim().split(/\s+/);
      const lastWord = words[words.length - 1]?.replace(/[.,;:!?]/g, '');
      
      if (lastWord && lastWord !== lastSpokenTextRef.current) {
        // Pequeña pausa antes de reproducir para evitar interrupciones
        typingTimeoutRef.current = setTimeout(() => {
          speak(lastWord);
        }, 300);
      }
    }
  }, [speak]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      cleanupSynthesis();
    };
  }, [cleanupSynthesis]);

  return {
    voices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    language,
    setLanguage,
    speak,
    stopSpeaking,
    handleAutoSpeak
  };
};
