import { useEffect, useRef } from 'react';

/**
 * ScrollProgressBar - A slim, subtle progress indicator pinned to the top of the viewport.
 * Tracks user scroll position across the landing page with zero layout shift and 60/120fps GPU performance.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const docEl = document.documentElement;
      const totalHeight = docEl.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset || docEl.scrollTop || 0;

      const progress = totalHeight > 0 ? Math.min(Math.max(currentScroll / totalHeight, 0), 1) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${progress * 100}%`;
        glowRef.current.style.opacity = progress > 0.002 ? '1' : '0';
      }
      if (containerRef.current) {
        containerRef.current.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Calculate initial state and listen to scroll and viewport resizes
    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <aside
      ref={containerRef}
      role="progressbar"
      aria-label="Progresso de leitura da página"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] sm:h-[2.5px] bg-cyan-950/25 backdrop-blur-[1px]"
    >
      {/* Active progress indicator with cyan-teal neon glow */}
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-teal-300 origin-left transform-gpu shadow-[0_0_10px_rgba(34,211,238,0.85)] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Leading micro-beacon glow highlight that glides with progress */}
      <div
        ref={glowRef}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-200 blur-[1px] shadow-[0_0_8px_#38bdf8] opacity-0 transition-opacity duration-200 pointer-events-none"
        style={{ left: '0%' }}
      />
    </aside>
  );
}
