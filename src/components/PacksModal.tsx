import { useState, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import {
  PackageCheck,
  X,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react';
import ModalLoadingFallback from './ModalLoadingFallback';

const CheckoutModal = lazy(() => import('../CheckoutModal'));

export interface StudioPack {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  originalPrice: string;
  price: number;
  installments: string;
  description: string;
  features: string[];
  includes: string[];
  bannerImage: string;
}

const STUDIO_PACKS: StudioPack[] = [
  {
    id: 'pack-master-42',
    title: 'Pack Master · 42 Templates Figma 4K',
    subtitle: 'A biblioteca definitiva de design cinematográfico para foto e vídeo.',
    badge: 'MAIS VENDIDO',
    badgeColor: 'bg-gradient-to-r from-cyan-400 to-cyan-300 text-black',
    originalPrice: 'R$ 297,00',
    price: 66.90,
    installments: 'ou 3x de R$ 23,40 sem juros',
    description: '42 arquivos Figma (.fig) 100% editáveis com auto-layout rigoroso, mídias 4K em 60 FPS originais e licença comercial vitalícia.',
    features: [
      '42 Arquivos Figma (.fig) completos e organizados em camadas',
      'Formatos para Web Desktop, Mobile App e Reels/Stories 4K',
      'Mídias e vídeos 60 FPS de alta fidelidade inclusos',
      'Licença Comercial Vitalícia (Uso ilimitado em clientes)',
      'Atualizações gratuitas de novos componentes'
    ],
    includes: ['Figma (.fig)', 'Mídias 4K', 'Vídeos 60fps', 'Licença Comercial'],
    bannerImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pack-combo-all-in-one',
    title: 'Super Combo VIP All-in-One 2026',
    subtitle: 'Todos os packs, treinamentos, prompts IA e design system em um só pacote.',
    badge: 'MELHOR VALOR • 73% OFF',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-300 text-black',
    originalPrice: 'R$ 497,00',
    price: 97.00,
    installments: 'ou 4x de R$ 25,60 sem juros',
    description: 'O acervo completo da EdiCria Studio: Pack 42 Templates + Curso Do Figma ao Site + Kit 85 Prompts IA + Design System Blueprint + 15 Golden Skills Motion.',
    features: [
      'Pack Completo 42 Templates Figma 4K (R$ 66,90)',
      'Curso Prático: Do Figma ao Site no Ar (R$ 19,90)',
      'Kit Sites Cinematográficos com IA (85+ Prompts) (R$ 14,90)',
      'Design System Blueprint dos Sites Caros (R$ 14,90)',
      '15 Golden Skills de Motion & Shaders (R$ 29,90)',
      'Grupo VIP de Alunos & Suporte Prioritário'
    ],
    includes: ['Todos os 5 Produtos', 'Acesso Vitalício', 'Suporte VIP', 'Comunidade'],
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pack-motion-skills',
    title: '15 Golden Skills de Motion & WebGL',
    subtitle: 'Shaders, distorções de líquidos e scroll-driven animations.',
    badge: 'GOLD SKILLS',
    badgeColor: 'bg-gradient-to-r from-purple-400 to-purple-300 text-black',
    originalPrice: 'R$ 147,00',
    price: 29.90,
    installments: 'ou 2x de R$ 15,60',
    description: '15 modelos de motion prontos para React/Vite e WebGL: botões com distorção de líquido, scrub de vídeo 60 FPS por GPU, telemetria live e áudio senoidal 432Hz.',
    features: [
      '15 Componentes de Motion 60 FPS prontos para copiar e colar',
      'Código limpo em TypeScript e Shaders GLSL comentados',
      'Integração com Framer Motion e GSAP ScrollTrigger',
      'Áudio sintetizador Web Audio API pronto para uso'
    ],
    includes: ['React/TS Source', 'Shaders GLSL', 'Exemplos Vforce'],
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pack-ai-prompts',
    title: 'Kit Sites Cinematográficos com IA',
    subtitle: '85+ Prompts calibrados e esteira de IA para exportação imediata.',
    badge: 'IA LAB',
    badgeColor: 'bg-gradient-to-r from-emerald-400 to-emerald-300 text-black',
    originalPrice: 'R$ 97,00',
    price: 14.90,
    installments: 'pagamento único',
    description: 'Prompts e esteiras calibradas para gerar landing pages completas e sem bugs no Claude, Cursor, v0 e AI Studio Build com fidelidade visual de 100%.',
    features: [
      '85+ Prompts estruturados para criação e refatoração de código',
      'Framework de design tokens pronto para colar na IA',
      'Instruções de anti-alucinação para Shaders e WebGL',
      'Guia de integração do MCP Figma com IA'
    ],
    includes: ['PDF Guia', '85+ Prompts', 'Prompt Library'],
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pack-design-system',
    title: 'Design System Blueprint',
    subtitle: 'O padrão visual que faz seu site parecer de R$ 50.000.',
    badge: 'SISTEMA VISUAL',
    badgeColor: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-black',
    originalPrice: 'R$ 97,00',
    price: 14.90,
    installments: 'pagamento único',
    description: 'Estrutura completa de tokens de cores escuras de luxo, escala tipográfica com razão matemática e botões translúcidos com efeito de vidro fosco.',
    features: [
      'Tokens de cores calibrados para UI Dark de alta costura',
      'Escala tipográfica com passo 1.25 (Major Second) calculada',
      'Componentes de botões líquidos e cartões de vidro fosco',
      'Checklist de validação estética contra AI-Slop'
    ],
    includes: ['Figma Tokens', 'CSS Variables', 'Style Guide'],
    bannerImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
  }
];

interface PacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PacksModal({ isOpen, onClose }: PacksModalProps) {
  const [selectedPackForCheckout, setSelectedPackForCheckout] = useState<StudioPack | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedPackForCheckout) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, selectedPackForCheckout]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-3xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-zinc-300 hover:text-white hover:bg-cyan-900/60 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <PackageCheck size={16} className="text-cyan-300" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300 font-semibold">
              LOJA OFICIAL EDICRIA STUDIO • ARQUIVOS FIGMA & TREINAMENTOS
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-white">
            Packs & Recursos Autorais de Alta Performance
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
            Adquira nossos templates originais em 4K, kits de IA calibrados e pacotes de motion com liberação imediata por PIX ou Cartão de Crédito e garantia incondicional de 7 dias.
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          {STUDIO_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`group relative rounded-3xl border ${
                pack.id === 'pack-combo-all-in-one'
                  ? 'border-amber-400/60 bg-amber-950/20 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
                  : 'border-cyan-400/35 bg-cyan-950/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]'
              } backdrop-blur-3xl hover:border-cyan-400/80 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5`}
            >
              {/* Banner Top */}
              <div className="relative h-44 w-full overflow-hidden bg-black">
                <img
                  src={pack.bannerImage}
                  alt={pack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-cyan-950/40 to-transparent" />
                
                {pack.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider shadow-lg ${pack.badgeColor || 'bg-cyan-400 text-black'}`}>
                    {pack.badge}
                  </span>
                )}

                {/* Includes tags */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                  {pack.includes.map((inc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-cyan-200 font-mono text-[9px] uppercase">
                      {inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {pack.title}
                  </h3>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    {pack.subtitle}
                  </p>

                  {/* Feature check items */}
                  <div className="pt-2 space-y-2 text-xs text-zinc-200">
                    {pack.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-zinc-400 line-through block font-mono">
                        {pack.originalPrice}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-xs text-cyan-300">R$</span>
                        <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                          {pack.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-300 text-right">
                      {pack.installments}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPackForCheckout(pack)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
                  >
                    <ShoppingBag size={15} className="text-black" />
                    ADQUIRIR ESTE PACK
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-400">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>Garantia 7 Dias • Acesso Imediato</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Integrated Checkout Modal (Centered Pop-up) */}
      {selectedPackForCheckout && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO CHECKOUT SEGURO..."
              onClose={() => setSelectedPackForCheckout(null)}
            />
          }
        >
          <CheckoutModal
            isOpen={Boolean(selectedPackForCheckout)}
            onClose={() => setSelectedPackForCheckout(null)}
            productName={selectedPackForCheckout.title}
            productPrice={selectedPackForCheckout.price}
            templateId={selectedPackForCheckout.id}
          />
        </Suspense>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
