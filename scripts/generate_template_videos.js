import fs from 'fs';

const TMP_DIR = '/tmp/figma_gen';
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

function getBase64Image(filePath) {
  const data = fs.readFileSync(filePath);
  return `data:image/webp;base64,${data.toString('base64')}`;
}

const ophidiaImg = getBase64Image('public/figma/hero-ophidia-snake-luxury-1.webp');
const atomImg = getBase64Image('public/figma/hero-atom-esg-sustainable-1.webp');
const alodhxImg = getBase64Image('public/figma/hero-alodhx-water-tech-1.webp');

// -------------------------------------------------------------
// 1. OPHIDIA HIGH JEWELRY ARTBOARD (1280 x 2560)
// -------------------------------------------------------------
const ophidiaSvg = `
<svg width="1280" height="2560" viewBox="0 0 1280 2560" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="opBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#05070a" />
      <stop offset="25%" stop-color="#0a0f16" />
      <stop offset="55%" stop-color="#040609" />
      <stop offset="80%" stop-color="#080d14" />
      <stop offset="100%" stop-color="#020305" />
    </linearGradient>
    <linearGradient id="opGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#f5e6be" />
      <stop offset="70%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#996515" />
    </linearGradient>
    <linearGradient id="opCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
    <linearGradient id="opGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.09)" />
      <stop offset="100%" stop-color="rgba(6,182,212,0.03)" />
    </linearGradient>
    <filter id="opGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1280" height="2560" fill="url(#opBg)" />

  <!-- HERO IMAGE EMBED -->
  <g transform="translate(0, 0)">
    <image href="${ophidiaImg}" x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice" />
    <!-- Gradient Fade Bottom -->
    <rect x="0" y="520" width="1280" height="200" fill="url(#opBg)" opacity="0.95" />
  </g>

  <!-- TOP FLOATING NAVBAR -->
  <g transform="translate(60, 40)">
    <rect width="1160" height="72" rx="36" fill="rgba(8,12,18,0.88)" stroke="rgba(212,175,55,0.4)" stroke-width="1.5"/>
    
    <circle cx="50" cy="36" r="6" fill="#d4af37" filter="url(#opGlow)" />
    <text x="70" y="43" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" letter-spacing="4">OPHIDIA</text>
    <text x="195" y="43" fill="#d4af37" font-family="sans-serif" font-size="10" font-weight="700" letter-spacing="3">HAUTE JOAILLERIE</text>
    
    <text x="440" y="42" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="2">THE SERPENT</text>
    <text x="600" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="2">THE VAULT</text>
    <text x="740" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="2">PRIVATE SALON</text>
    <text x="890" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="2">ATELIER</text>

    <rect x="1000" y="15" width="140" height="42" rx="21" fill="url(#opGold)"/>
    <text x="1070" y="41" fill="#000000" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1.5" text-anchor="middle">RESERVE VIP</text>
  </g>

  <!-- HERO HEADLINE & BADGE -->
  <g transform="translate(80, 520)">
    <rect width="320" height="40" rx="20" fill="rgba(212,175,55,0.15)" stroke="rgba(212,175,55,0.5)" stroke-width="1"/>
    <circle cx="24" cy="20" r="5" fill="#d4af37"/>
    <text x="42" y="25" fill="#fef3c7" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="2">EDITION N° 01 • GENEVA 2026</text>

    <text x="0" y="90" fill="#ffffff" font-family="sans-serif" font-size="48" font-weight="800" letter-spacing="1">THE SERPENTINE</text>
    <text x="0" y="145" fill="url(#opGold)" font-family="sans-serif" font-size="48" font-weight="800" letter-spacing="2">VAULT MASTERPIECE</text>
    
    <text x="0" y="190" fill="#d1d5db" font-family="sans-serif" font-size="16" font-weight="300" letter-spacing="0.5">
      Alta joalheria esculpida em ouro branco 18K, diamantes D-Flawless e vitrine 3D.
    </text>

    <!-- Interactive Buttons -->
    <g transform="translate(0, 220)">
      <rect width="240" height="54" rx="27" fill="url(#opGold)" filter="url(#opGlow)"/>
      <text x="120" y="33" fill="#000000" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5" text-anchor="middle">EXPLORAR COLEÇÃO</text>

      <rect x="260" y="0" width="220" height="54" rx="27" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)"/>
      <text x="370" y="33" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="1" text-anchor="middle">AGENDAR VISITA</text>
    </g>
  </g>

  <!-- SECTION 2: THE VAULT 3D SHOWCASE -->
  <g transform="translate(60, 880)">
    <rect width="1160" height="600" rx="32" fill="rgba(10,16,24,0.85)" stroke="rgba(212,175,55,0.3)" stroke-width="1.5"/>
    
    <text x="60" y="70" fill="#d4af37" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="4">THE VAULT ARCHIVE</text>
    <text x="60" y="115" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="700">Frascos de Alta Alquimia &amp; Pedestais 3D</text>

    <!-- Card 1 -->
    <g transform="translate(60, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(15,23,35,0.9)" stroke="rgba(212,175,55,0.3)"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(212,175,55,0.1)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(212,175,55,0.25)" filter="url(#opGlow)"/>
      <text x="160" y="135" fill="#d4af37" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">01</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">AURUM ELIXIR N° 07</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Ouro Coloidal &amp; Âmbar Suíço</text>
      <text x="30" y="335" fill="#d4af37" font-family="monospace" font-size="16" font-weight="bold">$ 14,500 USD</text>
    </g>

    <!-- Card 2 (Active Glow) -->
    <g transform="translate(420, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(15,23,35,0.9)" stroke="rgba(6,182,212,0.7)" stroke-width="2"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(6,182,212,0.15)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(6,182,212,0.35)" filter="url(#opGlow)"/>
      <text x="160" y="135" fill="#67e8f9" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">02</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">SAPPHIRE SERPENT N° 03</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Safira Real &amp; Diamantes VVS1</text>
      <text x="30" y="335" fill="#22d3ee" font-family="monospace" font-size="16" font-weight="bold">$ 28,900 USD</text>
    </g>

    <!-- Card 3 -->
    <g transform="translate(780, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(15,23,35,0.9)" stroke="rgba(244,114,182,0.3)"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(244,114,182,0.1)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(244,114,182,0.25)" filter="url(#opGlow)"/>
      <text x="160" y="135" fill="#f472b6" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">03</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">EMERALD VENOM N° 12</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Esmeralda Colombiana 4.2ct</text>
      <text x="30" y="335" fill="#f472b6" font-family="monospace" font-size="16" font-weight="bold">$ 36,000 USD</text>
    </g>
  </g>

  <!-- SECTION 3: CRAFTSMANSHIP METRICS -->
  <g transform="translate(60, 1530)">
    <rect width="1160" height="420" rx="32" fill="rgba(8,12,18,0.9)" stroke="rgba(255,255,255,0.1)"/>
    
    <text x="60" y="70" fill="#9ca3af" font-family="monospace" font-size="12" letter-spacing="3">ATELIER CRAFTSMANSHIP</text>
    <text x="60" y="115" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="700">Maestria Suíça em Joalheria</text>

    <!-- 4 Stats Boxes -->
    <g transform="translate(60, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#d4af37" font-family="sans-serif" font-size="38" font-weight="bold">18K</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Ouro Branco Maciço</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Fundição especial anti-risco</text>
    </g>

    <g transform="translate(330, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#22d3ee" font-family="sans-serif" font-size="38" font-weight="bold">VVS1</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Diamantes D-Flawless</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Lapidação Triple-X</text>
    </g>

    <g transform="translate(600, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#f472b6" font-family="sans-serif" font-size="38" font-weight="bold">320h</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Cravação Manual</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Trabalho sob microscópio 40x</text>
    </g>

    <g transform="translate(870, 160)">
      <rect width="230" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#d4af37" font-family="sans-serif" font-size="38" font-weight="bold">N° 01</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Certificado NFT</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Registro blockchain exclusivo</text>
    </g>
  </g>

  <!-- SECTION 4: FOOTER BANNER -->
  <g transform="translate(60, 2010)">
    <rect width="1160" height="420" rx="32" fill="rgba(10,16,24,0.95)" stroke="rgba(212,175,55,0.35)"/>
    
    <text x="580" y="130" fill="#ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">Entre para o Círculo Exclusivo Ophidia</text>
    <text x="580" y="175" fill="#9ca3af" font-family="sans-serif" font-size="15" text-anchor="middle">Acesso antecipado a lançamentos de peças únicas e eventos em Genebra e Paris.</text>

    <rect x="410" y="220" width="340" height="60" rx="30" fill="url(#opGold)" filter="url(#opGlow)"/>
    <text x="580" y="257" fill="#000000" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="2" text-anchor="middle">SOLICITAR CONVITE VIP</text>

    <text x="580" y="340" fill="#6b7280" font-family="monospace" font-size="11" letter-spacing="3" text-anchor="middle">© 2026 OPHIDIA HAUTE JOAILLERIE • GENÈVE</text>
  </g>
</svg>
`;

