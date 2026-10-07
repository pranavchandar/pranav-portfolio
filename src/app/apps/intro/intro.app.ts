import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { SoundService } from '../../os/sound.service';

/** The old /secret landing page, now running inside a media player like it always wanted to. */
@Component({
  selector: 'app-intro',
  template: `
    <div class="screen">
      <video #video src="assets/videos/intro3.mp4" playsinline preload="none" poster="assets/images/intro-placeholder2.webp"
             (ended)="playing.set(false)" (pause)="playing.set(false)" (play)="playing.set(true)"></video>
      @if (!started()) {
        <div class="gate">
          <p class="type">{{ message() }}<span class="cursor">_</span></p>
          <div class="gate__btns">
            <button type="button" class="btn95 btn95--primary" (click)="choose(true)">Y</button>
            <button type="button" class="btn95" (click)="choose(false)">N</button>
          </div>
        </div>
      }
    </div>
    <div class="controls bevel">
      <button type="button" class="btn95" (click)="toggle()" [attr.aria-label]="playing() ? 'Pause' : 'Play'">{{ playing() ? '❚❚' : '▶' }}</button>
      <button type="button" class="btn95" (click)="restart()" aria-label="Restart">⏮</button>
      <span class="now">Now playing: <b>INTRO.MOV</b> — a Blender-made trip into Pranav's desk</span>
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; background: #000; }
    .screen { position: relative; flex: 1; min-height: 0; background: #000; }
    video { width: 100%; height: 100%; object-fit: contain; }
    .gate { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 18px;
      background: rgba(0,0,0,.55); text-align: center; padding: 16px; }
    .type { margin: 0; font: 700 clamp(22px, 3.4vw, 36px) var(--font-pixel); color: #ffffbb; text-shadow: 0 0 10px #ff58e9; }
    .cursor { animation: blink 1s steps(2) infinite; }
    .gate__btns { display: flex; gap: 12px; }
    .gate__btns .btn95 { min-width: 70px; font-size: 26px; }
    .controls { display: flex; gap: 6px; align-items: center; padding: 6px; }
    .now { margin-left: 8px; color: var(--ink-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    @keyframes blink { 50% { opacity: 0; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:keydown)': 'onKey($event)' },
})
export class IntroApp {
  private readonly sound = inject(SoundService);
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');
  readonly started = signal(false);
  readonly playing = signal(false);
  readonly message = signal('Would you like to enter? (Y/N)');

  onKey(e: KeyboardEvent): void {
    if (this.started() || (e.target as HTMLElement)?.closest?.('input, textarea')) return;
    const k = e.key.toLowerCase();
    if (k === 'y' || k === 'n') this.choose(k === 'y');
  }

  choose(yes: boolean): void {
    if (yes) return this.start();
    this.sound.error();
    this.message.set("I'm taking you in anyway… :)");
    setTimeout(() => this.start(), 1600);
  }

  private start(): void {
    this.started.set(true);
    const v = this.video().nativeElement;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }

  toggle(): void {
    const v = this.video().nativeElement;
    this.started.set(true);
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  restart(): void {
    const v = this.video().nativeElement;
    v.currentTime = 0;
    this.started.set(true);
    v.play().catch(() => {});
  }
}
