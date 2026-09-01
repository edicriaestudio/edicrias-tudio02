import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { ambientEngine } from '../utils/audioEngine';

interface SoundtrackBarProps {
  compact?: boolean;
}

export default function SoundtrackBar({ compact = false }: SoundtrackBarProps) {
  const [isPlaying, setIsPlaying] = useState(ambientEngine.getIsPlaying());
  const [bars, setBars] = useState<number[]>([30, 60, 45, 80, 50]);

  useEffect(() => {
    const unsubscribe = ambientEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });

    let animId: number;
    const updateSpectrum = () => {
      if (ambientEngine.getIsPlaying()) {
        setBars(ambientEngine.getSpectrumData());
      } else {
        setBars([15, 20, 15, 25, 15]);
      }
      animId = requestAnimationFrame(updateSpectrum);
    };
    animId = requestAnimationFrame(updateSpectrum);
    return () => {
      unsubscribe();
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleToggle = () => {
    ambientEngine.toggle();
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? 'Desativar áudio da trilha sonora' : 'Ativar áudio da trilha sonora'}
        className={`flex items-center justify-center gap-1.5 h-9 w-9 sm:w-[86px] rounded-full border transition-all duration-300 active:scale-95 shrink-0 select-none overflow-hidden ${
          isPlaying
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_16px_rgba(6,182,212,0.4)]'
            : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300/80 hover:text-white hover:border-cyan-400/60 hover:bg-cyan-900/40'
        }`}
        title={isPlaying ? 'Pausar Trilha Sonora' : 'Tocar Trilha Sonora'}
      >
        {isPlaying ? (
          <Volume2 size={13} className="text-cyan-300 shrink-0" />
        ) : (
          <VolumeX size={13} className="shrink-0 opacity-70" />
        )}
        <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider font-semibold">
          ÁUDIO
        </span>
        <div className="hidden sm:flex items-end gap-[2px] h-2.5 px-0.5 shrink-0" aria-hidden="true">
          {bars.slice(0, 3).map((height, i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-cyan-300 shadow-[0_0_4px_#22d3ee]' : 'bg-cyan-500/30'
              }`}
              style={{ height: `${isPlaying ? Math.max(30, height) : 30}%` }}
            />
          ))}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 p-2.5 rounded-full border border-white/20 bg-zinc-950/80 backdrop-blur-xl shadow-2xl transition-all hover:border-white/40">
      <div className="flex items-center gap-2.5 pl-3 pr-1">
        <div className="relative flex items-center justify-center">
          <Music size={15} className={isPlaying ? 'text-white animate-bounce' : 'text-white/60'} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            Trilha Imersiva
          </span>
          <span className="text-xs font-medium text-white tracking-wide">
            {isPlaying ? 'Trilha Sonora Oficial' : 'Áudio Studio Off'}
          </span>
        </div>
      </div>

      {/* Equalizer spectrum bars */}
      <div className="flex items-end gap-[3px] h-5 px-2 py-1 bg-black/40 rounded-md border border-white/10">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-100 ${
              isPlaying ? 'bg-gradient-to-t from-white to-zinc-300' : 'bg-white/20'
            }`}
            style={{ height: `${isPlaying ? height : 20}%` }}
          />
        ))}
      </div>

      <button
        onClick={handleToggle}
        className={`p-2.5 rounded-full text-white transition-all transform active:scale-95 ${
          isPlaying
            ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
            : 'bg-white/15 hover:bg-white/25 border border-white/20'
        }`}
      >
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );
}
