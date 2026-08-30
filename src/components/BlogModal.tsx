import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  X,
  Clock,
  User,
  Share2,
  Check,
  ChevronRight,
  PackageCheck
} from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'design' | 'webgl' | 'conversion' | 'figma';
  categoryLabel: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  highlightBadge?: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      quote?: string;
    }[];
    conclusion: string;
  };
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Como Experiências Digitais Autoriais e Alta Performance Elevam a Conversão',
    slug: 'webgl-60fps-aumento-conversao',
    category: 'conversion',
    categoryLabel: 'Conversão & Vendas',
    readTime: '4 min de leitura',
    date: '28 de Agosto, 2026',
    author: 'Edcria Estúdio Lab',
    highlightBadge: 'DESTAQUE',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
    summary: 'Descubra por que a percepção de valor imediata gerada por direção de arte autoral e carregamento ultrarrápido transforma visitantes comuns em clientes qualificados.',
    content: {
      intro: 'No mercado digital contemporâneo, a primeira impressão não é apenas estética: ela define diretamente o teto de preço que o seu cliente está disposto a pagar pelo seu serviço ou produto. A transição de layouts padronizados para experiências autorais representa um salto substancial de autoridade e valor percebido.',
      sections: [
        {
          heading: '1. O Fator Psicológico da Fluidez Visual (60 FPS)',
          body: [
            'Estudos de percepção de interface e usabilidade comprovam que o cérebro humano associa interfaces responsivas, sem travamentos e com respostas táteis imediatas a marcas de alto padrão e solidez corporativa.',
            'Quando um visitante navega por uma landing page com arquitetura clara, carregamento ultrarrápido e interações suaves, a taxa de permanência nos primeiros 10 segundos aumenta significativamente (de 25% para mais de 60%).'
          ],
          quote: 'O design não é o que parece. É como o usuário se sente no segundo em que interage com a sua marca.'
        },
        {
          heading: '2. Por que Templates Padronizados Matam a Autoridade',
          body: [
            'A maioria das empresas usa os mesmos temas saturados de mercado. O cliente percebe o padrão genérico em milissegundos e passa a comparar seu preço com opções de baixo custo.',
            'Com a arquitetura autoral da Edcria Estúdio, cada detalhe de animação, tipografia e contraste é construído para criar um ecossistema exclusivo que eleva a credibilidade e diferencia sua proposta de valor.'
          ]
        },
        {
          heading: '3. Implementação Prática Sem Comprometer o Carregamento',
          body: [
            'Graças ao pré-carregamento assíncrono e compressão inteligente em formatos modernos, é possível entregar estética cinematográfica e interações sofisticadas com pontuação superior a 95 no Google Lighthouse e carregamento em menos de 1 segundo.'
          ]
        }
      ],
      conclusion: 'Investir em uma presença digital autoral não é custo estético, mas uma alavanca estratégica de conversão e posicionamento para empresas que desejam liderar em seus segmentos.'
    }
  },
  {
    id: '2',
    title: 'O Segredo dos Efeitos de Luxo: Shaders, Tipografia e Áudio Ambiente no Design',
    slug: 'design-luxo-shaders-audio-ambiente',
    category: 'design',
    categoryLabel: 'Design & Luxo',
    readTime: '5 min de leitura',
    date: '24 de Agosto, 2026',
    author: 'EdiCria Studio Lab',
    highlightBadge: 'TENDÊNCIA 2026',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80',
    summary: 'A anatomia de uma landing page de alta costura digital: como harmonizar tipografia display, distorções de líquido e trilha sonora interativa.',
    content: {
      intro: 'Marcas de luxo mundiais nunca vendem produtos através de páginas com visual genérico. Elas criam atmosferas imersivas onde o visitante entra em um universo particular.',
      sections: [
        {
          heading: '1. O Triângulo de Ouro: Tipografia, Luz e Negativo',
          body: [
            'A hierarquia tipográfica precisa de contrastes calculados. O uso de fontes display com tracking amplo acompanhadas de fontes sem serifa funcionais estabelece ritmo visual sem cansar o olho.',
            'O espaço negativo (espaçamento generoso) comunica abundância e exclusividade.'
          ],
          quote: 'O luxo se comunica através do silêncio espacial e do rigor dos detalhes.'
        },
        {
          heading: '2. Sintetizadores de Áudio Web: O Sentido Esquecido',
          body: [
            'Ao adicionar áudio ambiente generativo em ondas senoidais suaves (432Hz), o tempo de permanência na página aumenta em mais de 3x, criando uma conexão sensorial profunda com o visitante.'
          ]
        }
      ],
      conclusion: 'Dominar essas técnicas é o que separa um site comum de uma obra de arte digital interativa.'
    }
  },
  {
    id: '3',
    title: 'Do Figma ao Código com IA: Como Criar Landing Pages que Parecem Obras de Arte',
    slug: 'figma-ao-codigo-ia-guia',
    category: 'figma',
    categoryLabel: 'Figma & IA',
    readTime: '6 min de leitura',
    date: '20 de Agosto, 2026',
    author: 'Equipe EdiCria',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
    summary: 'Aprenda como utilizar modelos de IA e o MCP do Claude para exportar designs complexos do Figma diretamente para React/Vite com fidelidade de 100%.',
    content: {
      intro: 'O fluxo de desenvolvimento web mudou para sempre. Hoje, designers e desenvolvedores podem conectar seus protótipos de alta fidelidade a agentes de IA para gerar código limpo em minutos.',
      sections: [
        {
          heading: '1. Estruturação Correta no Figma (.fig)',
          body: [
            'A base de qualquer código perfeito gerado por IA começa com Auto Layout rigoroso, nomeação semântica de camadas e definição de tokens de design consistentes.',
            'Nossa biblioteca de 46 templates já vem 100% pronta para essa ponte, com componentes atômicos organizados.'
          ]
        },
        {
          heading: '2. Prompts de Alta Precisão para Shaders e Motion',
          body: [
            'Ensinar o modelo a aplicar equações de renderização com WebGL Canvas exige uma biblioteca de prompts calibrada. Ao fornecer tokens matemáticos precisos, você elimina alucinações e garante 60 quadros por segundo constantes.'
          ]
        }
      ],
      conclusion: 'Dominar o ecossistema Figma + IA é a maior vantagem competitiva que qualquer profissional digital pode ter.'
    }
  },
  {
    id: '4',
    title: 'Por que Landing Pages Tradicionais Estão Perdendo Clientes e Como Virar o Jogo',
    slug: 'fim-landing-pages-tradicionais',
    category: 'conversion',
    categoryLabel: 'Estratégia & ROI',
    readTime: '4 min de leitura',
    date: '15 de Agosto, 2026',
    author: 'EdiCria Estratégia',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
    summary: 'O público de alto valor não responde mais a fórmulas prontas de 2018 com contadores regressivos falsos e botões verdes piscantes.',
    content: {
      intro: 'O consumidor moderno desenvolveu cegueira visual contra templates pré-moldados. Quando todos os sites do seu nicho parecem ter sido feitos pela mesma pessoa, a diferenciação visual torna-se sua maior arma de vendas.',
      sections: [
        {
          heading: '1. A Morte dos Gatilhos Falsos',
          body: [
            'Contadores regressivos genéricos e banners apelativos afastam clientes qualificados. A confiança é conquistada com clareza conceitual, provas de autoridade e uma experiência de navegação impecável.'
          ]
        },
        {
          heading: '2. A Nova Fórmula: Velocidade + Arte + Propósito',
          body: [
            'Ao alinhar proposta de valor clara a um design cinematográfico, seu lead passa a ver sua empresa como líder incontestável de categoria.'
          ]
        }
      ],
      conclusion: 'Quem se adapta ao padrão de excelência visual lidera as vendas e conquista os clientes mais lucrativos.'
    }
  },
  {
    id: '5',
    title: 'Design System Blueprint: O Padrão Visual que Faz Seu Site Parecer de R$ 50.000',
    slug: 'design-system-blueprint-metodo',
    category: 'webgl',
    categoryLabel: 'WebGL & Tech',
    readTime: '5 min de leitura',
    date: '10 de Agosto, 2026',
    author: 'EdiCria Studio Lab',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
    summary: 'Como criar tokens de cores com saturação calculada, tipografia com razão matemática e botões líquidos que elevam a percepção de qualquer interface.',
    content: {
      intro: 'A diferença entre um site comum e um projeto de R$ 50.000 está nas regras invisíveis de consistência visual que guiam cada componente da interface.',
      sections: [
        {
          heading: '1. Matrizes de Cores e Contraste Não-Linear',
          body: [
            'Evite pretos e brancos puros. O segredo do visual dark de luxo reside em tons de preto com 3% a 5% de matiz ciano ou âmbar, gerando profundidade orgânica.'
          ]
        },
        {
          heading: '2. Micro-Interações que Encantam',
          body: [
            'Efeitos de hover suaves, cursores customizados e respostas táteis conferem peso e substância à experiência.'
          ]
        }
      ],
      conclusion: 'Um Design System robusto é o ativo mais valioso de qualquer operação digital escalável.'
    }
  }
];

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPortfolio?: () => void;
  onOpenContact?: () => void;
  onOpenPacks?: () => void;
}

