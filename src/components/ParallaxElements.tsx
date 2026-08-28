import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number; // e.g. -0.2 for slower upward, 0.3 for downward drift
  offset?: [number, number]; // [startOffset, endOffset] in px
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * ParallaxWrapper: Transforms scroll progress of the element (or its section)
 * into smooth, spring-dampened motion.
 */
export function ParallaxWrapper({
  children,
  speed = 0.2,
  offset,
  className = '',
  id,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = offset || [-50 * speed, 50 * speed];
  const rawY = useTransform(scrollYProgress, [0, 1], range);
  const smoothY = useSpring(rawY, { damping: 20, stiffness: 90, mass: 0.5 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className} id={id}>
      {children}
    </motion.div>
  );
}

/**
 * ParallaxFloatingOrb: Ambient glowing geometric light orb that drifts dynamically
 * as the user navigates down the page.
 */
export function ParallaxFloatingOrb({
  size = 400,
  top = '20%',
  left = '10%',
  color = 'cyan',
  speed = 0.4,
  blur = 130,
  opacity = 0.15,
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-80 * speed, 120 * speed]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-15, 25]);
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.95]);

  const smoothY = useSpring(rawY, { damping: 25, stiffness: 80 });
  const smoothRotate = useSpring(rawRotate, { damping: 25, stiffness: 80 });

  const colorMap = {
    cyan: 'bg-cyan-500',
    teal: 'bg-teal-400',
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-500',
  };

  return (
    <motion.div
      ref={ref}
      style={{
        top,
        left,
        width: size,
        height: size,
        y: smoothY,
        rotate: smoothRotate,
        scale: rawScale,
        filter: `blur(${blur}px)`,
        opacity,
      }}
      className={`absolute pointer-events-none rounded-full ${colorMap[color]} ${className}`}
    />
  );
}

/**
 * ParallaxFloatingBadge: Monospace telemetry chip or tech token that hovers
 * with micro-rotations and scroll elevation.
 */
export function ParallaxFloatingBadge({
  children,
  speed = 0.3,
  className = '',
  offsetY = 30,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offsetY?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [offsetY * speed, -offsetY * speed]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-2 * speed, 3 * speed]);
  const smoothY = useSpring(rawY, { damping: 18, stiffness: 100 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, rotate: rawRotate }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxDepthCard: Container with multi-axis depth response on scroll
 */
export function ParallaxDepthCard({
  children,
  depth = 1,
  className = '',
  id,
}: {
  children: React.ReactNode;
  depth?: number; // 1 = foreground (moves faster), 0.5 = midground, 0.2 = background
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yRange = [-40 * depth, 40 * depth];
  const rawY = useTransform(scrollYProgress, [0, 1], yRange);
  const smoothY = useSpring(rawY, { damping: 22, stiffness: 85 });

  return (
    <motion.div
      ref={ref}
      id={id}
      style={{ y: smoothY }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxScrollProgress: Minimalist cinematic scroll track header indicator
 */
export function ParallaxScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 flex items-center">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-500 via-cyan-300 to-white shadow-[0_0_12px_rgba(6,182,212,0.8)] origin-left w-full"
        style={{ scaleX }}
      />
    </div>
  );
}
