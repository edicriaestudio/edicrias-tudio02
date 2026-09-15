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
    features: ['3D Character', 'Brutalist Typography', 'Dark Mode Vibe'],
  },
  {
    id: 'hero-rio-estate',
    num: '00',
    title: 'Rio Estate / Imobiliï¿½ria Drone',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Real Estate & Luxo',
    desc: 'Template cinematogrï¿½fico de altï¿½ssimo padrï¿½o para imï¿½veis de luxo. Apresenta design full-screen e estï¿½tica de imagens aï¿½reas imersivas.',
    rating: '5.0 ?????',
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
    desc: 'Interface de plataforma web imersiva. Ambientaï¿½ï¿½o em floresta mï¿½stica bioluminescente, tipografia ousada e botï¿½es em glassmorphism neon.',
    rating: '5.0 ?????',
    likes: 3010,
    previewUrl: 'https://est-dio-edi-cria-canvas-visual-h5lw.vercel.app/og-image.jpg',
    videoPreview: '/canvas_video.mp4',
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
    rating: '5.0 ?????',
    likes: 2890,
    previewUrl: 'https://nexus-prospector-r9k7.vercel.app/og-image.jpg',
    videoPreview: '/nexus_video.mp4',
    features: ['3D Fur Textures', 'Gradient Lighting', 'SaaS Layout'],
  },
  {
    id: 'hero-akim-cyberpunk',
    num: '00',
    title: 'Akim Digital / Cyberpunk Neon',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Gaming, Web3 & Tech',
    desc: 'Interface futurista de alto impacto com estï¿½tica cyberpunk, tons de neon pï¿½rpura, tipografia tï¿½cnica e animaï¿½ï¿½es GSAP 60fps.',
    rating: '5.0 ?????',
    likes: 3120,
    previewUrl: 'https://akim-digital.vercel.app/og-image.jpg',
    videoPreview: '/akim_video.mp4',
    features: ['GSAP Animations', 'Cyberpunk UI', 'Mobile-First'],
  },
  {
    id: 'hero-suv-cinematic',
    num: '00',
    title: 'SUV Cinematic / Natureza Etï¿½rea',
    category: 'hero',
    categoryLabel: 'PROJETO VIP',
    tag: 'Cinematic & 3D WebGL',
    desc: 'Projeto autoral imersivo de altï¿½ssima conversï¿½o. Apresenta transiï¿½ï¿½es suaves, tipografia de luxo e uma atmosfera etï¿½rea de natureza misturada com o digital.',
    rating: '5.0 ?????',
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
    desc: 'Template cinematogrÃ¡fico com serpente albina em alta joalheria de ouro branco e diamantes, tipografia serifada de luxo e vitrine 3D The Vault com frascos de poÃ§Ã£o iluminados.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 1240,
    previewUrl: '/figma/hero-ophidia-snake-luxury-1.webp',
    videoPreview: '/figma/hero-ophidia.webm',
    features: ['Tipografia Editorial Serif', 'Cards The Vault 3D', 'Auto Layout 5.0 Completo'],
  },
  {
    id: 'hero-atom-esg-sustainable',
    num: '02',
    title: 'Hero Ãtom ESGX & Sustentabilidade',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'ESG, Sustentabilidade & Consultoria',
    desc: 'Template moderno e clean para consultoria empresarial em sustentabilidade, estratÃ©gia ESGX, arquitetura biofÃ­lica e ecossistemas corporativos sustentÃ¡veis.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 1150,
    previewUrl: '/figma/hero-atom-esg-sustainable-1.webp',
    videoPreview: '/figma/hero-atom.webm',
    features: ['Paleta BiofÃ­lica Clean', 'Navbar Flutuante PÃ­lula', 'Cards de Metodologia'],
  },
  {
    id: 'hero-alodhx-water-tech',
    num: '03',
    title: 'Hero Alodhx Bio-Water Architecture',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Tratamento de Ãgua & BioTech',
    desc: 'Template de alto padrÃ£o para tratamento inteligente de Ã¡gua, cleantech, sustentabilidade e biotecnologia com estÃ©tica submarina deep-ocean, micro-interaÃ§Ãµes e badges analÃ­ticas.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 980,
    previewUrl: '/figma/hero-alodhx-water-tech-1.webp',
    videoPreview: '/figma/hero-aloohxi.webm',
    features: ['EstÃ©tica Deep Ocean Frosted', 'Badges de EficiÃªncia Hâ‚‚O', 'Auto Layout 5.0 Completo'],
  },
  {
    id: 'hero-dark-luxury-2',
    num: '04',
    title: 'Hero Dark Luxury VIP',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Dark Luxury & High-End',
    desc: 'Template de Hero Section premium para marcas de luxo, joalherias e serviÃ§os exclusivos com iluminaÃ§Ã£o volumÃ©trica e hierarquia visual refinada.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 890,
    previewUrl: '/figma/hero-dark-luxury-2.webp',
    videoPreview: '/figma/hero-dark-luxury.webm',
    features: ['Auto Layout 5.0', 'Paleta Dark Gold', 'Camadas 100% EditÃ¡veis'],
  },
  {
    id: 'hero-amethyst-1',
    num: '05',
    title: 'Hero Amethyst Crystal',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Cristais & BioTech',
    desc: 'Interface conceitual com elementos 3D translÃºcidos em tons de ametista e degradÃª pÃºrpura, ideal para produtos inovadores e cosmÃ©tica de luxo.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 720,
    previewUrl: '/figma/hero-amethyst-1.webp',
    videoPreview: '/figma/hero-amethyst.webm',
    features: ['Efeito Glassmorphism', 'Design System Modular', 'Componentes TipogrÃ¡ficos'],
  },
  {
    id: 'hero-aqua-glass-1',
    num: '06',
    title: 'Hero Aqua Glass Ultra',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Aqua Glassmorphism',
    desc: 'Layout com estÃ©tica de vidro temperado translÃºcido e acentos ciano neon para plataformas digitais, fintechs e produtos de alta tecnologia.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 810,
    previewUrl: '/figma/hero-aqua-glass-1.webp',
    videoPreview: '/figma/hero-aqua-glass.webm',
    features: ['Camadas TranslÃºcidas', 'Grid Responsivo', 'VariÃ¡veis de Cores'],
  },
  {
    id: 'hero-aurora-heart-1',
    num: '07',
    title: 'Hero Aurora BioTech',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'SaÃºde & Biotecnologia',
    desc: 'ComposiÃ§Ã£o de alto impacto para saÃºde digital, clÃ­nicas mÃ©dicas avanÃ§adas e biotecnologia com visual limpo e moderno.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 940,
    previewUrl: '/figma/hero-aurora-heart-1.webp',
    videoPreview: '/figma/hero-aurora-heart.webm',
    features: ['Tipografia MÃ©dica Clean', 'Cards de Indicadores', 'Layout Responsivo'],
  },
  {
    id: 'hero-crystal-lotus-1',
    num: '08',
    title: 'Hero Crystal Lotus',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Sustentabilidade & Luxo',
    desc: 'FusÃ£o elegante entre botÃ¢nica digital e design refinado para marcas sustentÃ¡veis, spas, estÃ©tica e bem-estar de alto padrÃ£o.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 680,
    previewUrl: '/figma/hero-crystal-lotus-1.webp',
    videoPreview: '/figma/hero-crystal-lotus.webm',
    features: ['EstÃ©tica OrgÃ¢nica', 'Auto Layout Completo', 'Design System Incluso'],
  },
  {
    id: 'hero-crystal-sphere-1',
    num: '09',
    title: 'Hero Crystal Sphere Orbit',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'SaaS & Web3',
    desc: 'ComposiÃ§Ã£o com esferas translÃºcidas em cobalto profundo e sombras suaves para startups, softwares B2B e produtos digitais.',
    rating: '4.8 â˜…â˜…â˜…â˜…â˜…',
    likes: 610,
    previewUrl: '/figma/hero-crystal-sphere-1.webp',
    videoPreview: '/figma/hero-crystal-sphere.webm',
    features: ['Hierarquia TecnolÃ³gica', 'Cards de MÃ©tricas', 'Design Variables'],
  },
  {
    id: 'hero-cycle-zephyr-1',
    num: '10',
    title: 'Hero Cycle Zephyr',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Editorial & Lifestyle',
    desc: 'Design editorial ultra-limpo com micro-espaÃ§amentos calculados e tipografia expressiva para moda, mobilidade e lifestyle contemporÃ¢neo.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 750,
    previewUrl: '/figma/hero-cycle-zephyr-1.webp',
    videoPreview: '/figma/hero-cycle-zephyr.webm',
    features: ['Grid Editorial SuÃ­Ã§o', 'EspaÃ§o Negativo Amplo', 'Tipografia em Escala'],
  },
  {
    id: 'hero-editorial-medieval-1',
    num: '11',
    title: 'Hero Medieval Heritage',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Heritage & Alta Moda',
    desc: 'Contraste imponente entre tipografia serifada clÃ¡ssica e layout minimalista contemporÃ¢neo para marcas tradicionais e alta costura.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 830,
    previewUrl: '/figma/hero-editorial-medieval-1.webp',
    features: ['Tipografia Serif ClÃ¡ssica', 'ComposiÃ§Ã£o Revista', 'Camadas Nomeadas'],
  },
  {
    id: 'hero-ferrari-296-1',
    num: '12',
    title: 'Hero Supercar Performance',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Automotivo & Performance',
    desc: 'ApresentaÃ§Ã£o hiper-sofisticada para o mercado automotivo de luxo, mobilidade elÃ©trica e produtos de alta performance.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
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
    desc: 'EstÃ©tica nÃ³rdica gÃ©lida com tons brancos nevados e cartÃµes foscos para marcas de skincare, arquitetura e moda de inverno.',
    rating: '4.8 â˜…â˜…â˜…â˜…â˜…',
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
    desc: 'Interface de vanguarda inspirada em computaÃ§Ã£o espacial e inteligÃªncia artificial generativa com janelas flutuantes organizadas.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 990,
    previewUrl: '/figma/hero-iris-vision-1.webp',
    videoPreview: '/figma/hero-iris-vision.webm',
    features: ['UI Espacial Flutuante', 'Glows Radiais', 'Ãcones Vetoriais'],
  },
  {
    id: 'hero-minimal-bold-2',
    num: '15',
    title: 'Hero Swiss Minimal Bold',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Design SuÃ­Ã§o & Tipografia',
    desc: 'Layout fundamentado na escola suÃ­Ã§a de design com tipografia gigante de alto impacto para estÃºdios criativos e agÃªncias.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 670,
    previewUrl: '/figma/hero-minimal-bold-2.webp',
    videoPreview: '/figma/hero-minimal-bold.webm',
    features: ['Grid SuÃ­Ã§o Rigoroso', 'Escala TipogrÃ¡fica Display', 'Alto Contraste'],
  },
  {
    id: 'hero-mockup-3d-4',
    num: '16',
    title: 'Hero SaaS 3D Perspective',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'SaaS & Aplicativos',
    desc: 'ApresentaÃ§Ã£o isomÃ©trica para demonstrar softwares, painÃ©is analÃ­ticos e dashboards de aplicativos modernos com clareza.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 880,
    previewUrl: '/figma/hero-mockup-3d-4.webp',
    features: ['Perspectiva IsomÃ©trica', 'Cards de Funcionalidades', 'Paleta TecnolÃ³gica'],
  },
  {
    id: 'hero-museum-imperial-1',
    num: '17',
    title: 'Hero Imperial Gallery',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Cultura & Arte',
    desc: 'Layout nobre para galerias de arte, museus, leilÃµes e instituiÃ§Ãµes culturais com acabamento refinado e molduras elegantes.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 620,
    previewUrl: '/figma/hero-museum-imperial-1.webp',
    videoPreview: '/figma/hero-museum-imperial.webm',
    features: ['Tipografia Nobre', 'OrganizaÃ§Ã£o de Acervo', 'Design ClÃ¡ssico'],
  },
  {
    id: 'hero-noir-lux-1',
    num: '18',
    title: 'Hero Noir Monochromatic',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'MonocromÃ¡tico & Luxo',
    desc: 'EstÃ©tica noir monocromÃ¡tica com pretos absolutos e acentos metÃ¡licos sutis para marcas de moda autoral e relÃ³gios suÃ­Ã§os.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 910,
    previewUrl: '/figma/hero-noir-lux-1.webp',
    videoPreview: '/figma/hero-noir-lux.webm',
    features: ['Preto Absoluto #000', 'Bordas MetÃ¡licas 1px', 'Tipografia Minimalista'],
  },
  {
    id: 'hero-organico-editorial-1',
    num: '19',
    title: 'Hero Organic Editorial',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'OrgÃ¢nico & CosmÃ©ticos',
    desc: 'Texturas suaves, acentos verde-musgo e tipografia poÃ©tica para marcas orgÃ¢nicas, fitoterÃ¡picas e sustentÃ¡veis.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 730,
    previewUrl: '/figma/hero-organico-editorial-1.webp',
    videoPreview: '/figma/hero-organico-editorial.webm',
    features: ['Tons Terrosos & Musgo', 'Auto Layout FlexÃ­vel', 'Hierarquia PoÃ©tica'],
  },
  {
    id: 'hero-paradise-caribe-1',
    num: '20',
    title: 'Hero Resort & Hospitality',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Hotelaria & Resorts',
    desc: 'Template de alta conversÃ£o para hotelaria de luxo, ilhas privadas, charters de iates e turismo de alto padrÃ£o.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 870,
    previewUrl: '/figma/hero-paradise-caribe-1.webp',
    videoPreview: '/figma/hero-paradise-caribe.webm',
    features: ['Cards de Reserva RÃ¡pida', 'Paleta Turquesa Tropical', 'Componentes UI'],
  },
  {
    id: 'hero-primal-1',
    num: '21',
    title: 'Hero Brutalist Architecture',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Brutalismo & Engenharia',
    desc: 'EstÃ©tica brutalista com estÃ©tica de concreto aparente e tipografia industrial forte para escritÃ³rios de engenharia e arquitetura.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 930,
    previewUrl: '/figma/hero-primal-1.webp',
    videoPreview: '/figma/hero-primal.webm',
    features: ['Design Brutalista', 'Tipografia Mono & Sans', 'Bordas GeomÃ©tricas'],
  },
  {
    id: 'hero-samurai-purple-1',
    num: '22',
    title: 'Hero Cyberpunk Neon',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Gaming & Cyberpunk',
    desc: 'ComposiÃ§Ã£o vibrante com degradÃªs violeta e ciano neon para o universo gamer, entretenimento digital e Web3.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 1050,
    previewUrl: '/figma/hero-samurai-purple-1.webp',
    features: ['Paleta Neon Vibrante', 'EstÃ©tica Futurista', 'Componentes TemÃ¡ticos'],
  },
  {
    id: 'hero-smart-key-1',
    num: '23',
    title: 'Hero IoT & Cyber Security',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Hardware & SeguranÃ§a',
    desc: 'Template para lanÃ§amento de produtos de hardware inteligente, dispositivos biomÃ©tricos e seguranÃ§a digital.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 790,
    previewUrl: '/figma/hero-smart-key-1.webp',
    videoPreview: '/figma/hero-smart-key.webm',
    features: ['Showcase de Produto', 'Cards de EspecificaÃ§Ã£o', 'Design Industrial'],
  },
  {
    id: 'hero-smart-product-3d-1',
    num: '24',
    title: 'Hero Consumer Tech 3D',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Hardware & EletrÃ´nicos',
    desc: 'Layout comercial com foco na apresentaÃ§Ã£o de eletrÃ´nicos, fones de ouvido e gadgets de Ãºltima geraÃ§Ã£o.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
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
    tag: 'Mindfulness & SaÃºde',
    desc: 'Ambiente visual suave e harmonioso para aplicativos de meditaÃ§Ã£o, terapias holÃ­sticas e bem-estar integral.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
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
    desc: 'ComposiÃ§Ã£o de tela dividida com contraste equilibrado entre imagem de destaque e bloco tipogrÃ¡fico de conversÃ£o.',
    rating: '4.8 â˜…â˜…â˜…â˜…â˜…',
    likes: 570,
    previewUrl: '/figma/hero-split-screen-1.webp',
    features: ['Split Screen 50/50', 'Foco de ConversÃ£o', 'Adaptabilidade Mobile'],
  },
  {
    id: 'hero-stats-flutuantes-3',
    num: '27',
    title: 'Hero Fintech Telemetry',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Fintech & FinanÃ§as',
    desc: 'Interface analÃ­tica com cards flutuantes de telemetria, grÃ¡ficos de rendimento e prova social para fintechs e bancos digitais.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 940,
    previewUrl: '/figma/hero-stats-flutuantes-3.webp',
    videoPreview: '/figma/hero-stats-flutuantes.webm',
    features: ['Cards de MÃ©tricas Flutuantes', 'GrÃ¡ficos Vetoriais', 'Auto Layout'],
  },
  {
    id: 'hero-techwear-1',
    num: '28',
    title: 'Hero Kinetic Techwear',
    category: 'hero',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Streetwear & Moda Urbana',
    desc: 'Visual de alto impacto para marcas de vestuÃ¡rio tÃ©cnico, calÃ§ados esportivos e cultura urbana contemporÃ¢nea.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 880,
    previewUrl: '/figma/hero-techwear-1.webp',
    videoPreview: '/figma/hero-techwear.webm',
    features: ['Acentos Amarelo Neon', 'Tipografia TÃ©cnica', 'Cards de ColeÃ§Ã£o'],
  },
  {
    id: 'blog-post-hero-1',
    num: '29',
    title: 'Blog Post & Magazine Grid',
    category: 'web',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Editorial & ConteÃºdo',
    desc: 'Grade editorial para artigos de revista, publicaÃ§Ãµes especializadas e blogs corporativos com tempo de leitura e autores.',
    rating: '4.8 â˜…â˜…â˜…â˜…â˜…',
    likes: 490,
    previewUrl: '/figma/blog-post-hero-1.webp',
    features: ['Grid de Artigos', 'Metadados de Leitura', 'Hierarquia de Textos'],
  },
  {
    id: 'landing-page-full-2',
    num: '30',
    title: 'Full Landing Page Architecture',
    category: 'web',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Landing Pages Completas',
    desc: 'Arquitetura integral de landing page comercial, incluindo Hero, Prova Social, Features, Planos e RodapÃ©.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 1250,
    previewUrl: '/figma/landing-page-full-2.webp',
    features: ['Estrutura Completa de LP', 'Hierarquia Comercial', 'Componentes Aninhados'],
  },
  {
    id: 'portfolio-hero-cover',
    num: '31',
    title: 'Portfolio Showcase Master Layout',
    category: 'web',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'PortfÃ³lios & AgÃªncias',
    desc: 'Layout mestre para apresentaÃ§Ã£o de cases criativos, estÃºdios de design e profissionais independentes.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 1180,
    previewUrl: '/figma/portfolio-hero-cover.webp',
    features: ['Showcase de Projetos', 'Capa de ApresentaÃ§Ã£o', 'Grid de Trabalhos'],
  },
  {
    id: 'sobre-dark-1',
    num: '32',
    title: 'About & Manifesto Dark Layout',
    category: 'web',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'PÃ¡ginas Institucionais',
    desc: 'SeÃ§Ã£o institucional e manifesto de marca com tipografia de destaque, declaraÃ§Ã£o de valores e linha do tempo.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 690,
    previewUrl: '/figma/sobre-dark-1.webp',
    features: ['Manifesto de Marca', 'Linha Editorial Dark', 'Tipografia Display'],
  },
  {
    id: 'cards-produto-glassmorphism-2',
    num: '33',
    title: 'E-Commerce Glassmorphism Cards',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'E-Commerce & Vendas',
    desc: 'Conjunto de cards de produto com efeito de vidro translÃºcido, tags de preÃ§o, variantes de cores e botÃ£o de compra.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 760,
    previewUrl: '/figma/cards-produto-glassmorphism-2.webp',
    features: ['Cards de Produto', 'Variantes de Estado', 'BotÃµes de Checkout'],
  },
  {
    id: 'cards-servico-editorial-1',
    num: '34',
    title: 'Editorial Service Cards UI',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'ServiÃ§os & Consultoria',
    desc: 'Grade de apresentaÃ§Ã£o de serviÃ§os com numeraÃ§Ã£o sequencial, Ã­cones minimalistas e botÃµes de contrataÃ§Ã£o rÃ¡pida.',
    rating: '4.8 â˜…â˜…â˜…â˜…â˜…',
    likes: 510,
    previewUrl: '/figma/cards-servico-editorial-1.webp',
    videoPreview: '/figma/cards-servico-editorial.webm',
    features: ['3 Colunas de ServiÃ§os', 'Ãcones Vetoriais', 'Auto Layout 5.0'],
  },
  {
    id: 'cta-section-premium-1',
    num: '35',
    title: 'Premium Conversion CTA Block',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'ConversÃ£o & Leads',
    desc: 'SeÃ§Ã£o de chamada para aÃ§Ã£o de alta conversÃ£o com campo de captura, garantia e efeito de iluminaÃ§Ã£o nobre.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 870,
    previewUrl: '/figma/cta-section-premium-1.webp',
    features: ['Campo de Captura de Lead', 'Badges de ConfianÃ§a', 'Glows de Destaque'],
  },
  {
    id: 'depoimentos-2',
    num: '36',
    title: 'Testimonials & Social Proof Slider',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Prova Social & Reviews',
    desc: 'Componente de avaliaÃ§Ãµes com notas 5 estrelas, fotos de clientes, selos de verificaÃ§Ã£o e depoimentos destacados.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 630,
    previewUrl: '/figma/depoimentos-2.webp',
    features: ['Cards de Depoimento', 'Estrelas de AvaliaÃ§Ã£o', 'Selo Verificado'],
  },
  {
    id: 'features-grid-2',
    num: '37',
    title: 'Bento Grid Features Layout',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Bento Grid & Recursos',
    desc: 'Estrutura assimÃ©trica em formato bento box para organizar funcionalidades, diferenciais e mÃ©tricas de forma dinÃ¢mica.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 920,
    previewUrl: '/figma/features-grid-2.webp',
    features: ['Bento Grid AssimÃ©trico', 'MÃ©tricas em Destaque', 'Grid Responsivo'],
  },
  {
    id: 'footer-editorial-dark-1',
    num: '38',
    title: 'Dark Editorial Curved Footer',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'RodapÃ©s & NavegaÃ§Ã£o',
    desc: 'RodapÃ© imponente com curvatura superior arredondada, colunas de links, newsletter e indicador de status da equipe.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 710,
    previewUrl: '/figma/footer-editorial-dark-1.webp',
    features: ['Curvatura Superior 48px', 'Links Organizados', 'Status em Tempo Real'],
  },
  {
    id: 'footer-minimal-clean-1',
    num: '39',
    title: 'Minimalist Light Footer',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'RodapÃ©s & NavegaÃ§Ã£o',
    desc: 'RodapÃ© minimalista em fundo claro com alinhamento preciso, redes sociais e direitos autorais em conformidade.',
    rating: '4.7 â˜…â˜…â˜…â˜…â˜…',
    likes: 420,
    previewUrl: '/figma/footer-minimal-clean-1.webp',
    features: ['Design Minimalista Light', 'Hierarquia de Links', 'Redes Sociais'],
  },
  {
    id: 'navigation-bar-minimal-3',
    num: '40',
    title: 'Floating Pill Navbar Minimal',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Headers & Menus',
    desc: 'Menu de navegaÃ§Ã£o flutuante em formato de pÃ­lula com links centrados e botÃ£o de aÃ§Ã£o de alto contraste.',
    rating: '4.8 â˜…â˜…â˜…â˜…â˜…',
    likes: 560,
    previewUrl: '/figma/navigation-bar-minimal-3.webp',
    videoPreview: '/figma/navigation-bar-minimal.webm',
    features: ['Header PÃ­lula Flutuante', 'Estados Hover & Active', 'Auto Layout'],
  },
  {
    id: 'navigation-bar-premium-1',
    num: '41',
    title: 'Glassmorphism Navbar Header',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'Headers & Menus',
    desc: 'Barra de navegaÃ§Ã£o premium com desfoque de fundo de 25px, logotipo em vetor e botÃ£o CTA com aura iluminada.',
    rating: '5.0 â˜…â˜…â˜…â˜…â˜…',
    likes: 890,
    previewUrl: '/figma/navigation-bar-premium-1.webp',
    features: ['Vidro Fosco Backdrop', 'CTA com Efeito Glow', 'Menu Responsivo'],
  },
  {
    id: 'preco-planos-cards-cover',
    num: '42',
    title: 'Membership & Pricing Tier Stack',
    category: 'componentes',
    categoryLabel: 'TEMPLATE PREMIUM',
    tag: 'PreÃ§os & Planos',
    desc: 'Tabela comparativa de planos em 3 nÃ­veis com destaque para o plano mais vendido, checklists e botÃ£o de adesÃ£o.',
    rating: '4.9 â˜…â˜…â˜…â˜…â˜…',
    likes: 780,
    previewUrl: '/figma/preco-planos-cards-cover.webp',
    features: ['3 Tiers de PrecificaÃ§Ã£o', 'Card Destaque Saltado', 'Checklist de Recursos'],
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
                EDICRIA STUDIO â€¢ {templatesData.length} PROJETOS & TEMPLATES PROFISSIONAIS
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-[450] tracking-tight text-white">
              Biblioteca de Templates
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-3xl">
              PROJETOS & TEMPLATES profissionais e editÃ¡veis, desenvolvidos para criar websites de alto padrÃ£o, landing pages cinematogrÃ¡ficas e interfaces comerciais de alto impacto.
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
              <Layout size={12} /> WEBSITES & PÃGINAS ({countWeb})
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
                  TEMPLATE #{selectedTemplate.num} â€¢ {selectedTemplate.categoryLabel}
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
                    âœ“ {f}
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
            productName={`Template #${checkoutTemplate.num} Â· ${checkoutTemplate.title}`}
            productPrice={66.90}
            templateId={checkoutTemplate.id}
          />
        </Suspense>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}

