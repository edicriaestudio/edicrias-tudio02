// Web Audio & Custom Google Drive Soundtrack Engine with Spectrum Visualizer
type StateListener = (isPlaying: boolean) => void;

class AmbientSoundtrackEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private intervalId: number | null = null;
  private currentChordIndex = 0;
  private listeners: Set<StateListener> = new Set();
  private simulatedPhase = 0;

  // Primary local high-speed cached asset & Direct Google Drive Audio stream URLs
  private localAudioUrl = '/soundtrack.mp3';
  private googleDriveAudioUrl = 'https://docs.google.com/uc?export=download&id=15XKlcc1sNAsqfDhqvrs5SVZIlfbsussz';

  // Fallback Cinematic Ambient Chord Frequencies
  private chords = [
    [130.81, 155.56, 196.00, 233.08, 311.13],
    [103.83, 155.56, 174.61, 207.65, 261.63],
    [87.31, 130.81, 174.61, 207.65, 261.63],
    [98.00, 146.83, 174.61, 196.00, 246.94],
  ];

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.isPlaying));
  }

  public init() {
    if (this.ctx && this.audioElement) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }

      if (!this.audioElement) {
        // Create HTMLAudioElement for custom audio
        this.audioElement = new Audio(this.localAudioUrl);
        this.audioElement.loop = true;
        this.audioElement.volume = 0.65;
        this.audioElement.crossOrigin = 'anonymous';
        // Ensure browser does not pause audio during background scroll
        this.audioElement.setAttribute('playsinline', 'true');
        this.audioElement.setAttribute('webkit-playsinline', 'true');

        // Automatic recovery on stall or pause while isPlaying is true
        this.audioElement.addEventListener('pause', () => {
          if (this.isPlaying && this.audioElement && this.audioElement.paused) {
            // If paused unexpectedly while engine state is playing, resume seamlessly
            setTimeout(() => {
              if (this.isPlaying && this.audioElement && this.audioElement.paused) {
                this.audioElement.play().catch(() => {});
              }
            }, 100);
          }
        });

        // Add error fallback to direct Drive URL if local asset has any issue
        this.audioElement.addEventListener('error', () => {
          if (this.audioElement && this.audioElement.src.includes('soundtrack.mp3')) {
            console.info('Switching audio source to Google Drive direct stream...');
            this.audioElement.src = this.googleDriveAudioUrl;
            if (this.isPlaying) {
              this.audioElement.play().catch(console.warn);
            }
          }
        });

        // Try routing through Web Audio analyser for spectrum
        try {
          if (this.ctx && this.masterGain) {
            this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.mediaSourceNode.connect(this.masterGain);
          }
        } catch {
          // Direct element output will still play cleanly
        }
      }
    } catch (e) {
      console.warn('AudioContext init notice:', e);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.isPlaying = true;
    this.notify();

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.6, now + 1);
    }

    // Play soundtrack audio element
    if (this.audioElement) {
      this.audioElement.play().catch((err) => {
        console.warn('Soundtrack audio play notice:', err);
        this.triggerChord();
      });
    } else {
      this.triggerChord();
    }

    // Backup ambient synth chords if needed
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(() => {
        if (this.isPlaying && (!this.audioElement || this.audioElement.paused)) {
          this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
          this.triggerChord();
        }
      }, 6000);
    }
  }

  public pause() {
    this.isPlaying = false;
    this.notify();

    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
    }
  }

  private triggerChord() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const chord = this.chords[this.currentChordIndex];
    const now = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, now);
      filter.Q.setValueAtTime(2, now);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 6);
    });
  }

  public getSpectrumData(): number[] {
    if (!this.isPlaying) {
      return [15, 20, 15, 25, 15];
    }

    // Try reading hardware analyser frequency
    if (this.analyser) {
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      if (sum > 10) {
        const bars = 5;
        const result: number[] = [];
        const step = Math.floor(bufferLength / bars);

        for (let i = 0; i < bars; i++) {
          const val = dataArray[i * step] || 0;
          const normalized = Math.max(20, Math.min(100, (val / 255) * 100));
          result.push(normalized);
        }
        return result;
      }
    }

    // Dynamic wave spectrum animation when playing
    this.simulatedPhase += 0.15;
    const basePulsing = [
      Math.sin(this.simulatedPhase * 1.1) * 30 + 55,
      Math.cos(this.simulatedPhase * 1.4) * 35 + 65,
      Math.sin(this.simulatedPhase * 1.8 + 1) * 40 + 60,
      Math.cos(this.simulatedPhase * 1.2 + 2) * 35 + 70,
      Math.sin(this.simulatedPhase * 1.5 + 3) * 25 + 50,
    ];

    return basePulsing.map((v) => Math.max(20, Math.min(95, v)));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientEngine = new AmbientSoundtrackEngine();
