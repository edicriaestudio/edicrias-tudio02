import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  withGlow?: boolean;
  layout?: 'horizontal' | 'vertical';
}

/**
 * Modern Geometric Monogram "ED" Vector Emblem
 * Crafted with precision cyber-minimalist paths, continuous gradients,
 * and high-contrast ambient neon glow for EdiCria Studio.
 */
export function EDMonogramIcon({
  size = 32,
  className = '',
  glowing = true,
}: {
  size?: number;
  className?: string;
  glowing?: boolean;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group/logo ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic Ambient Glow Backdrop */}
      {glowing && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-cyan-400/20 to-teal-300/30 blur-md group-hover/logo:blur-lg group-hover/logo:from-cyan-400/50 group-hover/logo:to-white/40 transition-all duration-500 pointer-events-none" />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover/logo:scale-105"
      >
        <defs>
          {/* Futuristic Gradient for the Outer Shield Frame */}
          <linearGradient id="ed-frame-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0891b2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          {/* Glowing Gradient for Letter E */}
          <linearGradient id="ed-letter-e" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Electric Gradient for Letter D */}
          <linearGradient id="ed-letter-d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          {/* Accent Core Light */}
          <linearGradient id="ed-accent-core" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="ed-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#06b6d4" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* Faceted Outer Hexagonal-Octagonal Tech Frame */}
        <polygon
          points="28,8 72,8 92,28 92,72 72,92 28,92 8,72 8,28"
          className="fill-cyan-950/80 stroke-[url(#ed-frame-grad)]"
          strokeWidth="2"
        />

        {/* Inner Subtle Circuit Pattern / Corner Accents */}
        <path
          d="M 14 30 L 30 14 M 86 30 L 70 14 M 14 70 L 30 86 M 86 70 L 70 86"
          stroke="#22d3ee"
          strokeWidth="1.2"
          strokeOpacity="0.35"
          strokeLinecap="round"
        />

        {/* 
          =========================================
          MONOGRAM GLYPHS: BALANCED "E" & "D"
          =========================================
        */}
        <g filter="url(#ed-glow-filter)">
          {/*
            LETTER "E" (Left Component)
            Spine and 3 horizontal high-tech fins
          */}
          <path
            d="M 20 24 
               L 46 24 
               L 46 32 
               L 29 32 
               L 29 45 
               L 42 45 
               L 42 53 
               L 29 53 
               L 29 68 
               L 46 68 
               L 46 76 
               L 20 76 
               Z"
            fill="url(#ed-letter-e)"
          />

          {/*
            LETTER "D" (Right Component)
            High-tech aerodynamic loop with precision bevel
          */}
          <path
            d="M 52 24 
               L 66 24 
               C 77 24, 82 32, 82 50 
               C 82 68, 77 76, 66 76 
               L 52 76 
               L 52 68 
               L 65 68 
               C 71 68, 74 61, 74 50 
               C 74 39, 71 32, 65 32 
               L 52 32 
               Z"
            fill="url(#ed-letter-d)"
          />

          {/* Dynamic Laser Beam Accent connecting E and D centrally */}
          <rect
            x="40"
            y="48"
            width="14"
            height="2.5"
            rx="1.25"
            fill="url(#ed-accent-core)"
            className="animate-pulse"
          />

          {/* Micro High-Tech Vertex Nodes */}
          <circle cx="20" cy="24" r="1.5" fill="#ffffff" />
          <circle cx="46" cy="24" r="1.5" fill="#67e8f9" />
          <circle cx="46" cy="76" r="1.5" fill="#22d3ee" />
          <circle cx="20" cy="76" r="1.5" fill="#ffffff" />
          <circle cx="66" cy="24" r="1.5" fill="#ffffff" />
          <circle cx="66" cy="76" r="1.5" fill="#22d3ee" />
        </g>
      </svg>
    </div>
  );
}

export default function BrandLogo({
  size = 'md',
  showText = true,
  subtitle = 'EXPERIÊNCIAS DIGITAIS AUTORAIS',
  className = '',
  onClick,
  withGlow = true,
  layout = 'horizontal',
}: BrandLogoProps) {
  const sizeMap = {
    sm: { icon: 26, title: 'text-xs sm:text-sm', sub: 'text-[8px]', gap: 'gap-2' },
    md: { icon: 34, title: 'text-sm sm:text-base', sub: 'text-[9px]', gap: 'gap-2.5' },
    lg: { icon: 44, title: 'text-base sm:text-lg', sub: 'text-[10px]', gap: 'gap-3' },
    xl: { icon: 56, title: 'text-lg sm:text-2xl', sub: 'text-[11px]', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center group/brand ${onClick ? 'cursor-pointer' : ''} ${
        layout === 'vertical' ? 'flex-col text-center' : currentSize.gap
      } ${className}`}
    >
      {/* Modern ED Monogram Icon */}
      <EDMonogramIcon size={currentSize.icon} glowing={withGlow} />

      {/* Brand Typography */}
      {showText && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center mt-2' : ''}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-mono font-bold tracking-[0.16em] uppercase text-white group-hover/brand:text-cyan-200 transition-colors ${currentSize.title}`}>
              <span className="text-cyan-300 underline decoration-cyan-400 decoration-2 underline-offset-2">ED</span>CRIA ESTÚDIO
            </span>
          </div>

          {subtitle && (
            <span className={`font-mono tracking-[0.2em] text-cyan-300 uppercase mt-0.5 sm:mt-1 font-medium hidden sm:block ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
