
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Users } from 'lucide-react';

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
  const maleVoices = voices.filter(v => v.gender === 'male');
  const femaleVoices = voices.filter(v => v.gender === 'female');

  return (
    <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Voz</h3>
      
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

        {/* Voice Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Voz
          </label>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant={selectedVoice?.gender === 'male' ? 'default' : 'outline'}
              onClick={() => {
                const voice = maleVoices.find(v => v.lang.startsWith(language.split('-')[0])) || maleVoices[0];
                if (voice) onVoiceChange(voice);
              }}
              className="flex items-center gap-2 h-12"
            >
              <User size={18} />
              Masculina
            </Button>
            
            <Button
              variant={selectedVoice?.gender === 'female' ? 'default' : 'outline'}
              onClick={() => {
                const voice = femaleVoices.find(v => v.lang.startsWith(language.split('-')[0])) || femaleVoices[0];
                if (voice) onVoiceChange(voice);
              }}
              className="flex items-center gap-2 h-12"
            >
              <Users size={18} />
              Femenina
            </Button>
          </div>
        </div>

        {/* Specific Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voz Específica
          </label>
          <Select 
            value={selectedVoice?.id || ''} 
            onValueChange={(value) => {
              const voice = voices.find(v => v.id === value);
              if (voice) onVoiceChange(voice);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una voz" />
            </SelectTrigger>
            <SelectContent>
              {voices
                .filter(v => v.lang.startsWith(language.split('-')[0]))
                .map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name} ({voice.gender === 'male' ? 'Hombre' : 'Mujer'})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

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
      </div>
    </Card>
  );
};

export default VoiceSettings;