// -------------------------------------------------------------
// 2. ÁTOM ESGX & SUSTENTABILIDADE ARTBOARD (1280 x 2560)
// -------------------------------------------------------------
const atomSvg = `
<svg width="1280" height="2560" viewBox="0 0 1280 2560" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="atBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a1210" />
      <stop offset="25%" stop-color="#0f1f1a" />
      <stop offset="55%" stop-color="#081412" />
      <stop offset="80%" stop-color="#0d1e19" />
      <stop offset="100%" stop-color="#050a08" />
    </linearGradient>
    <linearGradient id="atGreen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#86efac" />
      <stop offset="50%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <linearGradient id="atCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="atGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1280" height="2560" fill="url(#atBg)" />

  <!-- HERO IMAGE EMBED -->
  <g transform="translate(0, 0)">
    <image href="${atomImg}" x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice" />
    <rect x="0" y="520" width="1280" height="200" fill="url(#atBg)" opacity="0.95" />
  </g>

  <!-- TOP NAVBAR -->
  <g transform="translate(60, 40)">
    <rect width="1160" height="72" rx="36" fill="rgba(10,20,16,0.9)" stroke="rgba(34,197,94,0.35)" stroke-width="1.5"/>
    
    <circle cx="50" cy="36" r="6" fill="#22c55e" filter="url(#atGlow)" />
    <text x="70" y="43" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" letter-spacing="3">ÁTOM ESGX</text>
    <text x="210" y="43" fill="#86efac" font-family="monospace" font-size="10" font-weight="700" letter-spacing="2">SUSTAINABLE ARCHITECTURE</text>
    
    <text x="510" y="42" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="1">ESTRATÉGIA</text>
    <text x="640" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="1">BIOFILIA</text>
    <text x="750" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="1">MÉTRICAS ESG</text>
    <text x="890" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="1">CASES</text>

    <rect x="990" y="15" width="150" height="42" rx="21" fill="url(#atGreen)"/>
    <text x="1065" y="41" fill="#000000" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1" text-anchor="middle">DIAGNÓSTICO</text>
  </g>

  <!-- HERO HEADLINE & BADGE -->
  <g transform="translate(80, 520)">
    <rect width="360" height="40" rx="20" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.5)" stroke-width="1"/>
    <circle cx="24" cy="20" r="5" fill="#22c55e"/>
    <text x="42" y="25" fill="#bbf7d0" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="2">ECO-EFFICIENCY SCORE: 98.4%</text>

    <text x="0" y="90" fill="#ffffff" font-family="sans-serif" font-size="48" font-weight="800">ARQUITETURA &amp; ESTRATÉGIA</text>
    <text x="0" y="145" fill="url(#atGreen)" font-family="sans-serif" font-size="48" font-weight="800">CORPORATIVA SUSTENTÁVEL</text>
    
    <text x="0" y="190" fill="#cbd5e1" font-family="sans-serif" font-size="16" font-weight="300">
      Consultoria corporativa em descarbonização, arquitetura biofílica e ecossistemas ESGX.
    </text>

    <!-- Interactive Buttons -->
    <g transform="translate(0, 220)">
      <rect width="250" height="54" rx="27" fill="url(#atGreen)" filter="url(#atGlow)"/>
      <text x="125" y="33" fill="#000000" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1" text-anchor="middle">INICIAR DIAGNÓSTICO</text>

      <rect x="270" y="0" width="220" height="54" rx="27" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
      <text x="380" y="33" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="1" text-anchor="middle">VER METODOLOGIA</text>
    </g>
  </g>

  <!-- SECTION 2: ESG METHODOLOGY -->
  <g transform="translate(60, 880)">
    <rect width="1160" height="600" rx="32" fill="rgba(12,24,19,0.85)" stroke="rgba(34,197,94,0.3)" stroke-width="1.5"/>
    
    <text x="60" y="70" fill="#86efac" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="3">METODOLOGIA CIRCULAR</text>
    <text x="60" y="115" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="700">Pilares de Transformação Regenerativa</text>

    <!-- Card 1 -->
    <g transform="translate(60, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(16,32,26,0.9)" stroke="rgba(34,197,94,0.25)"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(34,197,94,0.1)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(34,197,94,0.25)" filter="url(#atGlow)"/>
      <text x="160" y="135" fill="#86efac" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">CO₂</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Carbon Zero Strategy</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Modelagem de emissões e compensação</text>
      <text x="30" y="335" fill="#22c55e" font-family="monospace" font-size="16" font-weight="bold">-42% PEGADA CO₂</text>
    </g>

    <!-- Card 2 -->
    <g transform="translate(420, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(16,32,26,0.9)" stroke="rgba(34,197,94,0.7)" stroke-width="2"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(34,197,94,0.15)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(34,197,94,0.35)" filter="url(#atGlow)"/>
      <text x="160" y="135" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">BIO</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Design Biofílico 360°</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Jardins verticais e iluminação circadiana</text>
      <text x="30" y="335" fill="#86efac" font-family="monospace" font-size="16" font-weight="bold">+35% PRODUTIVIDADE</text>
    </g>

    <!-- Card 3 -->
    <g transform="translate(780, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(16,32,26,0.9)" stroke="rgba(6,182,212,0.3)"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(6,182,212,0.1)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(6,182,212,0.25)" filter="url(#atGlow)"/>
      <text x="160" y="135" fill="#67e8f9" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">ESG</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Compliance &amp; Certificação</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Auditoria para LEED Platinum e GRI</text>
      <text x="30" y="335" fill="#67e8f9" font-family="monospace" font-size="16" font-weight="bold">LEED PLATINUM 100%</text>
    </g>
  </g>

  <!-- SECTION 3: METRICS DASHBOARD -->
  <g transform="translate(60, 1530)">
    <rect width="1160" height="420" rx="32" fill="rgba(10,20,16,0.9)" stroke="rgba(255,255,255,0.1)"/>
    
    <text x="60" y="70" fill="#86efac" font-family="monospace" font-size="12" letter-spacing="3">IMPACTO &amp; TELEMETRIA</text>
    <text x="60" y="115" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="700">Métricas Reais de Projetos Ativos</text>

    <!-- 4 Stats Boxes -->
    <g transform="translate(60, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#22c55e" font-family="sans-serif" font-size="38" font-weight="bold">-42%</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Pegada de Carbono</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Descarbonização comprovada</text>
    </g>

    <g transform="translate(330, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#67e8f9" font-family="sans-serif" font-size="38" font-weight="bold">+85%</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Eficiência Hídrica</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Reúso e captação pluvial</text>
    </g>

    <g transform="translate(600, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#86efac" font-family="sans-serif" font-size="38" font-weight="bold">100%</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Energia Renovável</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Geração solar e eólica local</text>
    </g>

    <g transform="translate(870, 160)">
      <rect width="230" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#22c55e" font-family="sans-serif" font-size="38" font-weight="bold">A+</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Rating ESG Corporativo</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Padrão internacional GRI</text>
    </g>
  </g>

  <!-- SECTION 4: FOOTER -->
  <g transform="translate(60, 2010)">
    <rect width="1160" height="420" rx="32" fill="rgba(10,24,18,0.95)" stroke="rgba(34,197,94,0.4)"/>
    
    <text x="580" y="130" fill="#ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">Pronto para Descarbonizar sua Empresa?</text>
    <text x="580" y="175" fill="#9ca3af" font-family="sans-serif" font-size="15" text-anchor="middle">Agende uma sessão diagnóstica com nossos arquitetos e especialistas em sustentabilidade.</text>

    <rect x="410" y="220" width="340" height="60" rx="30" fill="url(#atGreen)" filter="url(#atGlow)"/>
    <text x="580" y="257" fill="#000000" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="1.5" text-anchor="middle">SOLICITAR CONSULTORIA</text>

    <text x="580" y="340" fill="#6b7280" font-family="monospace" font-size="11" letter-spacing="3" text-anchor="middle">© 2026 ÁTOM ESGX • BIO-ARCHITECTURE SOLUTIONS</text>
  </g>
</svg>
`;

