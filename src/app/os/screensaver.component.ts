import {
  ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, OnInit, inject, signal, viewChild,
} from '@angular/core';

/** The DVD logo, except it's Pranav's head. Waiting for it to hit the corner is a career choice. */
@Component({
  selector: 'os-screensaver',
  template: `
    <img #head class="head" src="assets/images/abouutSmall.webp" alt="" [style.filter]="filter()" />
    <p class="caption">
      PRANAV IS THINKING<span class="dots">...</span>
      <small>corner hits: {{ corners() }} · move the mouse to wake him</small>
    </p>
    @if (flash()) {
      <p class="corner">CORNER!!!</p>
    }
  `,
  styles: `
    :host { position: fixed; inset: 0; z-index: 8000; background: #000; overflow: hidden; }
    .head { position: absolute; left: 0; top: 0; width: 240px; will-change: transform; }
    .caption { position: absolute; left: 0; right: 0; bottom: 24px; margin: 0; text-align: center;
      color: #555; font: 24px var(--font-pixel); }
    .caption small { display: block; font-size: 18px; color: #333; }
    .dots { animation: blink 1s steps(2) infinite; }
    .corner { position: absolute; inset: 0; margin: 0; display: grid; place-items: center;
      font: 400 min(22vw, 220px) var(--font-display); color: var(--amber);
      text-shadow: 0 0 40px var(--red); animation: zoom 1.2s ease-out both; pointer-events: none; }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes zoom { from { transform: scale(0.2) rotate(-20deg); } 60% { transform: scale(1.1) rotate(4deg); } to { opacity: 0; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreensaverComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly head = viewChild.required<ElementRef<HTMLImageElement>>('head');
  readonly filter = signal('sepia(1) saturate(6) hue-rotate(0deg)');
  readonly corners = signal(0);
  readonly flash = signal(false);
  private raf = 0;

  ngOnInit(): void {
    let x = Math.random() * 200;
    let y = Math.random() * 200;
    let vx = 2.4;
    let vy = 1.9;
    let hue = 0;
    this.zone.runOutsideAngular(() => {
      const step = () => {
        const el = this.head().nativeElement;
        const w = el.offsetWidth || 240;
        const h = el.offsetHeight || 180;
        const maxX = window.innerWidth - w;
        const maxY = window.innerHeight - h;
        x += vx;
        y += vy;
        let hitX = false;
        let hitY = false;
        if (x <= 0 || x >= maxX) { vx = -vx; x = Math.max(0, Math.min(maxX, x)); hitX = true; }
        if (y <= 0 || y >= maxY) { vy = -vy; y = Math.max(0, Math.min(maxY, y)); hitY = true; }
        if (hitX || hitY) {
          hue = (hue + 67) % 360;
          this.zone.run(() => this.filter.set(`sepia(1) saturate(6) hue-rotate(${hue}deg)`));
        }
        if ((hitX && (y < 8 || y > maxY - 8)) || (hitY && (x < 8 || x > maxX - 8))) {
          this.zone.run(() => {
            this.corners.update((c) => c + 1);
            this.flash.set(true);
            setTimeout(() => this.flash.set(false), 1200);
          });
        }
        el.style.transform = `translate(${x}px, ${y}px)`;
        this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }
}
