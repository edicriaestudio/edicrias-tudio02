import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { X, Filter, Layers, Layout, Grid, Maximize2, ShoppingBag, ArrowUpRight } from 'lucide-react';
import SoundtrackBar from './components/SoundtrackBar';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';
import ModalLoadingFallback from './components/ModalLoadingFallback';



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
  checkoutUrl?: string;
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

// 100% Unique, Curated Professional Design Templates
const templatesData: TemplateItem[] = [
  {
    id: 'hero-kaltgrat',
    num: '00',
    title: 'Kaltgrat / Sports Event',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'High Performance & Data',
    desc: 'Template ultra-técnico focado em alta performance. Design de alto contraste, tipografia fluída, tabelas de dados precisas e scroll suave (Lenis) para eventos esportivos e de tecnologia.',
    rating: '5.0 ★★★★★',
    likes: 3890,
    previewUrl: 'https://kaltgrat-abfahrt-95.aura.build/og-image.jpg',
    videoPreview: '/kaltgrat_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/Xxv438R',
    features: ['Tabular Layouts', 'High-Contrast UI', 'Parallax Overlap'],
  },
  {
    id: 'hero-kairo',
    num: '00',
    title: 'Kairo / Expedition Island',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Three.js & Luxury Travel',
    desc: 'Landing page imersiva de expedições de luxo. Utiliza Three.js para renderizar uma ilha vulcânica 3D, Lenis Smooth Scroll e transição Day/Night fluida.',
    rating: '5.0 ★★★★★',
    likes: 6230,
    previewUrl: 'https://kairo-expedition.aura.build/og-image.jpg',
    videoPreview: '/kairo_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/ShxJf3l',
    features: ['WebGL Volcanic Island', 'Day/Night Toggle', 'Lenis Scroll'],
  },
  {
    id: 'hero-kuro',
    num: '00',
    title: 'Kuro / 3D Katana',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Three.js & GSAP Scroll',
    desc: 'Uma obra de arte digital interativa. Construído com Three.js e WebGL, apresentando objetos 3D gerados proceduralmente controlados pela rolagem do usuário via GSAP.',
    rating: '5.0 ★★★★★',
    likes: 5120,
    previewUrl: 'https://kurogane-artisanal.aura.build/og-image.jpg',
    videoPreview: '/kuro_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/ANpG1Lr',
    features: ['WebGL Canvas 3D', 'Procedural Katana', 'Japanese Typography'],
  },
  {
    id: 'hero-indie-showcase',
    num: '00',
    title: 'Indie Showcase / Aetherfall',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Gaming & Parallax 3D',
    desc: 'Template imersivo desenvolvido para o mercado de games e NFTs. Utiliza matemática de Parallax avançada (420svh) e galeria horizontal de alta performance.',
    rating: '5.0 ★★★★★',
    likes: 4890,
    previewUrl: 'https://indie-showcase-56.aura.build/og-image.jpg',
    videoPreview: '/indie_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/e5F2fY2',
    features: ['Parallax Multilayer', 'Horizontal Scroll', 'Magnetic UI'],
  },
  {
    id: 'hero-caio',
    num: '00',
    title: 'Caio / 3D Portfolio',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: '3D Character & Typography',
    desc: 'Template imersivo estilo Apple. Focado em tipografia brutalista, animações suaves e renderização 3D de alta definição para portfólios pessoais e criadores.',
    rating: '5.0 ★★★★★',
    likes: 3120,
    previewUrl: 'https://site-tampletes-caio.vercel.app/og-image.jpg',
    videoPreview: '/caio_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/zNkPqRr',
    features: ['3D Character', 'Brutalist Typography', 'Dark Mode Vibe'],
  },
  {
    id: 'hero-rio-estate',
    num: '00',
    title: 'Rio Estate / Imobiliaria Drone',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Real Estate & Luxo',
    desc: 'Template cinematográfico de altíssimo padrão para imóveis de luxo. Apresenta design full-screen e estética de imagens aéreas imersivas.',
    rating: '5.0 ★★★★★',
    likes: 4100,
    previewUrl: 'https://imobiliaria-drone.vercel.app/og-image.jpg',
    videoPreview: '/imob_video.mp4',
    features: ['Luxury Aesthetic', 'Drone View', 'High-end Typography'],
  },
  {
    id: 'hero-canvas-visual',
    num: '00',
    title: 'EdCria Canvas / Fantasy Forest',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'SaaS & Plataformas',
    desc: 'Interface de plataforma web imersiva. Ambientação em floresta mística bioluminescente, tipografia ousada e botões em glassmorphism neon.',
    rating: '5.0 ★★★★★',
    likes: 3010,
    previewUrl: 'https://est-dio-edi-cria-canvas-visual-h5lw.vercel.app/og-image.jpg',
    videoPreview: '/canvas_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/RPNXzmk',
    features: ['Bioluminescent UI', 'Fantasy 3D', 'Canvas Layout'],
  },
  {
    id: 'hero-nexus-ai',
    num: '00',
    title: 'Nexus Prospector / Abstract 3D',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'SaaS & CRM',
    desc: 'Landing page vibrante para SaaS e CRM. Utiliza formas 3D abstratas texturizadas, cores neon vibrantes e navbar em glassmorphism.',
    rating: '5.0 ★★★★★',
    likes: 2890,
    previewUrl: 'https://nexus-prospector-r9k7.vercel.app/og-image.jpg',
    videoPreview: '/nexus_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/P9U5Aj2',
    features: ['3D Fur Textures', 'Gradient Lighting', 'SaaS Layout'],
  },
  {
    id: 'hero-akim-cyberpunk',
    num: '00',
    title: 'Akim Digital / Cyberpunk Neon',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Gaming, Web3 & Tech',
    desc: 'Interface futurista de alto impacto com estética cyberpunk, tons de neon púrpura, tipografia técnica e animações GSAP 60fps.',
    rating: '5.0 ★★★★★',
    likes: 3120,
    previewUrl: 'https://akim-digital.vercel.app/og-image.jpg',
    videoPreview: '/akim_video.mp4',
    checkoutUrl: 'https://pay.kiwify.com.br/NxapDjc',
    features: ['GSAP Animations', 'Cyberpunk UI', 'Mobile-First'],
  },
  {
    id: 'hero-suv-cinematic',
    num: '00',
    title: 'SUV Cinematic / Natureza Etarea',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Cinematic & 3D WebGL',
    desc: 'Projeto autoral imersivo de altassima conversão. Apresenta transições suaves, tipografia de luxo e uma atmosfera etérea de natureza misturada com o digital.',
    rating: '5.0 ★★★★★',
    likes: 2540,
    previewUrl: 'https://suvcinematic.vercel.app/og-image.jpg',
    videoPreview: '/suv_video.mp4',
    features: ['Efeito Parallax', 'Tipografia Fluida', 'Performance 60FPS'],
  },
  {
    id: 'hero-ophidia-snake-luxury',
    num: '01',
    title: 'Hero Ophidia High Jewelry & The Vault',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Tratamento de Água & BioTech',
    desc: 'Template de alto padrão para tratamento inteligente de água, cleantech, sustentabilidade e biotecnologia com estética submarina deep-ocean, micro-interações e badges analíticas.',
    rating: '5.0 ★★★★★',
    likes: 980,
    previewUrl: '/figma/hero-alodhx-water-tech-1.webp',
    videoPreview: '/figma/hero-aloohxi.webm',
    features: ['Estética Deep Ocean Frosted', 'Badges de Eficiência Hâ‚‚O', 'Auto Layout 5.0 Completo'],
  },
  {
    id: 'hero-dark-luxury-2',
    num: '04',
    title: 'Hero Dark Luxury VIP',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Cristais & BioTech',
    desc: 'Interface conceitual com elementos 3D translúcidos em tons de ametista e degradê púrpura, ideal para produtos inovadores e cosmética de luxo.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Sustentabilidade & Luxo',
    desc: 'Fusão elegante entre botânica digital e design refinado para marcas sustentáveis, spas, estética e bem-estar de alto padrão.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'SaaS & Web3',
    desc: 'Composição com esferas translúcidas em cobalto profundo e sombras suaves para startups, softwares B2B e produtos digitais.',
    rating: '5.0 ★★★★★',
    likes: 610,
    previewUrl: '/figma/hero-crystal-sphere-1.webp',
    videoPreview: '/figma/hero-crystal-sphere.webm',
    features: ['Hierarquia Tecnológica', 'Cards de Métricas', 'Design Variables'],
  },
  {
    id: 'hero-cycle-zephyr-1',
    num: '10',
    title: 'Hero Cycle Zephyr',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Editorial & Lifestyle',
    desc: 'Design editorial ultra-limpo com micro-espaçamentos calculados e tipografia expressiva para moda, mobilidade e lifestyle contemporâneo.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Nordic & Minimal',
    desc: 'Estética nórdica gélida com tons brancos nevados e cartões foscos para marcas de skincare, arquitetura e moda de inverno.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Design Suíço & Tipografia',
    desc: 'Layout fundamentado na escola suíça de design com tipografia gigante de alto impacto para estúdios criativos e agências.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'SaaS & Aplicativos',
    desc: 'Apresentação isométrica para demonstrar softwares, painéis analíticos e dashboards de aplicativos modernos com clareza.',
    rating: '5.0 ★★★★★',
    likes: 880,
    previewUrl: '/figma/hero-mockup-3d-4.webp',
    features: ['Perspectiva Isométrica', 'Cards de Funcionalidades', 'Paleta Tecnológica'],
  },
  {
    id: 'hero-museum-imperial-1',
    num: '17',
    title: 'Hero Imperial Gallery',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Cultura & Arte',
    desc: 'Layout nobre para galerias de arte, museus, leilões e instituições culturais com acabamento refinado e molduras elegantes.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Orgânico & Cosméticos',
    desc: 'Texturas suaves, acentos verde-musgo e tipografia poética para marcas orgânicas, fitoterápicas e sustentáveis.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Hardware & Segurança',
    desc: 'Template para lançamento de produtos de hardware inteligente, dispositivos biométricos e segurança digital.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Hardware & Eletrônicos',
    desc: 'Layout comercial com foco na apresentação de eletrônicos, fones de ouvido e gadgets de última geração.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Mindfulness & Saúde',
    desc: 'Ambiente visual suave e harmonioso para aplicativos de meditação, terapias holísticas e bem-estar integral.',
    rating: '5.0 ★★★★★',
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
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Editorial & Moda',
    desc: 'Composição de tela dividida com contraste equilibrado entre imagem de destaque e bloco tipográfico de conversão.',
    rating: '5.0 ★★★★★',
    likes: 570,
    previewUrl: '/figma/hero-split-screen-1.webp',
    features: ['Split Screen 50/50', 'Foco de Conversão', 'Adaptabilidade Mobile'],
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
                EDCRIA STUDIO • {templatesData.length} PROJETOS & TEMPLATES PROFISSIONAIS
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-[450] tracking-tight text-white">
              Biblioteca de Templates
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-3xl">
              PROJETOS & TEMPLATES profissionais e editáveis, desenvolvidos para criar websites de alto padrão, landing pages cinematográficas e interfaces comerciais de alto impacto.
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
                    {item.title}
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
                    onClick={() => { if(item.checkoutUrl) { window.open(item.checkoutUrl, '_blank') } else { setCheckoutTemplate(item) } }}
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
                   • {selectedTemplate.categoryLabel}
                </span>
                <span className="font-mono text-xs text-zinc-400">{selectedTemplate.rating}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {selectedTemplate.title}
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
                    if(temp?.checkoutUrl) { window.open(temp.checkoutUrl, '_blank') } else { setCheckoutTemplate(temp) }
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
          
        </Suspense>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

