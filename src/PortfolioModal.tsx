import { useState } from 'react';
import { X, Sparkles, Filter, Film, Image as ImageIcon, Zap, Volume2, VolumeX, Maximize2, Copy, Check } from 'lucide-react';
import SoundtrackBar from './components/SoundtrackBar';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProjectForSite?: () => void;
}

export interface TemplateItem {
  id: string;
  num: string;
  title: string;
  category: 'foto' | 'video' | 'web';
  categoryLabel: string;
  tag: string;
  desc: string;
  rating: string;
  likes: number;
  previewUrl: string;
  videoPreview?: string;
  features: string[];
}

const templatesData: TemplateItem[] = [
  {
    id: 'hero-dark-luxury-2',
    num: '01',
    title: 'Hero Dark Luxury VIP',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Dark Luxury 3D',
    desc: 'Layout Hero de luxo extremo com iluminação volumétrica dourada e vídeo gravado direto do Figma em 60 FPS.',
    rating: '5.0 ★★★★★',
    likes: 890,
    previewUrl: '/figma/hero-dark-luxury-2.webp',
    videoPreview: '/figma/hero-dark-luxury.webm',
    features: ['Vídeo Real Figma 60FPS', 'Dark Luxury 3D', 'Vidro Temperado'],
  },
  {
    id: 'hero-amethyst-1',
    num: '02',
    title: 'Hero Amethyst Crystal',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Amethyst Glass',
    desc: 'Composição 3D com cristais de ametista flutuantes e refração de luz em degradê púrpura neon em movimento.',
    rating: '4.9 ★★★★★',
    likes: 720,
    previewUrl: '/figma/hero-amethyst-1.webp',
    videoPreview: '/figma/hero-amethyst.webm',
    features: ['Vídeo Real Figma 60FPS', 'Amethyst Shader', 'Neon Glow'],
  },
  {
    id: 'hero-aqua-glass-1',
    num: '03',
    title: 'Hero Aqua Glass Ultra',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Aqua Glassmorphism',
    desc: 'Estética aquática ultra-refritiva com cartões semi-transparentes de acrílico e tipografia técnica animada.',
    rating: '5.0 ★★★★★',
    likes: 810,
    previewUrl: '/figma/hero-aqua-glass-1.webp',
    videoPreview: '/figma/hero-aqua-glass.webm',
    features: ['Vídeo Real Figma 60FPS', 'Frosted Glass', 'Aqua Wave'],
  },
  {
    id: 'hero-aurora-heart-1',
    num: '04',
    title: 'Hero Aurora Heart Glow',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'BioTech Holographic',
    desc: 'Hero responsivo para bio-tecnologia com coração 3D holográfico pulsante gravado em alta definição.',
    rating: '5.0 ★★★★★',
    likes: 940,
    previewUrl: '/figma/hero-aurora-heart-1.webp',
    videoPreview: '/figma/hero-aurora-heart.webm',
    features: ['Vídeo Real Figma 60FPS', 'Coração 3D Pulse', 'EKG Holograma'],
  },
  {
    id: 'hero-crystal-lotus-1',
    num: '05',
    title: 'Hero Crystal Lotus 3D',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Organic 3D Lotus',
    desc: 'Fusão entre botânica digital e renderização 3D de alta precisão para marcas sustentáveis de alto padrão.',
    rating: '4.9 ★★★★★',
    likes: 680,
    previewUrl: '/figma/hero-crystal-lotus-1.webp',
    videoPreview: '/figma/hero-crystal-lotus.webm',
    features: ['Vídeo Real Figma 60FPS', 'Lotus 3D Render', 'Organic Bio'],
  },
  {
    id: 'hero-crystal-sphere-1',
    num: '06',
    title: 'Hero Crystal Sphere Orbit',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Orb 3D Cobalt',
    desc: 'Esfera de vidro translúcido em órbita com sombras suavizadas por ray-tracing em movimento.',
    rating: '4.8 ★★★★★',
    likes: 610,
    previewUrl: '/figma/hero-crystal-sphere-1.webp',
    videoPreview: '/figma/hero-crystal-sphere.webm',
    features: ['Vídeo Real Figma 60FPS', 'Crystal Orb 3D', 'Ray-Tracing'],
  },
  {
    id: 'hero-cycle-zephyr-1',
    num: '07',
    title: 'Hero Cycle Zephyr Motion',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Clean Motion Zephyr',
    desc: 'Design editorial ultra-limpo com micro-interações de rolagem e física de movimento real.',
    rating: '4.9 ★★★★★',
    likes: 750,
    previewUrl: '/figma/hero-cycle-zephyr-1.webp',
    videoPreview: '/figma/hero-cycle-zephyr.webm',
    features: ['Vídeo Real Figma 60FPS', 'Zephyr Motion', 'Clean Editorial'],
  },
  {
    id: 'hero-editorial-medieval-1',
    num: '08',
    title: 'Hero Medieval Heritage',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Heritage Serif',
    desc: 'Tipografia serifada histórica contrastada com layout contemporâneo de revista de alta moda.',
    rating: '5.0 ★★★★★',
    likes: 830,
    previewUrl: '/figma/hero-editorial-medieval-1.webp',
    features: ['Medieval Serif', 'Revista Alta Moda', 'Espaço Negativo'],
  },
  {
    id: 'hero-ferrari-296-1',
    num: '09',
    title: 'Hero Ferrari 296 GTB',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Automotive Speed',
    desc: 'Apresentação hiper-cinematográfica para hipercarros com vídeo real do protótipo e telemetria live.',
    rating: '5.0 ★★★★★',
    likes: 1120,
    previewUrl: '/figma/hero-ferrari-296-1.webp',
    videoPreview: '/figma/hero-ferrari-296.webm',
    features: ['Vídeo Real Figma 60FPS', 'Ferrari 296 4K', 'Telemetria Live'],
  },
  {
    id: 'hero-glacius-frost-1',
    num: '10',
    title: 'Hero Glacius Frost Nordic',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Nordic Frost',
    desc: 'Estética nórdica gélida com tons brancos de neve e vídeo de vidro fosco reflexivo.',
    rating: '4.8 ★★★★★',
    likes: 540,
    previewUrl: '/figma/hero-glacius-frost-1.webp',
    videoPreview: '/figma/hero-glacius-frost.webm',
    features: ['Vídeo Real Figma 60FPS', 'Nordic Frost', 'Gelo Reflexivo'],
  },
  {
    id: 'hero-iris-vision-1',
    num: '11',
    title: 'Hero Iris Vision AI',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Spatial Computing',
    desc: 'Interface conceitual para realidade espacial e inteligência artificial generativa em vídeo.',
    rating: '5.0 ★★★★★',
    likes: 990,
    previewUrl: '/figma/hero-iris-vision-1.webp',
    videoPreview: '/figma/hero-iris-vision.webm',
    features: ['Vídeo Real Figma 60FPS', 'Vision OS UI', 'Janelas Flutuantes'],
  },
  {
    id: 'hero-minimal-bold-2',
    num: '12',
    title: 'Hero Minimal Bold Swiss',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Swiss Typography',
    desc: 'Inspirado no design suíço internacional com vídeo de rolagem dos títulos em escala gigante.',
    rating: '4.9 ★★★★★',
    likes: 670,
    previewUrl: '/figma/hero-minimal-bold-2.webp',
    videoPreview: '/figma/hero-minimal-bold.webm',
    features: ['Vídeo Real Figma 60FPS', 'Swiss Design', 'Escala Gigante'],
  },
  {
    id: 'hero-mockup-3d-4',
    num: '13',
    title: 'Hero 3D Device Mockup',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'SaaS Isometric',
    desc: 'Mockup 3D interativo de software em perspectiva isométrica com brilho radial no fundo.',
    rating: '4.9 ★★★★★',
    likes: 880,
    previewUrl: '/figma/hero-mockup-3d-4.webp',
    features: ['Device 3D Mockup', 'Isométrico SaaS', 'Glow Radial'],
  },
  {
    id: 'hero-museum-imperial-1',
    num: '14',
    title: 'Hero Imperial Museum',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Fine Art Museum',
    desc: 'Layout para instituições culturais de prestígio com vídeo de navegação nas molduras douradas.',
    rating: '4.9 ★★★★★',
    likes: 620,
    previewUrl: '/figma/hero-museum-imperial-1.webp',
    videoPreview: '/figma/hero-museum-imperial.webm',
    features: ['Vídeo Real Figma 60FPS', 'Imperial Museum', 'Molduras Douradas'],
  },
  {
    id: 'hero-noir-lux-1',
    num: '15',
    title: 'Hero Noir Monochromatic Luxe',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Monochrome Noir',
    desc: 'Estética noir de contraste máximo com vídeo gravado de sombras metálicas em movimento.',
    rating: '5.0 ★★★★★',
    likes: 910,
    previewUrl: '/figma/hero-noir-lux-1.webp',
    videoPreview: '/figma/hero-noir-lux.webm',
    features: ['Vídeo Real Figma 60FPS', 'Noir Luxe', 'Preto Absoluto'],
  },
  {
    id: 'hero-organico-editorial-1',
    num: '16',
    title: 'Hero Organic Editorial 01',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Organic Research',
    desc: 'Textura cremosa e acentos verde-musgo com vídeo demonstrativo de tipografia poética.',
    rating: '4.9 ★★★★★',
    likes: 730,
    previewUrl: '/figma/hero-organico-editorial-1.webp',
    videoPreview: '/figma/hero-organico-editorial.webm',
    features: ['Vídeo Real Figma 60FPS', 'Organic Research', 'Verde-Musgo'],
  },
  {
    id: 'hero-organico-editorial-2',
    num: '17',
    title: 'Hero Organic Editorial 02',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Earth Tones Botanic',
    desc: 'Tons terrosos quentes e vídeo macro vegetal para marcas éticas de alto valor.',
    rating: '4.8 ★★★★★',
    likes: 590,
    previewUrl: '/figma/hero-organico-editorial-2.webp',
    videoPreview: '/figma/hero-organico-editorial (1).webm',
    features: ['Vídeo Real Figma 60FPS', 'Tons Terrosos', 'Macro Vegetal'],
  },
  {
    id: 'hero-organico-editorial-3',
    num: '18',
    title: 'Hero Organic Editorial 03',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Minimal Sand Bio',
    desc: 'Layout de revista arquitetônica focado em simplicidade orgânica e equilíbrio visual.',
    rating: '4.9 ★★★★★',
    likes: 640,
    previewUrl: '/figma/hero-organico-editorial-3.webp',
    features: ['Revista Arquitetura', 'Simplicidade Bio', 'Grid Assimétrico'],
  },
  {
    id: 'hero-organico-editorial-4',
    num: '19',
    title: 'Hero Organic Editorial 04',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Macro Mineral Texture',
    desc: 'Superfícies minerais táteis e tipografia com contraste de peso acentuado.',
    rating: '4.8 ★★★★★',
    likes: 520,
    previewUrl: '/figma/hero-organico-editorial-4.webp',
    features: ['Texturas Minerais', 'Peso Acentuado', 'Look Técnico'],
  },
  {
    id: 'hero-organico-editorial-5',
    num: '20',
    title: 'Hero Organic Editorial 05',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Warm Linen Serif',
    desc: 'Textura de linho cru com degradê natural e alinhamento assimétrico.',
    rating: '4.9 ★★★★★',
    likes: 610,
    previewUrl: '/figma/hero-organico-editorial-5.webp',
    features: ['Linho Cru', 'Degradê Natural', 'Assimétrico'],
  },
  {
    id: 'hero-organico-editorial-6',
    num: '21',
    title: 'Hero Organic Editorial 06',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Stone Gray Spa',
    desc: 'Ambiente visual inspirado em rochas vulcânicas e estéticas de spas de luxo.',
    rating: '4.8 ★★★★★',
    likes: 550,
    previewUrl: '/figma/hero-organico-editorial-6.webp',
    features: ['Rochas Vulcânicas', 'Spa de Luxo', 'Cinza Pedra'],
  },
  {
    id: 'hero-organico-editorial-7',
    num: '22',
    title: 'Hero Organic Editorial 07',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Terracotta Golden Sun',
    desc: 'Iluminação de hora dourada com paleta terracota e tipografia marcante.',
    rating: '4.9 ★★★★★',
    likes: 680,
    previewUrl: '/figma/hero-organico-editorial-7.webp',
    features: ['Hora Dourada', 'Terracota Warm', 'Marcante'],
  },
  {
    id: 'hero-paradise-caribe-1',
    num: '23',
    title: 'Hero Caribbean Paradise',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Private Island Resort',
    desc: 'Vídeo imersivo do protótipo para hotelaria de ilhas privadas e iates de luxo.',
    rating: '5.0 ★★★★★',
    likes: 870,
    previewUrl: '/figma/hero-paradise-caribe-1.webp',
    videoPreview: '/figma/hero-paradise-caribe.webm',
    features: ['Vídeo Real Figma 60FPS', 'Resort de Luxo', 'Iates Privados'],
  },
  {
    id: 'hero-primal-1',
    num: '24',
    title: 'Hero Primal Brutalist',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Raw Concrete Tech',
    desc: 'Vídeo gravado em 60 FPS da arquitetura brutalista em concreto aparente e tipografia industrial.',
    rating: '5.0 ★★★★★',
    likes: 930,
    previewUrl: '/figma/hero-primal-1.webp',
    videoPreview: '/figma/hero-primal.webm',
    features: ['Vídeo Real Figma 60FPS', 'Brutalismo Cru', 'Concreto Aparente'],
  },
  {
    id: 'hero-samurai-purple-1',
    num: '25',
    title: 'Hero Cyberpunk Samurai',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Neon Neo-Tokyo',
    desc: 'Estética neon cyberpunk inspirada na cultura futurista de Neo-Tóquio.',
    rating: '5.0 ★★★★★',
    likes: 1050,
    previewUrl: '/figma/hero-samurai-purple-1.webp',
    features: ['Cyberpunk Neo-Tokyo', 'Violet Neon', 'Samurai 3D'],
  },
  {
    id: 'hero-smart-key-1',
    num: '26',
    title: 'Hero Smart Key IoT',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Hardware Cyber Security',
    desc: 'Vídeo real da animação do dispositivo metálico 3D e chaveiro inteligente.',
    rating: '4.9 ★★★★★',
    likes: 790,
    previewUrl: '/figma/hero-smart-key-1.webp',
    videoPreview: '/figma/hero-smart-key.webm',
    features: ['Vídeo Real Figma 60FPS', 'Smart Key IoT', 'Animação Metálica'],
  },
  {
    id: 'hero-smart-product-3d-1',
    num: '27',
    title: 'Hero Smart Product 3D',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: '3D Consumer Tech',
    desc: 'Vídeo do protótipo com rotação 360° interativa de hardware de alta tecnologia.',
    rating: '4.9 ★★★★★',
    likes: 820,
    previewUrl: '/figma/hero-smart-product-3d-1.webp',
    videoPreview: '/figma/hero-smart-product-3d.webm',
    features: ['Vídeo Real Figma 60FPS', 'Hardware 3D', 'Rotação 360'],
  },
  {
    id: 'hero-solace-1',
    num: '28',
    title: 'Hero Solace Zen Sanctuary',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Zen Serenity Minimal',
    desc: 'Vídeo da interface minimalista focada no bem-estar, meditação e paz de espírito.',
    rating: '4.9 ★★★★★',
    likes: 610,
    previewUrl: '/figma/hero-solace-1.webp',
    videoPreview: '/figma/hero-solace.webm',
    features: ['Vídeo Real Figma 60FPS', 'Zen Sanctuary', 'Meditação'],
  },
  {
    id: 'hero-split-screen-1',
    num: '29',
    title: 'Hero Split Screen Modern',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Split Screen Editorial',
    desc: 'Layout dividido ao meio com contraste dramático entre tipografia e imagem 4K.',
    rating: '4.8 ★★★★★',
    likes: 570,
    previewUrl: '/figma/hero-split-screen-1.webp',
    features: ['Split Screen UI', 'Contraste Dramático', 'Modern Editorial'],
  },
  {
    id: 'hero-stats-flutuantes-3',
    num: '30',
    title: 'Hero Floating Telemetry',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Fintech Telemetry',
    desc: 'Vídeo real dos cartões flutuantes de telemetria financeira em tempo real.',
    rating: '5.0 ★★★★★',
    likes: 940,
    previewUrl: '/figma/hero-stats-flutuantes-3.webp',
    videoPreview: '/figma/hero-stats-flutuantes.webm',
    features: ['Vídeo Real Figma 60FPS', 'Telemetria Fintech', 'Cards Flutuantes'],
  },
  {
    id: 'hero-techwear-1',
    num: '31',
    title: 'Hero Techwear Fashion',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Kinetic Techwear',
    desc: 'Vídeo de moda funcional urbana com acentos amarelo neon e nylon 3D.',
    rating: '5.0 ★★★★★',
    likes: 880,
    previewUrl: '/figma/hero-techwear-1.webp',
    videoPreview: '/figma/hero-techwear.webm',
    features: ['Vídeo Real Figma 60FPS', 'Techwear Urbano', 'Amarelo Neon'],
  },
  {
    id: 'blog-post-hero-1',
    num: '32',
    title: 'Blog Post Editorial Grid',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Article Magazine Grid',
    desc: 'Grade editorial para artigos de revista com tempo de leitura e autores em destaque.',
    rating: '4.8 ★★★★★',
    likes: 490,
    previewUrl: '/figma/blog-post-hero-1.webp',
    features: ['Grid Editorial', 'Artigos Revista', 'Tempo de Leitura'],
  },
  {
    id: 'cards-produto-glassmorphism-2',
    num: '33',
    title: 'Glassmorphism E-Commerce Cards',
    category: 'foto',
    categoryLabel: 'FIGMA • FOTO 4K',
    tag: 'Glass E-Commerce',
    desc: 'Cards de produtos de luxo com bordas reluzentes e desfoque de fundo de 20px.',
    rating: '4.9 ★★★★★',
    likes: 760,
    previewUrl: '/figma/cards-produto-glassmorphism-2.webp',
    features: ['Glass E-Commerce', 'Bordas Reluzentes', 'Desfoque 20px'],
  },
  {
    id: 'cards-servico-editorial-1',
    num: '34',
    title: 'Editorial Service Cards',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Editorial Services',
    desc: 'Vídeo da grade de serviços editoriais com ícones minimalistas e botões de agendamento.',
    rating: '4.8 ★★★★★',
    likes: 510,
    previewUrl: '/figma/cards-servico-editorial-1.webp',
    videoPreview: '/figma/cards-servico-editorial.webm',
    features: ['Vídeo Real Figma 60FPS', 'Cards Editoriais', 'Ícones Minimalistas'],
  },
  {
    id: 'cta-section-premium-1',
    num: '35',
    title: 'Premium Conversion CTA',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'High Conversion CTA',
    desc: 'Seção de chamada para ação de alta conversão com campo em vidro temperado.',
    rating: '5.0 ★★★★★',
    likes: 870,
    previewUrl: '/figma/cta-section-premium-1.webp',
    features: ['High Conversion CTA', 'Vidro Temperado', 'Glow Gold'],
  },
  {
    id: 'depoimentos-2',
    num: '36',
    title: 'Testimonials Slider Micro-UI',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Social Proof Slider',
    desc: 'Carrossel de depoimentos com avaliação de 5 estrelas e selo de cliente verificado.',
    rating: '4.9 ★★★★★',
    likes: 630,
    previewUrl: '/figma/depoimentos-2.webp',
    features: ['Depoimentos 5★', 'Selo Verificado', 'Slider Smooth'],
  },
  {
    id: 'features-grid-2',
    num: '37',
    title: 'Bento Grid Features Layout',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Bento Grid UI',
    desc: 'Bento box assimétrico exibindo métricas, gráficos ao vivo e funcionalidades chave.',
    rating: '5.0 ★★★★★',
    likes: 920,
    previewUrl: '/figma/features-grid-2.webp',
    features: ['Bento Grid UI', 'Métricas Live', 'Gráficos ao Vivo'],
  },
  {
    id: 'footer-editorial-dark-1',
    num: '38',
    title: 'Dark Editorial Footer UI',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Dark Mode Footer',
    desc: 'Rodapé de curvatura superior ultra-arredondada (64px) com indicador pulsante de status.',
    rating: '4.9 ★★★★★',
    likes: 710,
    previewUrl: '/figma/footer-editorial-dark-1.webp',
    features: ['Rodapé Ultra Rounded', 'Curvatura 64px', 'Status Pulsante'],
  },
  {
    id: 'footer-minimal-clean-1',
    num: '39',
    title: 'Minimalist Clean Footer UI',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Clean White Footer',
    desc: 'Rodapé minimalista em fundo branco com links organizados em colunas perfeitas.',
    rating: '4.7 ★★★★★',
    likes: 420,
    previewUrl: '/figma/footer-minimal-clean-1.webp',
    features: ['Clean Footer', 'White Minimal', 'Links Colunas'],
  },
  {
    id: 'navigation-bar-minimal-3',
    num: '40',
    title: 'Floating Pill Navbar Minimal',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Floating Pill Header',
    desc: 'Vídeo da navegação em formato de pílula flutuante para telas limpas e focadas.',
    rating: '4.8 ★★★★★',
    likes: 560,
    previewUrl: '/figma/navigation-bar-minimal-3.webp',
    videoPreview: '/figma/navigation-bar-minimal.webm',
    features: ['Vídeo Real Figma 60FPS', 'Floating Pill', 'Clean Header'],
  },
  {
    id: 'navigation-bar-premium-1',
    num: '41',
    title: 'Floating Pill Navbar Glass',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Glassmorphism Header',
    desc: 'Menu superior em pílula com desfoque de 25px e botão CTA com aura iluminada.',
    rating: '5.0 ★★★★★',
    likes: 890,
    previewUrl: '/figma/navigation-bar-premium-1.webp',
    features: ['Navbar Glass 25px', 'Aura CTA', 'Pílula Flutuante'],
  },
  {
    id: 'preco-planos-cards-cover',
    num: '42',
    title: 'Membership Pricing Tier Stack',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Pricing Tier Stack',
    desc: 'Tabela de preços de 3 níveis com card destaque saltado.',
    rating: '4.9 ★★★★★',
    likes: 780,
    previewUrl: '/figma/preco-planos-cards-cover.webp',
    features: ['3 Níveis de Preço', 'Card Pop-Out', 'Checklist Recursos'],
  },
  {
    id: 'landing-page-full-2',
    num: '43',
    title: 'Full Landing Page Architecture',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Complete LP Architecture',
    desc: 'Estrutura completa de landing page cinematográfica do topo ao rodapé com vídeo motion.',
    rating: '5.0 ★★★★★',
    likes: 1250,
    previewUrl: '/figma/landing-page-full-2.webp',
    videoPreview: '/figma/hero-dark-luxury.webm',
    features: ['Vídeo Real Figma 60FPS', 'Landing Page Full', '60 FPS Canvas'],
  },
  {
    id: 'portfolio-hero-cover',
    num: '44',
    title: 'Portfolio Master Showcase Cover',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Master Portfolio Cover',
    desc: 'Capa principal do portfólio Figma com visão geral dos 46 protótipos de alta performance.',
    rating: '5.0 ★★★★★',
    likes: 1180,
    previewUrl: '/figma/portfolio-hero-cover.webp',
    features: ['Cover Master 46', 'Visão Geral 4K', 'Portfólio Completo'],
  },
  {
    id: 'sobre-dark-1',
    num: '45',
    title: 'About & Philosophy Dark Layout',
    category: 'web',
    categoryLabel: 'WEBSITES 4K',
    tag: 'Manifesto About Dark',
    desc: 'Seção de manifesto sobre visão estratégica, princípios criativos e manifesto de marca.',
    rating: '4.9 ★★★★★',
    likes: 690,
    previewUrl: '/figma/sobre-dark-1.webp',
    features: ['Manifesto Dark', 'Visão Estratégica', 'Princípios'],
  },
  {
    id: 'videoframe_4286',
    num: '46',
    title: 'Cinematic Motion Video Frame',
    category: 'video',
    categoryLabel: 'FIGMA • VÍDEO REAL 60FPS',
    tag: 'Motion Video Frame 4K',
    desc: 'Frame de vídeo cinematográfico demonstrando transições e fluidez das interfaces.',
    rating: '4.9 ★★★★★',
    likes: 740,
    previewUrl: '/figma/videoframe_4286.png',
    videoPreview: '/figma/hero-techwear.webm',
    features: ['Vídeo Real Figma 60FPS', 'Cinematic Motion', 'Frame 4K'],
  },
];

