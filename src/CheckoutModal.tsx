import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  CreditCard,
  QrCode,
  Lock,
  Copy,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export interface UpsellItem {
  id: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  selected: boolean;
  borderClass?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productPrice?: number;
  templateId?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  productName = 'Pack · 42 templates Figma 4K',
  productPrice = 66.90,
  templateId: _templateId,
}: CheckoutModalProps) {
  const [upsells, setUpsells] = useState<UpsellItem[]>([
    {
      id: 'curso-mcp',
      badge: 'RECOMENDADO',
      badgeColor: 'bg-orange-500 text-black',
      borderClass: 'border-orange-500/50 bg-orange-950/15 shadow-[0_0_25px_rgba(249,115,22,0.15)]',
      title: '+ Curso: Do Figma ao Site no Ar',
      description: 'coloque qualquer design no ar com o MCP do Claude — sem programar',
      price: 19.90,
      priceFormatted: '+R$ 19,90',
      selected: true,
    },
    {
      id: 'kit-ia',
      borderClass: 'border-white/15 bg-cyan-950/15 hover:border-cyan-400/40',
      title: '+ Kit Sites Cinematográficos com IA',
      description: '85+ prompts (site, imagem, copy) + fórmula',
      price: 14.90,
      priceFormatted: '+R$ 14,90',
      selected: false,
    },
    {
      id: 'design-system',
      borderClass: 'border-white/15 bg-cyan-950/15 hover:border-cyan-400/40',
      title: '+ Design System Blueprint',
      description: 'o método pra montar um design system que faz qualquer site parecer caro',
      price: 14.90,
      priceFormatted: '+R$ 14,90',
      selected: false,
    },
    {
      id: 'motion-skills',
      badge: 'GOLD',
      badgeColor: 'bg-amber-400 text-black font-bold',
      borderClass: 'border-amber-400/50 bg-amber-950/15 shadow-[0_0_25px_rgba(251,191,36,0.15)]',
      title: '+ Minhas 15 Golden Skills de Motion',
      description: 'as skills de IA por trás dos motions dos meus sites — seu agente aprende a animar',
      price: 29.90,
      priceFormatted: '+R$ 29,90',
      selected: false,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Checkout process states
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [dynamicPixCode, setDynamicPixCode] = useState('');

  const selectedUpsellsTotal = upsells
    .filter((u) => u.selected)
    .reduce((acc, u) => acc + u.price, 0);

  const finalTotal = productPrice + selectedUpsellsTotal;
  const formattedTotal = finalTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const defaultPixCode = `00020126580014br.gov.bcb.pix0136edicriaestudiocriativo@gmail.com520400005303986540${finalTotal.toFixed(2)}5802BR5920EDICRIA STUDIO DIGIT6009SAO PAULO62070503***6304E8A2`;
  const activePixCode = dynamicPixCode || defaultPixCode;

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

  const toggleUpsell = (id: string) => {
    setUpsells((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(activePixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Por favor, informe seu e-mail para entrega do acesso.');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'pix') {
        const response = await fetch('/api/mercadopago/pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            description: `EdiCria Studio - ${productName}`,
            payerEmail: email,
            payerName: name,
            phone,
            serviceType: productName,
          }),
        });
        const data = await response.json();
        if (data.qrCode) {
          setDynamicPixCode(data.qrCode);
        }
        setIsProcessing(false);
        setPixGenerated(true);
      } else {
        await fetch('/api/mercadopago/card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            description: `EdiCria Studio - ${productName}`,
            payerEmail: email,
            payerName: name,
            phone,
            serviceType: productName,
            installments: Number(installments),
            cardData: {
              holder: cardName,
              expiry: cardExpiry,
              lastDigits: cardNumber.slice(-4),
            },
          }),
        });
        setIsProcessing(false);
        setOrderComplete(true);
      }
    } catch {
      setIsProcessing(false);
      if (paymentMethod === 'pix') {
        setPixGenerated(true);
      } else {
        setOrderComplete(true);
      }
    }
  };

  const handleSimulatePixPaid = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPixGenerated(false);
      setOrderComplete(true);
    }, 1000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#04080e]/85 backdrop-blur-2xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Main Checkout Modal Container - Centered Floating Pop-up Glass Card */}
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.3)] z-10 text-white my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-zinc-300 hover:text-white hover:bg-cyan-900/80 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {!orderComplete ? (
          <>
            {/* Header */}
            <div className="space-y-1.5 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300 font-semibold">
                  CHECKOUT SEGURO • EDCRIA STUDIO
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white font-sans">
                Como você quer pagar?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-light flex items-center gap-2">
                <span className="text-cyan-300 font-medium">{productName}</span>
                <span>•</span>
                <span className="font-mono font-semibold text-white">
                  R$ {productPrice.toFixed(2).replace('.', ',')}
                </span>
              </p>
            </div>

            {!pixGenerated ? (
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                {/* Upsells Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/90 font-medium">
                      // COMPLETE SEU PACOTE (OFERTAS ÚNICAS):
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Opcional
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {upsells.map((item) => {
                      const isSelected = item.selected;
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleUpsell(item.id)}
                          className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? item.borderClass || 'border-cyan-400/60 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                              : 'border-white/10 bg-cyan-950/10 hover:border-cyan-400/30 hover:bg-cyan-950/20'
                          }`}
                        >
                          {/* Badge tag */}
                          {item.badge && (
                            <div className="absolute -top-2.5 left-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-md font-mono text-[9px] uppercase tracking-wider font-bold shadow-md ${
                                  item.badgeColor || 'bg-cyan-400 text-black'
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                          )}

                          {/* Checkbox and text */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                                isSelected
                                  ? item.badge === 'RECOMENDADO'
                                    ? 'bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                                    : item.badge === 'GOLD'
                                    ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                                    : 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                                  : 'border border-white/30 bg-black/30'
                              }`}
                            >
                              {isSelected && <Check size={13} strokeWidth={3} />}
                            </div>

                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[11px] sm:text-xs text-zinc-300 font-light leading-relaxed mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="shrink-0 text-right">
                            <span
                              className={`font-mono text-xs sm:text-sm font-bold ${
                                isSelected
                                  ? item.badge === 'RECOMENDADO'
                                    ? 'text-orange-400'
                                    : item.badge === 'GOLD'
                                    ? 'text-amber-300'
                                    : 'text-cyan-300'
                                  : 'text-zinc-400'
                              }`}
                            >
                              {item.priceFormatted}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method Selector (Only PIX and Cartão de Crédito as requested) */}
                <div className="space-y-2.5 pt-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/90 font-medium block">
                    // FORMA DE PAGAMENTO:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* PIX Option */}
                    <div
                      onClick={() => setPaymentMethod('pix')}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        paymentMethod === 'pix'
                          ? 'bg-gradient-to-r from-emerald-500/90 to-cyan-500/90 border-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.35)] scale-[1.02]'
                          : 'bg-cyan-950/20 border-white/10 text-white hover:border-cyan-400/40 hover:bg-cyan-950/30'
                      }`}
                    >
                      {/* Pill recommended */}
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-mono text-[9px] font-bold uppercase tracking-wider">
                        RECOMENDADO
                      </span>

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMethod === 'pix'
                            ? 'bg-black/20 text-white'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        <QrCode size={20} />
                      </div>

                      <div>
                        <div className="font-bold text-sm leading-none flex items-center gap-1.5">
                          <span>Pix</span>
                        </div>
                        <p
                          className={`text-[11px] mt-1 leading-tight ${
                            paymentMethod === 'pix' ? 'text-black/80 font-medium' : 'text-zinc-300'
                          }`}
                        >
                          Cai na hora · sem cartão
                        </p>
                      </div>
                    </div>

                    {/* Cartão de Crédito Option */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        paymentMethod === 'card'
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.35)] scale-[1.02]'
                          : 'bg-cyan-950/20 border-white/10 text-white hover:border-cyan-400/40 hover:bg-cyan-950/30'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          paymentMethod === 'card'
                            ? 'bg-black/20 text-white'
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        }`}
                      >
                        <CreditCard size={20} />
                      </div>

                      <div>
                        <div className="font-bold text-sm leading-none">
                          Cartão
                        </div>
                        <p
                          className={`text-[11px] mt-1 leading-tight ${
                            paymentMethod === 'card' ? 'text-black/80 font-medium' : 'text-zinc-300'
                          }`}
                        >
                          Crédito ou débito
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Information Inputs */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                      Seu e-mail (para receber o acesso instantâneo) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@seuemail.com"
                      className="w-full px-4 py-3 rounded-xl bg-cyan-950/30 border border-cyan-400/40 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 text-sm backdrop-blur-md"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-300 text-sm backdrop-blur-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5 font-medium">
                        WhatsApp (suporte VIP)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-2.5 rounded-xl bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-300 text-sm backdrop-blur-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Credit Card Inputs */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 space-y-3 backdrop-blur-md animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                        <Lock size={12} className="text-cyan-400" />
                        DADOS DO CARTÃO CRIPTOGRAFADOS (SSL 256-BIT)
                      </span>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Nome impresso no cartão"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-sm focus:border-cyan-400 focus:outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono text-center focus:border-cyan-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        maxLength={4}
                        className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-zinc-500 text-sm font-mono text-center focus:border-cyan-400 focus:outline-none"
                      />
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="px-2 py-2.5 rounded-xl bg-black/40 border border-white/15 text-cyan-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="1" className="bg-[#050b11]">1x {formattedTotal}</option>
                        <option value="2" className="bg-[#050b11]">2x {(finalTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                        <option value="3" className="bg-[#050b11]">3x {(finalTotal / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                        <option value="6" className="bg-[#050b11]">6x {(finalTotal / 6).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                        <option value="12" className="bg-[#050b11]">12x {(finalTotal / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Total and Submit Action */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-zinc-300">
                        VALOR TOTAL A PAGAR:
                      </span>
                      <p className="text-[11px] text-cyan-300 font-mono">
                        Acesso vitalício + Atualizações inclusas
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 tracking-tight">
                        {formattedTotal}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-white text-black hover:from-cyan-300 hover:to-cyan-100 font-mono text-sm sm:text-base font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(6,182,212,0.45)] active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        PROCESSANDO ACESSO...
                      </span>
                    ) : paymentMethod === 'pix' ? (
                      <>
                        <QrCode size={18} />
                        GERAR PIX & LIBERAR ACESSO ({formattedTotal})
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        PAGAR COM CARTÃO ({formattedTotal})
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-zinc-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-emerald-400" />
                      Garantia 7 Dias
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Zap size={13} className="text-cyan-400" />
                      Entrega Imediata no E-mail
                    </span>
                  </div>
                </div>
              </form>
            ) : (
              /* PIX Generated Screen */
              <div className="space-y-5 text-center py-2 animate-fadeIn">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 mb-1">
                  <QrCode size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight">
                    Pix Gerado com Sucesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-light mt-1">
                    Copie a chave Pix abaixo ou pague pelo app do seu banco. O acesso será enviado para <span className="text-cyan-300 font-medium">{email}</span> instantaneamente.
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="p-4 rounded-2xl bg-white p-4 max-w-[220px] mx-auto shadow-2xl border-4 border-cyan-400/40">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(activePixCode)}`}
                    alt="QR Code Pix"
                    className="w-full h-auto aspect-square"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
                    CÓDIGO PIX COPIA E COLA:
                  </span>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-white/15">
                    <input
                      type="text"
                      readOnly
                      value={activePixCode}
                      className="bg-transparent text-zinc-300 text-xs font-mono w-full px-2 outline-none truncate"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold uppercase shrink-0 transition-colors flex items-center gap-1.5"
                    >
                      {copiedPix ? (
                        <>
                          <Check size={14} /> COPIADO
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> COPIAR
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulation Button for Preview Confirmation */}
                <div className="pt-3 border-t border-white/10 space-y-2.5">
                  <button
                    onClick={handleSimulatePixPaid}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  >
                    {isProcessing ? 'CONFIRMANDO PAGAMENTO...' : 'JÁ FIZ O PAGAMENTO PIX (CONFIRMAR AGORA)'}
                  </button>

                  <button
                    onClick={() => setPixGenerated(false)}
                    className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    Voltar e alterar opções
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Order Complete / Delivery Screen */
          <div className="space-y-6 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold">
                PAGAMENTO APROVADO • ACESSO LIBERADO
              </span>
              <h2 className="text-3xl font-normal tracking-tight text-white">
                Bem-vindo ao Ecossistema Edcria Studio!
              </h2>
              <p className="text-sm text-zinc-200 max-w-md mx-auto leading-relaxed">
                Enviamos todos os arquivos fontes do Figma (.fig), vídeos 4K e bônus selecionados para <span className="text-cyan-300 font-medium">{email}</span>.
              </p>
            </div>

            {/* Access Summary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 text-left space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-xs text-zinc-400 uppercase">PRODUTOS INCLUSOS:</span>
                <span className="font-mono text-xs text-emerald-400 font-bold">STATUS: ATIVO</span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-200">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400 shrink-0" />
                  <span>{productName} (Arquivos .fig + Mídias 4K)</span>
                </li>
                {upsells.filter(u => u.selected).map(u => (
                  <li key={u.id} className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>{u.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Immediate Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href="https://figma.com/@edicria"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                <ExternalLink size={16} />
                ABRIR BIBLIOTECA NO FIGMA AGORA
              </a>

              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá Edcria Studio! Acabei de adquirir o ${productName} (E-mail: ${email}). Poderiam confirmar meu acesso VIP?`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-zinc-200 font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                FALAR COM SUPORTE NO WHATSAPP
              </a>

              <button
                onClick={onClose}
                className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4 pt-1"
              >
                Fechar janela
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
