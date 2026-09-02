import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { X, Filter, Layers, Layout, Grid, Maximize2, ShoppingBag, ArrowUpRight } from 'lucide-react';
import SoundtrackBar from './components/SoundtrackBar';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';
import ModalLoadingFallback from './components/ModalLoadingFallback';

const CheckoutModal = lazy(() => import('./CheckoutModal'));

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProjectForSite?: (templateName?: string) => void;
}

export interface TemplateItem {
  id: string;
  num: string;
  title: string;
  category: 'hero' | 'web' | 'componentes';
  categoryLabel: string;
  tag: string;
  desc: string;
  rating: string;
  likes: number;
  previewUrl: string;
  videoPreview?: string;
  features: string[];
  price?: string;
}

// Lazy Media Renderer that mounts video/image smoothly when in viewport
function LazyTemplateMedia({
  item,
  onOpenPreview,
}: {
  item: TemplateItem;
  onOpenPreview: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '250px 0px 250px 0px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [isVisible, item.videoPreview]);

  return (
    <div
      ref={containerRef}
      onClick={onOpenPreview}
      className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-black border-b border-white/10 flex items-center justify-center cursor-pointer group/media"
    >
      {item.videoPreview && isVisible ? (
        <video
          ref={videoRef}
          src={item.videoPreview}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100 pointer-events-none"
        />
      ) : (
        <img
          src={item.previewUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover object-top filter brightness-[0.92] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
        />
      )}

      {/* Hover Inspect Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 backdrop-blur-[2px]">
        <span className="px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
          <Maximize2 size={12} className="text-cyan-400" />
          VER DETALHES DO TEMPLATE
        </span>
      </div>

      {/* Gradient Overlay for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050b11] via-transparent to-black/30 pointer-events-none" />

      {/* Badge Tag Top Left */}
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#050b11]/90 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 tracking-wider uppercase flex items-center gap-1.5 z-10">
        <span className="text-zinc-400">#{item.num}</span>
        <span>{item.categoryLabel}</span>
      </div>

      {/* Rating Badge Bottom Right */}
      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#050b11]/90 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 z-10">
        {item.rating}
      </div>
    </div>
  );
}

// 100% Unique, Curated Professional Figma Templates
const templatesData: TemplateItem[] = [
  {
    id: 'hero-ophidia-snake-luxury',
    num: '01',
    title: 'Hero Ophidia High Jewelry & The Vault',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Alta Joalheria & Dark Luxury',
    desc: 'Template cinematográfico com serpente albina em alta joalheria de ouro branco e diamantes, tipografia serifada de luxo e vitrine 3D The Vault com frascos de poção iluminados.',
    rating: '5.0 ★★★★★',
    likes: 1240,
    previewUrl: '/figma/hero-ophidia-snake-luxury-1.webp',
    videoPreview: '/figma/hero-ophidia.webm',
    features: ['Tipografia Editorial Serif', 'Cards The Vault 3D', 'Auto Layout 5.0 Completo'],
  },
  {
    id: 'hero-atom-esg-sustainable',
    num: '02',
    title: 'Hero Átom ESGX & Sustentabilidade',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'ESG, Sustentabilidade & Consultoria',
    desc: 'Template moderno e clean para consultoria empresarial em sustentabilidade, estratégia ESGX, arquitetura biofílica e ecossistemas corporativos sustentáveis.',
    rating: '5.0 ★★★★★',
    likes: 1150,
    previewUrl: '/figma/hero-atom-esg-sustainable-1.webp',
    videoPreview: '/figma/hero-atom.webm',
    features: ['Paleta Biofílica Clean', 'Navbar Flutuante Pílula', 'Cards de Metodologia'],
  },
  {
    id: 'hero-alodhx-water-tech',
    num: '03',
    title: 'Hero Alodhx Bio-Water Architecture',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Tratamento de Água & BioTech',
    desc: 'Template de alto padrão para tratamento inteligente de água, cleantech, sustentabilidade e biotecnologia com estética submarina deep-ocean, micro-interações e badges analíticas.',
    rating: '5.0 ★★★★★',
    likes: 980,
    previewUrl: '/figma/hero-alodhx-water-tech-1.webp',
    videoPreview: '/figma/hero-aloohxi.webm',
    features: ['Estética Deep Ocean Frosted', 'Badges de Eficiência H₂O', 'Auto Layout 5.0 Completo'],
  },
  {
    id: 'hero-dark-luxury-2',
    num: '04',
    title: 'Hero Dark Luxury VIP',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Dark Luxury & High-End',
    desc: 'Template de Hero Section premium para marcas de luxo, joalherias e serviços exclusivos com iluminação volumétrica e hierarquia visual refinada.',
    rating: '5.0 ★★★★★',
    likes: 890,
    previewUrl: '/figma/hero-dark-luxury-2.webp',
    videoPreview: '/figma/hero-dark-luxury.webm',
    features: ['Auto Layout 5.0', 'Paleta Dark Gold', 'Camadas 100% Editáveis'],
  },
  {
    id: 'hero-amethyst-1',
    num: '05',
    title: 'Hero Amethyst Crystal',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Cristais & BioTech',
    desc: 'Interface conceitual com elementos 3D translúcidos em tons de ametista e degradê púrpura, ideal para produtos inovadores e cosmética de luxo.',
    rating: '4.9 ★★★★★',
    likes: 720,
    previewUrl: '/figma/hero-amethyst-1.webp',
    videoPreview: '/figma/hero-amethyst.webm',
    features: ['Efeito Glassmorphism', 'Design System Modular', 'Componentes Tipográficos'],
  },
  {
    id: 'hero-aqua-glass-1',
    num: '06',
    title: 'Hero Aqua Glass Ultra',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Aqua Glassmorphism',
    desc: 'Layout com estética de vidro temperado translúcido e acentos ciano neon para plataformas digitais, fintechs e produtos de alta tecnologia.',
    rating: '5.0 ★★★★★',
    likes: 810,
    previewUrl: '/figma/hero-aqua-glass-1.webp',
    videoPreview: '/figma/hero-aqua-glass.webm',
    features: ['Camadas Translúcidas', 'Grid Responsivo', 'Variáveis de Cores'],
  },
  {
    id: 'hero-aurora-heart-1',
    num: '07',
    title: 'Hero Aurora BioTech',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Saúde & Biotecnologia',
    desc: 'Composição de alto impacto para saúde digital, clínicas médicas avançadas e biotecnologia com visual limpo e moderno.',
    rating: '5.0 ★★★★★',
    likes: 940,
    previewUrl: '/figma/hero-aurora-heart-1.webp',
    videoPreview: '/figma/hero-aurora-heart.webm',
    features: ['Tipografia Médica Clean', 'Cards de Indicadores', 'Layout Responsivo'],
  },
  {
    id: 'hero-crystal-lotus-1',
    num: '08',
    title: 'Hero Crystal Lotus',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Sustentabilidade & Luxo',
    desc: 'Fusão elegante entre botânica digital e design refinado para marcas sustentáveis, spas, estética e bem-estar de alto padrão.',
    rating: '4.9 ★★★★★',
    likes: 680,
    previewUrl: '/figma/hero-crystal-lotus-1.webp',
    videoPreview: '/figma/hero-crystal-lotus.webm',
    features: ['Estética Orgânica', 'Auto Layout Completo', 'Design System Incluso'],
  },
  {
    id: 'hero-crystal-sphere-1',
    num: '09',
    title: 'Hero Crystal Sphere Orbit',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'SaaS & Web3',
    desc: 'Composição com esferas translúcidas em cobalto profundo e sombras suaves para startups, softwares B2B e produtos digitais.',
    rating: '4.8 ★★★★★',
    likes: 610,
    previewUrl: '/figma/hero-crystal-sphere-1.webp',
    videoPreview: '/figma/hero-crystal-sphere.webm',
    features: ['Hierarquia Tecnológica', 'Cards de Métricas', 'Figma Variables'],
  },
  {
    id: 'hero-cycle-zephyr-1',
    num: '10',
    title: 'Hero Cycle Zephyr',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Editorial & Lifestyle',
    desc: 'Design editorial ultra-limpo com micro-espaçamentos calculados e tipografia expressiva para moda, mobilidade e lifestyle contemporâneo.',
    rating: '4.9 ★★★★★',
    likes: 750,
    previewUrl: '/figma/hero-cycle-zephyr-1.webp',
    videoPreview: '/figma/hero-cycle-zephyr.webm',
    features: ['Grid Editorial Suíço', 'Espaço Negativo Amplo', 'Tipografia em Escala'],
  },
  {
    id: 'hero-editorial-medieval-1',
    num: '11',
    title: 'Hero Medieval Heritage',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Heritage & Alta Moda',
    desc: 'Contraste imponente entre tipografia serifada clássica e layout minimalista contemporâneo para marcas tradicionais e alta costura.',
    rating: '5.0 ★★★★★',
    likes: 830,
    previewUrl: '/figma/hero-editorial-medieval-1.webp',
    features: ['Tipografia Serif Clássica', 'Composição Revista', 'Camadas Nomeadas'],
  },
  {
    id: 'hero-ferrari-296-1',
    num: '12',
    title: 'Hero Supercar Performance',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Automotivo & Performance',
    desc: 'Apresentação hiper-sofisticada para o mercado automotivo de luxo, mobilidade elétrica e produtos de alta performance.',
    rating: '5.0 ★★★★★',
    likes: 1120,
    previewUrl: '/figma/hero-ferrari-296-1.webp',
    videoPreview: '/figma/hero-ferrari-296.webm',
    features: ['Cards de Telemetria', 'Contraste Preto Absoluto', 'Componentes UI'],
  },
  {
    id: 'hero-glacius-frost-1',
    num: '13',
    title: 'Hero Glacius Frost Nordic',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Nordic & Minimal',
    desc: 'Estética nórdica gélida com tons brancos nevados e cartões foscos para marcas de skincare, arquitetura e moda de inverno.',
    rating: '4.8 ★★★★★',
    likes: 540,
    previewUrl: '/figma/hero-glacius-frost-1.webp',
    videoPreview: '/figma/hero-glacius-frost.webm',
    features: ['Paleta Nordic Ice', 'Auto Layout 5.0', 'Cards Semi-transparentes'],
  },
  {
    id: 'hero-iris-vision-1',
    num: '14',
    title: 'Hero Spatial Vision AI',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Spatial Computing & IA',
    desc: 'Interface de vanguarda inspirada em computação espacial e inteligência artificial generativa com janelas flutuantes organizadas.',
    rating: '5.0 ★★★★★',
    likes: 990,
    previewUrl: '/figma/hero-iris-vision-1.webp',
    videoPreview: '/figma/hero-iris-vision.webm',
    features: ['UI Espacial Flutuante', 'Glows Radiais', 'Ícones Vetoriais'],
  },
  {
    id: 'hero-minimal-bold-2',
    num: '15',
    title: 'Hero Swiss Minimal Bold',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Design Suíço & Tipografia',
    desc: 'Layout fundamentado na escola suíça de design com tipografia gigante de alto impacto para estúdios criativos e agências.',
    rating: '4.9 ★★★★★',
    likes: 670,
    previewUrl: '/figma/hero-minimal-bold-2.webp',
    videoPreview: '/figma/hero-minimal-bold.webm',
    features: ['Grid Suíço Rigoroso', 'Escala Tipográfica Display', 'Alto Contraste'],
  },
  {
    id: 'hero-mockup-3d-4',
    num: '16',
    title: 'Hero SaaS 3D Perspective',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'SaaS & Aplicativos',
    desc: 'Apresentação isométrica para demonstrar softwares, painéis analíticos e dashboards de aplicativos modernos com clareza.',
    rating: '4.9 ★★★★★',
    likes: 880,
    previewUrl: '/figma/hero-mockup-3d-4.webp',
    features: ['Perspectiva Isométrica', 'Cards de Funcionalidades', 'Paleta Tecnológica'],
  },
  {
    id: 'hero-museum-imperial-1',
    num: '17',
    title: 'Hero Imperial Gallery',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Cultura & Arte',
    desc: 'Layout nobre para galerias de arte, museus, leilões e instituições culturais com acabamento refinado e molduras elegantes.',
    rating: '4.9 ★★★★★',
    likes: 620,
    previewUrl: '/figma/hero-museum-imperial-1.webp',
    videoPreview: '/figma/hero-museum-imperial.webm',
    features: ['Tipografia Nobre', 'Organização de Acervo', 'Design Clássico'],
  },
  {
    id: 'hero-noir-lux-1',
    num: '18',
    title: 'Hero Noir Monochromatic',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Monocromático & Luxo',
    desc: 'Estética noir monocromática com pretos absolutos e acentos metálicos sutis para marcas de moda autoral e relógios suíços.',
    rating: '5.0 ★★★★★',
    likes: 910,
    previewUrl: '/figma/hero-noir-lux-1.webp',
    videoPreview: '/figma/hero-noir-lux.webm',
    features: ['Preto Absoluto #000', 'Bordas Metálicas 1px', 'Tipografia Minimalista'],
  },
  {
    id: 'hero-organico-editorial-1',
    num: '19',
    title: 'Hero Organic Editorial',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Orgânico & Cosméticos',
    desc: 'Texturas suaves, acentos verde-musgo e tipografia poética para marcas orgânicas, fitoterápicas e sustentáveis.',
    rating: '4.9 ★★★★★',
    likes: 730,
    previewUrl: '/figma/hero-organico-editorial-1.webp',
    videoPreview: '/figma/hero-organico-editorial.webm',
    features: ['Tons Terrosos & Musgo', 'Auto Layout Flexível', 'Hierarquia Poética'],
  },
  {
    id: 'hero-paradise-caribe-1',
    num: '20',
    title: 'Hero Resort & Hospitality',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Hotelaria & Resorts',
    desc: 'Template de alta conversão para hotelaria de luxo, ilhas privadas, charters de iates e turismo de alto padrão.',
    rating: '5.0 ★★★★★',
    likes: 870,
    previewUrl: '/figma/hero-paradise-caribe-1.webp',
    videoPreview: '/figma/hero-paradise-caribe.webm',
    features: ['Cards de Reserva Rápida', 'Paleta Turquesa Tropical', 'Componentes UI'],
  },
  {
    id: 'hero-primal-1',
    num: '21',
    title: 'Hero Brutalist Architecture',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Brutalismo & Engenharia',
    desc: 'Estética brutalista com estética de concreto aparente e tipografia industrial forte para escritórios de engenharia e arquitetura.',
    rating: '5.0 ★★★★★',
    likes: 930,
    previewUrl: '/figma/hero-primal-1.webp',
    videoPreview: '/figma/hero-primal.webm',
    features: ['Design Brutalista', 'Tipografia Mono & Sans', 'Bordas Geométricas'],
  },
  {
    id: 'hero-samurai-purple-1',
    num: '22',
    title: 'Hero Cyberpunk Neon',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Gaming & Cyberpunk',
    desc: 'Composição vibrante com degradês violeta e ciano neon para o universo gamer, entretenimento digital e Web3.',
    rating: '5.0 ★★★★★',
    likes: 1050,
    previewUrl: '/figma/hero-samurai-purple-1.webp',
    features: ['Paleta Neon Vibrante', 'Estética Futurista', 'Componentes Temáticos'],
  },
  {
    id: 'hero-smart-key-1',
    num: '23',
    title: 'Hero IoT & Cyber Security',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Hardware & Segurança',
    desc: 'Template para lançamento de produtos de hardware inteligente, dispositivos biométricos e segurança digital.',
    rating: '4.9 ★★★★★',
    likes: 790,
    previewUrl: '/figma/hero-smart-key-1.webp',
    videoPreview: '/figma/hero-smart-key.webm',
    features: ['Showcase de Produto', 'Cards de Especificação', 'Design Industrial'],
  },
  {
    id: 'hero-smart-product-3d-1',
    num: '24',
    title: 'Hero Consumer Tech 3D',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Hardware & Eletrônicos',
    desc: 'Layout comercial com foco na apresentação de eletrônicos, fones de ouvido e gadgets de última geração.',
    rating: '4.9 ★★★★★',
    likes: 820,
    previewUrl: '/figma/hero-smart-product-3d-1.webp',
    videoPreview: '/figma/hero-smart-product-3d.webm',
    features: ['Vitrine de Hardware', 'Badges de Performance', 'Hierarquia Comercial'],
  },
  {
    id: 'hero-solace-1',
    num: '25',
    title: 'Hero Zen Wellness',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Mindfulness & Saúde',
    desc: 'Ambiente visual suave e harmonioso para aplicativos de meditação, terapias holísticas e bem-estar integral.',
    rating: '4.9 ★★★★★',
    likes: 610,
    previewUrl: '/figma/hero-solace-1.webp',
    videoPreview: '/figma/hero-solace.webm',
    features: ['Paleta Relaxante', 'Tipografia Acolhedora', 'Grid Suave'],
  },
  {
    id: 'hero-split-screen-1',
    num: '26',
    title: 'Hero Split Screen Modern',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Editorial & Moda',
    desc: 'Composição de tela dividida com contraste equilibrado entre imagem de destaque e bloco tipográfico de conversão.',
    rating: '4.8 ★★★★★',
    likes: 570,
    previewUrl: '/figma/hero-split-screen-1.webp',
    features: ['Split Screen 50/50', 'Foco de Conversão', 'Adaptabilidade Mobile'],
  },
  {
    id: 'hero-stats-flutuantes-3',
    num: '27',
    title: 'Hero Fintech Telemetry',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Fintech & Finanças',
    desc: 'Interface analítica com cards flutuantes de telemetria, gráficos de rendimento e prova social para fintechs e bancos digitais.',
    rating: '5.0 ★★★★★',
    likes: 940,
    previewUrl: '/figma/hero-stats-flutuantes-3.webp',
    videoPreview: '/figma/hero-stats-flutuantes.webm',
    features: ['Cards de Métricas Flutuantes', 'Gráficos Vetoriais', 'Auto Layout'],
  },
  {
    id: 'hero-techwear-1',
    num: '28',
    title: 'Hero Kinetic Techwear',
    category: 'hero',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Streetwear & Moda Urbana',
    desc: 'Visual de alto impacto para marcas de vestuário técnico, calçados esportivos e cultura urbana contemporânea.',
    rating: '5.0 ★★★★★',
    likes: 880,
    previewUrl: '/figma/hero-techwear-1.webp',
    videoPreview: '/figma/hero-techwear.webm',
    features: ['Acentos Amarelo Neon', 'Tipografia Técnica', 'Cards de Coleção'],
  },
  {
    id: 'blog-post-hero-1',
    num: '29',
    title: 'Blog Post & Magazine Grid',
    category: 'web',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Editorial & Conteúdo',
    desc: 'Grade editorial para artigos de revista, publicações especializadas e blogs corporativos com tempo de leitura e autores.',
    rating: '4.8 ★★★★★',
    likes: 490,
    previewUrl: '/figma/blog-post-hero-1.webp',
    features: ['Grid de Artigos', 'Metadados de Leitura', 'Hierarquia de Textos'],
  },
  {
    id: 'landing-page-full-2',
    num: '30',
    title: 'Full Landing Page Architecture',
    category: 'web',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Landing Pages Completas',
    desc: 'Arquitetura integral de landing page comercial, incluindo Hero, Prova Social, Features, Planos e Rodapé.',
    rating: '5.0 ★★★★★',
    likes: 1250,
    previewUrl: '/figma/landing-page-full-2.webp',
    features: ['Estrutura Completa de LP', 'Hierarquia Comercial', 'Componentes Aninhados'],
  },
  {
    id: 'portfolio-hero-cover',
    num: '31',
    title: 'Portfolio Showcase Master Layout',
    category: 'web',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Portfólios & Agências',
    desc: 'Layout mestre para apresentação de cases criativos, estúdios de design e profissionais independentes.',
    rating: '5.0 ★★★★★',
    likes: 1180,
    previewUrl: '/figma/portfolio-hero-cover.webp',
    features: ['Showcase de Projetos', 'Capa de Apresentação', 'Grid de Trabalhos'],
  },
  {
    id: 'sobre-dark-1',
    num: '32',
    title: 'About & Manifesto Dark Layout',
    category: 'web',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Páginas Institucionais',
    desc: 'Seção institucional e manifesto de marca com tipografia de destaque, declaração de valores e linha do tempo.',
    rating: '4.9 ★★★★★',
    likes: 690,
    previewUrl: '/figma/sobre-dark-1.webp',
    features: ['Manifesto de Marca', 'Linha Editorial Dark', 'Tipografia Display'],
  },
  {
    id: 'cards-produto-glassmorphism-2',
    num: '33',
    title: 'E-Commerce Glassmorphism Cards',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'E-Commerce & Vendas',
    desc: 'Conjunto de cards de produto com efeito de vidro translúcido, tags de preço, variantes de cores e botão de compra.',
    rating: '4.9 ★★★★★',
    likes: 760,
    previewUrl: '/figma/cards-produto-glassmorphism-2.webp',
    features: ['Cards de Produto', 'Variantes de Estado', 'Botões de Checkout'],
  },
  {
    id: 'cards-servico-editorial-1',
    num: '34',
    title: 'Editorial Service Cards UI',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Serviços & Consultoria',
    desc: 'Grade de apresentação de serviços com numeração sequencial, ícones minimalistas e botões de contratação rápida.',
    rating: '4.8 ★★★★★',
    likes: 510,
    previewUrl: '/figma/cards-servico-editorial-1.webp',
    videoPreview: '/figma/cards-servico-editorial.webm',
    features: ['3 Colunas de Serviços', 'Ícones Vetoriais', 'Auto Layout 5.0'],
  },
  {
    id: 'cta-section-premium-1',
    num: '35',
    title: 'Premium Conversion CTA Block',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Conversão & Leads',
    desc: 'Seção de chamada para ação de alta conversão com campo de captura, garantia e efeito de iluminação nobre.',
    rating: '5.0 ★★★★★',
    likes: 870,
    previewUrl: '/figma/cta-section-premium-1.webp',
    features: ['Campo de Captura de Lead', 'Badges de Confiança', 'Glows de Destaque'],
  },
  {
    id: 'depoimentos-2',
    num: '36',
    title: 'Testimonials & Social Proof Slider',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Prova Social & Reviews',
    desc: 'Componente de avaliações com notas 5 estrelas, fotos de clientes, selos de verificação e depoimentos destacados.',
    rating: '4.9 ★★★★★',
    likes: 630,
    previewUrl: '/figma/depoimentos-2.webp',
    features: ['Cards de Depoimento', 'Estrelas de Avaliação', 'Selo Verificado'],
  },
  {
    id: 'features-grid-2',
    num: '37',
    title: 'Bento Grid Features Layout',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Bento Grid & Recursos',
    desc: 'Estrutura assimétrica em formato bento box para organizar funcionalidades, diferenciais e métricas de forma dinâmica.',
    rating: '5.0 ★★★★★',
    likes: 920,
    previewUrl: '/figma/features-grid-2.webp',
    features: ['Bento Grid Assimétrico', 'Métricas em Destaque', 'Grid Responsivo'],
  },
  {
    id: 'footer-editorial-dark-1',
    num: '38',
    title: 'Dark Editorial Curved Footer',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Rodapés & Navegação',
    desc: 'Rodapé imponente com curvatura superior arredondada, colunas de links, newsletter e indicador de status da equipe.',
    rating: '4.9 ★★★★★',
    likes: 710,
    previewUrl: '/figma/footer-editorial-dark-1.webp',
    features: ['Curvatura Superior 48px', 'Links Organizados', 'Status em Tempo Real'],
  },
  {
    id: 'footer-minimal-clean-1',
    num: '39',
    title: 'Minimalist Light Footer',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Rodapés & Navegação',
    desc: 'Rodapé minimalista em fundo claro com alinhamento preciso, redes sociais e direitos autorais em conformidade.',
    rating: '4.7 ★★★★★',
    likes: 420,
    previewUrl: '/figma/footer-minimal-clean-1.webp',
    features: ['Design Minimalista Light', 'Hierarquia de Links', 'Redes Sociais'],
  },
  {
    id: 'navigation-bar-minimal-3',
    num: '40',
    title: 'Floating Pill Navbar Minimal',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Headers & Menus',
    desc: 'Menu de navegação flutuante em formato de pílula com links centrados e botão de ação de alto contraste.',
    rating: '4.8 ★★★★★',
    likes: 560,
    previewUrl: '/figma/navigation-bar-minimal-3.webp',
    videoPreview: '/figma/navigation-bar-minimal.webm',
    features: ['Header Pílula Flutuante', 'Estados Hover & Active', 'Auto Layout'],
  },
  {
    id: 'navigation-bar-premium-1',
    num: '41',
    title: 'Glassmorphism Navbar Header',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Headers & Menus',
    desc: 'Barra de navegação premium com desfoque de fundo de 25px, logotipo em vetor e botão CTA com aura iluminada.',
    rating: '5.0 ★★★★★',
    likes: 890,
    previewUrl: '/figma/navigation-bar-premium-1.webp',
    features: ['Vidro Fosco Backdrop', 'CTA com Efeito Glow', 'Menu Responsivo'],
  },
  {
    id: 'preco-planos-cards-cover',
    num: '42',
    title: 'Membership & Pricing Tier Stack',
    category: 'componentes',
    categoryLabel: 'TEMPLATE FIGMA',
    tag: 'Preços & Planos',
    desc: 'Tabela comparativa de planos em 3 níveis com destaque para o plano mais vendido, checklists e botão de adesão.',
    rating: '4.9 ★★★★★',
    likes: 780,
    previewUrl: '/figma/preco-planos-cards-cover.webp',
    features: ['3 Tiers de Precificação', 'Card Destaque Saltado', 'Checklist de Recursos'],
  },
];

export default function PortfolioModal({ isOpen, onClose, onSelectProjectForSite }: PortfolioModalProps) {
  const [filter, setFilter] = useState<'all' | 'hero' | 'web' | 'componentes'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [checkoutTemplate, setCheckoutTemplate] = useState<TemplateItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedTemplate && !checkoutTemplate) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, selectedTemplate, checkoutTemplate]);

  if (!isOpen) return null;

  const countHero = templatesData.filter((t) => t.category === 'hero').length;
  const countWeb = templatesData.filter((t) => t.category === 'web').length;
  const countComponentes = templatesData.filter((t) => t.category === 'componentes').length;

  const filteredTemplates = templatesData.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050b11]/85 backdrop-blur-3xl transition-opacity duration-300 animate-fadeIn"
      />

      {/* Main Container - Translucent Cyan Frosted Glass matching frontpage */}
      <div className="relative w-full max-w-6xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 font-medium">
                EDICRIA STUDIO • {templatesData.length} TEMPLATES FIGMA PROFISSIONAIS
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-[450] tracking-tight text-white">
              Biblioteca de Templates
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-3xl">
              Templates Figma profissionais e editáveis, desenvolvidos para criar websites de alto padrão, landing pages cinematográficas e interfaces comerciais de alto impacto.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <SoundtrackBar compact={true} />

            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-cyan-200 hover:text-white bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900 transition-all"
              aria-label="Fechar biblioteca"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-cyan-950/30 p-2.5 rounded-2xl border border-cyan-500/30 backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'all'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Filter size={12} /> TODOS ({templatesData.length} TEMPLATES)
            </button>

            <button
              onClick={() => setFilter('hero')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'hero'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers size={12} /> HERO SECTIONS ({countHero})
            </button>

            <button
              onClick={() => setFilter('web')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'web'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layout size={12} /> WEBSITES & PÁGINAS ({countWeb})
            </button>

            <button
              onClick={() => setFilter('componentes')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'componentes'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Grid size={12} /> COMPONENTES & UI KITS ({countComponentes})
            </button>
          </div>

          <span className="text-[11px] font-mono text-cyan-300/70 hidden lg:inline-block pr-2">
            ARQUIVOS .FIG + DESIGN SYSTEM MODULAR PRONTOS PARA USO
          </span>
        </div>

        {/* Optimized Lazy Media Grid - Translucent Cyan Frosted Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 py-2">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl border border-cyan-400/30 bg-cyan-950/20 backdrop-blur-3xl hover:border-cyan-400/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              {/* LAZY OPTIMIZED MEDIA FRAME */}
              <LazyTemplateMedia
                item={item}
                onOpenPreview={() => setSelectedTemplate(item)}
              />

              {/* Card Content Body - Translucent Glass */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-transparent">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-cyan-300/80 uppercase tracking-widest block font-medium">
                      {item.tag}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">
                      {item.likes} LIKES
                    </span>
                  </div>

                  <h4 className="text-xl font-medium text-white group-hover:text-cyan-200 transition-colors leading-snug">
                    {item.num}. {item.title}
                  </h4>

                  <p className="mt-2 text-xs text-zinc-300 font-light leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.features.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* High-Conversion Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  {/* Primary Button */}
                  <button
                    onClick={() => setCheckoutTemplate(item)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
                  >
                    <ShoppingBag size={15} className="text-black" />
                    ADQUIRIR TEMPLATE
                  </button>

                  {/* Secondary Details Action */}
                  <button
                    onClick={() => setSelectedTemplate(item)}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-200 hover:text-white text-[11px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Maximize2 size={12} className="text-cyan-400" />
                    VER DETALHES DO TEMPLATE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* High-Resolution Lightbox Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <div className="relative w-full max-w-4xl bg-cyan-950/25 border border-cyan-400/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-white my-auto max-h-[90vh] overflow-y-auto backdrop-blur-3xl">
              
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-white transition-colors z-20"
                aria-label="Fechar detalhes"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
                  TEMPLATE #{selectedTemplate.num} • {selectedTemplate.categoryLabel}
                </span>
                <span className="font-mono text-xs text-zinc-400">{selectedTemplate.rating}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {selectedTemplate.num}. {selectedTemplate.title}
              </h3>

              {/* MEDIA CONTAINER */}
              <div className="rounded-2xl overflow-hidden border border-cyan-500/30 h-[380px] sm:h-[460px] bg-black relative flex items-center justify-center shadow-2xl">
                {selectedTemplate.videoPreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={selectedTemplate.videoPreview}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>
                ) : (
                  <img
                    src={selectedTemplate.previewUrl}
                    alt={selectedTemplate.title}
                    className="w-full h-full object-contain max-h-[460px]"
                  />
                )}
              </div>

              <p className="text-base text-zinc-200 leading-relaxed font-light">
                {selectedTemplate.desc}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {selectedTemplate.features.map((f, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                    ✓ {f}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <WebGLLiquidSurgeButton
                  label="ADQUIRIR ESTE TEMPLATE"
                  onClick={() => {
                    const temp = selectedTemplate;
                    setSelectedTemplate(null);
                    setCheckoutTemplate(temp);
                  }}
                  width="w-full sm:w-[320px]"
                  height="h-[64px]"
                />

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const temp = selectedTemplate;
                      setSelectedTemplate(null);
                      onClose();
                      if (onSelectProjectForSite) onSelectProjectForSite(temp.title);
                    }}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-mono text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowUpRight size={14} className="text-cyan-300" />
                    QUERO UM SITE COM ESTE DESIGN
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Dedicated Modern Checkout Modal */}
      {checkoutTemplate && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO CHECKOUT SEGURO..."
              onClose={() => setCheckoutTemplate(null)}
            />
          }
        >
          <CheckoutModal
            isOpen={Boolean(checkoutTemplate)}
            onClose={() => setCheckoutTemplate(null)}
            productName={`Template #${checkoutTemplate.num} · ${checkoutTemplate.title}`}
            productPrice={66.90}
            templateId={checkoutTemplate.id}
          />
        </Suspense>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
