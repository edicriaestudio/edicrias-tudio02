import { FolderKanban, PackageCheck, BookOpen } from 'lucide-react';
import { useReveal } from './hooks';
import SoundtrackBar from './components/SoundtrackBar';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';
import BrandLogo from './components/BrandLogo';

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
      <header className="fixed top-3 inset-x-3 sm:inset-x-6 md:inset-x-12 z-40">
        <div className="max-w-6xl mx-auto rounded-full border border-cyan-400/40 bg-cyan-950/15 backdrop-blur-3xl px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all hover:border-cyan-400/60">
          
          {/* Brand Logo - Modern ED Initials Monogram */}
          <div ref={logoRef}>
            <BrandLogo
              size="md"
              onClick={onOpenPortfolio}
              subtitle="CREATIVE WEB & DESIGN"
            />
          </div>

          {/* Center Links (md+) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-mono text-xs uppercase tracking-wider text-zinc-200">
            <button
              onClick={onOpenPortfolio}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <FolderKanban size={13} className="text-cyan-400" />
              TEMPLATES FIGMA <span className="text-[10px] text-cyan-200 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/40">4K</span>
            </button>

            <button
              onClick={onOpenPacks}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 py-1"
            >
              <PackageCheck size={13} className="text-cyan-400" />
              PACKS & OFERTAS
            </button>

            <button
              onClick={onOpenBlog}
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
      <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 z-40 md:hidden flex items-center justify-between gap-2 p-2 rounded-full border border-cyan-400/40 bg-cyan-950/30 backdrop-blur-3xl shadow-[0_0_40px_rgba(6,182,212,0.3)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        <button
          onClick={onOpenPortfolio}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-transform shrink-0"
        >
          <FolderKanban size={14} className="text-cyan-400" />
          <span>TEMPLATES</span>
        </button>

        <button
          onClick={onOpenPacks}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-transform shrink-0"
        >
          <PackageCheck size={14} className="text-cyan-400" />
          <span>PACKS</span>
        </button>

        <button
          onClick={onOpenBlog}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono uppercase text-cyan-200 hover:text-white active:scale-95 transition-transform shrink-0"
        >
          <BookOpen size={14} className="text-cyan-400" />
          <span>BLOG</span>
        </button>

        <div className="flex-1 min-w-[110px] max-w-[150px]">
          <WebGLLiquidSurgeButton
            label="SITE VIP"
            onClick={onOpenContact}
            width="w-full"
            height="h-[44px]"
          />
        </div>
      </div>
    </>
  );
}
