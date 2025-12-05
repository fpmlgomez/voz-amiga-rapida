
import React from 'react';
import Logo from './Logo';
import adaptIaVidaLogo from '@/assets/adapt-ia-vida-logo.jpg';

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
      
      {/* Créditos de la innovación */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 rounded-xl border border-blue-100 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <a 
            href="https://adapt-iavida.site/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={adaptIaVidaLogo} 
              alt="Logo ADAPT-IA VIDA" 
              className="w-24 h-24 object-contain rounded-full shadow-md"
            />
          </a>
          <p className="text-sm text-gray-700 leading-relaxed text-left flex-1 min-w-[280px]">
            <span className="font-semibold text-purple-700">Esta innovación ha sido realizada por la </span>
            <span className="font-bold text-blue-700">Dra. María Luisa Gómez Jiménez</span>
            <span className="font-semibold text-purple-700">, CEO de </span>
            <span className="font-bold text-cyan-700">ADAPT-IA VIDA. UMA</span>
            <span className="text-gray-600">, y se integra en el catálogo de soluciones del ecosistema de innovación diseñado por la autora para mejorar la </span>
            <span className="font-semibold text-blue-600">inclusión</span>
            <span className="text-gray-600"> y </span>
            <span className="font-semibold text-purple-600">accesibilidad social</span>
            <span className="text-gray-600"> en las viviendas.</span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-100"></div>
        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse delay-200"></div>
      </div>
    </div>
  );
};

export default AppHeader;
