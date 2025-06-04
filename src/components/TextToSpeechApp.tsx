
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const voiceList: Voice[] = availableVoices
        .filter(voice => voice.lang.startsWith('es') || voice.lang.startsWith('en'))
        .map(voice => ({
          id: voice.voiceURI || voice.name,
          name: voice.name,
          lang: voice.lang,
          gender: voice.name.toLowerCase().includes('female') || 
                 voice.name.toLowerCase().includes('mujer') ||
                 voice.name.toLowerCase().includes('maria') ||
                 voice.name.toLowerCase().includes('sofia') ? 'female' : 'male'
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

  const speak = (textToSpeak: string = text) => {
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
  };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <Volume2 className="text-blue-600" size={40} />
          Comunicador de Voz
        </h1>
        <p className="text-lg text-gray-600">
          Herramienta de comunicación para convertir texto a voz de manera rápida y sencilla
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
              
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe aquí tu mensaje... (Ctrl + Enter para reproducir)"
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
                  Reproducir Voz
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
                Tip: Usa Ctrl + Enter para reproducir rápidamente
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