// -------------------------------------------------------------
// 3. ALODHX BIO-WATER & TECH ARTBOARD (1280 x 2560)
// -------------------------------------------------------------
const alodhxSvg = `
<svg width="1280" height="2560" viewBox="0 0 1280 2560" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="alBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#040c14" />
      <stop offset="25%" stop-color="#081826" />
      <stop offset="55%" stop-color="#030a10" />
      <stop offset="80%" stop-color="#071724" />
      <stop offset="100%" stop-color="#020508" />
    </linearGradient>
    <linearGradient id="alCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#67e8f9" />
      <stop offset="70%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="alBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
    <filter id="alGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="1280" height="2560" fill="url(#alBg)" />

  <!-- HERO IMAGE EMBED -->
  <g transform="translate(0, 0)">
    <image href="${alodhxImg}" x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice" />
    <rect x="0" y="520" width="1280" height="200" fill="url(#alBg)" opacity="0.95" />
  </g>

  <!-- TOP NAVBAR -->
  <g transform="translate(60, 40)">
    <rect width="1160" height="72" rx="36" fill="rgba(8,20,32,0.9)" stroke="rgba(6,182,212,0.4)" stroke-width="1.5"/>
    
    <circle cx="50" cy="36" r="6" fill="#06b6d4" filter="url(#alGlow)" />
    <text x="70" y="43" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="900" letter-spacing="4">ALODHX</text>
    <text x="180" y="43" fill="#67e8f9" font-family="monospace" font-size="10" font-weight="700" letter-spacing="3">HYDRATION LABS</text>
    
    <text x="470" y="42" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="2">BIO-TECH</text>
    <text x="610" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="2">FILTRAGEM</text>
    <text x="750" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="2">MINERAIS</text>
    <text x="880" y="42" fill="#9ca3af" font-family="sans-serif" font-size="13" letter-spacing="2">CIÊNCIA</text>

    <rect x="990" y="15" width="150" height="42" rx="21" fill="url(#alCyan)"/>
    <text x="1065" y="41" fill="#000000" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1.5" text-anchor="middle">ADQUIRIR</text>
  </g>

  <!-- HERO HEADLINE & BADGE -->
  <g transform="translate(80, 520)">
    <rect width="360" height="40" rx="20" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.5)" stroke-width="1"/>
    <circle cx="24" cy="20" r="5" fill="#06b6d4"/>
    <text x="42" y="25" fill="#cffafe" font-family="monospace" font-size="11" font-weight="bold" letter-spacing="2">SUB-AQUATIC RESILIENCE • 99.99%</text>

    <text x="0" y="90" fill="#ffffff" font-family="sans-serif" font-size="48" font-weight="800">ÁGUA REESTRUTURADA</text>
    <text x="0" y="145" fill="url(#alCyan)" font-family="sans-serif" font-size="48" font-weight="800">BIO-TECH PURITY SYSTEM</text>
    
    <text x="0" y="190" fill="#cbd5e1" font-family="sans-serif" font-size="16" font-weight="300">
      Tecnologia de nano-purificação de 0.001μm inspirada em ecossistemas oceânicos profundos.
    </text>

    <!-- Interactive Buttons -->
    <g transform="translate(0, 220)">
      <rect width="250" height="54" rx="27" fill="url(#alCyan)" filter="url(#alGlow)"/>
      <text x="125" y="33" fill="#000000" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1" text-anchor="middle">CONHECER SISTEMA</text>

      <rect x="270" y="0" width="220" height="54" rx="27" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
      <text x="380" y="33" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="1" text-anchor="middle">ESPECIFICAÇÕES</text>
    </g>
  </g>

  <!-- SECTION 2: MOLECULAR ENGINEERING -->
  <g transform="translate(60, 880)">
    <rect width="1160" height="600" rx="32" fill="rgba(8,20,32,0.85)" stroke="rgba(6,182,212,0.3)" stroke-width="1.5"/>
    
    <text x="60" y="70" fill="#67e8f9" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="3">ENGENHARIA MOLECULAR</text>
    <text x="60" y="115" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="700">Pureza Reestruturada em Nível Celular</text>

    <!-- Card 1 -->
    <g transform="translate(60, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(12,28,44,0.9)" stroke="rgba(6,182,212,0.25)"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(6,182,212,0.1)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(6,182,212,0.25)" filter="url(#alGlow)"/>
      <text x="160" y="135" fill="#67e8f9" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">NANO</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Filtragem 0.001μm</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Membranas bio-miméticas avançadas</text>
      <text x="30" y="335" fill="#06b6d4" font-family="monospace" font-size="16" font-weight="bold">99.999% PUREZA</text>
    </g>

    <!-- Card 2 -->
    <g transform="translate(420, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(12,28,44,0.9)" stroke="rgba(6,182,212,0.7)" stroke-width="2"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(6,182,212,0.15)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(6,182,212,0.35)" filter="url(#alGlow)"/>
      <text x="160" y="135" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">pH 8.5</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Infusão Eletrolítica</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">72 minerais essenciais rebalanceados</text>
      <text x="30" y="335" fill="#67e8f9" font-family="monospace" font-size="16" font-weight="bold">EQUILÍBRIO ALCALINO</text>
    </g>

    <!-- Card 3 -->
    <g transform="translate(780, 160)">
      <rect width="320" height="380" rx="24" fill="rgba(12,28,44,0.9)" stroke="rgba(56,189,248,0.3)"/>
      <rect x="25" y="25" width="270" height="200" rx="16" fill="rgba(56,189,248,0.1)"/>
      <circle cx="160" cy="125" r="55" fill="rgba(56,189,248,0.25)" filter="url(#alGlow)"/>
      <text x="160" y="135" fill="#38bdf8" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle">432Hz</text>
      
      <text x="30" y="260" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold">Bio-Ressonância H₂O</text>
      <text x="30" y="288" fill="#9ca3af" font-family="sans-serif" font-size="13">Clusters hexagonais de absorção rápida</text>
      <text x="30" y="335" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold">3X ABSORÇÃO CELULAR</text>
    </g>
  </g>

  <!-- SECTION 3: WATER PURITY TELEMETRY -->
  <g transform="translate(60, 1530)">
    <rect width="1160" height="420" rx="32" fill="rgba(8,16,26,0.9)" stroke="rgba(255,255,255,0.1)"/>
    
    <text x="60" y="70" fill="#67e8f9" font-family="monospace" font-size="12" letter-spacing="3">TELEMETRIA HIDROLÓGICA</text>
    <text x="60" y="115" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="700">Índices de Pureza &amp; Estabilidade</text>

    <!-- 4 Stats Boxes -->
    <g transform="translate(60, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#06b6d4" font-family="sans-serif" font-size="38" font-weight="bold">99.9%</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Grau de Pureza</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Zero contaminantes e microplásticos</text>
    </g>

    <g transform="translate(330, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#67e8f9" font-family="sans-serif" font-size="38" font-weight="bold">8.5</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">pH Alcalino Estável</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Neutralização de acidez sistêmica</text>
    </g>

    <g transform="translate(600, 160)">
      <rect width="240" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#38bdf8" font-family="sans-serif" font-size="38" font-weight="bold">18mg</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">TDS Otimizado</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Sabor ultraleve e mineralizado</text>
    </g>

    <g transform="translate(870, 160)">
      <rect width="230" height="190" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"/>
      <text x="30" y="65" fill="#06b6d4" font-family="sans-serif" font-size="38" font-weight="bold">300m</text>
      <text x="30" y="105" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">Pressão Sub-Aquática</text>
      <text x="30" y="135" fill="#9ca3af" font-family="sans-serif" font-size="11">Resistência extrema testada</text>
    </g>
  </g>

  <!-- SECTION 4: FOOTER -->
  <g transform="translate(60, 2010)">
    <rect width="1160" height="420" rx="32" fill="rgba(6,16,26,0.95)" stroke="rgba(6,182,212,0.4)"/>
    
    <text x="580" y="130" fill="#ffffff" font-family="sans-serif" font-size="36" font-weight="bold" text-anchor="middle">Experimente a Nova Era da Hidratação</text>
    <text x="580" y="175" fill="#9ca3af" font-family="sans-serif" font-size="15" text-anchor="middle">Sistemas de purificação residencial, esportiva e expedições oceânicas.</text>

    <rect x="410" y="220" width="340" height="60" rx="30" fill="url(#alCyan)" filter="url(#alGlow)"/>
    <text x="580" y="257" fill="#000000" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="1.5" text-anchor="middle">ADQUIRIR SISTEMA NANO-01</text>

    <text x="580" y="340" fill="#6b7280" font-family="monospace" font-size="11" letter-spacing="3" text-anchor="middle">© 2026 ALODHX HYDRATION LABS • BIO-PURITY TECH</text>
  </g>
</svg>
`;

fs.writeFileSync(`${TMP_DIR}/ophidia_board.svg`, ophidiaSvg);
fs.writeFileSync(`${TMP_DIR}/atom_board.svg`, atomSvg);
fs.writeFileSync(`${TMP_DIR}/alodhx_board.svg`, alodhxSvg);

console.log('SVGs created successfully.');
