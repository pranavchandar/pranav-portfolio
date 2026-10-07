import {
  ChangeDetectionStrategy, Component, DestroyRef, NgZone, afterNextRender, computed, effect, inject, signal, untracked,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { APPS, AppId, DESKTOP } from './apps';
import { AssistantComponent } from './assistant.component';
import { BootComponent } from './boot.component';
import { CrashComponent } from './crash.component';
import { EffectsComponent } from './effects.component';
import { OsService } from './os.service';
import { IconName } from './pixel-icons';
import { PixelIconComponent } from './pixel-icon.component';
import { ScreensaverComponent } from './screensaver.component';
import { SoundService } from './sound.service';
import { TaskbarComponent } from './taskbar.component';
import { WindowComponent } from './window.component';
import { WindowManager } from './window-manager.service';
import { ART } from '../data/art';

interface DesktopIcon {
  id: AppId | 'boring';
  label: string;
  icon: IconName;
  /** Label with zero-width break opportunities after _ and . so long names wrap nicely */
  wrapped: string;
}

const wrap = (label: string) => label.replace(/([_.])/g, '$1\u200b');

interface Pos { x: number; y: number; r: number }

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
const CELL_W = 104;
const CELL_H = 96;
const IDLE_MS = 60_000;
const POS_KEY = 'pranav-os.icons';
const BOOT_KEY = 'pranav-os.booted';

const PET_FRAMES = ['1top', '2topmid', '3mid', '4botmid', '5bot'].map((n) => `assets/images/${n}.webp`);
const PET_QUIPS = [
  'beep boop. hire him.',
  'I rendered this face myself.',
  'stop poking me.',
  'I run on Java 21 and spite.',
  'have you tried the terminal?',
  '01101000 01101001',
  'my eyes follow you. professionally.',
];

const TITLES: [number, string][] = [
  [95, 'ESQ., PhD (HONORARY, SELF-AWARDED)'],
  [75, 'THOUGHT LEADER™ · DIGITAL POLYMATH · KEYNOTE SPEAKER (UNINVITED)'],
  [50, 'FULL-STACK VISIONARY · PIXEL ALCHEMIST'],
  [25, 'SOFTWARE CRAFTSPERSON & VISUAL STORYTELLER'],
  [0, 'SOFTWARE ENGINEER · DIGITAL ARTIST · CGI GOBLIN'],
];

@Component({
  selector: 'app-os',
  imports: [
    NgComponentOutlet, BootComponent, TaskbarComponent, WindowComponent, PixelIconComponent,
    ScreensaverComponent, AssistantComponent, CrashComponent, EffectsComponent,
  ],
  templateUrl: './os.component.html',
  styleUrl: './os.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'onKey($event)',
    '(window:pointermove)': 'onPointerMove($event)',
    '(window:pointerdown)': 'poke()',
    '(window:wheel)': 'poke()',
    '(window:resize)': 'layoutIcons()',
  },
})
export class OsComponent {
  readonly os = inject(OsService);
  readonly wm = inject(WindowManager);
  private readonly sound = inject(SoundService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly icons: DesktopIcon[] = DESKTOP.map((id) =>
    id === 'boring'
      ? { id, label: 'BORING_MODE', icon: 'tie' as IconName, wrapped: wrap('BORING_MODE') }
      : { id, label: APPS[id].label, icon: APPS[id].icon, wrapped: wrap(APPS[id].label) },
  );

  readonly quickBoot = signal(false);
  readonly positions = signal<Pos[]>(this.icons.map((_, i) => ({ x: 12, y: 12 + i * CELL_H, r: 0 })));
  readonly selected = signal<string | null>(null);
  readonly idle = signal(false);
  readonly petFrame = signal(2);
  readonly petQuip = signal<string | null>(null);
  readonly dodge = signal({ x: 0, y: 0, n: 0 });

  readonly title = computed(() => TITLES.find(([min]) => this.os.settings().pretension >= min)![1]);
  readonly wallpaper = computed(() => {
    const w = this.os.settings().wallpaper;
    if (w.startsWith('art:')) {
      const piece = ART.find((p) => p.slug === w.slice(4));
      return { kind: 'art', url: piece ? `url(${piece.image})` : null };
    }
    return { kind: w, url: null };
  });
  readonly jittery = computed(() => this.os.settings().caffeine >= 85);

  private konami: string[] = [];
  private lastActive = Date.now();
  private customPositions: Record<string, { x: number; y: number }> = {};
  private physicsRaf = 0;
  private petTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      this.os.load();
      try {
        this.quickBoot.set(sessionStorage.getItem(BOOT_KEY) === '1');
        this.customPositions = JSON.parse(localStorage.getItem(POS_KEY) ?? '{}');
      } catch {
        this.customPositions = {};
      }
      this.layoutIcons();
      const idleCheck = setInterval(() => this.checkIdle(), 3000);
      this.destroyRef.onDestroy(() => {
        clearInterval(idleCheck);
        cancelAnimationFrame(this.physicsRaf);
      });
    });

    // A crash or shutdown kills every window, like a real computer would.
    effect(() => {
      const phase = this.os.phase();
      if (phase === 'bsod' || phase === 'shutdown') {
        untracked(() => {
          this.wm.closeAll();
          this.idle.set(false);
        });
      }
    });

    // Gravity: when DONT_PRESS.EXE is pressed one too many times, the desktop icons fall over.
    effect(() => {
      const falling = this.os.gravity();
      if (!this.os.browser) return;
      if (falling) untracked(() => this.dropIcons());
      else
        untracked(() => {
          cancelAnimationFrame(this.physicsRaf);
          this.layoutIcons();
        });
    });
  }

  // ── Boot ─────────────────────────────────────────────────────────
  booted(): void {
    try {
      sessionStorage.setItem(BOOT_KEY, '1');
    } catch {
      /* ignore */
    }
    this.quickBoot.set(true);
    this.os.phase.set('desktop');
    this.sound.startup();
    this.layoutIcons();
    const deepLink = this.route.snapshot.data['open'] as AppId | undefined;
    if (deepLink && !this.wm.windows().some((w) => w.app.id === deepLink)) {
      this.wm.open(deepLink);
    }
  }

  // ── Icons ────────────────────────────────────────────────────────
  layoutIcons(): void {
    if (!this.os.browser || this.os.gravity()) return;
    const usable = window.innerHeight - 44 - 16;
    const perCol = Math.max(3, Math.floor(usable / CELL_H));
    const maxX = window.innerWidth - CELL_W;
    const maxY = usable - CELL_H + 16;
    this.positions.set(
      this.icons.map((icon, i) => {
        const custom = this.customPositions[icon.id];
        const x = custom ? custom.x : 8 + Math.floor(i / perCol) * CELL_W;
        const y = custom ? custom.y : 8 + (i % perCol) * CELL_H;
        return {
          x: Math.max(0, Math.min(maxX, x)),
          y: Math.max(0, Math.min(maxY, y)),
          r: 0,
        };
      }),
    );
  }

  iconPointerDown(e: PointerEvent, index: number): void {
    const icon = this.icons[index];
    this.selected.set(icon.id);
    if (e.button !== 0 || this.os.gravity()) return;
    const start = this.positions()[index];
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture?.(e.pointerId);

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      this.positions.update((list) =>
        list.map((p, i) => (i === index ? { x: start.x + dx, y: Math.max(0, start.y + dy), r: 0 } : p)),
      );
    };
    const up = (ev: PointerEvent) => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      if (moved) {
        const p = this.positions()[index];
        this.customPositions[icon.id] = { x: Math.round(p.x), y: Math.round(p.y) };
        try {
          localStorage.setItem(POS_KEY, JSON.stringify(this.customPositions));
        } catch {
          /* ignore */
        }
      } else if (ev.pointerType !== 'mouse') {
        // Touch has no double-click; a single tap launches.
        this.launch(icon.id);
      }
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
  }

  launch(id: AppId | 'boring'): void {
    if (this.os.gravity()) return;
    if (id === 'boring') {
      this.router.navigateByUrl('/boring');
      return;
    }
    this.wm.open(id);
  }

  resetIcons(): void {
    this.customPositions = {};
    try {
      localStorage.removeItem(POS_KEY);
    } catch {
      /* ignore */
    }
    this.layoutIcons();
  }

  private dropIcons(): void {
    if (!this.os.browser) return;
    const floor = window.innerHeight - 44 - CELL_H;
    const width = window.innerWidth - CELL_W;
    const bodies = this.positions().map((p) => ({
      ...p,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 12,
      vr: (Math.random() - 0.5) * 20,
    }));
    this.zone.runOutsideAngular(() => {
      const step = () => {
        for (const b of bodies) {
          b.vy += 0.9;
          b.x += b.vx;
          b.y += b.vy;
          b.r += b.vr;
          if (b.y > floor) {
            b.y = floor;
            b.vy *= -0.45;
            b.vx *= 0.8;
            b.vr *= 0.7;
          }
          if (b.x < 0 || b.x > width) {
            b.vx *= -0.8;
            b.x = Math.max(0, Math.min(width, b.x));
          }
        }
        this.zone.run(() => this.positions.set(bodies.map(({ x, y, r }) => ({ x, y, r }))));
        if (this.os.gravity()) this.physicsRaf = requestAnimationFrame(step);
      };
      this.physicsRaf = requestAnimationFrame(step);
    });
  }

  // ── Desktop pet (the CRT whose face follows your cursor) ──────────
  onPointerMove(e: PointerEvent): void {
    this.poke();
    const frame = Math.min(4, Math.max(0, Math.floor((e.clientY / window.innerHeight) * 5)));
    if (frame !== this.petFrame()) this.petFrame.set(frame);
  }

  petClick(): void {
    this.sound.key();
    this.petQuip.set(PET_QUIPS[Math.floor(Math.random() * PET_QUIPS.length)]);
    if (this.petTimer) clearTimeout(this.petTimer);
    this.petTimer = setTimeout(() => this.petQuip.set(null), 2600);
  }

  readonly petFrames = PET_FRAMES;

  // ── Keyboard: Konami, terminal hotkey ────────────────────────────
  onKey(e: KeyboardEvent): void {
    this.poke();
    if (this.os.phase() !== 'desktop') return;
    const key = e.key.toLowerCase();
    this.konami = [...this.konami, key].slice(-KONAMI.length);
    if (this.konami.join() === KONAMI.join()) {
      this.konami = [];
      this.party();
    }
    const typing = (e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable]');
    if (!typing && (e.key === '`' || e.key === '~')) {
      e.preventDefault();
      this.wm.open('terminal');
    }
    if (e.key === 'Escape' && this.wm.dialog()) this.wm.resolveDialog(false);
  }

  party(): void {
    this.os.party.set(true);
    this.sound.powerUp();
    this.os.toast('GOD MODE ENABLED · +30 lives · +∞ creativity · -1 dignity', 'smiley');
    setTimeout(() => this.os.party.set(false), 12000);
  }

  // ── Idle → screensaver ───────────────────────────────────────────
  poke(): void {
    this.lastActive = Date.now();
    if (this.idle()) this.idle.set(false);
  }

  private checkIdle(): void {
    const watching = this.wm.isOpen('cgi') || this.wm.isOpen('intro');
    if (this.os.phase() === 'desktop' && !watching && Date.now() - this.lastActive > IDLE_MS) {
      this.idle.set(true);
    }
  }

  // ── Close-guard dialog with a cowardly button ────────────────────
  dodgeLeave(e: PointerEvent): void {
    if (e.pointerType !== 'mouse') return;
    const d = this.dodge();
    if (d.n >= 4) return;
    const angle = Math.random() * Math.PI * 2;
    this.dodge.set({ x: Math.cos(angle) * 140, y: Math.sin(angle) * 70, n: d.n + 1 });
    this.sound.key();
  }

  resolveGuard(leave: boolean): void {
    this.dodge.set({ x: 0, y: 0, n: 0 });
    this.wm.resolveDialog(leave);
  }

  dodgeText(): string {
    const n = this.dodge().n;
    return ['', 'nope', 'too slow', 'almost!', 'fine. click me.'][n] ?? '';
  }
}
