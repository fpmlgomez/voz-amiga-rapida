
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Check, User, Users, Volume2, Sparkles } from 'lucide-react';

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
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
        selectedVoice?.id === voice.id 
          ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md transform scale-[1.02]' 
          : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'
      }`}
      onClick={() => onVoiceSelect(voice)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${
              voice.gender === 'male' 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-pink-100 text-pink-600'
            }`}>
              {voice.gender === 'male' ? (
                <User size={16} />
              ) : (
                <Users size={16} />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                {cleanVoiceName(voice.name)}
                {selectedVoice?.id === voice.id && (
                  <div className="flex items-center gap-1">
                    <Check size={16} className="text-green-600" />
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Seleccionada
                    </span>
                  </div>
                )}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  voice.gender === 'female' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {voice.gender === 'female' ? 'Femenina' : 'Masculina'}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {voice.lang}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            testVoice(voice);
          }}
          disabled={testingVoice === voice.id}
          className={`ml-3 flex items-center gap-2 transition-all duration-200 ${
            testingVoice === voice.id
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Play size={14} />
          {testingVoice === voice.id ? 'Probando...' : 'Probar'}
        </Button>
      </div>
    </Card>
  );

  return (
    <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Volume2 size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Catálogo de Voces</h3>
          <p className="text-sm text-gray-500">Descubre y selecciona tu voz favorita</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Voces Femeninas */}
        {femaleVoices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Users size={18} className="text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Voces Femeninas</h4>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                {femaleVoices.length} disponibles
              </span>
            </div>
            <div className="grid gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {femaleVoices.map((voice) => (
                <VoiceCard key={voice.id} voice={voice} />
              ))}
            </div>
          </div>
        )}

        {/* Voces Masculinas */}
        {maleVoices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={18} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700">Voces Masculinas</h4>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {maleVoices.length} disponibles
              </span>
            </div>
            <div className="grid gap-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {maleVoices.map((voice) => (
                <VoiceCard key={voice.id} voice={voice} />
              ))}
            </div>
          </div>
        )}

        {filteredVoices.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Volume2 size={24} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">No hay voces disponibles</h4>
            <p className="text-gray-500">No se encontraron voces para el idioma seleccionado</p>
          </div>
        )}
      </div>

      {/* Tip Footer */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Sparkles size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Consejo</p>
            <p className="text-sm text-blue-700">
              Haz clic en "Probar" para escuchar cada voz antes de seleccionarla. 
              La voz seleccionada se marcará con un indicador verde.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VoiceCatalog;
