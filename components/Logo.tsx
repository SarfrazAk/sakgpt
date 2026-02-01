import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="2"
          opacity="0.5"
        />
        
        {/* Inner hexagon */}
        <polygon 
          points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="2"
          filter="url(#glow)"
        />
        
        {/* Center M */}
        <text 
          x="50" 
          y="62" 
          textAnchor="middle" 
          fill="url(#logoGradient)" 
          fontSize="32" 
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="url(#glow)"
        >
          M
        </text>
        
        {/* Decorative dots */}
        <circle cx="50" cy="15" r="3" fill="#22d3ee" />
        <circle cx="80" cy="32.5" r="3" fill="#06b6d4" />
        <circle cx="80" cy="67.5" r="3" fill="#0891b2" />
        <circle cx="50" cy="85" r="3" fill="#22d3ee" />
        <circle cx="20" cy="67.5" r="3" fill="#06b6d4" />
        <circle cx="20" cy="32.5" r="3" fill="#0891b2" />
      </svg>
    </div>
  );
};

export default Logo;
