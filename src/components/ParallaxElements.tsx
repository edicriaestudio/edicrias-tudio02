import React from 'react';

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  offset?: [number, number];
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * Lightweight Pass-Through wrappers that keep the DOM structure pure,
 * avoiding scroll listeners, spring simulations, and CPU throttling.
 */
export function ParallaxWrapper({
  children,
  className = '',
  id,
  style,
}: ParallaxProps) {
  return (
    <div className={className} id={id} style={style}>
      {children}
    </div>
  );
}

export function ParallaxFloatingOrb({
  size = 400,
  top = '20%',
  left = '10%',
  color = 'cyan',
  blur = 130,
  opacity = 0.08,
  className = '',
}: {
  size?: number;
  top?: string;
  left?: string;
  color?: 'cyan' | 'teal' | 'indigo' | 'blue';
  speed?: number;
  blur?: number;
  opacity?: number;
  className?: string;
}) {
  const colorMap = {
    cyan: 'bg-cyan-500',
    teal: 'bg-teal-400',
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-500',
  };

  return (
    <div
      style={{
        top,
        left,
        width: size,
        height: size,
        filter: `blur(${blur}px)`,
        opacity,
      }}
      className={`absolute pointer-events-none rounded-full ${colorMap[color]} transform-gpu ${className}`}
    />
  );
}

export function ParallaxFloatingBadge({
  children,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offsetY?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function ParallaxDepthCard({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
}

export function ParallaxScrollProgress() {
  return null;
}
