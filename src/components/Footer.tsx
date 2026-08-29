import { Sparkles, FolderKanban, PackageCheck, ShieldCheck } from 'lucide-react';
import { useReveal } from '../hooks';
import WebGLLiquidSurgeButton from './WebGLLiquidSurgeButton';
import { LegalTab } from './LegalModal';
import { ParallaxWrapper, ParallaxFloatingOrb, ParallaxFloatingBadge } from './ParallaxElements';
import BrandLogo from './BrandLogo';
import { prefetchModal } from '../utils/prefetch';

interface FooterProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
  onOpenPacks?: () => void;
  onOpenBlog?: () => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export default function Footer({
  onOpenContact,
  onOpenPortfolio,
  onOpenPacks,
  onOpenBlog,
  onOpenLegal,
}: FooterProps) {
  const headerRef = useReveal(100);

  return (
    <footer className="relative bg-gradient-to-b from-transparent via-cyan-950/25 to-[#050b11]/95 text-white rounded-t-[2.5rem] sm:rounded-t-[4rem] border-t border-cyan-500/30 pt-16 sm:pt-20 pb-28 md:pb-12 px-4 sm:px-8 md:px-12 overflow-hidden backdrop-blur-3xl">
      {/* Background Ambient Glow */}
      <ParallaxFloatingOrb size={600} top="0%" left="30%" color="cyan" speed={0.2} blur={160} opacity={0.14} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        {/* Main Call to Action Header - Ultra-Translucent Cyan Frosted Glass Card with Smooth Parallax */}
        <ParallaxWrapper speed={0.25} offset={[-20, 30]}>
          <div ref={headerRef} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 p-6 sm:p-12 rounded-3xl bg-cyan-950/25 border border-cyan-400/50 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <div className="max-w-2xl space-y-3">
              <ParallaxFloatingBadge speed={0.3} offsetY={6}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono uppercase text-cyan-300">
                  <Sparkles size={13} className="text-cyan-400" />
                  EDICRIA STUDIO 2026
                </div>
              </ParallaxFloatingBadge>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
                Pronto para transformar sua presença digital?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 font-light leading-relaxed">
                Solicite uma proposta exclusiva, explore nossos packs autorais ou adquira templates Figma editáveis em 4K.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
              <WebGLLiquidSurgeButton
                label="INICIAR PROJETO"
                onClick={onOpenContact}
                width="w-full sm:w-[220px]"
                height="h-[56px] sm:h-[60px]"
              />
              
              <button
                onClick={onOpenPacks}
                onMouseEnter={() => prefetchModal('packs')}
                onTouchStart={() => prefetchModal('packs')}
                className="w-full sm:w-auto px-5 py-3.5 sm:py-4 rounded-2xl border border-cyan-400/40 bg-cyan-950/40 text-cyan-200 text-xs font-mono uppercase tracking-wider hover:bg-cyan-900/50 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <PackageCheck size={14} className="text-cyan-300" />
                PACKS & OFERTAS
              </button>

              <button
                onClick={onOpenPortfolio}
                onMouseEnter={() => prefetchModal('portfolio')}
                onTouchStart={() => prefetchModal('portfolio')}
                className="w-full sm:w-auto px-5 py-3.5 sm:py-4 rounded-2xl border border-white/10 bg-white/5 text-zinc-300 text-xs font-mono uppercase tracking-wider hover:bg-white/15 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <FolderKanban size={14} className="text-cyan-300" />
                TEMPLATES FIGMA
              </button>
            </div>
          </div>
        </ParallaxWrapper>

        {/* Footer Middle Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-white/10 text-xs">
          <div className="space-y-3 md:col-span-2">
            <BrandLogo size="lg" subtitle="ESTÚDIO DE CRIAÇÃO DIGITAL & 4K" />
            <p className="text-zinc-300 font-light max-w-md leading-relaxed text-xs">
              Estúdio de criação digital de alta performance especializado em websites cinematográficos, shaders WebGL a 60 FPS e biblioteca de templates Figma profissionais para criadores e marcas de alto padrão.
            </p>
            <div className="pt-2 flex items-center gap-2 text-cyan-300 font-mono text-[11px]">
              <span>E-mail:</span>
              <a href="mailto:edicriaestudiocriativo@gmail.com" className="text-white hover:text-cyan-300 underline underline-offset-4">
                edicriaestudiocriativo@gmail.com
              </a>
            </div>
          </div>

          <div className="space-y-2.5 font-mono">
            <span className="text-[11px] uppercase tracking-widest text-cyan-300 font-bold block mb-1">
              PRODUTOS & ACERVO
            </span>
            <button
              onClick={onOpenPortfolio}
              onMouseEnter={() => prefetchModal('portfolio')}
              onTouchStart={() => prefetchModal('portfolio')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • 46 Templates Figma 4K
            </button>
            <button
              onClick={onOpenPacks}
              onMouseEnter={() => prefetchModal('packs')}
              onTouchStart={() => prefetchModal('packs')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Packs & Combos VIP
            </button>
            <button
              onClick={onOpenBlog}
              onMouseEnter={() => prefetchModal('blog')}
              onTouchStart={() => prefetchModal('blog')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Blog & Artigos Tech
            </button>
            <button
              onClick={onOpenContact}
              onMouseEnter={() => prefetchModal('contact')}
              onTouchStart={() => prefetchModal('contact')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Solicitar Orçamento
            </button>
          </div>

          <div className="space-y-2.5 font-mono">
            <span className="text-[11px] uppercase tracking-widest text-cyan-300 font-bold block mb-1 flex items-center gap-1">
              <ShieldCheck size={13} className="text-cyan-400" />
              LEGAL & LGPD
            </span>
            <button
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
              onMouseEnter={() => prefetchModal('legal')}
              onTouchStart={() => prefetchModal('legal')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Política de Privacidade (LGPD)
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('terms')}
              onMouseEnter={() => prefetchModal('legal')}
              onTouchStart={() => prefetchModal('legal')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Termos de Licenciamento
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('cookies')}
              onMouseEnter={() => prefetchModal('legal')}
              onTouchStart={() => prefetchModal('legal')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Política de Cookies
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('compliance')}
              onMouseEnter={() => prefetchModal('legal')}
              onTouchStart={() => prefetchModal('legal')}
              className="block text-zinc-300 hover:text-white text-left transition-colors"
            >
              • Garantia de 7 Dias (CDC)
            </button>
          </div>
        </div>

        {/* Footer Bottom Info */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div>
            © 2026 EDICRIA STUDIO. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>GOOGLE & LGPD COMPLIANCE VERIFICADO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
