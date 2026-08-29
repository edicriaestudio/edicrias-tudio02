/**
 * Lightweight dynamic chunk prefetch helper.
 * Initiates the download of heavy component bundles on idle or user hover/touch,
 * ensuring 0ms perceptible latency when modals are opened.
 */
export const prefetchModal = (
  modal: 'contact' | 'portfolio' | 'packs' | 'blog' | 'legal'
) => {
  try {
    switch (modal) {
      case 'contact':
        import('../ContactModal');
        break;
      case 'portfolio':
        import('../PortfolioModal');
        break;
      case 'packs':
        import('../components/PacksModal');
        break;
      case 'blog':
        import('../components/BlogModal');
        break;
      case 'legal':
        import('../components/LegalModal');
        break;
    }
  } catch {
    // Ignore prefetch failures in background
  }
};
