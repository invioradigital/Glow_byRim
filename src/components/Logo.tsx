import React from 'react';
import { useSalon } from '../context/SalonContext';
import { getAssetUrl } from '../utils/assets';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const { settings } = useSalon();

  const sizeClasses = {
    sm: 'h-9 text-lg',
    md: 'h-12 text-xl sm:text-2xl',
    lg: 'h-16 text-2xl sm:text-3xl',
    xl: 'h-24 text-3xl sm:text-4xl',
  };

  const imgHeightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  if (settings.logoType === 'image' && settings.logoUrl) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img
          src={getAssetUrl(settings.logoUrl)}
          alt={settings.salonName}
          className={`${imgHeightClasses[size]} w-auto object-contain transition-transform duration-300 hover:scale-103 filter drop-shadow-xs`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Cozy Typographic Logo
  const textColor = variant === 'light' ? 'text-[#FAF7F2]' : 'text-[#3A2F29]';
  const subColor = variant === 'light' ? 'text-[#E8D6C5]' : 'text-[#8C7A70]';

  return (
    <div className={`flex flex-col items-start justify-center select-none ${className}`}>
      <div className="flex items-baseline gap-1.5 leading-none">
        <span className={`font-serif tracking-normal font-semibold ${textColor} ${sizeClasses[size]}`}>
          Glow
        </span>
        <span className="font-serif italic text-sm md:text-base text-[#C4975C] font-light">
          by Rim
        </span>
      </div>
      {showSubtitle && (
        <span className={`text-[9px] md:text-[10px] tracking-[0.18em] uppercase ${subColor} font-medium mt-0.5`}>
          Salon de beauté • Casablanca
        </span>
      )}
    </div>
  );
};
