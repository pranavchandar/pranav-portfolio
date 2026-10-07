import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { OsService } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';

const WARNINGS = [
  'DO NOT PRESS',
  'I said do not.',
  'Seriously. Last warning.',
  'Okay. You asked for this.',
];

@Component({
  selector: 'app-dont-press',
  template: `
    <div class="stage" [class.is-armed]="presses() >= 3">
      <p class="sign">{{ sign() }}</p>
      <button type="button" class="big" (click)="press()" [disabled]="countdown() !== null" aria-label="The button">
        <span class="big__cap"></span>
      </button>
      @if (countdown() !== null) {
        <p class="countdown">SELF-DESTRUCT IN {{ countdown() }}</p>
      } @else {
        <p class="fine">presses: {{ presses() }} · this button is not connected to anything (it is)</p>
      }
    </div>
  `,
  styles: `
    :host { display: flex; flex-direction: column; height: 100%; }
    .stage { flex: 1; display: grid; place-content: center; justify-items: center; gap: 18px; text-align: center; padding: 16px;
      background: repeating-linear-gradient(-45deg, #1a1416 0 22px, #241b1d 22px 44px); }
    .stage.is-armed { background: repeating-linear-gradient(-45deg, #ffcf33 0 22px, #111 22px 44px); }
    .sign { margin: 0; padding: 6px 14px; background: #000; color: var(--red); font: 400 22px var(--font-chunky);
      box-shadow: 0 0 0 3px var(--red); max-width: 340px; line-height: 1.3; }
    .big { width: 170px; height: 120px; border: 0; padding: 0; background: none; position: relative; }
    .big::before { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 46px; border-radius: 50%;
      background: #3a3a3a; box-shadow: inset 0 -8px 0 #1a1a1a; }
    .big__cap { position: absolute; left: 18px; right: 18px; bottom: 22px; height: 80px; border-radius: 50% 50% 46% 46%;
      background: radial-gradient(circle at 35% 30%, #ff8080, #e01b1b 40%, #7a0000);
      box-shadow: 0 10px 0 #5a0000, 0 0 30px rgba(224,27,27,.6); transition: transform .06s; }
    .big:active .big__cap { transform: translateY(8px); box-shadow: 0 2px 0 #5a0000; }
    .big:disabled .big__cap { animation: alarm .3s steps(2) infinite; }
    .countdown { margin: 0; font: 400 46px var(--font-display); color: #000; background: #ffcf33; padding: 0 12px;
      animation: alarm .5s steps(2) infinite; }
    .fine { margin: 0; color: var(--ink-dim); font-size: 16px; }
    @keyframes alarm { 50% { filter: brightness(1.8); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DontPressApp {
  private readonly os = inject(OsService);
  private readonly sound = inject(SoundService);
  private readonly destroyRef = inject(DestroyRef);
  readonly presses = signal(0);
  readonly sign = signal(WARNINGS[0]);
  readonly countdown = signal<number | null>(null);
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.timers.forEach(clearTimeout);
      this.os.shaking.set(false);
    });
  }

  press(): void {
    const n = this.presses() + 1;
    this.presses.set(n);
    this.sign.set(WARNINGS[Math.min(n, WARNINGS.length - 1)]);
    if (n < 4) {
      this.sound.error();
      return;
    }
    // Chaos sequence: siren → shaking → icons obey gravity → blue screen.
    this.sound.siren();
    this.os.shaking.set(true);
    this.os.gravity.set(true);
    this.countdown.set(3);
    [2, 1, 0].forEach((v, i) => this.timers.push(setTimeout(() => this.countdown.set(v), 1000 * (i + 1))));
    this.timers.push(setTimeout(() => this.os.bsod('SOMEONE_PRESSED_THE_BUTTON'), 3600));
  }
}
