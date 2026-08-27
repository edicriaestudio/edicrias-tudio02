import { Check, Sparkles, ArrowUpRight, Hexagon } from 'lucide-react';
import { useReveal } from '../hooks';

interface PricingFooterProps {
  onOpenContact?: () => void;
  onOpenPortfolio?: () => void;
}

export default function PricingFooter({ onOpenContact, onOpenPortfolio }: PricingFooterProps) {
  const headerRef = useReveal(100);

  const plans = [
    {
      name: 'ESSENCIAL',
      badge: 'STARTER',
      price: 'R$ 2.490',
      period: 'projeto único',
      desc: 'Ideal para profissionais autônomos e startups que precisam de presença autoral imediata.',
      features: [
        'Landing Page 100% Responsiva Mobile-First',
        'Design Autoral no Figma Incluso',
        'SEO Avançado & Carregamento Ultra-Rápido',
        'Formulário de Contato Direto no Whatsapp',
        'Hospedagem & Domínio Configurados',
      ],
      featured: false,
    },
    {
      name: 'PERFORMANCE 4K',
      badge: 'MAIS POPULAR',
      price: 'R$ 4.890',
      period: 'projeto completo',
      desc: 'Para marcas e empresas que buscam impacto visual máximo com scroll cinematográfico.',
      features: [
        'Tudo do Plano Essencial',
        'Animações de Scroll Canvas 60 FPS (VFX)',
        'Showroom de Portfólio / Templates Figma',
        'Trilha Sonora Imersiva Integrada (Web Audio)',
        'Integração com CRM, Analytics & Meta Pixel',
        'Suporte VIP Prioritário por 90 Dias',
      ],
      featured: true,
    },
    {
      name: 'ENTERPRISE AI',
      badge: 'CUSTOM STUDIO',
      price: 'Sob Consulta',
      period: 'personalizado',
      desc: 'Ecossistema completo sob medida com integrações avançadas de IA e múltiplos produtos.',
      features: [
        'Múltiplas Páginas & PWA Aplicativo Web',
        'Assistente de IA Integrado (Gemini / OpenAI)',
        'Design System Exclusivo & Direção de Arte',
        'Gerenciamento de Conteúdo Headless (CMS)',
        'Consultoria Semanal de Conversão & UX',
      ],
      featured: false,
    },
  ];

  return (
    <footer className="relative bg-zinc-950 text-white rounded-t-[3rem] sm:rounded-t-[4rem] border-t border-white/20 pt-20 pb-12 px-5 sm:px-8 md:px-12 overflow-hidden">
      {/* Background Texture & Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase text-white/70">
            <Sparkles size={13} className="text-emerald-400" />
            INVESTIMENTO & PLANOS
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight">
            Escolha o nível de excelência para seu projeto
          </h3>
          <p className="text-sm text-white/70 font-light">
            Transparência total, entrega agilizada e padrão cinematográfico em todas as criações do Dadcria Studio.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-24">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? 'bg-gradient-to-b from-white/15 via-zinc-900 to-black border-2 border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.15)] md:-translate-y-4'
                  : 'bg-white/5 border border-white/10 hover:border-white/25'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-black font-mono text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                    {plan.name}
                  </span>
                  {!plan.featured && (
                    <span className="font-mono text-[10px] text-white/40 border border-white/10 px-2 py-0.5 rounded">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">{plan.price}</span>
                  <span className="text-xs text-white/50 font-mono ml-1.5">/ {plan.period}</span>
                </div>

                <p className="text-xs text-white/70 font-light leading-relaxed mb-6">
                  {plan.desc}
                </p>

                <div className="space-y-3 pt-6 border-t border-white/10 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-white/80">
                      <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenContact}
                className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  plan.featured
                    ? 'bg-white text-black hover:bg-white/85 shadow-lg'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                SOLICITAR PLANO {plan.name}
                <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer Bottom Info */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Hexagon size={24} strokeWidth={1.5} className="text-white" />
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-widest text-white">
                DADCRIA STUDIO
              </span>
              <span className="text-[11px] text-white/50 font-mono">
                TECNOLOGIA & DIREÇÃO DE ARTE DIGITAL © 2026
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6 text-xs text-white/70 font-mono">
            <button onClick={onOpenPortfolio} className="hover:text-white transition-colors">
              TEMPLATES FIGMA
            </button>
            <button onClick={onOpenContact} className="hover:text-white transition-colors">
              CONTATO
            </button>
            <a href="#top" className="hover:text-white transition-colors">
              VOLTAR AO TOPO ↑
            </a>
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            STATUS DO SISTEMA: 100% OPERACIONAL
          </div>
        </div>
      </div>
    </footer>
  );
}
