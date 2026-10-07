import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IconName } from './pixel-icons';
import { SoundService } from './sound.service';

export type Phase = 'boot' | 'desktop' | 'bsod' | 'shutdown';

export interface Settings {
  crt: boolean;
  sound: boolean;
  trail: boolean;
  comic: boolean;
  wallpaper: string; // 'bars' | 'void' | 'teal' | 'art:<slug>'
  caffeine: number;
  pretension: number;
  assistant: boolean;
}

export interface Toast {
  id: number;
  text: string;
  icon: IconName;
}

const DEFAULTS: Settings = {
  crt: true,
  sound: true,
  trail: false,
  comic: false,
  wallpaper: 'bars',
  caffeine: 40,
  pretension: 0,
  assistant: true,
};

const KEY = 'pranav-os.settings';

/** Global OS state: boot phase, user settings, chaos flags, toasts. */
@Injectable({ providedIn: 'root' })
export class OsService {
  private readonly sound = inject(SoundService);
  readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly phase = signal<Phase>('boot');
  readonly settings = signal<Settings>({ ...DEFAULTS });
  readonly bsodReason = signal('PRANAV_TOO_POWERFUL');
  readonly party = signal(false);
  readonly gravity = signal(false);
  readonly shaking = signal(false);
  readonly toasts = signal<Toast[]>([]);
  readonly assistantPing = signal(0);
  private toastId = 0;
  private loaded = false;

  constructor() {
    effect(() => {
      const s = this.settings();
      this.sound.enabled = s.sound;
      if (!this.browser || !this.loaded) return;
      try {
        localStorage.setItem(KEY, JSON.stringify(s));
      } catch {
        /* private mode — settings just won't stick */
      }
      document.body.classList.toggle('comic', s.comic);
    });
  }

  /** Called once on the client after first render so SSR and hydration agree. */
  load(): void {
    if (!this.browser || this.loaded) return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) this.settings.set({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt settings */
    }
    this.loaded = true;
    this.settings.update((s) => ({ ...s }));
  }

  set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    this.settings.update((s) => ({ ...s, [key]: value }));
  }

  reset(): void {
    this.settings.set({ ...DEFAULTS });
  }

  toast(text: string, icon: IconName = 'smiley'): void {
    const id = ++this.toastId;
    this.toasts.update((t) => [...t.slice(-3), { id, text, icon }]);
    if (this.browser) setTimeout(() => this.toasts.update((t) => t.filter((x) => x.id !== id)), 4200);
  }

  bsod(reason = 'PRANAV_TOO_POWERFUL'): void {
    this.bsodReason.set(reason);
    this.gravity.set(false);
    this.shaking.set(false);
    this.sound.crash();
    this.phase.set('bsod');
  }

  shutdown(): void {
    this.sound.close();
    this.phase.set('shutdown');
  }

  reboot(): void {
    this.gravity.set(false);
    this.party.set(false);
    this.phase.set('boot');
  }
}
