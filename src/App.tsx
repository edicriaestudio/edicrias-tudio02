import { useState, lazy, Suspense } from 'react';
import ScrollVideo from './ScrollVideo';
import Navbar from './Navbar';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import PhilosophySection from './components/PhilosophySection';
import StickyProtocolStack from './components/StickyProtocolStack';
import Footer from './components/Footer';
import ModalLoadingFallback from './components/ModalLoadingFallback';
import type { LegalTab } from './components/LegalModal';

// Dynamically chunked heavy modals for optimal mobile first load and 0ms idle overhead
const ContactModal = lazy(() => import('./ContactModal'));
const PortfolioModal = lazy(() => import('./PortfolioModal'));
const PacksModal = lazy(() => import('./components/PacksModal'));
const BlogModal = lazy(() => import('./components/BlogModal'));
const LegalModal = lazy(() => import('./components/LegalModal'));

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
      {/* Ambient Static Glows (Hardware-Accelerated CSS with 0 scroll CPU overhead) */}
      <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
        <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] transform-gpu pointer-events-none" />
        <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] rounded-full bg-teal-400/8 blur-[140px] transform-gpu pointer-events-none" />
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

      {/* Interactive Modals (Loaded on-demand with Suspense & zero initial JS overhead) */}
      {contactOpen && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO TERMINAL VIP..."
              onClose={handleCloseContact}
            />
          }
        >
          <ContactModal
            key={selectedTemplateName || 'general-contact'}
            isOpen={contactOpen}
            onClose={handleCloseContact}
            initialTemplate={selectedTemplateName}
          />
        </Suspense>
      )}

      {portfolioOpen && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO ACERVO FIGMA 4K..."
              onClose={handleClosePortfolio}
            />
          }
        >
          <PortfolioModal
            isOpen={portfolioOpen}
            onClose={handleClosePortfolio}
            onSelectProjectForSite={(name) => handleOpenContact(name)}
          />
        </Suspense>
      )}

      {packsOpen && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO PACKS & COMBOS..."
              onClose={handleClosePacks}
            />
          }
        >
          <PacksModal
            isOpen={packsOpen}
            onClose={handleClosePacks}
          />
        </Suspense>
      )}

      {blogOpen && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO ARTIGOS & TECH BLOG..."
              onClose={handleCloseBlog}
            />
          }
        >
          <BlogModal
            isOpen={blogOpen}
            onClose={handleCloseBlog}
            onOpenPortfolio={handleOpenPortfolio}
            onOpenContact={() => handleOpenContact()}
            onOpenPacks={handleOpenPacks}
          />
        </Suspense>
      )}

      {legalOpen && (
        <Suspense
          fallback={
            <ModalLoadingFallback
              message="CARREGANDO TERMOS LGPD..."
              onClose={handleCloseLegal}
            />
          }
        >
          <LegalModal
            isOpen={legalOpen}
            onClose={handleCloseLegal}
            initialTab={legalTab}
          />
        </Suspense>
      )}
    </div>
  );
}
