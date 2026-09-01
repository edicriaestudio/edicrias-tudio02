import React from 'react';
import {
  MessageSquareText,
  Search,
  Users2,
  FileCheck,
  FileSpreadsheet,
  Rocket,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useReveal } from '../hooks';

interface CommercialProcessSectionProps {
  onOpenContact?: () => void;
}

const STEPS = [
  {
    num: '01',
    icon: MessageSquareText,
    title: 'Você conta o contexto',
    desc: 'Preencha o diagnóstico inicial com seus objetivos, canais e visão do projeto em menos de 2 minutos.',
  },
  {
    num: '02',
    icon: Search,
    title: 'A EdiCria analisa a oportunidade',
    desc: 'Avaliamos a aderência técnica, posicionamento da marca e potencial de impacto da experiência.',
  },
  {
    num: '03',
    icon: Users2,
    title: 'Conversamos sobre objetivo e escopo',
    desc: 'Alinhamos expectativas, referências e prazos em um contato consultivo e transparente.',
  },
  {
    num: '04',
    icon: FileCheck,
    title: 'Você recebe uma proposta adequada',
    desc: 'Apresentamos uma proposta sob medida com escopo claro, fases de entrega e investimento justo.',
  },
  {
    num: '05',
    icon: FileSpreadsheet,
    title: 'Após o aceite, preenche o briefing completo',
    desc: 'Com a proposta aprovada, você responde ao briefing de imersão para detalhar conteúdos e direção de arte.',
  },
  {
    num: '06',
    icon: Rocket,
    title: 'O projeto começa com contrato e kickoff',
    desc: 'Formalizamos o contrato, efetuamos o sinal inicial e iniciamos a produção autoral a todo vapor.',
  },
];

export default function CommercialProcessSection({ onOpenContact }: CommercialProcessSectionProps) {
  const headerRef = useReveal(100);

  return (
    <section id="processo" className="py-20 sm:py-28 px-4 sm:px-8 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-96 bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono uppercase text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            FLUXO TRANSPARENTE & SEM SURPRESAS
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-[450] tracking-tight text-white leading-tight">
            Como funciona a jornada de trabalho com a EdiCria.
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            Um processo claro, estruturado e consultivo — do primeiro diagnóstico inicial até a entrega do website no ar.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative p-6 sm:p-7 rounded-3xl bg-cyan-950/20 border border-cyan-400/25 backdrop-blur-2xl hover:border-cyan-400/60 hover:bg-cyan-950/40 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-[0_0_25px_rgba(6,182,212,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-400/80 tracking-widest">
                    ETAPA {step.num}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-cyan-200 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx === 4 && (
                  <div className="pt-2 border-t border-white/10">
                    <a
                      href="https://creativ-brief.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                    >
                      Acesse o briefing completo se já tiver proposta
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-teal-950/30 to-black border border-cyan-500/30 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-medium text-white">
              Pronto para iniciar a primeira etapa?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 font-light">
              Envie suas informações no diagnóstico inicial sem compromisso ou burocracia.
            </p>
          </div>

          <button
            onClick={onOpenContact}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>SOLICITAR DIAGNÓSTICO INICIAL</span>
            <ArrowRight size={14} className="text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
