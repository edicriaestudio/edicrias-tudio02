import { Sparkles, FolderKanban } from 'lucide-react';
import { useReveal } from './hooks';
import { DiagnosticShuffler, TelemetryTypewriter } from './components/InteractiveArtifacts';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';
import { ParallaxWrapper, ParallaxDepthCard, ParallaxFloatingBadge } from './components/ParallaxElements';

interface SectionOneProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
}

function ServiceLine({ text, delay }: { text: string; delay: number }) {
  const ref = useReveal(delay);
  return (
    <span
      ref={ref}
      className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/90 drop-shadow-md flex items-center gap-1.5"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      {text}
    </span>
  );
}

export default function SectionOne({ onOpenContact, onOpenPortfolio }: SectionOneProps) {
  const introRef = useReveal(300);
  const badgeRef = useReveal(150);
  const h1Ref = useReveal(280);

  return (
    <section className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between px-4 sm:px-8 md:px-12 pt-24 sm:pt-32 pb-14 sm:pb-16 relative bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
      {/* Noise Texture SVG Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top row with distinct Parallax Speeds */}
      <div className="flex flex-col gap-5 sm:gap-8 sm:flex-row sm:justify-between items-start">
        {/* Left — Ultra-Translucent Service List Card with Smooth Parallax Drift */}
        <ParallaxWrapper speed={0.2} offset={[-15, 25]} className="w-full sm:w-auto">
          <div className="w-full sm:w-auto flex flex-col gap-2 bg-cyan-950/15 backdrop-blur-3xl border border-cyan-400/40 p-4 sm:p-5 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.18)]">
            <ServiceLine text="/ WEB DESIGN 4K" delay={150} />
            <ServiceLine text="/ LANDING PAGES CINEMATOGRÁFICAS" delay={270} />
            <ServiceLine text="/ FIGMA TEMPLATES (FOTO & VÍDEO)" delay={390} />
            <ServiceLine text="/ EXPERIÊNCIAS SCROLL-DRIVEN" delay={510} />
          </div>
        </ParallaxWrapper>

        {/* Right — Live Telemetry Terminal Feed with Counter-Parallax Drift */}
        <ParallaxWrapper speed={0.35} offset={[-20, 35]} className="w-full max-w-sm sm:max-w-md">
          <div className="w-full">
            <TelemetryTypewriter />
          </div>
        </ParallaxWrapper>
      </div>

      {/* Main Hero & Interactive Shuffler Grid */}
      <div className="my-6 sm:my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Typography with Cinematic Depth */}
        <ParallaxDepthCard depth={0.6} className="lg:col-span-7 space-y-5 sm:space-y-6">
          <ParallaxFloatingBadge speed={0.4} offsetY={12}>
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 border-l-2 border-cyan-400 bg-cyan-950/20 px-3.5 sm:px-4 py-2 backdrop-blur-3xl rounded-r-xl border-y border-r border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              <Sparkles size={14} className="text-cyan-300 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-cyan-200 font-medium">
                EDICRIA STUDIO • ART DIRECTION 2026
              </span>
            </div>
          </ParallaxFloatingBadge>

          <h1
            ref={h1Ref}
            className="text-[clamp(2.1rem,6.2vw,4.8rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-2xl"
          >
            Não criamos <br />
            apenas websites. <br />
            <span className="italic font-serif font-light text-cyan-300 underline decoration-cyan-400 underline-offset-8 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">
              Criamos experiências autorais.
            </span>
          </h1>

          <p
            ref={introRef}
            className="max-w-xl text-sm sm:text-lg text-zinc-200 font-light leading-relaxed drop-shadow-md"
          >
            Páginas cinematográficas, templates editáveis no Figma (Foto & Vídeo) e animações de alta performance desenvolvidas para destacar sua marca.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
            <WebGLLiquidSurgeButton
              label="CRIAR MEU SITE AUTORAL"
              onClick={onOpenContact}
              width="w-full sm:w-[290px]"
              height="h-[64px] sm:h-[68px]"
            />

            <button
              onClick={onOpenPortfolio}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl border border-cyan-400/40 bg-cyan-950/20 backdrop-blur-3xl text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-200 hover:bg-cyan-900/50 hover:text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.15)] active:scale-95"
            >
              <FolderKanban size={16} className="text-cyan-300" />
              VER TEMPLATES FIGMA
            </button>
          </div>
        </ParallaxDepthCard>

        {/* Right — Diagnostic Shuffler Card Stack with Elevated 3D Scroll Parallax */}
        <ParallaxDepthCard depth={1.3} className="lg:col-span-5 flex justify-center w-full">
          <DiagnosticShuffler />
        </ParallaxDepthCard>
      </div>
    </section>
  );
}
