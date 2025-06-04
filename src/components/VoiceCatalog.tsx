import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Check, User, Users } from 'lucide-react';

interface Voice {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female';
}

interface VoiceCatalogProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onVoiceSelect: (voice: Voice) => void;
  language: string;
}

const VoiceCatalog: React.FC<VoiceCatalogProps> = ({
  voices,
  selectedVoice,
  onVoiceSelect,
  language,
}) => {
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  // Función para limpiar el nombre de la voz (quitar Microsoft, etc.)
  const cleanVoiceName = (name: string) => {
    return name
      .replace(/Microsoft\s+/gi, '')
      .replace(/\s+Microsoft/gi, '')
      .trim();
  };

  const testVoice = (voice: Voice) => {
    setTestingVoice(voice.id);
    speechSynthesis.cancel();
    
    const cleanName = cleanVoiceName(voice.name);
    const testText = language.startsWith('es') 
      ? `Hola, soy ${cleanName}. Esta es mi voz.`
      : `Hello, I am ${cleanName}. This is my voice.`;
    
    const utterance = new SpeechSynthesisUtterance(testText);
    
    const systemVoice = speechSynthesis.getVoices().find(v => 
      v.voiceURI === voice.id || v.name === voice.name
    );
    
    if (systemVoice) {
      utterance.voice = systemVoice;
    }
    
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => setTestingVoice(null);
    utterance.onerror = () => setTestingVoice(null);
    
    speechSynthesis.speak(utterance);
  };

  const filteredVoices = voices.filter(v => v.lang.startsWith(language.split('-')[0]));
  const maleVoices = filteredVoices.filter(v => v.gender === 'male');
  const femaleVoices = filteredVoices.filter(v => v.gender === 'female');

  const VoiceCard = ({ voice }: { voice: Voice }) => (
    <Card 
      key={voice.id} 
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        selectedVoice?.id === voice.id 
          ? 'ring-2 ring-blue-500 bg-blue-50' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onVoiceSelect(voice)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {voice.gender === 'male' ? (
              <User size={16} className="text-blue-600" />
            ) : (
              <Users size={16} className="text-pink-600" />
            )}
            <h4 className="font-medium text-gray-800">
              {cleanVoiceName(voice.name)}
            </h4>
            {selectedVoice?.id === voice.id && (
              <Check size={16} className="text-green-600" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {voice.gender === 'female' ? 'Voz femenina' : 'Voz masculina'} - {voice.lang}
          </p>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            testVoice(voice);
          }}
          disabled={testingVoice === voice.id}
          className="ml-2"
        >
          <Play size={14} />
          {testingVoice === voice.id ? 'Probando...' : 'Probar'}
        </Button>
      </div>
    </Card>
  );

  return (
    <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Catálogo de Voces</h3>
      
      <div className="space-y-6">
        {/* Voces Femeninas */}
        {femaleVoices.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Users size={18} className="text-pink-600" />
              Voces Femeninas ({femaleVoices.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {femaleVoices.map((voice) => (
                <VoiceCard key={voice.id} voice={voice} />
              ))}
            </div>
          </div>
        )}

        {/* Voces Masculinas */}
        {maleVoices.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Voces Masculinas ({maleVoices.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {maleVoices.map((voice) => (
                <VoiceCard key={voice.id} voice={voice} />
              ))}
            </div>
          </div>
        )}

        {filteredVoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay voces disponibles para el idioma seleccionado
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Haz clic en "Probar" para escuchar cada voz antes de seleccionarla
        </p>
      </div>
    </Card>
  );
};

export default VoiceCatalog;
