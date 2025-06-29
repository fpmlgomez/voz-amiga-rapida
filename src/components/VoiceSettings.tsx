
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, List, Volume2, User } from 'lucide-react';
import VoiceCatalog from './VoiceCatalog';

interface Voice {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female';
}

interface VoiceSettingsProps {
  voices: Voice[];
  selectedVoice: Voice | null;
  onVoiceChange: (voice: Voice) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  voices,
  selectedVoice,
  onVoiceChange,
  language,
  onLanguageChange,
}) => {
  const [showCatalog, setShowCatalog] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Configuración de Voz</h3>
              <p className="text-sm text-gray-500">Personaliza tu experiencia de voz</p>
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Volume2 size={16} className="text-gray-600" />
              Idioma
            </label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                <SelectItem value="en-US">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Voice Display */}
          {selectedVoice && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-1">{selectedVoice.name}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedVoice.gender === 'female' 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedVoice.gender === 'male' ? 'Voz masculina' : 'Voz femenina'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {selectedVoice.lang}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Catalog Button */}
          <Button
            onClick={() => setShowCatalog(!showCatalog)}
            className={`w-full flex items-center justify-center gap-2 h-12 text-base font-medium rounded-xl transition-all duration-200 ${
              showCatalog 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg' 
                : 'bg-white border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50'
            }`}
            variant={showCatalog ? "default" : "outline"}
          >
            <List size={18} />
            {showCatalog ? 'Ocultar Catálogo de Voces' : 'Explorar Catálogo de Voces'}
          </Button>
        </div>
      </Card>

      {/* Voice Catalog */}
      {showCatalog && (
        <VoiceCatalog
          voices={voices}
          selectedVoice={selectedVoice}
          onVoiceSelect={onVoiceChange}
          language={language}
        />
      )}
    </div>
  );
};

export default VoiceSettings;
