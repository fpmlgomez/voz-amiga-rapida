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

  // Función mejorada para detectar género con más nombres femeninos
  const detectGender = useCallback((voiceName: string): 'male' | 'female' => {
    const name = voiceName.toLowerCase();
    
    // Nombres femeninos expandidos, incluyendo voces más naturales
    const femaleNames = [
      // Nombres en español
      'helena', 'maria', 'sofia', 'elena', 'carmen', 'pilar', 'ana', 'lucia',
      'sabina', 'ines', 'paulina', 'monica', 'paloma', 'esperanza', 'dolores',
      'remedios', 'amparo', 'consuelo', 'mercedes', 'rosario', 'beatriz',
      'cristina', 'patricia', 'marta', 'sara', 'laura', 'andrea',
      
      // Nombres en inglés y otros idiomas
      'female', 'mujer', 'woman', 'zira', 'cortana', 'hazel', 'susan', 'karen', 
      'samantha', 'victoria', 'serena', 'alex', 'allison', 'ava', 'nicky', 'zoë', 
      'amelie', 'anna', 'carmit', 'damayanti', 'ellen', 'fiona', 'ioana', 'joana', 
      'kanya', 'kyoko', 'lekha', 'luca', 'luciana', 'mariska', 'melina',
      'milena', 'moira', 'nora', 'raveena', 'salli', 'sin-ji',
      'tatyana', 'valentina', 'veena', 'vicki', 'yuki', 'ivy', 'joanna',
      'kendra', 'kimberly', 'salli', 'joey', 'nicole', 'emma', 'amy',
      'chloe', 'grace', 'heather', 'jenny', 'julie', 'kate', 'linda',
      'mary', 'nancy', 'ruth', 'sandra', 'stephanie', 'tessa', 'wendy',
      
      // Indicadores de género
      'femenina', 'feminine', 'fem', 'girl', 'lady', 'woman', 'chica'
    ];
    
    // Nombres masculinos
    const maleNames = [
      'diego', 'jorge', 'pablo', 'carlos', 'miguel', 'alberto', 'fernando',
      'male', 'hombre', 'man', 'david', 'mark', 'daniel', 'francisco',
      'ricardo', 'manuel', 'antonio', 'jose', 'juan', 'luis', 'pedro',
      'joey', 'justin', 'matthew', 'brian', 'russell', 'geraint',
      'giorgio', 'hans', 'karl', 'mathieu', 'takumi', 'ravi',
      'christian', 'felipe', 'ivan', 'maxim', 'ruben'
    ];
    
    // Verificar nombres femeninos primero (más específicos)
    for (const femaleName of femaleNames) {
      if (name.includes(femaleName)) {
        return 'female';
      }
    }
    
    // Verificar nombres masculinos
    for (const maleName of maleNames) {
      if (name.includes(maleName)) {
        return 'male';
      }
    }
    
    // Por defecto, asumir masculino si no se puede determinar
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
        }))
        // Ordenar priorizando voces femeninas naturales
        .sort((a, b) => {
          // Priorizar voces femeninas
          if (a.gender === 'female' && b.gender === 'male') return -1;
          if (a.gender === 'male' && b.gender === 'female') return 1;
          
          // Dentro del mismo género, priorizar nombres más naturales
          const naturalFemaleNames = ['helena', 'maria', 'sofia', 'elena', 'lucia', 'paloma'];
          const aIsNatural = naturalFemaleNames.some(name => a.name.toLowerCase().includes(name));
          const bIsNatural = naturalFemaleNames.some(name => b.name.toLowerCase().includes(name));
          
          if (aIsNatural && !bIsNatural) return -1;
          if (!aIsNatural && bIsNatural) return 1;
          
          return a.name.localeCompare(b.name);
        });
      
      setVoices(voiceList);
      
      // Seleccionar voz por defecto: priorizar voz femenina española natural
      if (voiceList.length > 0 && !selectedVoice) {
        const preferredVoice = voiceList.find(v => 
          v.lang.startsWith('es') && 
          v.gender === 'female' &&
          (v.name.toLowerCase().includes('helena') || 
           v.name.toLowerCase().includes('maria') ||
           v.name.toLowerCase().includes('sofia') ||
           v.name.toLowerCase().includes('elena') ||
           v.name.toLowerCase().includes('lucia'))
        ) || voiceList.find(v => v.lang.startsWith('es') && v.gender === 'female') 
          || voiceList.find(v => v.lang.startsWith('es')) 
          || voiceList[0];
        
        setSelectedVoice(preferredVoice);
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
