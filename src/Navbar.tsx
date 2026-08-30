import { FolderKanban, PackageCheck, BookOpen, Send } from 'lucide-react';
import { useReveal } from './hooks';
import SoundtrackBar from './components/SoundtrackBar';
import BrandLogo from './components/BrandLogo';
import { prefetchModal } from './utils/prefetch';

interface NavbarProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
  onOpenPacks?: () => void;
  onOpenBlog?: () => void;
}

export default function Navbar({
  onOpenContact,
  onOpenPortfolio,
  onOpenPacks,
  onOpenBlog,
}: NavbarProps) {
  const logoRef = useReveal(0);
  const ctaRef = useReveal(500);

  return (
    <>
      {/* Top Floating Glass Pill Navbar - Ultra Translucent Cyan Glass */}
      <header className="fixed top-3 inset-x-2.5 sm:inset-x-6 md:inset-x-12 z-40">
        <div className="max-w-6xl mx-auto rounded-full border border-cyan-400/40 bg-cyan-950/20 backdrop-blur-3xl px-3 sm:px-5 py-2 flex items-center justify-between shadow-[0_0_35px_rgba(6,182,212,0.22)] transition-all hover:border-cyan-400/60 gap-2 sm:gap-4">
          
          {/* Brand Logo - Modern ED Initials Monogram */}
          <div ref={logoRef}>
            <BrandLogo
              size="md"
              onClick={onOpenPortfolio}
              onMouseEnter={() => prefetchModal('portfolio')}
              subtitle="CREATIVE WEB & DESIGN"
            />
          </div>

          {/* Center Links (md+) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-mono text-xs uppercase tracking-wider text-zinc-200">
            <button
              onClick={onOpenPortfolio}
              onMouseEnter={() => prefetchModal('portfolio')}
              onFocus={() => prefetchModal('portfolio')}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <FolderKanban size={13} className="text-cyan-400" />
              TEMPLATES FIGMA <span className="text-[10px] text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/40">4K</span>
            </button>

            <button
              onClick={onOpenPacks}
              onMouseEnter={() => prefetchModal('packs')}
              onFocus={() => prefetchModal('packs')}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <PackageCheck size={13} className="text-cyan-400" />
              PACKS & OFERTAS
            </button>

            <button
              onClick={onOpenBlog}
              onMouseEnter={() => prefetchModal('blog')}
              onFocus={() => prefetchModal('blog')}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <BookOpen size={13} className="text-cyan-400" />
              BLOG
            </button>

            <a href="#pilares" className="hover:text-cyan-300 transition-colors py-1">
              PILARES
            </a>
          </nav>

          {/* Actions Right */}
          <div ref={ctaRef} className="flex items-center gap-2 sm:gap-3">
            {/* Embedded Soundtrack Bar (compact) */}
            <SoundtrackBar compact={true} />

            {/* Top Sleek Capsule CTA Button */}
            <button
              onClick={onOpenContact}
              onMouseEnter={() => prefetchModal('contact')}
              onFocus={() => prefetchModal('contact')}
              className="hidden sm:flex items-center justify-center h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-black border border-cyan-100 font-mono font-bold text-xs sm:text-[13px] uppercase tracking-wider shadow-[0_0_16px_rgba(6,182,212,0.45)] hover:shadow-[0_0_24px_rgba(6,182,212,0.75)] hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>SOLICITAR DIAGNÓSTICO</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Floating Navigation Bar for Mobile (Thumb-Friendly, Proportional & Balanced) */}
      <div className="fixed bottom-3 inset-x-2.5 sm:inset-x-6 z-40 md:hidden grid grid-cols-4 gap-1.5 p-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/85 backdrop-blur-3xl shadow-[0_0_35px_rgba(6,182,212,0.3)] pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
        <button
          onClick={onOpenPortfolio}
          onTouchStart={() => prefetchModal('portfolio')}
          className="flex flex-col items-center justify-center gap-1 h-11 px-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[9.5px] sm:text-[10px] font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-all"
        >
          <FolderKanban size={13} className="text-cyan-300 shrink-0" />
          <span className="truncate">TEMPLATES</span>
        </button>

        <button
          onClick={onOpenPacks}
          onTouchStart={() => prefetchModal('packs')}
          className="flex flex-col items-center justify-center gap-1 h-11 px-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[9.5px] sm:text-[10px] font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-all"
        >
          <PackageCheck size={13} className="text-cyan-300 shrink-0" />
          <span className="truncate">PACKS</span>
        </button>

        <button
          onClick={onOpenBlog}
          onTouchStart={() => prefetchModal('blog')}
          className="flex flex-col items-center justify-center gap-1 h-11 px-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[9.5px] sm:text-[10px] font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-all"
        >
          <BookOpen size={13} className="text-cyan-300 shrink-0" />
          <span className="truncate">BLOG</span>
        </button>

        <button
          onClick={onOpenContact}
          onTouchStart={() => prefetchModal('contact')}
          className="flex flex-col items-center justify-center gap-1 h-11 px-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black border border-cyan-200 font-bold text-[10px] sm:text-[11px] font-mono uppercase shadow-[0_0_18px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-95 transition-all"
        >
          <Send size={12} className="text-black shrink-0" />
          <span className="truncate">DIAGNÓSTICO</span>
        </button>
      </div>
    </>
  );
}
