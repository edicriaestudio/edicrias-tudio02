import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { trackSubmitLead, getStoredUtms } from '../utils/analytics';
import type { LegalTab } from './LegalModal';

export interface InitialDiagnosticFormProps {
  onSuccess?: (leadId: string) => void;
  onOpenLegal?: (tab: LegalTab) => void;
  className?: string;
}

interface FormErrors {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  cityState?: string;
  objective?: string;
  consent?: string;
  general?: string;
}

const OBJECTIVE_OPTIONS = [
  { id: 'criar presença digital', label: 'Criar presença digital' },
  { id: 'melhorar o site atual', label: 'Melhorar o site atual' },
  { id: 'gerar mais contatos ou leads', label: 'Gerar mais contatos ou leads' },
  { id: 'apresentar uma campanha/oferta', label: 'Apresentar uma campanha/oferta' },
  { id: 'fortalecer posicionamento e autoridade', label: 'Fortalecer posicionamento e autoridade' },
  { id: 'ainda não tenho certeza', label: 'Ainda não tenho certeza' },
];

const BUDGET_OPTIONS = [
  'ainda não definida',
  'até R$ 3.000',
  'de R$ 3.000 a R$ 6.000',
  'de R$ 6.000 a R$ 12.000',
  'acima de R$ 12.000',
];

const REFERRAL_OPTIONS = [
  'Instagram / Redes Sociais',
  'Indicação de Parceiro / Amigo',
  'Busca Google / Orgânico',
  'Portfólio / Projetos no Ar',
  'Outro Canal',
];

const DRAFT_STORAGE_KEY = 'edicria_diagnostic_draft_v2';

const getInitialFormData = () => {
  const defaultData = {
    name: '',
    company: '',
    phone: '',
    email: '',
    cityState: '',
    hasNoSite: false,
    currentUrl: '',
    instagram: '',
    objective: 'criar presença digital',
    timeline: '',
    budgetRange: 'ainda não definida',
    referralSource: '',
    oneSentenceGoal: '',
    consent: false,
  };

  if (typeof window === 'undefined') return defaultData;

  try {
    const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultData,
        ...parsed,
        consent: false, // strictly enforce consent unchecked on restore
      };
    }
  } catch {
    // fallback
  }

  return defaultData;
};

