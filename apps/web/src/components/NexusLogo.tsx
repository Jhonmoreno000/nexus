import React, { useEffect, useRef } from 'react';

export const NexusLogo = () => {
  return (
    <div className="relative flex items-center justify-center w-10 h-10 group cursor-pointer">
      {/* Glow Layer */}
      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-400/30 transition-all duration-500"></div>
      
      {/* Base App Icon Shape */}
      <div className="relative w-full h-full rounded-[14px] bg-gradient-to-b from-[#1a2335] to-[#0a0e17] border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Animated Background Mesh/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-500/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Custom SVG Logo */}
        <svg viewBox="0 0 40 40" className="w-6 h-6 z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          <defs>
            <linearGradient id="nexus-core" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="nexus-ring" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          
          {/* Outer Interlocking Ring (Database platter metaphor) */}
          <path 
            d="M 20 6 C 28 6, 34 9, 34 13 C 34 14.5, 32 16, 29 17.5"
            fill="none" 
            stroke="url(#nexus-ring)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            className="group-hover:stroke-[#818cf8] transition-colors duration-300"
          />
          <path 
            d="M 11 17.5 C 8 16, 6 14.5, 6 13 C 6 9, 12 6, 20 6"
            fill="none" 
            stroke="url(#nexus-ring)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray="4 4"
            className="opacity-50"
          />
          
          <path 
            d="M 6 20 C 6 24, 12 27, 20 27 C 28 27, 34 24, 34 20"
            fill="none" 
            stroke="url(#nexus-ring)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
          
          <path 
            d="M 6 27 C 6 31, 12 34, 20 34 C 28 34, 34 31, 34 27"
            fill="none" 
            stroke="url(#nexus-ring)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />

          {/* Inner Glowing Core */}
          <circle 
            cx="20" cy="16" r="4.5" 
            fill="url(#nexus-core)" 
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          {/* Data connection lines */}
          <line x1="20" y1="20.5" x2="20" y2="27" stroke="url(#nexus-core)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="20" y1="27" x2="20" y2="34" stroke="url(#nexus-core)" strokeWidth="2.5" strokeLinecap="round" className="opacity-40" />
        </svg>

        {/* Shimmer Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"></div>
      </div>
    </div>
  );
};