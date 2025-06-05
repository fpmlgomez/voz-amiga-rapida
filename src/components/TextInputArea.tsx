
import React from 'react';
import { Play, Pause, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface TextInputAreaProps {
  text: string;
  setText: (text: string) => void;
  autoSpeak: boolean;
  setAutoSpeak: (autoSpeak: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onTextChange: (text: string) => void;
}

const TextInputArea: React.FC<TextInputAreaProps> = ({
  text,
  setText,
  autoSpeak,
  setAutoSpeak,
  showSettings,
  setShowSettings,
  isSpeaking,
  onSpeak,
  onStop,
  onTextChange,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onSpeak();
    }
  };

  const handleClearText = () => {
    setText('');
    onTextChange('');
  };

  return (
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
              onClick={handleClearText}
              disabled={!text.trim()}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50"
              title="Borrar todo el texto"
            >
              <Trash2 size={16} />
              Borrar Todo
            </Button>
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
          onChange={(e) => {
            setText(e.target.value);
            onTextChange(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          placeholder={autoSpeak 
            ? "Escribe aquí... Las palabras se pronunciarán automáticamente al terminar de escribirlas" 
            : "Escribe aquí tu mensaje... (Ctrl + Enter para reproducir)"
          }
          className="min-h-[200px] text-lg resize-none border-2 focus:border-blue-400 transition-colors"
        />
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onSpeak}
            disabled={!text.trim() || isSpeaking}
            size="lg"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <Play size={20} />
            Reproducir Todo
          </Button>
          
          {isSpeaking && (
            <Button
              onClick={onStop}
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
  );
};

export default TextInputArea;
