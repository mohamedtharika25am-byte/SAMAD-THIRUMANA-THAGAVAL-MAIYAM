import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Temporary Matrimonial Logo Component
 * ====================================
 * Designed with two intertwined wedding rings and a subtle auspicious diamond/flower crest
 * in deep wine maroon and antique gold.
 *
 * EASY TO REPLACE LATER:
 * When the Canva-created final logo is ready, simply replace the <svg> below
 * with `<img src="/path-to-final-logo.png" alt="SAMAD THIRUMANA THAGAVAL MAIYAM" className="h-10 w-auto" />`
 */
export const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-10' }) => {
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-xl bg-[#7A1C2E] text-[#F5E6C8] shadow-xs ring-1 ring-[#C59B27]/40 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
      >
        {/* Subtle top auspicious lotus/diamond crown */}
        <path
          d="M24 8L26.8 11.8L24 14.5L21.2 11.8L24 8Z"
          fill="#E5C158"
        />
        {/* Left Wedding Ring */}
        <circle
          cx="19.5"
          cy="26.5"
          r="8.5"
          stroke="#F7E4B5"
          strokeWidth="2.4"
        />
        {/* Right Wedding Ring (Intertwined) */}
        <circle
          cx="28.5"
          cy="26.5"
          r="8.5"
          stroke="#D4AF37"
          strokeWidth="2.4"
        />
        {/* Subtle centre union knot highlight */}
        <circle cx="24" cy="26.5" r="1.5" fill="#F7E4B5" />
      </svg>
    </div>
  );
};
