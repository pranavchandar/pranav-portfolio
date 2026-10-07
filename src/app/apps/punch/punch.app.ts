import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SoundService } from '../../os/sound.service';
import { WindowManager } from '../../os/window-manager.service';

interface Hit { id: number; x: number; y: number; text: string; crit: boolean }

const TAUNTS = ['ow.', 'my code!', 'not the beard', 'I have a deadline', 'HR will hear about this', 'that one was personal'];

/** The old About page's "-20HP" gag, promoted to a full fighting game. */
@Component({
  selector: 'app-punch',
  templateUrl: './punch.app.html',
  styleUrl: './punch.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PunchApp {
  private readonly sound = inject(SoundService);
  private readonly wm = inject(WindowManager);
  readonly hp = signal(100);
  readonly hits = signal<Hit[]>([]);
  readonly oof = signal(false);
  readonly combo = signal(0);
  readonly taunt = signal<string | null>(null);
  readonly ko = signal(false);
  readonly rounds = signal(1);
  private hitId = 0;
  private lastHit = 0;

  punch(e: MouseEvent): void {
    if (this.ko()) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const crit = Math.random() < 0.15;
    const dmg = crit ? 40 : 20;
    const now = Date.now();
    this.combo.set(now - this.lastHit < 700 ? this.combo() + 1 : 1);
    this.lastHit = now;

    const hit: Hit = {
      id: ++this.hitId,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      text: crit ? `-${dmg}HP CRIT!` : `-${dmg}HP`,
      crit,
    };
    this.hits.update((h) => [...h, hit]);
    setTimeout(() => this.hits.update((h) => h.filter((x) => x.id !== hit.id)), 900);

    this.sound.punch();
    this.oof.set(true);
    setTimeout(() => this.oof.set(false), 140);
    this.hp.set(Math.max(0, this.hp() - dmg));

    if (Math.random() < 0.4) {
      this.taunt.set(TAUNTS[Math.floor(Math.random() * TAUNTS.length)]);
      setTimeout(() => this.taunt.set(null), 1100);
    }

    if (this.hp() === 0) {
      this.ko.set(true);
      this.taunt.set(null);
      setTimeout(() => this.sound.ko(), 150);
    }
  }

  loot(): void {
    this.sound.coin();
    this.wm.open('resume');
  }

  rematch(): void {
    this.hp.set(100);
    this.ko.set(false);
    this.combo.set(0);
    this.rounds.update((r) => r + 1);
  }
}
