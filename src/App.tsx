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

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
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

  return (
    <div id="top" className="relative bg-[#080808] text-white selection:bg-white/20 selection:text-white">
      {/* Full-bleed scroll-scrubbed video canvas engine */}
      <ScrollVideo />

      {/* Content layer */}
      <div className="relative z-10">
        <Navbar
          onOpenContact={() => handleOpenContact()}
          onOpenPortfolio={handleOpenPortfolio}
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
          <StickyProtocolStack />

          {/* Spacer room for scroll video scrub */}
          <div className="h-[40vh]" aria-hidden="true" />

          {/* Section 2: Methodology + Protocol Scheduler */}
          <SectionTwo
            onOpenContact={() => handleOpenContact()}
            onOpenPortfolio={handleOpenPortfolio}
          />

          {/* Studio Footer (Clean, without pricing cards) */}
          <Footer
            onOpenContact={() => handleOpenContact()}
            onOpenPortfolio={handleOpenPortfolio}
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
    </div>
  );
}
