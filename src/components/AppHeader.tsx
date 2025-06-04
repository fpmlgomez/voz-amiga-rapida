
import React from 'react';
import { Volume2 } from 'lucide-react';

const AppHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
        <Volume2 className="text-blue-600" size={40} />
        ExpreSIA
      </h1>
      <p className="text-lg text-gray-600">
        Tu comunicador de voz personal con IA para una comunicación rápida y sencilla
      </p>
    </div>
  );
};

export default AppHeader;
