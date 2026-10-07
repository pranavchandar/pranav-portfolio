import {
  ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output, signal,
} from '@angular/core';
import { OsService } from './os.service';
import { PixelIconComponent } from './pixel-icon.component';
import { ART } from '../data/art';
import { TAPES } from '../data/videos';

const POST: [string, string][] = [
  ['PRANAV BIOS v6.2  (C) 1995-2026 Chandar Megatrends Inc.', ''],
  ['', ''],
  ['CPU0: Left Hemisphere  (LOGIC)      @ 4.20 GHz', 'OK'],
  ['CPU1: Right Hemisphere (CREATIVITY) @ ∞ GHz', 'OK'],
  ['Memory test: 640K ought to be enough for anyb—', '65536K OK'],
  ['Detecting Java 21', 'FOUND'],
  ['Detecting Spring Boot', 'FOUND'],
  ['Detecting Angular', "FOUND (you're looking at it)"],
  ['Detecting Blender', 'FOUND (render ETA: 3 days)'],
  ['Detecting sleep schedule', 'NOT FOUND'],
  ['Caffeine level', 'CRITICAL (nominal)'],
  [`Mounting /art  (${ART.length} pieces)`, 'OK'],
  [`Mounting /cgi  (${TAPES.length} tapes)`, 'OK'],
  ['Loading personality.dll', 'OK'],
  ['Loading sense_of_humor.sys', 'OK (questionable)'],
  ['', ''],
  ['All systems nominal. Booting PRANAV OS 95...', ''],
];

const LOADING_LINES = [
  'Reticulating splines...',
  'Convincing pixels to cooperate...',
  'Hiding bugs from recruiters...',
  'Migrating Java 4 → Java 21 (emotionally)...',
  'Rendering the doughnut. Again...',
  'Untangling node_modules...',
  'Polishing the CRT...',
];

@Component({
  selector: 'os-boot',
  imports: [PixelIconComponent],
  templateUrl: './boot.component.html',
  styleUrl: './boot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'skip()',
    '(pointerdown)': 'skip()',
  },
})
export class BootComponent implements OnInit {
  private readonly os = inject(OsService);
  private readonly destroyRef = inject(DestroyRef);
  readonly quick = input(false);
  readonly done = output<void>();

  readonly stage = signal<'post' | 'splash'>('post');
  readonly lines = signal<[string, string][]>([]);
  readonly progress = signal(0);
  readonly loadingLine = signal(LOADING_LINES[0]);
  private timers: ReturnType<typeof setTimeout>[] = [];
  private finished = false;

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
    if (!this.os.browser) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('pranav-os.booted') === '1';
    } catch {
      /* ignore */
    }
    if (this.quick() || seen || reduced) {
      this.splash(reduced ? 300 : 900);
      return;
    }
    POST.forEach((line, i) => this.later(() => this.lines.update((l) => [...l, line]), 120 + i * 140));
    this.later(() => this.splash(2600), 120 + POST.length * 140 + 500);
  }

  /** Any key or click fast-forwards the boot. Impatience is a virtue. */
  skip(): void {
    if (!this.os.browser || this.finished) return;
    if (this.stage() === 'post') {
      this.timers.forEach(clearTimeout);
      this.lines.set(POST);
      this.splash(900);
    } else {
      this.finish();
    }
  }

  private splash(duration: number): void {
    this.stage.set('splash');
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      this.later(() => {
        this.progress.set(i / steps);
        if (i % 4 === 0) this.loadingLine.set(LOADING_LINES[(i / 4 + Math.floor(Math.random() * 3)) % LOADING_LINES.length]);
      }, (duration / steps) * i);
    }
    this.later(() => this.finish(), duration + 250);
  }

  private finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.timers.forEach(clearTimeout);
    this.done.emit();
  }

  private later(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(fn, ms));
  }

  segments = Array.from({ length: 20 }, (_, i) => i);
}
