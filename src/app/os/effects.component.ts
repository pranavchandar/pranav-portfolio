import {
  ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, effect, inject, viewChild,
} from '@angular/core';
import { OsService } from './os.service';

interface Dot { x: number; y: number; life: number; hue: number }

/** CRT glass, the cursor trail and Konami-code party mode. Purely decorative, never clickable. */
@Component({
  selector: 'os-effects',
  template: `
    @if (os.settings().crt) {
      <div class="crt" aria-hidden="true"></div>
    }
    @if (os.settings().trail) {
      <canvas #trail class="trail" aria-hidden="true"></canvas>
    }
    @if (os.party()) {
      <div class="party" aria-hidden="true">
        @for (h of heads; track $index) {
          <img src="assets/images/abouutSmall.webp" alt=""
               [style.left.%]="h.left" [style.width.px]="h.size"
               [style.animation-delay.s]="h.delay" [style.animation-duration.s]="h.dur"
               [style.filter]="'sepia(1) saturate(5) hue-rotate(' + h.hue + 'deg)'" />
        }
      </div>
    }
  `,
  styles: `
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 9800; }
    .crt { position: absolute; inset: 0;
      background:
        repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px),
        radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%);
      animation: flicker 4s steps(1) infinite; mix-blend-mode: multiply; }
    .crt::after { content: ''; position: absolute; left: 0; right: 0; height: 18vh; top: -20vh;
      background: linear-gradient(180deg, transparent, rgba(255,255,255,.035), transparent);
      animation: roll 7s linear infinite; }
    .trail { position: absolute; inset: 0; width: 100%; height: 100%; }
    .party { position: absolute; inset: 0; overflow: hidden; }
    .party img { position: absolute; top: -200px; animation: fall linear infinite;
 }
    @keyframes fall { to { transform: translateY(calc(100vh + 260px)) rotate(720deg); } }
    @keyframes flicker { 0%, 100% { opacity: 1; } 47% { opacity: .92; } 48% { opacity: 1; } 83% { opacity: .96; } }
    @keyframes roll { to { top: 110vh; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EffectsComponent implements OnDestroy {
  readonly os = inject(OsService);
  private readonly zone = inject(NgZone);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('trail');
  readonly heads = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37) % 100,
    size: 50 + ((i * 53) % 90),
    delay: ((i * 0.37) % 4),
    dur: 3 + ((i * 0.71) % 4),
    hue: (i * 47) % 360,
  }));
  private raf = 0;
  private dots: Dot[] = [];
  private hue = 0;
  private readonly onMove = (e: PointerEvent) => {
    this.hue = (this.hue + 7) % 360;
    this.dots.push({ x: e.clientX, y: e.clientY, life: 1, hue: this.hue });
    if (this.dots.length > 60) this.dots.shift();
  };

  constructor() {
    effect(() => {
      const el = this.canvas()?.nativeElement;
      this.stop();
      if (el) this.zone.runOutsideAngular(() => this.start(el));
    });
  }

  private start(el: HTMLCanvasElement): void {
    const ctx = el.getContext('2d');
    if (!ctx) return;
    window.addEventListener('pointermove', this.onMove);
    const draw = () => {
      if (el.width !== window.innerWidth) el.width = window.innerWidth;
      if (el.height !== window.innerHeight) el.height = window.innerHeight;
      ctx.clearRect(0, 0, el.width, el.height);
      for (const d of this.dots) {
        d.life -= 0.03;
        if (d.life <= 0) continue;
        const s = Math.round(10 * d.life);
        ctx.globalAlpha = d.life;
        ctx.fillStyle = `hsl(${d.hue} 100% 55%)`;
        ctx.fillRect(Math.round(d.x - s / 2), Math.round(d.y - s / 2) + 14, s, s);
      }
      this.dots = this.dots.filter((d) => d.life > 0);
      this.raf = requestAnimationFrame(draw);
    };
    this.raf = requestAnimationFrame(draw);
  }

  private stop(): void {
    if (!this.os.browser) return;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
    this.dots = [];
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
