
import React from 'react';
import Logo from './Logo';

const AppHeader = () => {
  return (
    <div className="text-center mb-12 px-4">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Logo size={64} />
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            ExpreSIA
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </div>
      </div>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Tu comunicador de voz personal con IA para una{' '}
        <span className="text-blue-600 font-semibold">comunicación rápida</span> y{' '}
        <span className="text-purple-600 font-semibold">sencilla</span>
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-100"></div>
        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse delay-200"></div>
      </div>
    </div>
  );
};

export default AppHeader;
