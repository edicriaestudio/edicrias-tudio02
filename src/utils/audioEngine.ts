// Web Audio & Custom Google Drive Audio Soundtrack Engine with Spectrum Visualizer
class AmbientSoundtrackEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private intervalId: number | null = null;
  private currentChordIndex = 0;

  // Custom Google Drive Audio Stream URL provided by the user
  private googleDriveAudioUrl = 'https://docs.google.com/uc?export=download&id=15XKlcc1sNAsqfDhqvrs5SVZIlfbsussz';

  // Fallback Cinematic Ambient Chord Frequencies
  private chords = [
    [130.81, 155.56, 196.00, 233.08, 311.13],
    [103.83, 155.56, 174.61, 207.65, 261.63],
    [87.31, 130.81, 174.61, 207.65, 261.63],
    [98.00, 146.83, 174.61, 196.00, 246.94],
  ];

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 32;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Create HTMLAudioElement for user custom Drive Audio
      this.audioElement = new Audio(this.googleDriveAudioUrl);
      this.audioElement.loop = true;
      this.audioElement.crossOrigin = 'anonymous';

      try {
        this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioElement);
        this.mediaSourceNode.connect(this.masterGain);
      } catch (err) {
        console.warn('MediaElementSource fallback to synth:', err);
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
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
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, now + 1.5);

    // Try playing custom Google Drive audio
    if (this.audioElement) {
      this.audioElement.play().catch((err) => {
        console.warn('Custom Drive Audio autoplay restricted, triggering ambient synth fallback:', err);
        this.triggerChord();
      });
    } else {
      this.triggerChord();
    }

    // Rotate ambient chords if synth mode is active
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
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
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
    if (!this.analyser || !this.isPlaying) {
      return [10, 15, 8, 20, 12];
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    const bars = 5;
    const result: number[] = [];
    const step = Math.floor(bufferLength / bars);

    for (let i = 0; i < bars; i++) {
      const val = dataArray[i * step] || 0;
      const normalized = Math.max(15, Math.min(100, (val / 255) * 100));
      result.push(normalized);
    }
    return result;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientEngine = new AmbientSoundtrackEngine();
