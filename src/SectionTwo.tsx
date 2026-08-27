import { Sparkles } from 'lucide-react';
import { useReveal } from './hooks';
import { ProtocolScheduler } from './components/InteractiveArtifacts';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';

interface Capability {
  num: string;
  title: string;
  body: string;
}

interface SectionTwoProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
}

const capabilities: Capability[] = [
  {
    num: '01',
    title: 'Templates Figma Editáveis (Foto & Vídeo 4K)',
    body: 'Acesse nossa biblioteca autoral com 46 arquivos Figma prontos em alta resolução, layouts para reels e apresentações 4K.',
  },
  {
    num: '02',
    title: 'Arquitetura Scroll-Driven & WebGL 60 FPS',
    body: 'Renderização fluida por GPU Shader que transforma sua rolagem de tela numa experiência cinematográfica imersiva.',
  },
  {
    num: '03',
    title: 'Trilha Sonora Imersiva Web Audio',
    body: 'Sintetizador de áudio ambiente em tempo real integrado ao site para encantar seu cliente em cada página.',
  },
];

function CapabilityRow({ cap, delay, isLast }: { cap: Capability; delay: number; isLast: boolean }) {
  const ref = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`flex gap-4 py-4.5 ${!isLast ? 'border-b border-white/10' : ''}`}
    >
      <span className="font-mono text-xs tracking-[0.15em] text-cyan-300 font-bold pt-1 shrink-0">
        {cap.num}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2 group cursor-default">
          <span className="text-base font-medium text-white group-hover:text-cyan-200 transition-colors">
            {cap.title}
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-200 font-light">
          {cap.body}
        </p>
      </div>
    </div>
  );
}

export default function SectionTwo({ onOpenContact, onOpenPortfolio: _onOpenPortfolio }: SectionTwoProps) {
  const badgeRef = useReveal(120);
  const copyRef = useReveal(220);
  const h2Ref = useReveal(180);

  return (
    <section id="pilares" className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between px-4 sm:px-8 md:px-12 pt-16 sm:pt-24 pb-14 sm:pb-16 relative bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent backdrop-blur-2xl">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:justify-between items-start">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 border-l-2 border-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 backdrop-blur-md rounded-r-lg border-y border-r border-cyan-500/30"
        >
          <Sparkles size={13} className="text-cyan-300" />
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-cyan-200 font-medium">
            METODOLOGIA & DIFERENCIAIS
          </span>
        </div>

        <p
          ref={copyRef}
          className="max-w-md sm:text-right text-sm sm:text-lg leading-relaxed text-zinc-200 drop-shadow-md font-light"
        >
          Seu site pode ser mais do que presença institucional. Pode ser uma ferramenta de autoridade que converte visitantes em clientes.
        </p>
      </div>

      {/* Main Grid */}
      <div className="my-6 sm:my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          <h2
            ref={h2Ref}
            className="text-[clamp(2rem,4.8vw,3.8rem)] font-normal leading-[1.08] tracking-tight text-white drop-shadow-lg"
          >
            Sua marca merece <br />
            uma experiência <br />
            <span className="font-serif italic font-light text-cyan-300 underline decoration-cyan-400/50 underline-offset-8 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              cinematográfica.
            </span>
          </h2>

          <p className="text-xs sm:text-base text-zinc-200 font-light leading-relaxed max-w-lg">
            A EdiCria Studio combina design de autor, desenvolvimento de alta performance, biblioteca de templates Figma e áudio ambiente para criar ecossistemas digitais inesquecíveis.
          </p>

          {/* Ultra-Translucent Cyan Capability panel */}
          <div className="rounded-3xl border border-cyan-400/40 bg-cyan-950/20 backdrop-blur-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)] space-y-3 sm:space-y-4">
            <CapabilityRow cap={capabilities[0]} delay={300} isLast={false} />
            <CapabilityRow cap={capabilities[1]} delay={410} isLast={false} />
            <CapabilityRow cap={capabilities[2]} delay={520} isLast={true} />

            <div className="pt-3 sm:pt-4 flex items-center justify-start">
              <WebGLLiquidSurgeButton
                label="SOLICITAR DIAGNÓSTICO VIP"
                onClick={onOpenContact}
                width="w-full sm:w-[280px]"
                height="h-[60px] sm:h-[64px]"
              />
            </div>
          </div>
        </div>

        {/* Right Column — Protocol Scheduler Widget */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <ProtocolScheduler />
        </div>
      </div>
    </section>
  );
}
