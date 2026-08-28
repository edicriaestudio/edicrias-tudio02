import { useState, useEffect } from 'react';
import { Sparkles, Cpu, Layers, Scan, ArrowUpRight, Activity, Waves, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import WebGLLiquidSurgeButton from './WebGLLiquidSurgeButton';

interface StickyProtocolStackProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
}

export default function StickyProtocolStack({ onOpenContact, onOpenPortfolio }: StickyProtocolStackProps) {
  const [activeCard, setActiveCard] = useState(0);
  const [scanCoordinate, setScanCoordinate] = useState({ x: 104.2, y: 88.5 });
  const [freqBand, setFreqBand] = useState([65, 82, 45, 96, 74, 88, 55, 90, 78, 62, 94, 70]);

  // Dynamic telemetry coordinate counter for scanner HUD
  useEffect(() => {
    const interval = setInterval(() => {
      setScanCoordinate({
        x: Number((100 + Math.random() * 20).toFixed(1)),
        y: Number((80 + Math.random() * 30).toFixed(1)),
      });
      setFreqBand((prev) =>
        prev.map(() => Math.floor(35 + Math.random() * 65))
      );
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      id: '01',
      title: 'LASER SCANNING & INTERAÇÃO SENSORIAL',
      subtitle: 'Micro-UIs vivas com resposta háptica visual',
      desc: 'Cada botão, card ou elemento reage instantaneamente aos toques com efeitos glassmorphism, scanner contínuo de alta precisão e iluminação volumétrica.',
      tag: 'LASER MATRIX RESPONSIVA',
      graphic: (
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex flex-col items-center justify-center border border-cyan-400/50 rounded-3xl overflow-hidden bg-gradient-to-b from-cyan-950/30 via-[#041520]/80 to-cyan-950/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.28)] group">
          {/* Cyber Grid Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d418_1px,transparent_1px),linear-gradient(to_bottom,#06b6d418_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          {/* Radial Core Glow */}
          <div className="absolute inset-0 bg-radial from-cyan-500/15 via-transparent to-transparent pointer-events-none" />

          {/* Corner Precision Reticles */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

          {/* Top Telemetry Overlay */}
          <div className="absolute top-3 inset-x-4 flex items-center justify-between font-mono text-[9px] text-cyan-300/90 z-20 pointer-events-none">
            <span className="flex items-center gap-1">
              <Scan size={10} className="text-cyan-400 animate-spin" />
              SCANNING
            </span>
            <span className="text-cyan-200 font-bold">
              X:{scanCoordinate.x} Y:{scanCoordinate.y}
            </span>
          </div>

          {/* Central Animated Hologram Target */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-md">
              <Cpu size={46} className="text-cyan-300 animate-pulse relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              
              {/* Rotating Tech Ring */}
              <div className="absolute -inset-2 border border-dashed border-cyan-400/40 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
            <span className="mt-3 font-mono text-[10px] text-cyan-200 tracking-[0.2em] uppercase font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              SCANNING MATRIX 4K
            </span>
          </div>

          {/* Bottom Status */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between font-mono text-[8px] tracking-widest text-cyan-400/80 z-20 pointer-events-none">
            <span>GPU: REAC_60FPS</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              ACTIVE
            </span>
          </div>

          {/* CONTINUOUS ULTRA-SMOOTH VERTICAL LASER SCANNER BEAM */}
          <motion.div
            animate={{
              top: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 2.8,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="absolute inset-x-0 z-30 pointer-events-none -translate-y-1/2"
          >
            <div className="w-full h-12 bg-gradient-to-t from-cyan-400/30 via-cyan-500/10 to-transparent" />
            <div className="relative w-full h-[2.5px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#22d3ee,0_0_35px_#06b6d4]" />
            <div className="w-full h-12 bg-gradient-to-b from-cyan-400/30 via-cyan-500/10 to-transparent" />
          </motion.div>
        </div>
      ),
    },
    {
      id: '02',
      title: 'MOTOR GRÁFICO WEBGL & ONDAS DE FLUIDO',
      subtitle: 'Física de partículas reativas e osciladores de frequência 60 FPS',
      desc: 'Nossa tecnologia proprietária de shaders WebGL renderiza simulações fluídas, oscilações harmônicas e campos de energia direto na placa gráfica do usuário.',
      tag: 'GPU FLUID ENGINE 60FPS',
      graphic: (
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex flex-col items-center justify-between border border-cyan-400/40 rounded-3xl overflow-hidden bg-gradient-to-b from-cyan-950/25 via-[#03131e]/85 to-cyan-950/35 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] p-4 group">
          {/* Ambient Nebula */}
          <div className="absolute inset-0 bg-radial from-teal-500/15 via-transparent to-transparent pointer-events-none" />

          {/* Top Telemetry Header */}
          <div className="w-full flex items-center justify-between font-mono text-[9px] text-cyan-300 z-10">
            <span className="flex items-center gap-1.5">
              <Activity size={12} className="text-teal-300 animate-pulse" />
              GPU ENGINE
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-200">
              60.0 FPS
            </span>
          </div>

          {/* Central Futuristic Waveform Harmonic Core */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-cyan-400/20 animate-ping pointer-events-none" />
              <div className="absolute w-36 h-36 rounded-full border border-teal-400/15 animate-[spin_8s_linear_infinite] border-dashed pointer-events-none" />
              
              {/* Center Fluid Orb */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/40 via-teal-400/30 to-cyan-200/40 border border-cyan-300/60 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                <Waves size={26} className="text-cyan-200 animate-pulse drop-shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>

            {/* Dynamic Equalizer Wave Bars */}
            <div className="flex items-end justify-center gap-1 mt-4 h-8 px-3">
              {freqBand.map((val, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="w-1 rounded-full bg-gradient-to-t from-cyan-500 via-cyan-300 to-teal-200 shadow-[0_0_6px_#06b6d4]"
                />
              ))}
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="w-full flex items-center justify-between font-mono text-[8px] tracking-widest text-cyan-300/80 border-t border-cyan-500/20 pt-2 z-10">
            <span className="flex items-center gap-1">
              <Radio size={10} className="text-teal-300" />
              FREQ: 432Hz HARMONIC
            </span>
            <span className="text-cyan-200 font-bold">LATENCY: 0.8ms</span>
          </div>
        </div>
      ),
    },
    {
      id: '03',
      title: 'ECOSSISTEMA FIGMA & TEMPLATES AUTORAIS',
      subtitle: 'Kits completos prontos para foto e vídeo',
      desc: 'Acesso imediato aos nossos componentes editáveis no Figma, criados especificamente para elevar a autoridade visual da sua marca.',
      tag: 'FIGMA SYSTEM 2026',
      graphic: (
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex flex-col items-center justify-center border border-cyan-400/40 rounded-3xl overflow-hidden bg-gradient-to-b from-cyan-950/20 via-[#041520]/80 to-cyan-950/30 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.22)] p-6 text-center group">
          {/* Ambient Background Shimmer */}
          <div className="absolute inset-0 bg-radial from-cyan-500/15 via-transparent to-transparent pointer-events-none" />

          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Layers size={40} className="text-cyan-300 animate-pulse drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
          </div>

          <span className="font-mono text-[11px] uppercase tracking-widest text-cyan-200 font-bold mb-4">
            46+ COMPONENTES FIGMA 4K
          </span>

          {/* Direct CTA that opens the Template Portfolio */}
          <WebGLLiquidSurgeButton
            label="EXPLORAR TEMPLATES"
            onClick={onOpenPortfolio || onOpenContact}
            width="w-full max-w-[220px]"
            height="h-[54px]"
          />

          <button
            onClick={onOpenPortfolio || onOpenContact}
            className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300 hover:text-white transition-colors"
          >
            <span>VER CATÁLOGO AO VIVO</span>
            <ArrowUpRight size={12} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section id="protocolos" className="relative py-16 sm:py-28 px-4 sm:px-8 md:px-12 bg-gradient-to-b from-transparent via-cyan-950/25 to-transparent backdrop-blur-3xl border-y border-cyan-500/20 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6 border-b border-white/10 pb-6">
          <div>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-cyan-300 flex items-center gap-2 mb-2 font-medium">
              <Sparkles size={14} className="text-cyan-400" />
              // PROTOCOLO DE CONSTRUÇÃO (WEBGL & SHADERS)
            </span>
            <h3 className="text-2xl sm:text-5xl font-normal text-white tracking-tight">
              Os 3 pilares da <span className="font-serif italic text-cyan-300 underline decoration-cyan-400/50 underline-offset-8">EdiCria Studio</span>
            </h3>
          </div>

          {/* Pillar Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCard(idx)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-mono text-xs border transition-all duration-300 active:scale-95 ${
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

        {/* Clean Spaced Card Display Container */}
        <div className="w-full min-h-[380px] sm:min-h-[420px] relative">
          {cards.map((card, idx) => {
            const isActive = activeCard === idx;
            return (
              <div
                key={card.id}
                onClick={() => setActiveCard(idx)}
                className={`w-full rounded-3xl border p-5 sm:p-10 md:p-12 transition-all duration-500 ${
                  isActive
                    ? 'bg-cyan-950/15 border-cyan-400/40 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.22)] relative z-20 opacity-100 scale-100 pointer-events-auto block'
                    : 'bg-cyan-950/10 border-white/10 backdrop-blur-xl opacity-0 pointer-events-none absolute top-0 inset-x-0 z-10 scale-95 hidden'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-10">
                  
                  {/* Left Specs & Copy */}
                  <div className="flex-1 space-y-3.5 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-cyan-500/40 shadow-sm">
                        {card.tag}
                      </span>
                      <span className="font-mono text-xs text-zinc-300 font-medium">PILAR {card.id}</span>
                    </div>

                    <h4 className="text-xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-snug">
                      {card.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-cyan-200 font-mono tracking-wider pt-0.5 sm:pt-1">
                      // {card.subtitle}
                    </p>

                    <p className="text-sm sm:text-lg text-zinc-100 font-light leading-relaxed max-w-2xl pt-1 sm:pt-2">
                      {card.desc}
                    </p>
                  </div>

                  {/* Right WebGL Interactive Graphic */}
                  <div className="shrink-0 w-full lg:w-auto flex items-center justify-center pt-2 lg:pt-0">
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
