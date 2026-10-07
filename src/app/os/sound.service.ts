import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Wave = OscillatorType;

/**
 * Every sound on the site is synthesised on the fly with WebAudio.
 * Zero audio files were downloaded in the making of this OS.
 */
@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private ctx: AudioContext | null = null;
  enabled = true;

  private audio(): AudioContext | null {
    if (!this.browser || !this.enabled) return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  private tone(freq: number, dur = 0.08, wave: Wave = 'square', gain = 0.05, delay = 0, slideTo?: number): void {
    const ctx = this.audio();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private noise(dur = 0.15, gain = 0.15, delay = 0): void {
    const ctx = this.audio();
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
    const src = ctx.createBufferSource();
    const amp = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    src.buffer = buf;
    amp.gain.value = gain;
    src.connect(filter).connect(amp).connect(ctx.destination);
    src.start(t);
  }

  click(): void { this.tone(1400, 0.025, 'square', 0.03); }
  open(): void { this.tone(520, 0.06, 'square', 0.04); this.tone(780, 0.08, 'square', 0.04, 0.05); }
  close(): void { this.tone(700, 0.06, 'square', 0.04); this.tone(420, 0.09, 'square', 0.04, 0.05); }
  minimize(): void { this.tone(900, 0.12, 'triangle', 0.05, 0, 200); }
  error(): void { this.tone(160, 0.18, 'sawtooth', 0.06); this.tone(120, 0.25, 'sawtooth', 0.06, 0.12); }
  ding(): void { this.tone(1320, 0.3, 'sine', 0.08); this.tone(1760, 0.4, 'sine', 0.05, 0.08); }
  key(): void { this.tone(2200 + Math.random() * 400, 0.012, 'square', 0.015); }
  coin(): void { this.tone(988, 0.07, 'square', 0.05); this.tone(1319, 0.25, 'square', 0.05, 0.07); }
  punch(): void { this.noise(0.12, 0.35); this.tone(140, 0.12, 'sine', 0.2, 0, 50); }

  ko(): void {
    [392, 330, 262, 196].forEach((f, i) => this.tone(f, 0.22, 'square', 0.06, i * 0.18));
  }

  startup(): void {
    // A totally original startup chime. Any resemblance is coincidental.
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1318.5];
    notes.forEach((f, i) => this.tone(f, 0.9 - i * 0.08, 'triangle', 0.05, i * 0.13));
    this.tone(130.81, 1.6, 'sine', 0.06, 0);
  }

  siren(): void {
    for (let i = 0; i < 6; i++) this.tone(600, 0.25, 'sawtooth', 0.04, i * 0.5, 1200);
  }

  crash(): void { this.noise(0.6, 0.25); this.tone(55, 0.8, 'sawtooth', 0.08); }

  powerUp(): void {
    [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'square', 0.05, i * 0.07));
  }
}
