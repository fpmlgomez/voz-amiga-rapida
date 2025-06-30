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

  // Función mejorada para detectar género con mejor precisión
  const detectGender = useCallback((voiceName: string): 'male' | 'female' => {
    const name = voiceName.toLowerCase();
    
    // Indicadores explícitos de género - más específicos primero
    const femaleIndicators = [
      'female', 'mujer', 'woman', 'femenina', 'feminine', 'fem', 'girl', 'lady', 'chica'
    ];
    
    const maleIndicators = [
      'male', 'hombre', 'man', 'masculino', 'masculine', 'masc', 'boy', 'chico'
    ];
    
    // Verificar indicadores explícitos primero
    for (const indicator of femaleIndicators) {
      if (name.includes(indicator)) {
        return 'female';
      }
    }
    
    for (const indicator of maleIndicators) {
      if (name.includes(indicator)) {
        return 'male';
      }
    }
    
    // Nombres específicos femeninos (más precisos)
    const femaleNames = [
      // Nombres en español - más específicos
      'helena', 'maria', 'sofia', 'elena', 'carmen', 'pilar', 'ana', 'lucia',
      'sabina', 'ines', 'paulina', 'monica', 'paloma', 'esperanza', 'dolores',
      'remedios', 'amparo', 'consuelo', 'mercedes', 'rosario', 'beatriz',
      'cristina', 'patricia', 'marta', 'sara', 'laura', 'andrea', 'isabel',
      
      // Nombres en inglés - más específicos
      'zira', 'cortana', 'hazel', 'susan', 'karen', 'samantha', 'victoria', 
      'serena', 'allison', 'ava', 'nicky', 'zoë', 'amelie', 'anna', 'carmit', 
      'damayanti', 'ellen', 'fiona', 'ioana', 'joana', 'kanya', 'kyoko', 
      'lekha', 'luciana', 'mariska', 'melina', 'milena', 'moira', 'nora', 
      'raveena', 'salli', 'tatyana', 'valentina', 'veena', 'vicki', 'yuki', 
      'ivy', 'joanna', 'kendra', 'kimberly', 'nicole', 'emma', 'amy',
      'chloe', 'grace', 'heather', 'jenny', 'julie', 'kate', 'linda',
      'mary', 'nancy', 'ruth', 'sandra', 'stephanie', 'tessa', 'wendy'
    ];
    
    // Nombres específicos masculinos (más precisos)
    const maleNames = [
      // Nombres en español
      'diego', 'jorge', 'pablo', 'carlos', 'miguel', 'alberto', 'fernando',
      'francisco', 'ricardo', 'manuel', 'antonio', 'jose', 'juan', 'luis', 
      'pedro', 'rafael', 'alejandro', 'javier', 'daniel', 'eduardo',
      
      // Nombres en inglés
      'david', 'mark', 'joey', 'justin', 'matthew', 'brian', 'russell', 
      'geraint', 'giorgio', 'hans', 'karl', 'mathieu', 'takumi', 'ravi',
      'christian', 'felipe', 'ivan', 'maxim', 'ruben', 'alex', 'eric',
      'john', 'michael', 'robert', 'william', 'james', 'thomas', 'christopher',
      'charles', 'steven', 'kenneth', 'andrew', 'joshua', 'kevin', 'brian'
    ];
    
    // Verificar nombres femeninos - usar coincidencia más estricta
    for (const femaleName of femaleNames) {
      // Buscar el nombre como palabra completa o al principio/final
      const regex = new RegExp(`\\b${femaleName}\\b|^${femaleName}|${femaleName}$`, 'i');
      if (regex.test(name)) {
        return 'female';
      }
    }
    
    // Verificar nombres masculinos - usar coincidencia más estricta
    for (const maleName of maleNames) {
      // Buscar el nombre como palabra completa o al principio/final
      const regex = new RegExp(`\\b${maleName}\\b|^${maleName}|${maleName}$`, 'i');
      if (regex.test(name)) {
        return 'male';
      }
    }
    
    // Casos especiales por patrones
    if (name.includes('microsoft') && name.includes('zira')) return 'female';
    if (name.includes('microsoft') && name.includes('david')) return 'male';
    
    // Si no se puede determinar, usar una heurística más conservadora
    // Revisar si hay más indicios en el nombre completo
    const wordCount = name.split(' ').length;
    if (wordCount > 1) {
      const words = name.split(' ');
      for (const word of words) {
        if (femaleNames.includes(word)) return 'female';
        if (maleNames.includes(word)) return 'male';
      }
    }
    
    // Por defecto, asumir masculino solo si no hay dudas
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
      console.log('Available voices:', availableVoices.map(v => ({ name: v.name, lang: v.lang })));
      
      const voiceList: Voice[] = availableVoices
        .filter(voice => voice.lang.startsWith('es') || voice.lang.startsWith('en'))
        .map(voice => {
          const detectedGender = detectGender(voice.name);
          console.log(`Voice: ${voice.name} -> Gender: ${detectedGender}`);
          
          return {
            id: voice.voiceURI || voice.name,
            name: voice.name,
            lang: voice.lang,
            gender: detectedGender
          };
        })
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
      
      console.log('Processed voices:', voiceList);
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
        
        console.log('Selected default voice:', preferredVoice);
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
