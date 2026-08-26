import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { ambientEngine } from '../utils/audioEngine';

interface SoundtrackBarProps {
  compact?: boolean;
}

export default function SoundtrackBar({ compact = false }: SoundtrackBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>([30, 60, 45, 80, 50]);

  useEffect(() => {
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
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleToggle = () => {
    const active = ambientEngine.toggle();
    setIsPlaying(active);
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
          isPlaying
            ? 'bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            : 'bg-white/10 border-white/15 text-white/70 hover:text-white hover:bg-white/20'
        }`}
        title={isPlaying ? 'Pausar Trilha Sonora Imersiva' : 'Tocar Trilha Sonora Imersiva'}
      >
        {isPlaying ? <Volume2 size={14} className="animate-pulse text-white" /> : <VolumeX size={14} />}
        <span className="font-mono text-[10px] uppercase tracking-wider font-medium">
          {isPlaying ? 'TRILHA ATIVA' : 'TRILHA SONORA'}
        </span>
        <div className="flex items-end gap-[2px] h-3.5 px-0.5">
          {bars.map((height, i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-white' : 'bg-white/40'
              }`}
              style={{ height: `${isPlaying ? Math.max(20, height) : 25}%` }}
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
            <Sparkles size={10} className="text-white/80" />
            Trilha Imersiva
          </span>
          <span className="text-xs font-medium text-white tracking-wide">
            {isPlaying ? 'Sintetizador Ambient' : 'Áudio Estúdio Off'}
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