export default function PortfolioModal({ isOpen, onClose, onSelectProjectForSite }: PortfolioModalProps) {
  const [filter, setFilter] = useState<'all' | 'foto' | 'video' | 'web'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen) return null;

  const filteredTemplates = templatesData.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleCopyFigmaLink = (id: string) => {
    navigator.clipboard.writeText('https://figma.com/@edicriastudio/templates');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050b11]/85 backdrop-blur-3xl transition-opacity duration-300"
      />

      {/* Main Container - Translucent Cyan Frosted Glass */}
      <div className="relative w-full max-w-6xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/75 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-cyan-300 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300 font-medium">
                EDICRIA STUDIO • 46 TEMPLATES FIGMA AUTORAIS (FOTO & VÍDEO WEBM 4K)
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
              Biblioteca de Protótipos com Vídeos Reais do Figma
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              24 Vídeos .WebM originais extraídos do Figma + 22 Imagens High-Res 4K em proporções expansivas.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <SoundtrackBar compact={true} />

            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-cyan-200 hover:text-white bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-cyan-950/40 p-2.5 rounded-2xl border border-cyan-500/30 backdrop-blur-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'all'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Filter size={12} /> TODOS (46 TEMPLATES)
            </button>

            <button
              onClick={() => setFilter('video')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'video'
                  ? 'bg-red-600 text-white shadow-lg scale-105 border border-red-400/50'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Film size={12} /> VÍDEOS REAIS FIGMA 60FPS
            </button>

            <button
              onClick={() => setFilter('foto')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'foto'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon size={12} /> TEMPLATES FOTO 4K
            </button>

            <button
              onClick={() => setFilter('web')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                filter === 'web'
                  ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap size={12} /> WEBSITES & COMPONENTES 4K
            </button>
          </div>

          <span className="text-[11px] font-mono text-cyan-300/70 hidden lg:inline-block pr-2">
            VÍDEOS .WEBM REAIS DO FIGMA AUTOPLAY LOOP
          </span>
        </div>

        {/* 46 Expanded Media Grid - Translucent Cyan Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 py-2">
          {filteredTemplates.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl border border-cyan-400/30 bg-[#050b11]/50 backdrop-blur-3xl hover:border-cyan-400/70 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
            >
              {/* ENLARGED MEDIA FRAME (h-[280px] sm:h-[320px]) */}
              <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-black border-b border-white/10 flex items-center justify-center">
                
                {item.videoPreview ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.videoPreview}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                    />
                    {/* Live Motion Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-600/90 border border-red-400/40 backdrop-blur-md font-mono text-[9px] text-white uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      VÍDEO REAL FIGMA 60FPS
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top filter brightness-[0.92] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                  />
                )}

                {/* Gradient Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b11] via-transparent to-black/30 pointer-events-none" />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#050b11]/90 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300 tracking-wider uppercase flex items-center gap-1.5">
                  <span className="text-zinc-400">#{item.num}</span>
                  <span>{item.categoryLabel}</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#050b11]/90 border border-cyan-500/40 backdrop-blur-md text-[10px] font-mono text-cyan-300">
                  {item.rating}
                </div>
              </div>

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

                {/* Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTemplate(item)}
                    className="flex-1 py-3 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 hover:text-white text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                  >
                    <Maximize2 size={13} className="text-cyan-300" /> ASSISTIR & DETALHES 4K
                  </button>

                  <button
                    onClick={() => handleCopyFigmaLink(item.id)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-cyan-300 hover:text-white transition-colors"
                    title="Copiar Link do Figma"
                  >
                    {copiedId === item.id ? <Check size={14} className="text-cyan-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* High-Resolution Cinematic Lightbox Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <div className="relative w-full max-w-4xl bg-[#050b11]/90 border border-cyan-400/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_80px_rgba(6,182,212,0.3)] text-white my-auto max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-5 right-5 p-2.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 text-white transition-colors z-20"
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

              {/* EXPANDED CINEMATIC MEDIA CONTAINER (h-[380px] sm:h-[460px]) */}
              <div className="rounded-2xl overflow-hidden border border-cyan-500/30 h-[380px] sm:h-[460px] bg-black relative flex items-center justify-center shadow-2xl">
                {selectedTemplate.videoPreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={selectedTemplate.videoPreview}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      controls
                      className="w-full h-full object-contain bg-black"
                    />
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-4 right-4 p-3 rounded-full bg-black/80 border border-cyan-400/40 text-cyan-300 backdrop-blur-md hover:bg-white/20 transition-colors z-10"
                      title={isMuted ? 'Ativar Som' : 'Desativar Som'}
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-cyan-400" />}
                    </button>
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
                  label="CRIAR MEU SITE COM ESTE TEMPLATE"
                  onClick={() => {
                    setSelectedTemplate(null);
                    onClose();
                    if (onSelectProjectForSite) onSelectProjectForSite();
                  }}
                  width="w-full sm:w-[320px]"
                  height="h-[64px]"
                />

                <a
                  href={selectedTemplate.videoPreview || selectedTemplate.previewUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-mono text-xs uppercase tracking-wider text-center transition-all"
                >
                  DOWNLOAD MÍDIA 4K
                </a>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
