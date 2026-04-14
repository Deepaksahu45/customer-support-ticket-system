// Aegis — Reusable brand logo component
import React from 'react';

const sizeMap = {
  sm: { icon: 20, font: '16px', gap: '6px' },
  md: { icon: 28, font: '20px', gap: '8px' },
  lg: { icon: 40, font: '32px', gap: '10px' },
};

const AegisLogo = ({ size = 'md', variant = 'full' }) => {
  const { icon, font, gap } = sizeMap[size] || sizeMap.md;

  const ShieldIcon = () => (
    <svg
      width={icon}
      height={icon}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 6 L54 17 L54 35 C54 48 43 56 32 60 C21 56 10 48 10 35 L10 17 Z"
        fill="rgba(34,197,94,0.15)"
        stroke="#22c55e"
        strokeWidth="2.5"
      />
      <path
        d="M27 34 L32 39 L39 27"
        fill="none"
        stroke="#22c55e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className="flex items-center justify-center">
        <ShieldIcon />
      </div>
    );
  }

  return (
    <div className="flex items-center" style={{ gap }}>
      <ShieldIcon />
      <span
        className="font-brand font-bold tracking-tight select-none"
        style={{ fontSize: font, letterSpacing: '-0.5px' }}
      >
        <span className="text-aegis-text">Ae</span>
        <span className="text-aegis-green">gis</span>
      </span>
    </div>
  );
};

export default AegisLogo;
