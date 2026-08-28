import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle2,
  Hexagon,
  Sparkles,
  CreditCard,
  QrCode,
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ExternalLink,
  RefreshCw,
  CalendarCheck
} from 'lucide-react';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: string;
}

export type PaymentMode = 'pix' | 'card';
export type IntentMode = 'deposit' | 'quote';

export default function ContactModal({ isOpen, onClose, initialTemplate }: ContactModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: initialTemplate ? `Template Figma: ${initialTemplate}` : 'Website Premium 4K',
    message: initialTemplate ? `Gostaria de iniciar o desenvolvimento baseado no template ${initialTemplate}.` : '',
    depositPlan: 'sinal_padrao', // 'sinal_padrao' (R$ 490), 'consultoria' (R$ 197), 'completo_vip' (R$ 1.490)
  });

  const [intentMode, setIntentMode] = useState<IntentMode>('deposit');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('pix');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Transaction / API State
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeUrl?: string;
    qrCodeBase64?: string | null;
    paymentId: string;
    amount: number;
    mode?: string;
  } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmedTransaction, setConfirmedTransaction] = useState<{
    id: string;
    method: 'pix' | 'card' | 'quote';
    amount: number;
    date: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
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
      amount: 490.00,
      desc: 'Garante o início imediato e reserva da data da equipe EdiCria',
    },
    consultoria: {
      label: 'Consultoria Estratégica & Diagnóstico 1-on-1',
      amount: 197.00,
      desc: 'Sessão de 60 min com análise de arquitetura e direção de arte',
    },
    completo_vip: {
      label: 'Entrada Prioritária VIP (Sprint Acelerada 5 Dias)',
      amount: 1490.00,
      desc: 'Atendimento prioritário 24/7 com entrega do protótipo em alta fidelidade',
    },
  };

  const currentPlan = planAmounts[formData.depositPlan] || planAmounts.sinal_padrao;
  const currentAmount = currentPlan.amount;
  const formattedAmount = currentAmount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Format Card input
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

  // Submit flow
  const handleStartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email || !formData.name) {
      setErrorMessage('Por favor, informe seu nome e e-mail.');
      return;
    }

    // Se o usuário escolheu apenas solicitar cotação sem pagamento imediato
    if (intentMode === 'quote') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setConfirmedTransaction({
          id: `QUOTE-${Date.now().toString().slice(-6)}`,
          method: 'quote',
          amount: 0,
          date: new Date().toLocaleDateString('pt-BR'),
        });
        setPaymentSuccess(true);
      }, 900);
      return;
    }

    // Se escolheu Mercado Pago:
    setIsProcessing(true);

    try {
      if (paymentMode === 'pix') {
        const response = await fetch('/api/mercadopago/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentAmount,
            description: `EdiCria Studio - ${currentPlan.label}`,
            payerEmail: formData.email,
            payerName: formData.name,
            phone: formData.phone,
            serviceType: formData.projectType,
            customNotes: formData.message,
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
            mode: data.mode,
          });
        } else {
          throw new Error(data.error || 'Erro ao gerar QR Code Mercado Pago.');
        }
      } else {
        // Pagamento com Cartão de Crédito
        const response = await fetch('/api/mercadopago/card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentAmount,
            description: `EdiCria Studio - ${currentPlan.label}`,
            payerEmail: formData.email,
            payerName: formData.name,
            phone: formData.phone,
            serviceType: formData.projectType,
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
          setPaymentSuccess(true);
        } else {
          throw new Error(data.error || 'Não foi possível autorizar o cartão.');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Erro no checkout Mercado Pago:', error);
      setErrorMessage(error.message || 'Erro de conexão com o Mercado Pago. Tente novamente.');
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
      setPaymentSuccess(true);
    }, 1200);
  };

  const handleResetModal = () => {
    setPaymentSuccess(false);
    setPixData(null);
    setConfirmedTransaction(null);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleResetModal}
        className="fixed inset-0 bg-[#050b11]/85 backdrop-blur-3xl transition-opacity animate-fadeIn"
      />

      {/* Main Transparent Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className="absolute top-5 right-5 p-2 rounded-full text-cyan-300 hover:text-white bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {!paymentSuccess && !pixData ? (
          /* STEP 1: Formulation & Payment Selection */
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hexagon size={18} strokeWidth={1.5} className="text-cyan-300" />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-cyan-400" />
                  MERCADO PAGO API • CHECKOUT TRANSPARENTE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                Inicie seu <span className="italic font-serif text-cyan-300 underline decoration-cyan-400/60 underline-offset-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">projeto 4K autoral</span>.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                Reserve sua data no cronograma via <strong className="text-cyan-300 font-normal">Mercado Pago (Pix ou Cartão de Crédito em até 12x)</strong> ou envie o briefing para orçamento customizado.
              </p>
            </div>

            {/* Intent Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
              <button
                type="button"
                onClick={() => setIntentMode('deposit')}
                className={`py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  intentMode === 'deposit'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap size={14} />
                GARANTIR VAGA & SINAL (MERCADO PAGO)
              </button>

              <button
                type="button"
                onClick={() => setIntentMode('quote')}
                className={`py-2.5 px-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  intentMode === 'quote'
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalendarCheck size={14} />
                SOLICITAR PROPOSTA SOB MEDIDA
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleStartCheckout} className="flex flex-col gap-4">
              {/* Personal & Project Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Carlos Mendes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    E-mail Principal *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    WhatsApp (Notificação VIP)
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 98888-7777"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    Tipo de Projeto
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050b11] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-sans"
                  >
                    <option value="Website Premium 4K">Website Premium 4K</option>
                    <option value="Landing Page Cinematográfica">Landing Page Cinematográfica</option>
                    <option value="Template Figma Foto / Vídeo">Template Figma (Foto / Vídeo)</option>
                    <option value="Redesign Completo & WebGL">Redesign Completo & WebGL</option>
                    <option value="Consultoria Técnica & IA">Consultoria Técnica & IA</option>
                  </select>
                </div>
              </div>

              {/* Deposit Plan Selection (Only if in deposit mode) */}
              {intentMode === 'deposit' && (
                <div className="space-y-2.5 pt-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/90 font-medium block">
                    // ESCOLHA O VALOR DO SINAL / RESERVA NO MERCADO PAGO:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {Object.entries(planAmounts).map(([key, plan]) => {
                      const isSelected = formData.depositPlan === key;
                      return (
                        <div
                          key={key}
                          onClick={() => setFormData({ ...formData, depositPlan: key })}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                              : 'bg-cyan-950/15 border-white/10 hover:border-cyan-400/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider block font-semibold">
                              {key === 'sinal_padrao' ? 'RECOMENDADO' : key === 'consultoria' ? 'DIAGNÓSTICO' : 'VIP EXPRESS'}
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
              )}

              {/* Mercado Pago Payment Method (Pix vs Card) */}
              {intentMode === 'deposit' && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/90 font-medium flex items-center gap-1.5">
                      <Lock size={12} className="text-cyan-400" />
                      GATEWAY MERCADO PAGO • FORMA DE PAGAMENTO:
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={12} /> SSL 256-BIT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* PIX */}
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

                    {/* CARTÃO */}
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

                  {/* Card form inputs if card selected */}
                  {paymentMode === 'card' && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-cyan-400/30 space-y-3 backdrop-blur-md">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>BANDEIRAS SUPORTADAS:</span>
                        <span className="text-cyan-300 font-bold">VISA • MASTER • ELO • AMEX • HIPER</span>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="Número do Cartão (0000 0000 0000 0000)"
                          className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="Nome Completo do Titular (como impresso)"
                          className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white placeholder-zinc-500 text-sm focus:border-cyan-400 focus:outline-none uppercase font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          className="px-3 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                          placeholder="CVV"
                          maxLength={4}
                          className="px-3 py-2.5 rounded-xl bg-cyan-950/30 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono text-center focus:border-cyan-400 focus:outline-none"
                        />
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
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
              )}

              {/* Message / Briefing */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                  Objetivos do Projeto ou Referências (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Website cinematográfico com animações WebGL e alta taxa de conversão..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all resize-none font-sans"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {intentMode === 'deposit' ? (
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
                        GERAR PIX MERCADO PAGO ({formattedAmount})
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        PAGAR VIA CARTÃO NO MERCADO PAGO ({formattedAmount})
                      </>
                    )}
                  </button>
                ) : (
                  <WebGLLiquidSurgeButton
                    label={isProcessing ? 'ENVIANDO SOLICITAÇÃO...' : 'ENVIAR BRIEFING PARA PROPOSTA'}
                    onClick={() => handleStartCheckout({ preventDefault: () => {} } as React.FormEvent)}
                    width="w-full"
                    height="h-[58px]"
                  />
                )}
              </div>

              {/* Trust Badges Footer */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Garantia de 7 Dias (CDC)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock size={13} className="text-cyan-400" />
                  Mercado Pago Gateway Criptografado
                </span>
              </div>
            </form>
          </div>
        ) : pixData ? (
          /* STEP 2 (PIX SCREEN): Transparent Glass Pix Display */
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
                Pague com Pix e Confirme sua Vaga
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-light mt-1 max-w-md mx-auto">
                Abra o app do seu banco, escolha <strong>Pix Copia e Cola</strong> ou aponte a câmera para o QR Code abaixo no valor de <strong className="text-cyan-300">{formattedAmount}</strong>.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-white p-3 max-w-[210px] mx-auto shadow-2xl border-4 border-cyan-400/50">
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

            {/* Pix Copy and Paste field */}
            <div className="space-y-2 max-w-lg mx-auto w-full">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 block">
                CÓDIGO PIX COPIA E COLA:
              </span>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-cyan-400/40">
                <input
                  type="text"
                  readOnly
                  value={pixData.qrCode}
                  className="bg-transparent text-zinc-300 text-xs font-mono w-full px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold uppercase shrink-0 transition-colors flex items-center gap-1.5 shadow-md"
                >
                  {copiedPix ? (
                    <>
                      <Check size={14} /> COPIADO!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> COPIAR PIX
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
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
                    VERIFICANDO COM MERCADO PAGO...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    JÁ FIZ O PIX (CONFIRMAR RESERVA AGORA)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPixData(null)}
                className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4"
              >
                Voltar e alterar forma de pagamento
              </button>
            </div>
          </div>
        ) : (
          /* STEP 3: SUCCESS & CONFIRMATION RECEIPT */
          <div className="flex flex-col items-center text-center gap-5 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                // CONFIRMAÇÃO OFICIAL EDICRIA STUDIO
              </span>
              <h3 className="text-2xl sm:text-3xl font-medium text-white mt-1">
                {confirmedTransaction?.method === 'quote'
                  ? `Solicitação Recebida, ${formData.name || 'Cliente'}!`
                  : `Vaga Confirmada no Cronograma, ${formData.name || 'Cliente'}!`}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto leading-relaxed font-light">
                {confirmedTransaction?.method === 'quote'
                  ? `Recebemos sua solicitação para ${formData.projectType}. Nossa equipe analisará as diretrizes técnicas e enviará a proposta no e-mail ${formData.email}.`
                  : `Seu pagamento via Mercado Pago (${confirmedTransaction?.method === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito'}) foi registrado com sucesso.`}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 text-left space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
                <span className="text-zinc-400 uppercase">COMPROVANTE DE ENTRADA:</span>
                <span className="text-cyan-300 font-bold">ID: {confirmedTransaction?.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">CLIENTE:</span>
                  <span className="text-white font-medium">{formData.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">SERVIÇO:</span>
                  <span className="text-cyan-200 font-medium">{formData.projectType}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">MÉTODO:</span>
                  <span className="text-emerald-400 font-mono font-semibold uppercase">
                    {confirmedTransaction?.method === 'pix'
                      ? 'PIX (MERCADO PAGO)'
                      : confirmedTransaction?.method === 'card'
                      ? 'CARTÃO (MERCADO PAGO)'
                      : 'PROPOSTA SOB MEDIDA'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-mono text-[10px]">VALOR:</span>
                  <span className="text-white font-mono font-bold">
                    {confirmedTransaction?.amount ? `R$ ${confirmedTransaction.amount.toFixed(2).replace('.', ',')}` : 'A Combinar'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call */}
            <div className="w-full space-y-2.5 pt-1">
              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                  `Olá EdiCria Studio! Realizei o pedido de ${formData.projectType} (ID: ${confirmedTransaction?.id}, Nome: ${formData.name}, E-mail: ${formData.email}). Gostaria de agilizar o início do meu projeto.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                <ExternalLink size={16} />
                INICIAR ATENDIMENTO VIP NO WHATSAPP
              </a>

              <button
                type="button"
                onClick={handleResetModal}
                className="w-full py-3 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all"
              >
                CONCLUIR E FECHAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
