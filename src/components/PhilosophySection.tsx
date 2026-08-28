import { Sparkles } from 'lucide-react';
import { useReveal } from '../hooks';
import WebGLLiquidSurgeButton from './WebGLLiquidSurgeButton';
import { ParallaxWrapper, ParallaxFloatingOrb, ParallaxFloatingBadge } from './ParallaxElements';

interface PhilosophyProps {
  onOpenContact?: () => void;
}

export default function PhilosophySection({ onOpenContact }: PhilosophyProps) {
  const badgeRef = useReveal(100);
  const text1Ref = useReveal(200);
  const text2Ref = useReveal(350);

  return (
    <section id="manifesto" className="relative py-16 sm:py-36 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent backdrop-blur-3xl border-t border-b border-cyan-500/20 overflow-hidden">
      {/* Dynamic Ambient Parallax Orbs */}
      <ParallaxFloatingOrb size={650} top="20%" left="25%" color="cyan" speed={0.3} blur={160} opacity={0.14} />
      <ParallaxFloatingOrb size={450} top="60%" left="60%" color="teal" speed={0.45} blur={140} opacity={0.1} />

      <div className="max-w-5xl mx-auto relative z-10">
        <ParallaxFloatingBadge speed={0.3} offsetY={10}>
          <div ref={badgeRef} className="flex items-center gap-2 mb-6 sm:mb-8">
            <Sparkles size={16} className="text-cyan-300 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-cyan-300 font-medium">
              // MANIFESTO EDICRIA STUDIO
            </span>
          </div>
        </ParallaxFloatingBadge>

        <div className="space-y-6 sm:space-y-12">
          {/* Contrast 1 - Ultra-Translucent Frosted Glass Card with Gentle Parallax Rate */}
          <ParallaxWrapper speed={0.15} offset={[-15, 20]}>
            <div ref={text1Ref} className="p-5 sm:p-8 rounded-3xl bg-cyan-950/15 border border-cyan-400/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.18)]">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cyan-300/80 block mb-2 font-medium">
                / O MERCADO COMUM
              </span>
              <p className="text-lg sm:text-3xl md:text-4xl font-normal leading-relaxed text-zinc-200 font-sans">
                A maioria foca em: <span className="text-cyan-300 font-serif italic underline decoration-cyan-400/60 underline-offset-4 sm:underline-offset-6">templates genéricos, sites pesados e sem identidade visual.</span>
              </p>
            </div>
          </ParallaxWrapper>

          {/* Contrast 2 - Ultra-Translucent Cyan Glow Card with Elevated Parallax Float */}
          <ParallaxWrapper speed={0.35} offset={[-25, 40]}>
            <div ref={text2Ref} className="p-6 sm:p-12 rounded-3xl bg-cyan-950/20 border border-cyan-400/50 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Sparkles size={140} className="text-cyan-300" />
              </div>

              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cyan-300 font-semibold block mb-2 sm:mb-3">
                / NOSSO DIFERENCIAL AUTORAL
              </span>
              <p className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.14] sm:leading-[1.1] tracking-tight text-white">
                Nós focamos em: <span className="italic font-serif text-cyan-300 font-light underline decoration-cyan-400 underline-offset-6 sm:underline-offset-8 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">experiências cinematográficas 4K</span> que geram autoridade imediata, alta retenção e posicionamento de luxo.
              </p>

              <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-4">
                <WebGLLiquidSurgeButton
                  label="SOLICITAR PROJETO AUTORAL"
                  onClick={onOpenContact}
                  width="w-full sm:w-[310px]"
                  height="h-[62px] sm:h-[68px]"
                />
              </div>
            </div>
          </ParallaxWrapper>
        </div>
      </div>
    </section>
  );
}