export default function BlogModal({
  isOpen,
  onClose,
  onOpenPortfolio,
  onOpenContact,
  onOpenPacks,
}: BlogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !activePost) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, activePost]);

  if (!isOpen) return null;

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-3xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-zinc-300 hover:text-white hover:bg-cyan-900/60 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {!activePost ? (
          <>
            {/* Header */}
            <div className="space-y-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-cyan-300" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300 font-semibold">
                  EDICRIA JOURNAL • INSIGHTS, WEBGL & DESIGN DE AUTOR
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-normal tracking-tight text-white">
                Conteúdos, Tendências & Estratégias Digitais
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
                Artigos exclusivos sobre design cinematográfico, inteligência artificial aplicada ao Figma, shaders em WebGL e estratégias de alta conversão para marcas de alto ticket.
              </p>
            </div>

            {/* Categories filter bar */}
            <div className="flex flex-wrap items-center gap-2 bg-cyan-950/30 p-2 rounded-2xl border border-cyan-500/30">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Todos os Artigos ({BLOG_POSTS.length})
              </button>
              <button
                onClick={() => setSelectedCategory('conversion')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === 'conversion'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Conversão & Vendas
              </button>
              <button
                onClick={() => setSelectedCategory('design')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === 'design'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Design & Luxo
              </button>
              <button
                onClick={() => setSelectedCategory('figma')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === 'figma'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Figma & IA
              </button>
              <button
                onClick={() => setSelectedCategory('webgl')}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  selectedCategory === 'webgl'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                WebGL & Shaders
              </button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="group relative rounded-3xl border border-cyan-400/30 bg-cyan-950/20 backdrop-blur-2xl hover:border-cyan-400/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  {/* Article Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-black">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/90 via-transparent to-transparent" />
                    
                    {post.highlightBadge && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-cyan-400 text-black font-mono text-[9px] font-bold uppercase tracking-wider shadow-lg">
                        {post.highlightBadge}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-black/60 border border-white/10 text-cyan-300 font-mono text-[10px] uppercase">
                      {post.categoryLabel}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mb-2">
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      <h3 className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-zinc-300 font-light line-clamp-2 mt-2 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-300 group-hover:text-white">
                      <span>LER ARTIGO COMPLETO</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Single Article Reader View */
          <div className="space-y-6 animate-fadeIn">
            {/* Back Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <button
                onClick={() => setActivePost(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                ← Voltar para todos os artigos
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-zinc-300 hover:text-white font-mono text-xs transition-colors"
              >
                {copiedLink ? <Check size={13} className="text-cyan-400" /> : <Share2 size={13} />}
                <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
              </button>
            </div>

            {/* Article Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-300">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 uppercase">
                  {activePost.categoryLabel}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {activePost.readTime}
                </span>
                <span>•</span>
                <span>{activePost.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <User size={12} /> {activePost.author}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
                {activePost.title}
              </h1>
            </div>

            {/* Hero Image */}
            <div className="h-64 sm:h-80 rounded-3xl overflow-hidden border border-cyan-400/30 relative">
              <img
                src={activePost.image}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Article Body */}
            <div className="p-6 sm:p-8 rounded-3xl bg-cyan-950/15 border border-cyan-400/30 space-y-6 text-sm sm:text-base text-zinc-200 leading-relaxed max-w-4xl mx-auto">
              <p className="text-lg text-cyan-100 font-light italic border-l-2 border-cyan-400 pl-4 py-1 leading-relaxed">
                {activePost.content.intro}
              </p>

              {activePost.content.sections.map((section, idx) => (
                <div key={idx} className="space-y-3 pt-2">
                  <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                    {section.heading}
                  </h3>

                  {section.body.map((p, pIdx) => (
                    <p key={pIdx} className="text-zinc-200 font-light leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {section.quote && (
                    <blockquote className="my-4 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 font-serif italic text-base sm:text-lg">
                      &quot;{section.quote}&quot;
                    </blockquote>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-2">
                <h4 className="text-lg font-semibold text-white">Conclusão</h4>
                <p className="text-zinc-200 font-light leading-relaxed">
                  {activePost.content.conclusion}
                </p>
              </div>
            </div>

            {/* Bottom Call to Action inside Article */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 to-cyan-900/30 border border-cyan-400/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-mono text-xs uppercase text-cyan-300 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  APLIQUE ESSE PADRÃO NO SEU NEGÓCIO
                </span>
                <h4 className="text-lg font-semibold text-white">
                  Quer um site cinematográfico ou nossos templates Figma?
                </h4>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActivePost(null);
                    onClose();
                    if (onOpenPacks) onOpenPacks();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <PackageCheck size={14} />
                  VER PACKS & OFERTAS
                </button>
                <button
                  onClick={() => {
                    setActivePost(null);
                    onClose();
                    if (onOpenPortfolio) onOpenPortfolio();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
                >
                  46 TEMPLATES FIGMA
                </button>
                <button
                  onClick={() => {
                    setActivePost(null);
                    onClose();
                    if (onOpenContact) onOpenContact();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
                >
                  SOLICITAR DIAGNÓSTICO
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
