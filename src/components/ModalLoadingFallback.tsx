import { X, Activity } from 'lucide-react';

interface ModalLoadingFallbackProps {
  message?: string;
  onClose?: () => void;
}

export default function ModalLoadingFallback({
  message = 'CARREGANDO MÓDULO...',
  onClose,
}: ModalLoadingFallbackProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
      )}

      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-cyan-950/30 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-3xl text-center max-w-xs">
        {/* Futuristic Glowing Pulse Loader */}
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping" />
          <div className="absolute inset-1 rounded-full border-2 border-dashed border-cyan-400/60 animate-[spin_4s_linear_infinite]" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/30 to-teal-300/30 border border-cyan-300/60 flex items-center justify-center shadow-[0_0_20px_#06b6d4]">
            <Activity size={18} className="text-cyan-300 animate-pulse" />
          </div>
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200 font-bold block">
            {message}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-zinc-400 mt-1 block">
            OTIMIZAÇÃO 60 FPS • EDCRIA STUDIO
          </span>
        </div>
      </div>
    </div>
  );
}
