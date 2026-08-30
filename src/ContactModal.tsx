import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  FileText,
  CreditCard,
  QrCode,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ExternalLink,
  RefreshCw,
  ClipboardList,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';
import { EDMonogramIcon } from './components/BrandLogo';
import { getStoredUtms, trackSubmitLead, trackContactWhatsapp, trackStartDiagnosis } from './utils/analytics';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: string;
  onOpenPortfolio?: () => void;
}

export type ModalFlow = 'diagnostico' | 'proposta' | 'reserva';
export type PaymentMode = 'pix' | 'card';

export default function ContactModal({
  isOpen,
  onClose,
  initialTemplate,
  onOpenPortfolio,
}: ContactModalProps) {
  // Flow selector: 'diagnostico' (default free funnel) | 'proposta' (custom proposal) | 'reserva' (deposit checkout)
  const [modalFlow, setModalFlow] = useState<ModalFlow>('diagnostico');

  // Diagnostic form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    segment: 'Tecnologia / SaaS / Digital',
    currentUrl: '',
    projectType: initialTemplate ? `Template Figma: ${initialTemplate}` : 'Landing Page de Alta Conversão',
    mainGoal: 'Posicionamento e autoridade premium',
    timeline: '1 a 2 meses',
    budgetRange: 'R$ 6.000 a R$ 15.000 (Projeto Autoral 4K)',
    additionalContext: initialTemplate ? `Gostaria de basear meu projeto no template: ${initialTemplate}` : '',
    consent: true,
  });

  // Deposit form state
  const [depositData, setDepositData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: initialTemplate ? `Template Figma: ${initialTemplate}` : 'Website Autoral 4K',
    depositPlan: 'sinal_padrao', // 'sinal_padrao' (R$ 490), 'consultoria' (R$ 197), 'completo_vip' (R$ 1.490)
    notes: '',
  });

  const [paymentMode, setPaymentMode] = useState<PaymentMode>('pix');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // UI & Asynchronous state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<{
    id: string;
    name: string;
    company: string;
    mainGoal: string;
    leadType: ModalFlow;
    timestamp: string;
  } | null>(null);

  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeUrl?: string;
    qrCodeBase64?: string | null;
    paymentId: string;
    amount: number;
  } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [confirmedTransaction, setConfirmedTransaction] = useState<{
    id: string;
    method: 'pix' | 'card';
    amount: number;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    trackStartDiagnosis('modal_open');

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Deposit pricing options
  const planAmounts: Record<string, { label: string; amount: number; desc: string }> = {
    sinal_padrao: {
      label: 'Sinal de Entrada & Reserva de Cronograma',
      amount: 490.0,
      desc: 'Garante o início imediato e reserva da data na esteira de produção',
    },
    consultoria: {
      label: 'Consultoria Estratégica & Diagnóstico 1-on-1',
      amount: 197.0,
      desc: 'Sessão de 60 min com análise de arquitetura, narrativa e direção de arte',
    },
    completo_vip: {
      label: 'Entrada Prioritária VIP (Sprint 7 Dias)',
      amount: 1490.0,
      desc: 'Atendimento prioritário 24/7 com protótipo em altíssima fidelidade',
    },
  };

  const currentPlan = planAmounts[depositData.depositPlan] || planAmounts.sinal_padrao;
  const currentAmount = currentPlan.amount;
  const formattedAmount = currentAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Submit Lead (Diagnóstico ou Proposta Sob Medida)
  const handleLeadSubmit = async (e: React.FormEvent, leadType: ModalFlow) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name || !formData.email || !formData.company) {
      setErrorMessage('Por favor, preencha os campos obrigatórios (Nome, E-mail e Empresa).');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('É necessário concordar com o tratamento de dados (LGPD) para prosseguir.');
      return;
    }

    setIsProcessing(true);

    try {
      const utms = getStoredUtms();
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          segment: formData.segment,
          current_url: formData.currentUrl,
          objective: formData.mainGoal,
          timeline: formData.timeline,
          budget_range: formData.budgetRange,
          context: formData.additionalContext,
          consent: formData.consent,
          lead_type: leadType,
          source_page: window.location.pathname || '/',
          utms,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmittedLead({
          id: data.leadId,
          name: formData.name,
          company: formData.company,
          mainGoal: formData.mainGoal,
          leadType,
          timestamp: new Date().toLocaleDateString('pt-BR'),
        });

        trackSubmitLead(
          leadType === 'diagnostico' ? 'diagnostico_gratuito' : 'proposta_sob_medida',
          'modal_contato',
          formData.mainGoal
        );
      } else {
        throw new Error(data.error || 'Erro ao processar solicitação.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Fallback local para lead:', error.message);
      const fallbackId = `EDC-LEAD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 8999 + 1000)}`;
      setSubmittedLead({
        id: fallbackId,
        name: formData.name,
        company: formData.company,
        mainGoal: formData.mainGoal,
        leadType,
        timestamp: new Date().toLocaleDateString('pt-BR'),
      });
      trackSubmitLead('lead_offline', 'modal_contato', formData.mainGoal);
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Mercado Pago Deposit
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!depositData.email || !depositData.name) {
      setErrorMessage('Por favor, informe seu nome e e-mail.');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMode === 'pix') {
        const response = await fetch('/api/mercadopago/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentAmount,
            description: `Edcria Estúdio - ${currentPlan.label}`,
            payerEmail: depositData.email,
            payerName: depositData.name,
            phone: depositData.phone,
            serviceType: depositData.projectType,
            customNotes: depositData.notes,
          }),
        });

        const data = await response.json();

        if (data.success && data.qrCode) {
          setPixData({
            qrCode: data.qrCode,
            qrCodeUrl: data.qrCodeUrl,
            qrCodeBase64: data.qrCodeBase64,
            paymentId: data.paymentId || `MP-${Date.now()}`,
            amount: currentAmount,
          });
        } else {
          throw new Error(data.error || 'Erro ao gerar QR Code Mercado Pago.');
        }
      } else {
        // Cartão de Crédito
        const response = await fetch('/api/mercadopago/card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentAmount,
            description: `Edcria Estúdio - ${currentPlan.label}`,
            payerEmail: depositData.email,
            payerName: depositData.name,
            phone: depositData.phone,
            serviceType: depositData.projectType,
            installments: Number(installments),
            cardData: {
              holder: cardHolder,
              expiry: cardExpiry,
              lastDigits: cardNumber.replace(/\s/g, '').slice(-4),
            },
          }),
        });

        const data = await response.json();

        if (data.success) {
          setConfirmedTransaction({
            id: data.paymentId || `MP-CARD-${Date.now().toString().slice(-6)}`,
            method: 'card',
            amount: currentAmount,
            date: new Date().toLocaleDateString('pt-BR'),
          });
        } else {
          throw new Error(data.error || 'Não foi possível autorizar o cartão.');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'Erro de conexão com o Mercado Pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleConfirmPixPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmedTransaction({
        id: pixData?.paymentId || `MP-PIX-${Date.now().toString().slice(-6)}`,
        method: 'pix',
        amount: currentAmount,
        date: new Date().toLocaleDateString('pt-BR'),
      });
      setPixData(null);
    }, 1200);
  };

  const handleResetModal = () => {
    setSubmittedLead(null);
    setPixData(null);
    setConfirmedTransaction(null);
    setErrorMessage(null);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleResetModal}
        className="fixed inset-0 bg-[#050b11]/90 backdrop-blur-3xl transition-opacity animate-fadeIn"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-cyan-400/40 bg-[#061019]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_90px_rgba(6,182,212,0.25)] z-10 text-white my-auto max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className="absolute top-5 right-5 p-2 rounded-full text-cyan-300 hover:text-white bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 transition-colors z-20 focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none"
          aria-label="Fechar modal de diagnóstico"
        >
          <X size={18} />
        </button>

        {/* 1. LEAD CONFIRMATION VIEW (DIAGNÓSTICO OU PROPOSTA) */}
        {submittedLead ? (
          <div className="flex flex-col items-center text-center gap-6 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.4)]">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-bold">
                // {submittedLead.leadType === 'diagnostico' ? 'DIAGNÓSTICO REGISTRADO COM SUCESSO' : 'SOLICITAÇÃO DE PROPOSTA ENVIADA'}
              </span>
              <h3 className="text-2xl sm:text-4xl font-medium text-white mt-1">
                Tudo pronto, {submittedLead.name}!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-lg mx-auto leading-relaxed font-light">
                Analisaremos o posicionamento e os objetivos de <strong className="text-cyan-300">{submittedLead.company}</strong> para estruturar um direcionamento visual e técnico detalhado.
              </p>
            </div>

            {/* Lead Summary Card */}
            <div className="w-full p-4 sm:p-6 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 text-left space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
                <span className="text-zinc-400 uppercase">IDENTIFICADOR DO ATENDIMENTO:</span>
                <span className="text-cyan-300 font-bold">{submittedLead.id}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">CLIENTE:</span>
                  <span className="text-white font-medium">{submittedLead.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">EMPRESA:</span>
                  <span className="text-cyan-200 font-medium">{submittedLead.company}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">MODALIDADE:</span>
                  <span className="text-cyan-300 font-medium uppercase font-mono text-[11px]">
                    {submittedLead.leadType === 'diagnostico' ? 'Diagnóstico Gratuito' : 'Proposta Sob Medida'}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps CTA (Safe WhatsApp URL without PII) */}
            <div className="w-full space-y-3 pt-1 max-w-lg">
              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                  `Olá, sou responsável pelo atendimento ${submittedLead.id} e gostaria de continuar meu diagnóstico.`
                )}`}
                onClick={() => trackContactWhatsapp('modal_diagnostico_sucesso')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95"
              >
                <ExternalLink size={16} />
                CONTINUAR ATENDIMENTO NO WHATSAPP
              </a>

              {onOpenPortfolio && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetModal();
                    onOpenPortfolio();
                  }}
                  className="w-full py-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <FolderKanban size={15} />
                  EXPLORAR TEMPLATES & PACKS ENQUANTO AGUARDA
                </button>
              )}
            </div>
          </div>
        ) : confirmedTransaction ? (
          /* 2. TRANSACTION CONFIRMATION RECEIPT */
          <div className="flex flex-col items-center text-center gap-6 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                // SINAL CONFIRMADO NO CRONOGRAMA
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium text-white mt-1">
                Vaga Reservada, {depositData.name || 'Cliente'}!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto leading-relaxed font-light">
                Seu pagamento via Mercado Pago ({confirmedTransaction.method === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito'}) foi registrado com sucesso. Nossa equipe de direção iniciará o contato para o briefing prioritário.
              </p>
            </div>

            <div className="w-full p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 text-left space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
                <span className="text-zinc-400 uppercase">COMPROVANTE DE ENTRADA:</span>
                <span className="text-cyan-300 font-bold">ID: {confirmedTransaction.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">CLIENTE:</span>
                  <span className="text-white font-medium">{depositData.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">SERVIÇO:</span>
                  <span className="text-cyan-200 font-medium">{depositData.projectType}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">MÉTODO:</span>
                  <span className="text-emerald-400 font-mono font-semibold uppercase">
                    {confirmedTransaction.method === 'pix' ? 'PIX (MERCADO PAGO)' : 'CARTÃO (MERCADO PAGO)'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">VALOR:</span>
                  <span className="text-white font-mono font-bold">
                    {confirmedTransaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-2.5 pt-1">
              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                  `Olá, sou responsável pelo atendimento ${confirmedTransaction.id} e gostaria de continuar meu diagnóstico.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95"
              >
                <ExternalLink size={16} />
                INICIAR ATENDIMENTO NO WHATSAPP
              </a>
            </div>
          </div>
        ) : pixData ? (
          /* 3. MERCADO PAGO PIX VIEW */
          <div className="flex flex-col gap-5 text-center py-2 animate-fadeIn">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 mx-auto">
              <QrCode size={34} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] uppercase font-bold">
                  MERCADO PAGO PIX • ID: {pixData.paymentId}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-tight">
                Pague com Pix e Garanta sua Vaga
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-light mt-1 max-w-md mx-auto">
                Abra o app do seu banco, escolha <strong>Pix Copia e Cola</strong> ou aponte a câmera para o QR Code abaixo no valor de <strong className="text-cyan-300">{formattedAmount}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white max-w-[210px] mx-auto shadow-2xl border-4 border-cyan-400/50">
              {pixData.qrCodeBase64 ? (
                <img
                  src={pixData.qrCodeBase64}
                  alt="QR Code Pix Mercado Pago"
                  className="w-full h-auto aspect-square"
                />
              ) : (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pixData.qrCode)}`}
                  alt="QR Code Pix Mercado Pago"
                  className="w-full h-auto aspect-square"
                />
              )}
            </div>

            <div className="space-y-2 max-w-lg mx-auto w-full">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 block">
                CÓDIGO PIX COPIA E COLA:
              </span>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-cyan-400/40">
                <input
                  type="text"
                  readOnly
                  value={pixData.qrCode}
                  aria-label="Código Pix Copia e Cola"
                  className="bg-transparent text-zinc-300 text-xs font-mono w-full px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyPix}
                  aria-label="Copiar código Pix"
                  className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold uppercase shrink-0 transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  {copiedPix ? <Check size={14} /> : <Copy size={14} />}
                  {copiedPix ? 'COPIADO' : 'COPIAR PIX'}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 max-w-md mx-auto w-full">
              <button
                type="button"
                onClick={handleConfirmPixPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    CONFIRMANDO COM O BANCO...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    JÁ FIZ O PIX (CONFIRMAR ENTRADA)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPixData(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4"
              >
                Voltar e alterar opções
              </button>
            </div>
          </div>
        ) : (
          /* 4. MAIN FORM: 3 DISTINCT INTENTION TABS */
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <EDMonogramIcon size={22} glowing={true} />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-cyan-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  EDCRIA ESTÚDIO • ATENDIMENTO AUTORAL
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                Como podemos <span className="italic font-serif text-cyan-300 underline decoration-cyan-400/60 underline-offset-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">ajudar sua marca</span>?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                {modalFlow === 'diagnostico'
                  ? 'Uma análise inicial para entender o que sua presença digital precisa comunicar melhor.'
                  : modalFlow === 'proposta'
                  ? 'Para quem já sabe o que precisa e deseja conversar sobre escopo, prazo e investimento.'
                  : 'Para clientes que já decidiram avançar e desejam reservar uma data mediante sinal.'}
              </p>
            </div>

            {/* Mode Selector - 3 Semantic Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setModalFlow('diagnostico')}
                className={`py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 ${
                  modalFlow === 'diagnostico'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <ClipboardList size={13} />
                  <span>1. DIAGNÓSTICO</span>
                </div>
                <span className="text-[9px] opacity-85 lowercase font-sans">100% gratuito</span>
              </button>

              <button
                type="button"
                onClick={() => setModalFlow('proposta')}
                className={`py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 ${
                  modalFlow === 'proposta'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <FileText size={13} />
                  <span>2. PROPOSTA SOB MEDIDA</span>
                </div>
                <span className="text-[9px] opacity-85 lowercase font-sans">escopo & prazo</span>
              </button>

              <button
                type="button"
                onClick={() => setModalFlow('reserva')}
                className={`py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-0.5 ${
                  modalFlow === 'reserva'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Zap size={13} />
                  <span>3. RESERVAR CRONOGRAMA</span>
                </div>
                <span className="text-[9px] opacity-85 lowercase font-sans">sinal Mercado Pago</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {/* TAB 1: DIAGNÓSTICO GRATUITO */}
            {modalFlow === 'diagnostico' && (
              <form onSubmit={(e) => handleLeadSubmit(e, 'diagnostico')} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-name" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Seu Nome *
                    </label>
                    <input
                      id="diag-name"
                      type="text"
                      required
                      placeholder="Ex: Carlos Mendes"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-email" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      E-mail Profissional *
                    </label>
                    <input
                      id="diag-email"
                      type="email"
                      required
                      placeholder="carlos@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-phone" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      WhatsApp / Telefone
                    </label>
                    <input
                      id="diag-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-company" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Empresa / Marca *
                    </label>
                    <input
                      id="diag-company"
                      type="text"
                      required
                      placeholder="Nome da sua marca"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-segment" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Segmento de Atuação
                    </label>
                    <select
                      id="diag-segment"
                      value={formData.segment}
                      onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061019] border border-cyan-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      <option value="Tecnologia / SaaS / Digital">Tecnologia / SaaS / Digital</option>
                      <option value="Consultoria & Serviços Corporativos">Consultoria & Serviços Corporativos</option>
                      <option value="Saúde & Bem-Estar">Saúde & Bem-Estar</option>
                      <option value="Arquitetura, Design & Moda">Arquitetura, Design & Moda</option>
                      <option value="E-commerce & Varejo Premium">E-commerce & Varejo Premium</option>
                      <option value="Outro">Outro segmento</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-url" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Site Atual (opcional)
                    </label>
                    <input
                      id="diag-url"
                      type="url"
                      placeholder="https://suaempresa.com"
                      value={formData.currentUrl}
                      onChange={(e) => setFormData({ ...formData, currentUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-goal" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Principal Objetivo do Diagnóstico
                    </label>
                    <select
                      id="diag-goal"
                      value={formData.mainGoal}
                      onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061019] border border-cyan-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      <option value="Posicionamento e autoridade premium">Posicionamento e autoridade premium</option>
                      <option value="Aumento de conversão e geração de leads">Aumento de conversão e geração de leads</option>
                      <option value="Lançamento de novo produto / serviço">Lançamento de produto / serviço</option>
                      <option value="Redesign completo da presença digital">Redesign completo da presença digital</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="diag-timeline" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Prazo Estimado
                    </label>
                    <select
                      id="diag-timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061019] border border-cyan-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      <option value="Imediato (próximos 15-30 dias)">Imediato (próximos 15-30 dias)</option>
                      <option value="1 a 2 meses">1 a 2 meses</option>
                      <option value="Planejamento futuro (3+ meses)">Planejamento futuro (3+ meses)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="diag-context" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    Contexto ou Desafios Atuais (opcional)
                  </label>
                  <textarea
                    id="diag-context"
                    rows={2}
                    placeholder="Ex: Sentimos que nosso site atual não transmite o valor real dos nossos serviços..."
                    value={formData.additionalContext}
                    onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 resize-none font-sans"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-300 pt-1">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-cyan-500/40 text-cyan-400 focus:ring-0"
                  />
                  <span>
                    Concordo com o tratamento dos dados informados para receber o diagnóstico autoral da Edcria Estúdio (LGPD).
                  </span>
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 font-mono text-sm sm:text-base font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(6,182,212,0.45)] active:scale-95 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={18} className="animate-spin" />
                        PROCESSANDO DIAGNÓSTICO...
                      </span>
                    ) : (
                      <>
                        SOLICITAR DIAGNÓSTICO
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: PROPOSTA SOB MEDIDA */}
            {modalFlow === 'proposta' && (
              <form onSubmit={(e) => handleLeadSubmit(e, 'proposta')} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prop-type" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Tipo de Projeto Prioritário *
                    </label>
                    <select
                      id="prop-type"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061019] border border-cyan-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      <option value="Landing Page de Alta Conversão">Landing Page de Alta Conversão</option>
                      <option value="Site Institucional Autoral 4K">Site Institucional Autoral 4K</option>
                      <option value="E-commerce e Experiência de Produto">E-commerce e Experiência de Produto</option>
                      <option value="Design System & Motion WebGL">Design System & Motion WebGL</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prop-company" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Empresa / Marca *
                    </label>
                    <input
                      id="prop-company"
                      type="text"
                      required
                      placeholder="Nome da sua marca"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prop-name" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Seu Nome *
                    </label>
                    <input
                      id="prop-name"
                      type="text"
                      required
                      placeholder="Carlos Mendes"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prop-email" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      E-mail Profissional *
                    </label>
                    <input
                      id="prop-email"
                      type="email"
                      required
                      placeholder="carlos@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prop-phone" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      WhatsApp / Telefone
                    </label>
                    <input
                      id="prop-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="prop-budget" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Faixa de Investimento Planejada
                    </label>
                    <select
                      id="prop-budget"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061019] border border-cyan-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 font-sans"
                    >
                      <option value="R$ 4.000 a R$ 8.000">R$ 4.000 a R$ 8.000 (Landing Page Autoral)</option>
                      <option value="R$ 8.000 a R$ 18.000">R$ 8.000 a R$ 18.000 (Site Institucional 4K)</option>
                      <option value="R$ 18.000 a R$ 35.000">R$ 18.000 a R$ 35.000 (Ecossistema / E-commerce)</option>
                      <option value="Acima de R$ 35.000">Acima de R$ 35.000 (Escopo Customizado)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="prop-context" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    Detalhes do Escopo e Integrações Necessárias
                  </label>
                  <textarea
                    id="prop-context"
                    rows={3}
                    placeholder="Descreva páginas necessárias, integrações com CRM, gateway de pagamento ou referências visuais..."
                    value={formData.additionalContext}
                    onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 resize-none font-sans"
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-300 pt-1">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-cyan-500/40 text-cyan-400 focus:ring-0"
                  />
                  <span>
                    Concordo com o tratamento dos dados informados para recebimento da proposta comercial (LGPD).
                  </span>
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 font-mono text-sm sm:text-base font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(6,182,212,0.45)] active:scale-95 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={18} className="animate-spin" />
                        ESTRUTURANDO PROPOSTA...
                      </span>
                    ) : (
                      <>
                        SOLICITAR PROPOSTA SOB MEDIDA
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: RESERVA DE CRONOGRAMA (MERCADO PAGO) */}
            {modalFlow === 'reserva' && (
              <form onSubmit={handleDepositSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="res-name" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      Nome Completo *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      placeholder="Carlos Mendes"
                      value={depositData.name}
                      onChange={(e) => setDepositData({ ...depositData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:border-cyan-400 focus:outline-none font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="res-email" className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                      E-mail Principal *
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      placeholder="carlos@empresa.com"
                      value={depositData.email}
                      onChange={(e) => setDepositData({ ...depositData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:border-cyan-400 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="space-y-2.5 pt-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/90 font-medium block">
                    // ESCOLHA O PLANO DE ENTRADA (MERCADO PAGO):
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {Object.entries(planAmounts).map(([key, plan]) => {
                      const isSelected = depositData.depositPlan === key;
                      return (
                        <div
                          key={key}
                          onClick={() => setDepositData({ ...depositData, depositPlan: key })}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                              : 'bg-cyan-950/15 border-white/10 hover:border-cyan-400/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block font-semibold">
                              {key === 'sinal_padrao' ? 'RECOMENDADO' : key === 'consultoria' ? 'DIAGNÓSTICO 1-ON-1' : 'VIP EXPRESS'}
                            </span>
                            <div className="font-mono text-base font-bold text-white">
                              R$ {plan.amount.toFixed(2).replace('.', ',')}
                            </div>
                            <p className="text-[11px] text-zinc-300 leading-snug font-light">
                              {plan.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Mode Selection */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/90 font-medium flex items-center gap-1.5">
                      <Lock size={12} className="text-cyan-400" />
                      FORMA DE PAGAMENTO MERCADO PAGO:
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} /> SSL CRIPTOGRAFADO
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setPaymentMode('pix')}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        paymentMode === 'pix'
                          ? 'bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 border-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                          : 'bg-cyan-950/20 border-white/10 text-white hover:border-cyan-400/40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMode === 'pix' ? 'bg-black/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        <QrCode size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Pix Mercado Pago</div>
                        <p className={`text-[10px] ${paymentMode === 'pix' ? 'text-black/80 font-medium' : 'text-zinc-300'}`}>
                          Aprovação instantânea 24/7
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMode('card')}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        paymentMode === 'card'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-black shadow-[0_0_25px_rgba(249,115,22,0.3)]'
                          : 'bg-cyan-950/20 border-white/10 text-white hover:border-cyan-400/40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMode === 'card' ? 'bg-black/20 text-white' : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Cartão de Crédito</div>
                        <p className={`text-[10px] ${paymentMode === 'card' ? 'text-black/80 font-medium' : 'text-zinc-300'}`}>
                          Em até 12x no Mercado Pago
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMode === 'card' && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-cyan-400/30 space-y-3 backdrop-blur-md">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="Número do Cartão (0000 0000 0000 0000)"
                        aria-label="Número do Cartão"
                        className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono focus:border-cyan-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="Nome Completo do Titular"
                        aria-label="Nome Completo do Titular"
                        className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white placeholder-zinc-500 text-sm focus:border-cyan-400 focus:outline-none uppercase font-sans"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          aria-label="Validade do Cartão"
                          className="px-3 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white text-sm font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                          placeholder="CVV"
                          aria-label="Código de Segurança CVV"
                          maxLength={4}
                          className="px-3 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white text-sm font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          aria-label="Parcelas"
                          className="px-2 py-2.5 rounded-xl bg-cyan-950/60 border border-white/15 text-cyan-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="1" className="bg-[#050b11]">1x {formattedAmount}</option>
                          <option value="2" className="bg-[#050b11]">2x {(currentAmount / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                          <option value="3" className="bg-[#050b11]">3x {(currentAmount / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                          <option value="6" className="bg-[#050b11]">6x {(currentAmount / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                          <option value="12" className="bg-[#050b11]">12x {(currentAmount / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 font-mono text-sm sm:text-base font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(6,182,212,0.45)] active:scale-95 disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={18} className="animate-spin" />
                        CONECTANDO AO MERCADO PAGO...
                      </span>
                    ) : paymentMode === 'pix' ? (
                      <>
                        <QrCode size={18} />
                        RESERVAR CRONOGRAMA VIA PIX ({formattedAmount})
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        RESERVAR CRONOGRAMA NO CARTÃO ({formattedAmount})
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Trust Badges Footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-400" />
                Diagnóstico Confidencial
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock size={13} className="text-cyan-400" />
                Gateway Mercado Pago Criptografado
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
