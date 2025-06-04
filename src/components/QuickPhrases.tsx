
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickPhrasesProps {
  onPhraseSelect: (phrase: string) => void;
}

const QuickPhrases: React.FC<QuickPhrasesProps> = ({ onPhraseSelect }) => {
  const phrases = [
    "Hola, ¿cómo estás?",
    "Gracias",
    "Por favor",
    "Disculpa",
    "No entiendo",
    "¿Puedes repetir?",
    "Sí",
    "No",
    "¿Me ayudas?",
    "Hasta luego",
    "Buenos días",
    "Buenas tardes",
    "¿Cómo te llamas?",
    "Me llamo...",
    "¿Dónde está?",
    "No me siento bien"
  ];

  return (
    <Card className="p-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Frases Rápidas</h3>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {phrases.map((phrase, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onPhraseSelect(phrase)}
            className="w-full text-left justify-start h-auto py-3 px-4 text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {phrase}
          </Button>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Haz clic en cualquier frase para reproducirla inmediatamente
      </div>
    </Card>
  );
};

export default QuickPhrases;
