import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks';

export default function PortfolioCalloutSection() {
  const cardRef = useReveal(120);

  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-8 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div
          ref={cardRef}
          className="relative rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/30 via-[#05111a]/85 to-cyan-950/20 backdrop-blur-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_60px_rgba(6,182,212,0.18)] overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none transform-gpu" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-10">
            <div className="max-w-2xl space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-cyan-300">
                <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                PORTFÓLIO DE PROJETOS
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-display font-[450] tracking-tight text-white leading-tight [text-wrap:balance]">
                PROJETOS QUE TRANSFORMAM IDEIAS EM EXPERIÊNCIAS DIGITAIS.
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
                Explore nosso portfólio e conheça uma seleção de projetos, experiências visuais e soluções digitais desenvolvidas pela EdCria Studio.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto pt-2 lg:pt-0">
              <a
                href="https://portfolio.edicria.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>EXPLORAR PORTFÓLIO</span>
                <ArrowUpRight size={16} className="text-black" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
