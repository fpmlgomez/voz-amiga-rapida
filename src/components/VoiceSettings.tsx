
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, List } from 'lucide-react';
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
    <div className="space-y-4">
      <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings size={18} />
          Configuración de Voz
        </h3>
        
        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es-ES">Español</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Voice Display */}
          {selectedVoice && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Voz actual:</strong> {selectedVoice.name}
              </p>
              <p className="text-sm text-blue-600">
                {selectedVoice.gender === 'male' ? 'Voz masculina' : 'Voz femenina'} - {selectedVoice.lang}
              </p>
            </div>
          )}

          {/* Toggle Catalog Button */}
          <Button
            onClick={() => setShowCatalog(!showCatalog)}
            className="w-full flex items-center gap-2"
            variant={showCatalog ? "default" : "outline"}
          >
            <List size={16} />
            {showCatalog ? 'Ocultar Catálogo' : 'Mostrar Catálogo de Voces'}
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
