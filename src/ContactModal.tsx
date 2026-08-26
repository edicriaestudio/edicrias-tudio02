import React, { useState } from 'react';
import { X, Send, CheckCircle2, Hexagon, Sparkles } from 'lucide-react';
import WebGLLiquidSurgeButton from './components/WebGLLiquidSurgeButton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Website Premium 4K',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#050b11]/85 backdrop-blur-3xl transition-opacity"
      />

      {/* Dialog - Translucent Cyan Frosted Glass Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-cyan-400/50 bg-[#050b11]/85 p-6 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full text-cyan-300 hover:text-white bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 transition-colors"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hexagon size={18} strokeWidth={1.5} className="text-cyan-300" />
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-cyan-400" />
                  EDICRIA STUDIO • PROJETO AUTORAL
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
                Vamos criar o seu <span className="italic font-serif text-cyan-300 underline decoration-cyan-400/60 underline-offset-8 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">site 4K autoral</span>.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                Conte-nos sobre o seu projeto ou selecione um template do Figma. Retornaremos com uma proposta sob medida.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Carlos Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    E-mail ou WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="contato@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                    Tipo de Serviço
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#050b11] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all font-sans"
                  >
                    <option value="Website Premium 4K">Website Premium 4K</option>
                    <option value="Landing Page Cinematográfica">Landing Page Cinematográfica</option>
                    <option value="Template Figma Foto / Vídeo">Template Figma (Foto / Vídeo)</option>
                    <option value="Redesign Completo & IA">Redesign Completo & IA</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-cyan-300/80 font-medium">
                  Breve descrição ou link de referência (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Quais são as principais metas do novo site?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex justify-center">
                <WebGLLiquidSurgeButton
                  label="SOLICITAR PROPOSTA AUTORAL"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  width="w-full"
                  height="h-[64px]"
                />
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-5 py-4">
            <div className="w-14 h-14 rounded-full bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-300">
                // SOLICITAÇÃO RECEBIDA
              </span>
              <h3 className="text-2xl font-medium text-white mt-1">
                Excelente, {formData.name || 'Cliente'}!
              </h3>
              <p className="text-sm text-zinc-300 mt-2 max-w-xs mx-auto leading-relaxed font-light">
                Recebemos o seu pedido para <strong className="text-cyan-300">{formData.projectType}</strong>. Nossa equipe da EdiCria Studio entrará em contato em breve.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-full border border-cyan-500/40 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-mono uppercase tracking-wider transition-all"
            >
              FECHAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
