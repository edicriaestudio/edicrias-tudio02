import { useState, useEffect } from 'react';
import {
  Terminal,
  Layers,
  Calculator,
  Calendar,
  ExternalLink,
  Check
} from 'lucide-react';

// 1. Diagnostic Shuffler: Clean Single Translucent Cyan Glass Card (No overlapping cards underneath)
export function DiagnosticShuffler() {
  const cards = [
    { id: 1, title: 'Conversão & Mobile-First', metric: '+30% a +45% Retenção', tag: 'UI / UX Autoral' },
    { id: 2, title: 'Animações 60 FPS & Shaders', metric: '0.8s LCP • 98+ Lighthouse', tag: 'Performance Web' },
    { id: 3, title: 'Arquitetura de Marca & Autoridade', metric: 'Posicionamento Premium', tag: 'Branding & Percepção' },
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
  'SYSTEM.INIT: Edcria Estúdio Core v2.4 initialized...',
  'PERF.AUDIT: 98/100 Lighthouse Performance Index verified.',
  'SCROLL.ENGINE: Canvas frame scrub active (60 FPS).',
  'UI.AUTORAL: Responsive layout grid synthesized.',
  'DEPLOY.EDGE: Global CDN cached with low latency (0.8s LCP).',
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

// 3. Interactive Project Scope & Instant ROI Estimator / Real Consultation Scheduler
export function ProtocolScheduler({ onOpenContact }: { onOpenContact?: () => void }) {
  const [mode, setMode] = useState<'estimator' | 'schedule'>('estimator');

  // Estimator States
  const [projectType, setProjectType] = useState<'landing' | 'institutional' | 'ecommerce'>('landing');
  const [features, setFeatures] = useState<{ [key: string]: boolean }>({
    webgl: true,
    soundtrack: true,
    video4k: true,
    ia: false,
  });

  // Schedule States
  const days = [
    { label: 'SEG', full: 'Segunda-feira' },
    { label: 'TER', full: 'Terça-feira' },
    { label: 'QUA', full: 'Quarta-feira' },
    { label: 'QUI', full: 'Quinta-feira' },
    { label: 'SEX', full: 'Sexta-feira' },
    { label: 'SÁB', full: 'Sábado' },
  ];
  const times = ['10:00', '14:30', '16:00', '19:00'];
  const [selectedDay, setSelectedDay] = useState('QUA');
  const [selectedTime, setSelectedTime] = useState('14:30');

  const toggleFeature = (key: string) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic calculations based on user selection
  const getCalculation = () => {
    let baseDays = 5;
    let baseImpact = '+25% a +40%';
    let impactLabel = 'Geração de Leads Qualificados';

    if (projectType === 'landing') {
      baseDays = 5;
      baseImpact = '+30% a +45%';
      impactLabel = 'Taxa de Conversão & Leads';
    } else if (projectType === 'institutional') {
      baseDays = 8;
      baseImpact = '+35% a +50%';
      impactLabel = 'Retenção & Confiança';
    } else if (projectType === 'ecommerce') {
      baseDays = 12;
      baseImpact = '+20% a +35%';
      impactLabel = 'Conversão no Checkout';
    }

    if (features.webgl) baseDays += 1;
    if (features.video4k) baseDays += 1;
    if (features.soundtrack) baseDays += 1;
    if (features.ia) baseDays += 2;

    return { days: baseDays, impact: baseImpact, impactLabel };
  };

  const calc = getCalculation();

  const handleOpenWhatsAppSchedule = () => {
    const dayObj = days.find((d) => d.label === selectedDay);
    const dayName = dayObj ? dayObj.full : selectedDay;
    const typeLabel =
      projectType === 'landing'
        ? 'Landing Page Autoral'
        : projectType === 'institutional'
        ? 'Site Institucional Autoral'
        : 'E-commerce Autoral';

    const text = encodeURIComponent(
      `Olá Edcria Estúdio! Gostaria de agendar uma Reunião de Diagnóstico para ${dayName} às ${selectedTime}.\n\nInteresse: ${typeLabel}\nRecursos: ${
        features.webgl ? 'Shader WebGL 60FPS, ' : ''
      }${features.soundtrack ? 'Trilha Sonora, ' : ''}${features.video4k ? 'Vídeos 4K, ' : ''}${features.ia ? 'Automação IA, ' : ''}\n\nPodemos confirmar esse horário?`
    );
    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-cyan-400/40 bg-cyan-950/20 p-5 sm:p-7 backdrop-blur-3xl shadow-[0_0_60px_rgba(6,182,212,0.22)] text-white flex flex-col justify-between space-y-4">
      
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-cyan-500/30">
          <button
            onClick={() => setMode('estimator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              mode === 'estimator'
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Calculator size={13} />
            Simulador
          </button>
          <button
            onClick={() => setMode('schedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              mode === 'schedule'
                ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Calendar size={13} />
            Agendar VIP
          </button>
        </div>

        <span className="font-mono text-[10px] uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
          INTERATIVO
        </span>
      </div>

      {mode === 'estimator' ? (
        /* MODE 1: Interactive Project Scope Estimator */
        <div className="space-y-4">
          <div>
            <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-wider block mb-1.5">
              1. SELECIONE O TIPO DE PROJETO:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setProjectType('landing')}
                className={`py-2 px-2 rounded-xl text-center font-mono text-[11px] uppercase transition-all border ${
                  projectType === 'landing'
                    ? 'bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                Landing 4K
              </button>
              <button
                onClick={() => setProjectType('institutional')}
                className={`py-2 px-2 rounded-xl text-center font-mono text-[11px] uppercase transition-all border ${
                  projectType === 'institutional'
                    ? 'bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                Institucional
              </button>
              <button
                onClick={() => setProjectType('ecommerce')}
                className={`py-2 px-2 rounded-xl text-center font-mono text-[11px] uppercase transition-all border ${
                  projectType === 'ecommerce'
                    ? 'bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                E-Commerce
              </button>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-wider block mb-1.5">
              2. RECURSOS EXCLUSIVOS INCLUSOS:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => toggleFeature('webgl')}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  features.webgl
                    ? 'bg-cyan-950/80 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                <span>Shader WebGL 60fps</span>
                {features.webgl ? <Check size={13} className="text-cyan-400" /> : <span className="text-[10px]">+</span>}
              </button>

              <button
                onClick={() => toggleFeature('soundtrack')}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  features.soundtrack
                    ? 'bg-cyan-950/80 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                <span>Trilha Web Audio</span>
                {features.soundtrack ? <Check size={13} className="text-cyan-400" /> : <span className="text-[10px]">+</span>}
              </button>

              <button
                onClick={() => toggleFeature('video4k')}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  features.video4k
                    ? 'bg-cyan-950/80 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                <span>Vídeos 4K Originais</span>
                {features.video4k ? <Check size={13} className="text-cyan-400" /> : <span className="text-[10px]">+</span>}
              </button>

              <button
                onClick={() => toggleFeature('ia')}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  features.ia
                    ? 'bg-cyan-950/80 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-zinc-400'
                }`}
              >
                <span>Automação IA</span>
                {features.ia ? <Check size={13} className="text-cyan-400" /> : <span className="text-[10px]">+</span>}
              </button>
            </div>
          </div>

          {/* Results Metric Card */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase text-zinc-400 block">ESTIMATIVA DE ENTREGA</span>
                <span className="text-base font-bold text-white font-mono">{calc.days} a {calc.days + 3} dias úteis</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] uppercase text-zinc-400 block">IMPACTO ESTIMADO</span>
                <span className="text-base font-bold text-cyan-300 font-mono">{calc.impact}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-zinc-300">
              <span className="text-cyan-200">FOCO: {calc.impactLabel}</span>
              <span className="text-zinc-400">Benchmark CRO & UX</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onOpenContact || handleOpenWhatsAppSchedule}
            className="w-full py-4 px-5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
          >
            SOLICITAR COM ESTE ESCOPO
          </button>
        </div>
      ) : (
        /* MODE 2: Real VIP Consultation Booking */
        <div className="space-y-4">
          <p className="text-xs text-zinc-200 font-light leading-relaxed">
            Selecione o dia e horário preferencial para uma reunião de diagnóstico de 15 minutos com nosso diretor de arte.
          </p>

          {/* Day selection */}
          <div className="grid grid-cols-6 gap-1.5">
            {days.map((d) => {
              const active = selectedDay === d.label;
              return (
                <button
                  key={d.label}
                  onClick={() => setSelectedDay(d.label)}
                  className={`py-2 rounded-xl font-mono text-xs font-semibold transition-all border ${
                    active
                      ? 'bg-cyan-400 text-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Time selection */}
          <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
            {times.map((t) => {
              const active = selectedTime === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-2 rounded-xl border transition-all ${
                    active
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  {t}h
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-zinc-300 flex items-center justify-between">
            <span>SESSÃO: <strong className="text-cyan-300">{selectedDay} às {selectedTime}h</strong></span>
            <span className="text-emerald-400 text-[10px]">● DISPONÍVEL</span>
          </div>

          <button
            onClick={handleOpenWhatsAppSchedule}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-cyan-300 text-black hover:from-emerald-300 hover:to-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95"
          >
            <ExternalLink size={15} className="text-black" />
            CONFIRMAR HORÁRIO NO WHATSAPP VIP
          </button>
        </div>
      )}

    </div>
  );
}

