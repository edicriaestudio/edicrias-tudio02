import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Terminal, Layers } from 'lucide-react';

// 1. Diagnostic Shuffler: Clean Single Translucent Cyan Glass Card (No overlapping cards underneath)
export function DiagnosticShuffler() {
  const cards = [
    { id: 1, title: 'Conversão & Mobile-First', metric: '+340% Engajamento', tag: 'UI / UX Autoral' },
    { id: 2, title: 'Animações 60 FPS GSAP', metric: '0.2s LCP Load Time', tag: 'Performance' },
    { id: 3, title: 'Arquitetura de Marca de Luxo', metric: 'Posicionamento Premium', tag: 'Branding' },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % cards.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [cards.length]);

  const card = cards[activeIdx];

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-7 rounded-3xl border border-cyan-400/40 bg-cyan-950/15 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.18)] flex flex-col justify-between min-h-[240px] transition-all duration-700">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40 flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {card.tag}
        </span>
        <span className="font-mono text-[11px] text-zinc-300">CARD #0{card.id}</span>
      </div>

      <div className="my-4">
        <h4 className="text-xl font-medium text-white tracking-tight">{card.title}</h4>
        <p className="text-2xl sm:text-3xl font-bold text-cyan-300 mt-1.5 tracking-tight">{card.metric}</p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-300">
        <span>DIAGNÓSTICO ATIVO</span>
        <span className="text-cyan-300 flex items-center gap-1">AUTO-SHUFFLE 3S <Layers size={12} /></span>
      </div>
    </div>
  );
}

const TELEMETRY_LOGS = [
  'SYSTEM.INIT: EdiCria Studio Core v2.4 initialized...',
  'PERF.AUDIT: 100/100 Lighthouse Performance Index verified.',
  'SCROLL.ENGINE: Canvas frame scrub active (60 FPS).',
  'AI.GEN: Neural responsive layout grid synthesized.',
  'DEPLOY.VERCEL: Edge CDN cached across global nodes.',
];

// 2. Telemetry Typewriter: Live monospace terminal feed (Ultra-Translucent Cyan Glass)
export function TelemetryTypewriter() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const fullLine = TELEMETRY_LOGS[currentLineIndex];
    if (currentCharIndex < fullLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullLine[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setCurrentCharIndex(0);
        setCurrentLineIndex((prev) => (prev + 1) % TELEMETRY_LOGS.length);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex]);

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-cyan-400/40 bg-cyan-950/15 p-5 backdrop-blur-3xl font-mono text-xs shadow-[0_0_50px_rgba(6,182,212,0.18)]">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-cyan-300">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cyan-400" />
          <span className="text-[11px] uppercase tracking-widest text-cyan-300 font-medium">TELEMETRIA LIVE</span>
        </div>
        <span className="text-[10px] text-cyan-400 animate-pulse">● LIVE STREAM</span>
      </div>

      <div className="py-4 space-y-2 min-h-[90px]">
        <div className="text-zinc-400 text-[10px] uppercase tracking-wider">LOG DE EXECUÇÃO:</div>
        <p className="text-white font-mono text-xs sm:text-sm leading-relaxed">
          {displayedText}
          <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-ping align-middle" />
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-300">
        <span>LATÊNCIA: 4ms</span>
        <span className="text-cyan-300">STATUS: OPERACIONAL</span>
      </div>
    </div>
  );
}

// 3. Protocol Scheduler: Interactive weekly grid (Ultra-Translucent Cyan Glass)
export function ProtocolScheduler() {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const [selectedDay, setSelectedDay] = useState<string>('QUA');
  const [isSaved, setIsSaved] = useState(false);

  const handleSelect = (day: string) => {
    setSelectedDay(day);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-cyan-400/40 bg-cyan-950/15 p-6 sm:p-7 backdrop-blur-3xl shadow-[0_0_50px_rgba(6,182,212,0.18)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-cyan-300" />
          <h4 className="text-sm font-semibold text-white uppercase font-mono tracking-wider">AGENDAMENTO DE PROJETO</h4>
        </div>
        <span className="text-[10px] font-mono uppercase bg-cyan-950/80 px-2.5 py-1 rounded-full text-cyan-300 border border-cyan-500/30">AGENDA 2026</span>
      </div>

      <p className="text-xs text-zinc-200 font-light mb-5 leading-relaxed">
        Selecione o dia ideal para a reunião de diagnóstico inicial da sua marca.
      </p>

      {/* Grid of days */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {days.map((day) => {
          const active = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => handleSelect(day)}
              className={`py-3 rounded-xl font-mono text-xs font-semibold transition-all transform active:scale-95 flex flex-col items-center gap-1 border ${
                active
                  ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'bg-white/5 text-zinc-200 border-white/10 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{day}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-black' : 'bg-cyan-400/40'}`} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          {isSaved ? (
            <span className="text-cyan-300 font-mono text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-cyan-400" /> AGENDADO COM SUCESSO!
            </span>
          ) : (
            <span className="text-zinc-300 font-mono text-xs">
              SESSÃO SELECIONADA: <strong className="text-cyan-300">{selectedDay}</strong>
            </span>
          )}
        </div>

        <button
          onClick={() => setIsSaved(true)}
          className="px-4 py-2 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all"
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  );
}
