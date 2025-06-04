import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, Mic, Settings, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import VoiceSettings from './VoiceSettings';
import QuickPhrases from './QuickPhrases';

interface Voice {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female';
}

const TextToSpeechApp = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('es-ES');
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenTextRef = useRef('');

  // Función mejorada para detectar género basándose en nombres
  const detectGender = (voiceName: string): 'male' | 'female' => {
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
    
    // Fallback: si no se puede determinar, asumimos masculino por defecto
    return 'male';
  };

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
    };
  }, [selectedVoice]);

  // Función para detectar cuando el usuario termina de escribir una palabra
  const handleTextChange = (newText: string) => {
    setText(newText);
    
    if (!autoSpeak) return;
    
    // Limpiar el timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
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
  };

  const speak = useCallback((textToSpeak: string = text) => {
    if (!textToSpeak.trim()) return;
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
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
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
    lastSpokenTextRef.current = textToSpeak;
  }, [text, selectedVoice, language]);

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      speak();
    }
  };

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Volume2 className="text-blue-600" size={40} />
          ExpreSIA
        </h1>
        <p className="text-lg text-gray-600">
          Tu comunicador de voz personal con IA para una comunicación rápida y sencilla
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Text Input Area */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Escribe tu mensaje</h2>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autoSpeak}
                      onChange={(e) => setAutoSpeak(e.target.checked)}
                      className="rounded"
                    />
                    Auto-pronunciar
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Configuración
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={autoSpeak 
                  ? "Escribe aquí... Las palabras se pronunciarán automáticamente al terminar de escribirlas" 
                  : "Escribe aquí tu mensaje... (Ctrl + Enter para reproducir)"
                }
                className="min-h-[200px] text-lg resize-none border-2 focus:border-blue-400 transition-colors"
              />
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => speak()}
                  disabled={!text.trim() || isSpeaking}
                  size="lg"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform transition-all hover:scale-105"
                >
                  <Play size={20} />
                  Reproducir Todo
                </Button>
                
                {isSpeaking && (
                  <Button
                    onClick={stopSpeaking}
                    size="lg"
                    variant="destructive"
                    className="flex items-center gap-2 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
                  >
                    <Pause size={20} />
                    Detener
                  </Button>
                )}
              </div>
              
              <div className="text-center text-sm text-gray-500">
                {autoSpeak 
                  ? "Modo auto-pronunciar activado. Las palabras se pronuncian al escribir un espacio o puntuación."
                  : "Usa Ctrl + Enter para reproducir rápidamente o activa el modo auto-pronunciar"
                }
              </div>
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Voice Settings */}
          {showSettings && (
            <VoiceSettings
              voices={voices}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              language={language}
              onLanguageChange={setLanguage}
            />
          )}
          
          {/* Quick Phrases */}
          <QuickPhrases onPhraseSelect={speak} />
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechApp;
