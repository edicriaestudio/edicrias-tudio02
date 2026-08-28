import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  FileText,
  Cookie,
  Lock,
  X,
  Mail,
  Search,
  CheckCircle2,
  Scale
} from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'cookies' | 'compliance';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-3xl transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Main Container - Frosted Cyan Glass Card */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-cyan-400/40 bg-[#050b11]/95 p-5 sm:p-8 backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.25)] z-10 text-white my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-zinc-300 hover:text-white hover:bg-cyan-900/60 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-cyan-300" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300 font-semibold">
              TRANSPARÊNCIA, LGPD & SEGURANÇA JURÍDICA
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-white">
            Políticas Oficiais & Termos Legais
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-light">
            Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/18), Código de Defesa do Consumidor e Diretrizes de Anúncios do Google & Meta.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-cyan-950/30 p-2 rounded-2xl border border-cyan-500/30">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'privacy'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock size={13} />
              Privacidade & LGPD
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={13} />
              Termos de Uso
            </button>

            <button
              onClick={() => setActiveTab('cookies')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'cookies'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cookie size={13} />
              Cookies
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'compliance'
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scale size={13} />
              Garantia & Anúncios
            </button>
          </div>

          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar termos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7 rounded-2xl bg-cyan-950/15 border border-cyan-400/30 backdrop-blur-md space-y-6 text-xs sm:text-sm text-zinc-200 leading-relaxed max-h-[50vh] overflow-y-auto custom-scrollbar">
          
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  1. Política de Privacidade & Proteção de Dados (LGPD)
                </h3>
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-1 rounded border border-cyan-500/30">
                  Atualizado em 2026
                </span>
              </div>

              <p>
                A <strong>EDICRIA STUDIO</strong> valoriza a privacidade e a proteção dos dados pessoais de seus clientes, usuários e parceiros. Esta Política de Privacidade descreve de forma clara e transparente como coletamos, tratamos, armazenamos e protegemos os seus dados, em integral conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)</strong> e regulamentações internacionais como o GDPR.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">1.1. Dados Coletados e Finalidades</h4>
                <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                  <li><strong>Dados de Identificação e Contato:</strong> Nome completo, endereço de e-mail e número de WhatsApp para processamento do pedido de templates, envio dos links de download e suporte técnico.</li>
                  <li><strong>Dados de Pagamento:</strong> Processados de forma 100% criptografada através de gateways certificados PCI-DSS (ex: Mercado Pago, Stripe). A EdiCria Studio <em>não armazena números de cartões de crédito</em> em seus servidores.</li>
                  <li><strong>Dados de Navegação e Diagnóstico:</strong> Endereço IP anônimo, tipo de navegador, páginas acessadas e métricas de desempenho para garantir a estabilidade do site e otimização dos shaders WebGL.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">1.2. Seus Direitos como Titular dos Dados (Art. 18 da LGPD)</h4>
                <p>Você pode a qualquer momento exercer seus direitos perante a EdiCria Studio:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>Confirmação da existência de tratamento</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>Acesso e correção de dados incompletos</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>Eliminação dos dados pessoais tratados</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>Revogação do consentimento</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">1.3. Contato do Encarregado de Dados (DPO)</h4>
                <p>
                  Para solicitações relativas a dados pessoais, envie um e-mail para{' '}
                  <a href="mailto:edicriaestudiocriativo@gmail.com" className="text-cyan-300 underline underline-offset-4">
                    edicriaestudiocriativo@gmail.com
                  </a> com o assunto <em>&quot;Privacidade LGPD - Titular&quot;</em>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  2. Termos de Uso e Licenciamento de Software/Templates
                </h3>
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-1 rounded border border-cyan-500/30">
                  Licença Vitalícia
                </span>
              </div>

              <p>
                Ao navegar no portal da <strong>EDICRIA STUDIO</strong> ou adquirir qualquer template Figma (.fig), kit de prompts IA ou projeto sob medida, você concorda expressamente com as diretrizes e regras aqui estipuladas.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">2.1. Escopo da Licença Comercial</h4>
                <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                  <li><strong>Uso Autorizado:</strong> Você adquire uma licença perpétua e não-exclusiva para editar, personalizar e publicar websites finais para si ou para clientes comerciais de forma ilimitada.</li>
                  <li><strong>Restrição de Redistribuição:</strong> É estritamente proibido revender, redistribuir, sublicenciar ou compartilhar os arquivos fonte brutos do Figma (.fig) em outros marketplaces, comunidades abertas ou pacotes piratas.</li>
                  <li><strong>Propriedade Intelectual:</strong> Todos os direitos autorais sobre a estrutura visual, componentes e shaders permanecem sob titularidade da EdiCria Studio.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">2.2. Entrega e Acesso Digital</h4>
                <p>
                  A entrega dos templates ocorre digitalmente e de forma imediata após a confirmação do pagamento via PIX ou Cartão de Crédito, enviada diretamente para o endereço de e-mail cadastrado pelo comprador no checkout.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  3. Política de Cookies & Tecnologias de Rastreamento
                </h3>
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-1 rounded border border-cyan-500/30">
                  Consentimento Ativo
                </span>
              </div>

              <p>
                Utilizamos cookies e tecnologias similares para proporcionar a melhor experiência de navegação, avaliar a performance dos nossos shaders WebGL e fornecer anúncios relevantes em plataformas de busca (Google Ads) e redes sociais.
              </p>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">3.1. Tipos de Cookies Utilizados</h4>
                <div className="space-y-2 text-zinc-300">
                  <p>• <strong>Cookies Estritamente Necessários:</strong> Essenciais para a navegação básica, segurança e persistência do carrinho e opções de áudio.</p>
                  <p>• <strong>Cookies de Desempenho e Telemetria:</strong> Ajudam a monitorar métricas anônimas de 60 FPS, tempo de carregamento de vídeo e estabilidade de hardware.</p>
                  <p>• <strong>Cookies de Publicidade & Conversão (Google/Meta):</strong> Permitem mensurar o retorno de campanhas publicitárias e evitar repetição de anúncios para quem já adquiriu templates.</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">3.2. Como Gerenciar ou Desativar</h4>
                <p>
                  Você pode configurar seu navegador para recusar cookies ou alertá-lo quando cookies estiverem sendo enviados. Note que algumas partes do site (como preferências de áudio) podem não funcionar adequadamente sem certos cookies.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  4. Garantia Incondicional, Reembolso & Compliance de Anúncios
                </h3>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/40">
                  Garantia de 7 Dias
                </span>
              </div>

              <p>
                Garantimos total transparência para os nossos usuários e total conformidade com as diretrizes do <strong>Google Ads, Meta Ads e Código de Defesa do Consumidor (Art. 49 da Lei nº 8.078/1990)</strong>.
              </p>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                <h4 className="font-semibold text-emerald-300 text-sm flex items-center gap-1.5">
                  <ShieldCheck size={16} />
                  Garantia Incondicional de 7 Dias (CDC Art. 49)
                </h4>
                <p className="text-zinc-200">
                  Se por qualquer motivo você não ficar 100% satisfeito com o pacote de templates Figma ou treinamentos adquiridos, você pode solicitar o reembolso total do seu valor em até 7 dias corridos a partir da data de compra, sem burocracia.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300 text-sm">4.1. Dados de Identificação do Anunciante</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block">ESTÚDIO / TITULAR:</span>
                    <strong className="text-white">EDICRIA STUDIO DIGITAL</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block">E-MAIL PROFISSIONAL:</span>
                    <strong className="text-cyan-300">edicriaestudiocriativo@gmail.com</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block">LOCALIZAÇÃO:</span>
                    <strong className="text-white">São Paulo - SP, Brasil</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-zinc-400 block">SUPORTE VIP:</span>
                    <strong className="text-emerald-400">Atendimento via WhatsApp & E-mail</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Support Call */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Mail size={14} className="text-cyan-400" />
            <span>Dúvidas jurídicas ou suporte?</span>
            <a
              href="mailto:edicriaestudiocriativo@gmail.com"
              className="text-cyan-300 hover:text-white font-mono underline underline-offset-4"
            >
              edicriaestudiocriativo@gmail.com
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold uppercase tracking-wider text-xs transition-colors"
          >
            Entendido & Fechar
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
