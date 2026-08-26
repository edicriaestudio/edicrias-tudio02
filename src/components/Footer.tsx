import { Hexagon, ArrowUpRight, Sparkles, FolderKanban } from 'lucide-react';
import { useReveal } from '../hooks';
import WebGLLiquidSurgeButton from './WebGLLiquidSurgeButton';

interface FooterProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
}

export default function Footer({ onOpenContact, onOpenPortfolio }: FooterProps) {
  const headerRef = useReveal(100);

  return (
    <footer className="relative bg-gradient-to-b from-transparent via-cyan-950/25 to-[#050b11]/95 text-white rounded-t-[3rem] sm:rounded-t-[4rem] border-t border-cyan-500/30 pt-20 pb-12 px-5 sm:px-8 md:px-12 overflow-hidden backdrop-blur-3xl">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Main Call to Action Header - Ultra-Translucent Cyan Frosted Glass Card */}
        <div ref={headerRef} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 p-8 sm:p-12 rounded-3xl bg-cyan-950/25 border border-cyan-400/50 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)]">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono uppercase text-cyan-300">
              <Sparkles size={13} className="text-cyan-400" />
              EDICRIA STUDIO 2026
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
              Pronto para transformar sua presença digital?
            </h3>
            <p className="text-sm text-zinc-200 font-light leading-relaxed">
              Solicite uma proposta exclusiva ou explore nossa biblioteca de 46 templates Figma editáveis (foto & vídeo).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <WebGLLiquidSurgeButton
              label="INICIAR PROJETO"
              onClick={onOpenContact}
              width="w-[240px]"
              height="h-[64px]"
            />
            
            <button
              onClick={onOpenPortfolio}
              className="px-6 py-4 rounded-2xl border border-cyan-400/40 bg-cyan-950/40 text-cyan-200 text-xs font-mono uppercase tracking-wider hover:bg-cyan-900/50 hover:text-white transition-all flex items-center gap-2 shadow-lg"
            >
              <FolderKanban size={14} className="text-cyan-300" />
              TEMPLATES FIGMA
            </button>
          </div>
        </div>

        {/* Footer Bottom Info */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Hexagon size={26} strokeWidth={1.5} className="text-cyan-300" />
            <div className="flex flex-col">
              <span className="font-mono text-base font-bold tracking-widest text-white">
                EDICRIA STUDIO
              </span>
              <span className="text-[11px] text-cyan-200/60 font-mono">
                CREATIVE WEB DESIGN & FIGMA TEMPLATES © 2026
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300 font-mono uppercase tracking-wider">
            <button onClick={onOpenPortfolio} className="hover:text-cyan-300 transition-colors">
              TEMPLATES FIGMA
            </button>
            <a href="#pilares" className="hover:text-cyan-300 transition-colors">
              PILARES
            </a>
            <a href="#manifesto" className="hover:text-cyan-300 transition-colors">
              MANIFESTO
            </a>
            <button onClick={onOpenContact} className="hover:text-cyan-300 transition-colors">
              CONTATO
            </button>
            <a href="#top" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              TOPO <ArrowUpRight size={12} />
            </a>
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            STATUS: 100% OPERACIONAL
          </div>
        </div>
      </div>
    </footer>
  );
}
