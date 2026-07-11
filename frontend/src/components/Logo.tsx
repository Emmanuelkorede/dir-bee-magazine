import React from 'react';

interface LogoProps {
  className?: string;
  colorOverrides?: {
    bColor?: string;
    eeColor?: string;
    mColor?: string;
  };
}

export const BrandLogo: React.FC<LogoProps> = ({ 
  className = "h-16 w-auto", 
  colorOverrides 
}) => {
  // Default brand color codes matching your reference specs
  const defaultBColor = "#F3E5AB";   // Soft Cream / Tan Gold
  const defaultEeColor = "#F3E5AB";  // Matches the B
  const defaultMColor = "#4A2E1B";   // Burnt Rich Brown

  const bColor = colorOverrides?.bColor || defaultBColor;
  const eeColor = colorOverrides?.eeColor || defaultEeColor;
  const mColor = colorOverrides?.mColor || defaultMColor;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 600" 
      className={className}
      fill="none"
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@500;700&display=swap');
            
            .brand-serif {
              font-family: 'Playfair Display', 'Times New Roman', serif;
              font-size: 380px;
              font-weight: 700;
            }
            
            .brand-script {
              font-family: 'Great Vibes', 'Brush Script MT', cursive;
              font-size: 160px;
            }
          `}
        </style>
      </defs>
      
      {/* Group wrapper to handle placement coordinates */}
      <g transform="translate(140, 430)">
        {/* The 'B' - Cream Color */}
        <text x="0" y="0" className="brand-serif" fill={bColor}>B</text>
        
        {/* The cursive 'ee' - Floating beautifully inside/next to the B */}
        <text x="80" y="-60" className="brand-script" fill={eeColor}>ee</text>
        
        {/* The 'M' - Burnt Brown Color */}
        <text x="290" y="0" className="brand-serif" fill={mColor}>M</text>
      </g>
    </svg>
  );
};