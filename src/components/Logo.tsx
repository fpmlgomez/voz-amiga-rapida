
import React from 'react';

const Logo = ({ size = 48 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Fondo circular con gradiente */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F0F9FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        
        {/* Círculo de fondo */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" />
        
        {/* Ondas de sonido */}
        <g transform="translate(20, 30)">
          {/* Onda 1 */}
          <path
            d="M5 20 Q15 10, 25 20 T45 20"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Onda 2 */}
          <path
            d="M8 30 Q18 20, 28 30 T48 30"
            stroke="url(#waveGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Onda 3 */}
          <path
            d="M10 40 Q20 30, 30 40 T50 40"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
        
        {/* Micrófono estilizado */}
        <g transform="translate(35, 15)">
          <ellipse cx="15" cy="25" rx="8" ry="12" fill="#FFFFFF" opacity="0.9" />
          <rect x="13" y="37" width="4" height="8" fill="#FFFFFF" opacity="0.9" />
          <rect x="9" y="45" width="12" height="2" fill="#FFFFFF" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
