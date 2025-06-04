
import React, { useState } from 'react';
import AppHeader from './AppHeader';
import TextInputArea from './TextInputArea';
import VoiceSettings from './VoiceSettings';
import QuickPhrases from './QuickPhrases';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

const TextToSpeechApp = () => {
  const [text, setText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    language,
    setLanguage,
    speak,
    stopSpeaking,
    handleAutoSpeak
  } = useSpeechSynthesis();

  const handleSpeak = () => speak(text);

  const handleTextChange = (newText: string) => {
    handleAutoSpeak(newText, autoSpeak);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <AppHeader />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Text Input Area */}
        <div className="lg:col-span-2">
          <TextInputArea
            text={text}
            setText={setText}
            autoSpeak={autoSpeak}
            setAutoSpeak={setAutoSpeak}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            isSpeaking={isSpeaking}
            onSpeak={handleSpeak}
            onStop={stopSpeaking}
            onTextChange={handleTextChange}
          />
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
