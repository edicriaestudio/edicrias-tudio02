import { useState } from 'react';
import ScrollVideo from './ScrollVideo';
import Navbar from './Navbar';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import PhilosophySection from './components/PhilosophySection';
import StickyProtocolStack from './components/StickyProtocolStack';
import Footer from './components/Footer';
import ContactModal from './ContactModal';
import PortfolioModal from './PortfolioModal';
import LegalModal, { LegalTab } from './components/LegalModal';
import BlogModal from './components/BlogModal';
import PacksModal from './components/PacksModal';
import { ParallaxScrollProgress, ParallaxFloatingOrb } from './components/ParallaxElements';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [packsOpen, setPacksOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | undefined>(undefined);

  const handleOpenContact = (templateName?: string) => {
    setSelectedTemplateName(templateName);
    setContactOpen(true);
  };
  const handleCloseContact = () => {
    setContactOpen(false);
    setSelectedTemplateName(undefined);
  };

  const handleOpenPortfolio = () => setPortfolioOpen(true);
  const handleClosePortfolio = () => setPortfolioOpen(false);

  const handleOpenBlog = () => setBlogOpen(true);
  const handleCloseBlog = () => setBlogOpen(false);

  const handleOpenPacks = () => setPacksOpen(true);
  const handleClosePacks = () => setPacksOpen(false);

  const handleOpenLegal = (tab: LegalTab = 'privacy') => {
    setLegalTab(tab);
    setLegalOpen(true);
  };
  const handleCloseLegal = () => setLegalOpen(false);

  return (
    <div id="top" className="relative bg-[#080808] text-white selection:bg-white/20 selection:text-white overflow-x-hidden">
      {/* Top Parallax Progress Engine */}
      <ParallaxScrollProgress />

      {/* Ambient Parallax Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <ParallaxFloatingOrb size={500} top="15%" left="5%" color="cyan" speed={0.25} blur={160} opacity={0.12} />
        <ParallaxFloatingOrb size={600} top="50%" left="75%" color="teal" speed={0.35} blur={180} opacity={0.09} />
        <ParallaxFloatingOrb size={550} top="80%" left="15%" color="cyan" speed={0.3} blur={170} opacity={0.1} />
      </div>

      {/* Full-bleed scroll-scrubbed video canvas engine */}
      <ScrollVideo />

      {/* Content layer */}
      <div className="relative z-10">
        <Navbar
          onOpenContact={() => handleOpenContact()}
          onOpenPortfolio={handleOpenPortfolio}
          onOpenPacks={handleOpenPacks}
          onOpenBlog={handleOpenBlog}
        />

        <main>
          {/* Section 1: Hero + Live Telemetry + Diagnostic Shuffler */}
          <SectionOne
            onOpenContact={() => handleOpenContact()}
            onOpenPortfolio={handleOpenPortfolio}
          />

          {/* Manifesto: Contrast Philosophy Section */}
          <PhilosophySection onOpenContact={() => handleOpenContact()} />

          {/* Sticky Pillars Stack */}
          <StickyProtocolStack
            onOpenContact={() => handleOpenContact()}
            onOpenPortfolio={handleOpenPortfolio}
          />

          {/* Spacer room for scroll video scrub */}
          <div className="h-[40vh]" aria-hidden="true" />

          {/* Section 2: Methodology + Interactive Scope Estimator & Protocol Scheduler */}
          <SectionTwo
            onOpenContact={() => handleOpenContact()}
            onOpenPortfolio={handleOpenPortfolio}
          />

          {/* Studio Footer (With Direct Links to Legal LGPD, Packs, Blog, Portfolio) */}
          <Footer
            onOpenContact={() => handleOpenContact()}
            onOpenPortfolio={handleOpenPortfolio}
            onOpenPacks={handleOpenPacks}
            onOpenBlog={handleOpenBlog}
            onOpenLegal={handleOpenLegal}
          />
        </main>
      </div>

      {/* Interactive Modals */}
      <ContactModal
        key={selectedTemplateName || 'general-contact'}
        isOpen={contactOpen}
        onClose={handleCloseContact}
        initialTemplate={selectedTemplateName}
      />

      <PortfolioModal
        isOpen={portfolioOpen}
        onClose={handleClosePortfolio}
        onSelectProjectForSite={(name) => handleOpenContact(name)}
      />

      <PacksModal
        isOpen={packsOpen}
        onClose={handleClosePacks}
      />

      <BlogModal
        isOpen={blogOpen}
        onClose={handleCloseBlog}
        onOpenPortfolio={handleOpenPortfolio}
        onOpenContact={() => handleOpenContact()}
        onOpenPacks={handleOpenPacks}
      />

      <LegalModal
        isOpen={legalOpen}
        onClose={handleCloseLegal}
        initialTab={legalTab}
      />
    </div>
  );
}
