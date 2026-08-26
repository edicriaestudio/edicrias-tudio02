import { useState } from 'react';
import { Sparkles, Cpu, Layers } from 'lucide-react';
import WebGLLiquidSurgeButton from './WebGLLiquidSurgeButton';

interface StickyProtocolStackProps {
  onOpenContact?: () => void;
}

export default function StickyProtocolStack({ onOpenContact }: StickyProtocolStackProps) {
  const [activeCard, setActiveCard] = useState(0);

  const cards = [
    {
      id: '01',
      title: 'ARQUITETURA LIQUID SURGE & WEBGL 4K',
      subtitle: 'Shaders fluídos e física de partículas reativas',
      desc: 'Nossa tecnologia de rendering por GPU WebGL converte toques e interações em simulações líquidas cinematográficas a 60 FPS.',
      tag: 'WEBGL LIQUID SURGE 60FPS',
      graphic: (
        <div className="flex flex-col items-center gap-4 py-2">
          <WebGLLiquidSurgeButton
            label="INTERAGIR COM SURGE"
            onClick={onOpenContact}
            width="w-[260px] sm:w-[280px]"
            height="h-[74px]"
          />
          <span className="font-mono text-[10px] text-cyan-300 tracking-widest uppercase flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            WEBGL SHADER LIQUID ENGINE
          </span>
        </div>
      ),
    },
    {
      id: '02',
      title: 'LASER SCANNING & INTERAÇÃO SENSORIAL',
      subtitle: 'Micro-UIs vivas com resposta háptica visual',
      desc: 'Cada botão, card ou elemento reage instantaneamente aos toques com efeitos glassmorphism e sombras dinâmicas.',
      tag: 'LASER MATRIX RESPONSIVA',
      graphic: (
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center border border-cyan-400/40 rounded-3xl overflow-hidden bg-cyan-950/20 backdrop-blur-3xl shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          {/* Laser Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-[bounce_2s_infinite] shadow-[0_0_20px_#06b6d4]" />
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:20px_20px]" />
          <Cpu size={48} className="text-cyan-300 animate-pulse relative z-10" />
          <span className="mt-3 font-mono text-[10px] text-cyan-200 tracking-widest uppercase z-10">
            SCANNING MATRIX 4K
          </span>
        </div>
      ),
    },
    {
      id: '03',
      title: 'ECOSSISTEMA FIGMA & TEMPLATES AUTORAIS',
      subtitle: 'Kits completos prontos para foto e vídeo',
      desc: 'Acesso imediato aos nossos 46 componentes editáveis no Figma, criados especificamente para escalar a presença digital da sua marca.',
      tag: 'FIGMA SYSTEM 2026',
      graphic: (
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center border border-cyan-400/30 rounded-3xl overflow-hidden bg-cyan-950/15 backdrop-blur-3xl shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <Layers size={48} className="text-cyan-300 animate-pulse mb-3" />
          <WebGLLiquidSurgeButton
            label="EXPLORAR TEMPLATES"
            onClick={onOpenContact}
            width="w-[220px]"
            height="h-[56px]"
          />
        </div>
      ),
    },
  ];

  return (
    <section id="protocolos" className="relative py-28 px-5 sm:px-8 md:px-12 bg-gradient-to-b from-transparent via-cyan-950/25 to-transparent backdrop-blur-3xl border-y border-cyan-500/20">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-cyan-500/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2 mb-2 font-medium">
              <Sparkles size={14} className="text-cyan-400" />
              // PROTOCOLO DE CONSTRUÇÃO (WEBGL & SHADERS)
            </span>
            <h3 className="text-3xl sm:text-5xl font-normal text-white tracking-tight">
              Os 3 pilares da <span className="font-serif italic text-cyan-300 underline decoration-cyan-400/50 underline-offset-8">EdiCria Studio</span>
            </h3>
          </div>

          {/* Pillar Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCard(idx)}
                className={`px-4 py-2.5 rounded-full font-mono text-xs border transition-all duration-300 ${
                  activeCard === idx
                    ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                    : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                PILAR #0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Spaced Card Display Container (Ultra-Translucent Glass) */}
        <div className="w-full min-h-[420px] relative">
          {cards.map((card, idx) => {
            const isActive = activeCard === idx;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCard(idx)}
                className={`w-full rounded-3xl border p-6 sm:p-10 md:p-12 transition-all duration-500 ${
                  isActive
                    ? 'bg-cyan-950/15 border-cyan-400/40 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.22)] relative z-20 opacity-100 scale-100 pointer-events-auto block'
                    : 'bg-cyan-950/10 border-white/10 backdrop-blur-xl opacity-0 pointer-events-none absolute top-0 inset-x-0 z-10 scale-95 hidden'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                  
                  {/* Left Specs & Copy with Clean Spacing */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-sm">
                        {card.tag}
                      </span>
                      <span className="font-mono text-xs text-zinc-300 font-medium">PILAR {card.id}</span>
                    </div>

                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-snug">
                      {card.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-cyan-200 font-mono tracking-wider pt-1">
                      // {card.subtitle}
                    </p>

                    <p className="text-base sm:text-lg text-zinc-100 font-light leading-relaxed max-w-2xl pt-2">
                      {card.desc}
                    </p>
                  </div>

                  {/* Right WebGL Interactive Graphic */}
                  <div className="shrink-0 w-full lg:w-auto flex items-center justify-center pt-4 lg:pt-0">
                    {card.graphic}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