export default function InitialDiagnosticForm({
  onSuccess,
  onOpenLegal,
  className = '',
}: InitialDiagnosticFormProps) {
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState<string | null>(null);

  // Field refs for accessible focus management on validation failure
  const nameRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const cityStateRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  // Save changes to sessionStorage draft
  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      try {
        const toSave = { ...next };
        delete (toSave as any).consent;
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(toSave));
      } catch {
        // ignore storage errors
      }
      return next;
    });

    // Clear field-specific error as user types
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as keyof FormErrors];
        return copy;
      });
    }
  };

  // Telephone mask: (99) 99999-9999
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    }
    updateField('phone', formatted);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Por favor, informe seu nome completo.';
    }

    if (!formData.company.trim() || formData.company.trim().length < 2) {
      newErrors.company = 'Informe a sua empresa, marca ou nome do projeto.';
    }

    const digitsOnlyPhone = formData.phone.replace(/\D/g, '');
    if (!digitsOnlyPhone || digitsOnlyPhone.length < 10) {
      newErrors.phone = 'Informe um WhatsApp com DDD válido (ex: 11 99999-9999).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }

    if (!formData.cityState.trim() || formData.cityState.trim().length < 2) {
      newErrors.cityState = 'Informe sua cidade e estado (ex: São Paulo - SP).';
    }

    if (!formData.objective) {
      newErrors.objective = 'Selecione o objetivo principal da sua presença digital.';
    }

    if (!formData.consent) {
      newErrors.consent = 'É necessário concordar com a política de privacidade e LGPD.';
    }

    setErrors(newErrors);

    // Focus first invalid element for accessibility
    if (newErrors.name && nameRef.current) {
      nameRef.current.focus();
    } else if (newErrors.company && companyRef.current) {
      companyRef.current.focus();
    } else if (newErrors.phone && phoneRef.current) {
      phoneRef.current.focus();
    } else if (newErrors.email && emailRef.current) {
      emailRef.current.focus();
    } else if (newErrors.cityState && cityStateRef.current) {
      cityStateRef.current.focus();
    } else if (newErrors.consent && consentRef.current) {
      consentRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        cityState: formData.cityState.trim(),
        hasNoSite: formData.hasNoSite,
        currentUrl: formData.hasNoSite ? null : formData.currentUrl.trim(),
        instagram: formData.instagram.trim(),
        objective: formData.objective,
        timeline: formData.timeline.trim() || 'Ainda não definido',
        budgetRange: formData.budgetRange,
        referralSource: formData.referralSource.trim(),
        oneSentenceGoal: formData.oneSentenceGoal.trim(),
        consent: true,
        lead_type: 'diagnostico_inicial',
        source_page: typeof window !== 'undefined' ? window.location.pathname : '/',
        utms: getStoredUtms(),
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Falha ao processar o envio.');
      }

      const leadId = result.leadId || `EDC-${Date.now()}`;
      setGeneratedLeadId(leadId);
      setSubmitSuccess(true);

      // Track analytics safely
      trackSubmitLead(leadId, 'diagnostico_inicial');

      // Clear draft safely from storage
      try {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }

      if (onSuccess) {
        onSuccess(leadId);
      }
    } catch (err: any) {
      setErrors({
        general:
          err.message ||
          'Não foi possível enviar agora. Confira os campos ou tente novamente em alguns instantes. Seus dados não foram descartados sem aviso.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setGeneratedLeadId(null);
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      cityState: '',
      hasNoSite: false,
      currentUrl: '',
      instagram: '',
      objective: 'criar presença digital',
      timeline: '',
      budgetRange: 'ainda não definida',
      referralSource: '',
      oneSentenceGoal: '',
      consent: false,
    });
  };

  // SUCCESS VIEW
  if (submitSuccess) {
    return (
      <div
        id="diagnostic-success-card"
        className={`p-6 sm:p-10 rounded-3xl bg-cyan-950/40 border border-cyan-400/50 backdrop-blur-3xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/60 mx-auto flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="font-mono text-xs text-cyan-300 tracking-widest uppercase font-semibold">
            SOLICITAÇÃO RECEBIDA COM SUCESSO
          </span>
          <h4 className="text-2xl sm:text-3xl font-display font-[500] text-white tracking-tight">
            Diagnóstico Inicial em Análise
          </h4>
          <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed pt-1">
            Recebemos suas informações. A EdiCria vai analisar o contexto e retornará com os próximos passos. O briefing completo será solicitado somente se fizer sentido avançar.
          </p>
        </div>

        {generatedLeadId && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-cyan-500/30 font-mono text-xs text-cyan-200">
            <span>Protocolo de Atendimento:</span>
            <strong className="text-white font-bold">{generatedLeadId}</strong>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-zinc-300 transition-colors"
          >
            Enviar outra solicitação
          </button>
          
          <a
            href="https://creativ-brief.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
          >
            Já tem uma proposta aprovada? Acesse o briefing completo
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  // FORM VIEW
  return (
    <form
      id="initial-diagnostic-form"
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-6 text-left ${className}`}
    >
      {/* General Error Alert */}
      {errors.general && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
        >
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Grid: Personal / Brand Identity (Fields 1 to 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Nome completo */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-name"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            1. Nome completo <span className="text-cyan-400">*</span>
          </label>
          <input
            id="diag-name"
            ref={nameRef}
            type="text"
            required
            autoComplete="name"
            placeholder="Ex: Roberto Silveira"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl bg-black/40 border text-white text-sm focus:outline-none transition-all placeholder:text-zinc-500 ${
              errors.name
                ? 'border-red-500 focus:border-red-400 bg-red-950/20'
                : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40'
            }`}
          />
          {errors.name && (
            <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* 2. Empresa ou marca */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-company"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            2. Empresa ou marca <span className="text-cyan-400">*</span>
          </label>
          <input
            id="diag-company"
            ref={companyRef}
            type="text"
            required
            autoComplete="organization"
            placeholder="Ex: Lumina Tech / Dr. Carlos"
            value={formData.company}
            onChange={(e) => updateField('company', e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl bg-black/40 border text-white text-sm focus:outline-none transition-all placeholder:text-zinc-500 ${
              errors.company
                ? 'border-red-500 focus:border-red-400 bg-red-950/20'
                : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40'
            }`}
          />
          {errors.company && (
            <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> {errors.company}
            </p>
          )}
        </div>

        {/* 3. WhatsApp com DDD */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-phone"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            3. WhatsApp com DDD <span className="text-cyan-400">*</span>
          </label>
          <input
            id="diag-phone"
            ref={phoneRef}
            type="tel"
            required
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-3 rounded-2xl bg-black/40 border text-white text-sm font-mono focus:outline-none transition-all placeholder:text-zinc-500 ${
              errors.phone
                ? 'border-red-500 focus:border-red-400 bg-red-950/20'
                : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40'
            }`}
          />
          {errors.phone && (
            <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> {errors.phone}
            </p>
          )}
        </div>

        {/* 4. E-mail */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-email"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            4. E-mail corporativo ou principal <span className="text-cyan-400">*</span>
          </label>
          <input
            id="diag-email"
            ref={emailRef}
            type="email"
            required
            autoComplete="email"
            placeholder="contato@suaempresa.com.br"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl bg-black/40 border text-white text-sm focus:outline-none transition-all placeholder:text-zinc-500 ${
              errors.email
                ? 'border-red-500 focus:border-red-400 bg-red-950/20'
                : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40'
            }`}
          />
          {errors.email && (
            <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* 5. Cidade e Estado */}
      <div className="space-y-1.5">
        <label
          htmlFor="diag-city"
          className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
        >
          5. Cidade e Estado <span className="text-cyan-400">*</span>
        </label>
        <input
          id="diag-city"
          ref={cityStateRef}
          type="text"
          required
          placeholder="Ex: São Paulo - SP / Curitiba - PR"
          value={formData.cityState}
          onChange={(e) => updateField('cityState', e.target.value)}
          className={`w-full px-4 py-3 rounded-2xl bg-black/40 border text-white text-sm focus:outline-none transition-all placeholder:text-zinc-500 ${
            errors.cityState
              ? 'border-red-500 focus:border-red-400 bg-red-950/20'
              : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40'
          }`}
        />
        {errors.cityState && (
          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle size={12} /> {errors.cityState}
          </p>
        )}
      </div>

      {/* Grid: Digital Channels (Fields 6 and 7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 6. Site atual (com opção "Ainda não tenho site") */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="diag-url"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
            >
              6. Site atual (opcional)
            </label>
          </div>

          <input
            id="diag-url"
            type="url"
            disabled={formData.hasNoSite}
            placeholder={formData.hasNoSite ? 'Marcado: Ainda não tenho site' : 'https://suaempresa.com.br'}
            value={formData.hasNoSite ? '' : formData.currentUrl}
            onChange={(e) => updateField('currentUrl', e.target.value)}
            className={`w-full px-4 py-3 rounded-2xl bg-black/40 border text-white text-sm font-mono focus:outline-none transition-all placeholder:text-zinc-500 ${
              formData.hasNoSite
                ? 'opacity-40 border-white/5 cursor-not-allowed bg-black/20 text-zinc-400'
                : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40'
            }`}
          />

          <label className="flex items-center gap-2 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              id="diag-no-site-check"
              checked={formData.hasNoSite}
              onChange={(e) => {
                updateField('hasNoSite', e.target.checked);
                if (e.target.checked) {
                  updateField('currentUrl', '');
                }
              }}
              className="rounded border-cyan-500/40 text-cyan-400 focus:ring-0 w-4 h-4 bg-black/50"
            />
            <span className="text-xs text-zinc-300 font-light select-none">
              Ainda não tenho site (projeto do zero)
            </span>
          </label>
        </div>

        {/* 7. Instagram ou principal canal */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-instagram"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            7. Instagram ou canal digital (opcional)
          </label>
          <input
            id="diag-instagram"
            type="text"
            placeholder="@suamarca ou link do LinkedIn/YouTube"
            value={formData.instagram}
            onChange={(e) => updateField('instagram', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 text-white text-sm focus:outline-none transition-all placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* 8. Principal objetivo (Obrigatório, seleção clara de opções) */}
      <div className="space-y-2.5">
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium">
          8. Principal objetivo com o projeto <span className="text-cyan-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {OBJECTIVE_OPTIONS.map((opt) => {
            const isSelected = formData.objective === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                id={`diag-obj-${opt.id.replace(/\s+/g, '-')}`}
                onClick={() => updateField('objective', opt.id)}
                className={`p-3 rounded-2xl text-left text-xs sm:text-[13px] font-medium border transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40'
                    : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-white/30'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                </span>
              </button>
            );
          })}
        </div>
        {errors.objective && (
          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle size={12} /> {errors.objective}
          </p>
        )}
      </div>

      {/* Grid: Timeline, Investment Range, Referral (Fields 9, 10, 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 9. Prazo ou evento importante */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-timeline"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            9. Prazo / Evento (opcional)
          </label>
          <input
            id="diag-timeline"
            type="text"
            placeholder="Ex: Lançamento em 30 dias / Sem data fixa"
            value={formData.timeline}
            onChange={(e) => updateField('timeline', e.target.value)}
            className="w-full px-3.5 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 text-white text-xs sm:text-sm focus:outline-none transition-all placeholder:text-zinc-500"
          />
        </div>

        {/* 10. Faixa de investimento prevista */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-budget"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            10. Faixa de investimento (opcional)
          </label>
          <select
            id="diag-budget"
            value={formData.budgetRange}
            onChange={(e) => updateField('budgetRange', e.target.value)}
            className="w-full px-3.5 py-3 rounded-2xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b} className="bg-zinc-900 text-white">
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* 11. Como conheceu a EdiCria */}
        <div className="space-y-1.5">
          <label
            htmlFor="diag-referral"
            className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
          >
            11. Como conheceu (opcional)
          </label>
          <select
            id="diag-referral"
            value={formData.referralSource}
            onChange={(e) => updateField('referralSource', e.target.value)}
            className="w-full px-3.5 py-3 rounded-2xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 text-white text-xs sm:text-sm focus:outline-none transition-all cursor-pointer"
          >
            <option value="" className="bg-zinc-900 text-zinc-400">
              Selecione uma opção...
            </option>
            {REFERRAL_OPTIONS.map((r) => (
              <option key={r} value={r} className="bg-zinc-900 text-white">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 12. Conte em uma frase o que você gostaria de melhorar */}
      <div className="space-y-1.5">
        <label
          htmlFor="diag-goal-sentence"
          className="block text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium"
        >
          12. Conte em uma frase o que você gostaria de melhorar (opcional)
        </label>
        <textarea
          id="diag-goal-sentence"
          rows={2}
          maxLength={250}
          placeholder="Ex: Quero um site autoral de alta conversão que transmita autoridade e posicione nossa marca no topo do mercado."
          value={formData.oneSentenceGoal}
          onChange={(e) => updateField('oneSentenceGoal', e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 text-white text-xs sm:text-sm focus:outline-none transition-all resize-none placeholder:text-zinc-500"
        />
        <div className="flex justify-end text-[10px] font-mono text-zinc-500">
          {formData.oneSentenceGoal.length}/250 caracteres
        </div>
      </div>

      {/* Consent Checkbox (LGPD compliant, NOT pre-selected) */}
      <div className="pt-2 space-y-1.5">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            id="diag-consent-check"
            ref={consentRef}
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => updateField('consent', e.target.checked)}
            className="mt-1 rounded border-cyan-500/40 text-cyan-400 focus:ring-0 w-4 h-4 bg-black/50"
          />
          <span className="text-xs text-zinc-300 leading-relaxed group-hover:text-white transition-colors">
            Concordo que a EdiCria utilize os dados enviados para responder à minha solicitação, conforme a{' '}
            <button
              type="button"
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
              className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
            >
              Política de Privacidade
            </button>
            . <span className="text-cyan-400">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1 pl-7">
            <AlertCircle size={12} /> {errors.consent}
          </p>
        )}
      </div>

      {/* Privacy Notice text near CTA */}
      <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/10">
        Usaremos essas informações para responder à sua solicitação e entender o contexto inicial do projeto. Não envie informações sensíveis neste formulário. Consulte nossa{' '}
        <button
          type="button"
          onClick={() => onOpenLegal && onOpenLegal('privacy')}
          className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
        >
          Política de Privacidade
        </button>
        .
      </p>

      {/* Action / Submit Button */}
      <div className="pt-2 space-y-3">
        <button
          type="submit"
          id="btn-submit-diagnostic"
          disabled={isSubmitting}
          className="w-full h-14 sm:h-16 rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 text-black font-mono font-bold text-sm sm:text-base uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin text-black" />
              <span>PROCESSANDO SOLICITAÇÃO...</span>
            </>
          ) : (
            <>
              <span>Solicitar diagnóstico inicial</span>
              <ArrowRight size={18} className="text-black" />
            </>
          )}
        </button>

        {/* Supporting text below CTA */}
        <p className="text-center text-xs text-zinc-400 font-mono">
          Este formulário é uma pré-análise. O briefing completo será enviado em uma etapa posterior, caso o projeto avance.
        </p>
      </div>

      {/* Secondary Link to Briefing */}
      <div className="pt-3 border-t border-white/10 text-center">
        <a
          href="https://creativ-brief.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors"
        >
          <span>Já recebeu uma proposta da EdiCria? Acesse o briefing completo</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </form>
  );
}
