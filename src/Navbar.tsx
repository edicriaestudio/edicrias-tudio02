import { Hexagon, FolderKanban } from 'lucide-react';
import { useReveal } from './hooks';
import SoundtrackBar from './components/SoundtrackBar';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';

interface NavbarProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
}

export default function Navbar({ onOpenContact, onOpenPortfolio }: NavbarProps) {
  const logoRef = useReveal(0);
  const ctaRef = useReveal(500);

  return (
    <>
      {/* Top Floating Glass Pill Navbar - Ultra Translucent Cyan Glass */}
      <header className="fixed top-3 inset-x-3 sm:inset-x-6 md:inset-x-12 z-40">
        <div className="max-w-6xl mx-auto rounded-full border border-cyan-400/40 bg-cyan-950/15 backdrop-blur-3xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all hover:border-cyan-400/60">
          
          {/* Brand Logo - EDICRIA STUDIO */}
          <div
            ref={logoRef}
            onClick={onOpenPortfolio}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="relative">
              <Hexagon size={24} strokeWidth={1.5} className="text-cyan-300 group-hover:rotate-45 transition-transform duration-500" />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-white">
                E
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-[0.15em] uppercase text-white font-mono leading-none">
                EDICRIA STUDIO
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-300 uppercase mt-0.5">
                CREATIVE WEB & DESIGN
              </span>
            </div>
          </div>

          {/* Center Links (md+) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-wider text-zinc-200">
            <button
              onClick={onOpenPortfolio}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <FolderKanban size={13} className="text-cyan-400" />
              TEMPLATES FIGMA <span className="text-[10px] text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/40">FOTO & VÍDEO 4K</span>
            </button>

            <a href="#pilares" className="hover:text-cyan-300 transition-colors py-1">
              PILARES
            </a>

            <a href="#protocolos" className="hover:text-cyan-300 transition-colors py-1">
              WEBGL PROTOCOLO
            </a>
          </nav>

          {/* Actions Right */}
          <div ref={ctaRef} className="flex items-center gap-3">
            {/* Embedded Soundtrack Bar (compact) */}
            <SoundtrackBar compact={true} />

            <div className="hidden sm:block">
              <WebGLLiquidSurgeButton
                label="CRIAR MEU SITE"
                onClick={onOpenContact}
                width="w-[185px]"
                height="h-[46px]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Floating Navigation Bar for Mobile (Thumb-Friendly with Safe Area Inset) */}
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 z-40 md:hidden flex items-center justify-between gap-3 p-2 rounded-full border border-cyan-400/40 bg-cyan-950/30 backdrop-blur-3xl shadow-[0_0_40px_rgba(6,182,212,0.3)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          onClick={onOpenPortfolio}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-transform shrink-0"
        >
          <FolderKanban size={15} className="text-cyan-400" />
          <span className="font-semibold">TEMPLATES</span>
        </button>

        <div className="flex-1 max-w-[200px]">
          <WebGLLiquidSurgeButton
            label="SOLICITAR SITE"
            onClick={onOpenContact}
            width="w-full"
            height="h-[44px]"
          />
        </div>
      </div>
    </>
  );
}
