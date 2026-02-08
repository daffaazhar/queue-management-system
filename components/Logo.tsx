
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-16 w-16" }) => {
  return (
    <div className={`${className} bg-[#FFEB3B] flex items-center justify-center p-1 rounded-sm shadow-sm`}>
      <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Blue Waves */}
        <g stroke="#03A9F4" strokeWidth="6" fill="none" strokeLinecap="round">
            <path d="M20 45 Q 35 35, 50 45 T 80 45" />
            <path d="M20 65 Q 35 55, 50 65 T 80 65" />
            <path d="M20 85 Q 35 75, 50 85 T 80 85" />
        </g>
        {/* Red Lightning Bolt */}
        <path 
            d="M60 10 L 35 75 L 55 75 L 45 125 L 75 55 L 55 55 L 70 10 Z" 
            fill="#F44336" 
            stroke="#F44336" 
            strokeWidth="2" 
            strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Logo;
