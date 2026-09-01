/**
 * Edcria Studio - Camada de Mensuração & Rastreamento Seguro de Eventos
 *
 * Diretrizes:
 * - Totalmente assíncrono e não-bloqueante
 * - NENHUM dado pessoal sensível (nome, e-mail, telefone, mensagens livres) é enviado
 * - Preserva UTMs e parâmetros de campanha entre sessões
 * - Compatível com Google Analytics 4 (dataLayer / gtag), Meta Pixel (fbq) e Custom Events
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
  first_touch_timestamp?: string;
}

const UTM_STORAGE_KEY = 'edcria_utm_attribution';

/**
 * Inicializa a captura de parâmetros UTM na primeira interação e salva na sessão.
 */
export function initAnalytics(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const existing = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utms: UtmParams = {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      referrer: document.referrer || undefined,
      landing_path: window.location.pathname + window.location.hash,
      first_touch_timestamp: new Date().toISOString(),
    };

    // Remove undefined values
    const cleanedUtms = Object.fromEntries(
      Object.entries(utms).filter(([, v]) => v !== undefined)
    ) as UtmParams;

    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(cleanedUtms));
    return cleanedUtms;
  } catch {
    return {};
  }
}

/**
 * Recupera os UTMs armazenados para envio com o lead de diagnóstico.
 */
export function getStoredUtms(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : initAnalytics();
  } catch {
    return {};
  }
}

/**
 * Disparador de eventos anônimos e padronizados
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    const safeParams = {
      ...params,
      page_path: window.location.pathname,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    // 1. Despacho de Custom Event para extensões ou ouvintes na aplicação
    const customEvent = new CustomEvent('edcria_analytics', {
      detail: { event: eventName, ...safeParams },
    });
    window.dispatchEvent(customEvent);

    // 2. Google Tag Manager / GA4 dataLayer
    const win = window as any;
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: eventName,
        ...safeParams,
      });
    } else if (typeof win.gtag === 'function') {
      win.gtag('event', eventName, safeParams);
    }

    // 3. Meta Pixel (fbq) se presente
    if (typeof win.fbq === 'function') {
      win.fbq('trackCustom', eventName, safeParams);
    }
  } catch {
    // Fail silently para não interromper a navegação do usuário
  }
}

// Helpers tipados para eventos do funil da Edcria Studio

export function trackViewService(serviceType: string, ctaLocation = 'body') {
  trackEvent('view_service', { service_type: serviceType, source_location: ctaLocation });
}

export function trackViewProduct(productId: string, category: string) {
  trackEvent('view_product', { product_id: productId, product_category: category });
}

export function trackClickPrimaryCta(ctaLocation: string, label = 'SOLICITAR DIAGNÓSTICO') {
  trackEvent('click_primary_cta', { cta_location: ctaLocation, cta_label: label });
}

export function trackClickTemplatesCta(ctaLocation: string, label = 'EXPLORAR TEMPLATES') {
  trackEvent('click_templates_cta', { cta_location: ctaLocation, cta_label: label });
}

export function trackStartDiagnosis(sourceLocation: string) {
  trackEvent('start_diagnosis', { source_location: sourceLocation });
}

export function trackSubmitLead(leadType: string, sourceLocation: string, goal?: string) {
  trackEvent('submit_lead', {
    lead_type: leadType,
    source_location: sourceLocation,
    project_goal: goal,
  });
}

export function trackScheduleCall(sourceLocation: string, scheduledDate?: string) {
  trackEvent('schedule_call', {
    source_location: sourceLocation,
    scheduled_slot: scheduledDate,
  });
}

export function trackContactWhatsapp(sourceLocation: string) {
  trackEvent('contact_whatsapp', { source_location: sourceLocation });
}

export function trackBeginCheckout(productId: string, category: string, price: number) {
  trackEvent('begin_checkout', {
    product_id: productId,
    product_category: category,
    value: price,
    currency: 'BRL',
  });
}

export function trackPurchase(productId: string, category: string, value: number) {
  trackEvent('purchase', {
    product_id: productId,
    product_category: category,
    value,
    currency: 'BRL',
  });
}

export function trackVideoStart(videoId: string, contentType = 'template_preview') {
  trackEvent('video_start', { video_id: videoId, content_type: contentType });
}

export function trackVideoProgress(videoId: string, progress: number, contentType = 'template_preview') {
  trackEvent('video_progress', {
    video_id: videoId,
    progress_percent: progress,
    content_type: contentType,
  });
}
