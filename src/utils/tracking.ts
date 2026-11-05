export type TrackingEventName =
  | 'page_view'
  | 'click_whatsapp'
  | 'click_cta_hero'
  | 'click_plan'
  | 'view_pricing'
  | 'generate_lead';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
const GTM_ID = (import.meta.env.VITE_GTM_ID || '').trim();
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID || '').trim();
const GOOGLE_ADS_ID = (import.meta.env.VITE_GOOGLE_ADS_ID || '').trim();

let initialized = false;

function injectScript(src: string, async = true): void {
  if (typeof document === 'undefined') return;
  const script = document.createElement('script');
  script.src = src;
  script.async = async;
  document.head.appendChild(script);
}

/**
 * Inicializa scripts de tracking apenas quando os respectivos IDs
 * estiverem configurados nas variáveis de ambiente VITE_*.
 */
export function initTracking(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`);
  }

  const primaryGtagId = GA_ID || GOOGLE_ADS_ID;
  if (primaryGtagId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    if (GA_ID) {
      window.gtag('config', GA_ID);
    }
    if (GOOGLE_ADS_ID) {
      window.gtag('config', GOOGLE_ADS_ID);
    }
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(primaryGtagId)}`);
  }

  if (META_PIXEL_ID) {
    const fbq = function (...args: unknown[]) {
      (fbq as unknown as { queue: unknown[][] }).queue.push(args);
    };
    (fbq as unknown as { queue: unknown[][] }).queue = [];
    (fbq as unknown as { loaded: boolean }).loaded = true;
    (fbq as unknown as { version: string }).version = '2.0';
    window.fbq = fbq;
    injectScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

/**
 * Dispara eventos de conversão preparados sem gerar chamadas quebradas
 * caso nenhum provedor esteja configurado.
 */
export function trackEvent(
  eventName: TrackingEventName,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, params || {});
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...(params || {}) });
  }

  if (window.fbq) {
    if (eventName === 'page_view') {
      window.fbq('track', 'PageView');
    } else if (eventName === 'generate_lead') {
      window.fbq('track', 'Lead', params || {});
    } else {
      window.fbq('trackCustom', eventName, params || {});
    }
  }
}

export function getWhatsAppUrl(message: string): string {
  const phone = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
