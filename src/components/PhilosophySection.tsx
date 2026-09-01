import { useReveal } from '../hooks';
import WebGLLiquidSurgeButton from './WebGLLiquidSurgeButton';
import { trackClickPrimaryCta } from '../utils/analytics';

interface PhilosophyProps {
  onOpenContact?: () => void;
}

export default function PhilosophySection({ onOpenContact }: PhilosophyProps) {
  const badgeRef = useReveal(100);
  const text1Ref = useReveal(200);
  const text2Ref = useReveal(350);

  const handleContactClick = () => {
    trackClickPrimaryCta('philosophy_section', 'SOLICITAR DIAGNÓSTICO');
    onOpenContact?.();
  };

  return (
    <section id="manifesto" className="relative py-16 sm:py-36 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent backdrop-blur-3xl border-t border-b border-cyan-500/20 overflow-hidden">
      {/* Dynamic Ambient Glow (Pure CSS) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none transform-gpu" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div ref={badgeRef} className="flex items-center gap-2 mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-cyan-300 font-medium">
            // MANIFESTO EDCRIA STUDIO
          </span>
        </div>

        <div className="space-y-6 sm:space-y-12">
          {/* Contrast 1 - Ultra-Translucent Frosted Glass Card */}
          <div ref={text1Ref} className="p-5 sm:p-8 rounded-3xl bg-cyan-950/15 border border-cyan-400/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.18)]">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cyan-300/80 block mb-2 font-medium">
              / O MERCADO COMUM
            </span>
            <h3 className="text-xl sm:text-3xl font-display font-[500] text-white tracking-[-0.03em] leading-snug mb-2 [text-wrap:balance]">
              O problema não é ter um site. É ter um site que parece igual a todos.
            </h3>
            <p className="text-sm sm:text-lg font-light leading-relaxed text-zinc-300 font-sans">
              Templates genéricos, excesso de informação e páginas sem direção dificultam a percepção do valor real de uma marca e transformam seu preço em commodity.
            </p>
          </div>

          {/* Contrast 2 - Ultra-Translucent Cyan Glow Card */}
          <div ref={text2Ref} className="p-6 sm:p-12 rounded-3xl bg-cyan-950/20 border border-cyan-400/50 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] relative overflow-hidden group">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cyan-300 font-semibold block mb-2 sm:mb-3">
              / O DIFERENCIAL DA EDCRIA
            </span>
            <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-[450] leading-[1.14] sm:leading-[1.1] tracking-[-0.04em] text-white mb-4 [text-wrap:balance]">
              Direção de arte, narrativa e tecnologia trabalhando juntas para criar uma <span className="italic font-serif text-cyan-300 font-light underline decoration-cyan-400 underline-offset-6 sm:underline-offset-8 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">experiência memorável</span> e orientada à ação.
            </h3>
            <p className="text-sm sm:text-lg text-zinc-200 font-light leading-relaxed max-w-3xl">
              Eliminamos o ruído e colocamos sua marca em um patamar de autoridade inquestionável, com alta retenção e taxas superiores de conversão.
            </p>

            <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-4">
              <WebGLLiquidSurgeButton
                label="SOLICITAR DIAGNÓSTICO"
                onClick={handleContactClick}
                width="w-full sm:w-[310px]"
                height="h-[62px] sm:h-[68px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
