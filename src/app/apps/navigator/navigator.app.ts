import {
  ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal, untracked,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GITHUB_PROFILE, PROJECTS_LIST, Project } from '../../data/projects';
import { OsService } from '../../os/os.service';
import { PixelIconComponent } from '../../os/pixel-icon.component';
import { SoundService } from '../../os/sound.service';
import { WindowManager } from '../../os/window-manager.service';

/** Pages Navigator knows about: the portal, every project, GitHub, and a 404. */
type PageId = 'home' | 'github' | 'notfound' | string;

const LIVE = PROJECTS_LIST.filter((p) => p.live);
const MAX_DEPTH = 2;

@Component({
  selector: 'app-navigator',
  imports: [PixelIconComponent],
  templateUrl: './navigator.app.html',
  styleUrl: './navigator.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorApp {
  private readonly os = inject(OsService);
  private readonly wm = inject(WindowManager);
  private readonly sound = inject(SoundService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  /** Which page to open, e.g. 'sky'. Set by PROJECTS, the terminal or a deep link. */
  readonly site = input<string>();
  /** Changes on every launch so re-opening the same site still navigates. */
  readonly nonce = input<number>();

  readonly live = LIVE;
  readonly building = PROJECTS_LIST.filter((p) => p.status === 'building');
  readonly private = PROJECTS_LIST.filter((p) => p.status === 'self-hosted');
  readonly profile = GITHUB_PROFILE;
  readonly depth = this.os.depth;
  readonly maxDepth = MAX_DEPTH;

  readonly page = signal<PageId>('home');
  readonly history = signal<PageId[]>(['home']);
  readonly cursor = signal(0);
  readonly dialing = signal(false);
  readonly loaded = signal(false);
  readonly modemLog = signal<string[]>([]);
  readonly phone = signal(true);
  readonly typed = signal<string | null>(null);
  readonly visitor = signal(41);

  readonly project = computed(() => PROJECTS_LIST.find((p) => p.id === this.page()) ?? null);
  readonly address = computed(() => {
    const p = this.page();
    if (p === 'home') return 'pranav://home';
    if (p === 'github') return 'https://github.com/pranavchandar';
    if (p === 'notfound') return this.lastTyped || 'about:blank';
    const proj = this.project();
    if (proj?.live) return proj.live.url;
    if (proj?.status === 'self-hosted') return 'http://100.64.0.42:8765';
    return proj?.repo ?? 'about:blank';
  });
  readonly status = computed(() => {
    if (this.dialing()) return `Connecting to ${this.hostOf(this.page())}…`;
    if (this.frameUrl() && !this.loaded()) return `Waiting for ${this.hostOf(this.page())}…`;
    return 'Document: Done';
  });

  /** The page's iframe URL, when this page can actually be shown inside Navigator. */
  readonly frameUrl = computed<SafeResourceUrl | null>(() => {
    const proj = this.project();
    if (!proj?.live?.frameable) return null;
    if (proj.id === 'portfolio' && this.depth() >= MAX_DEPTH) return null;
    // URLs come from data/projects.ts in this repo, never from user input.
    return this.sanitizer.bypassSecurityTrustResourceUrl(proj.live.url);
  });

  private lastTyped = '';
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
    effect(() => {
      const site = this.site();
      this.nonce();
      if (site) untracked(() => this.go(site));
    });
    if (this.os.browser) {
      try {
        const n = Number(localStorage.getItem('pranav-os.visitor') ?? '41') + 1;
        localStorage.setItem('pranav-os.visitor', String(n));
        this.visitor.set(n);
      } catch {
        /* the counter is decorative */
      }
    }
  }

  go(id: PageId, record = true): void {
    if (record) {
      const kept = this.history().slice(0, this.cursor() + 1);
      this.history.set([...kept, id]);
      this.cursor.set(kept.length);
    }
    this.page.set(id);
    this.loaded.set(false);
    this.typed.set(null);
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (id === 'home' || !this.os.browser) {
      this.dialing.set(false);
      return;
    }
    this.dial(id);
  }

  back(): void {
    if (this.cursor() === 0) return;
    this.cursor.update((c) => c - 1);
    this.go(this.history()[this.cursor()], false);
  }

  forward(): void {
    if (this.cursor() >= this.history().length - 1) return;
    this.cursor.update((c) => c + 1);
    this.go(this.history()[this.cursor()], false);
  }

  reload(): void {
    this.go(this.page(), false);
  }

  /** Typing in the address bar: Navigator only knows Pranav's corner of the internet. */
  submitAddress(value: string): void {
    const q = value.trim().toLowerCase();
    if (!q) return;
    this.lastTyped = value.trim();
    const match = PROJECTS_LIST.find(
      (p) =>
        q.includes(p.id) ||
        q.includes(p.name.toLowerCase()) ||
        (p.live && (q.includes(p.live.host.toLowerCase()) || p.live.url.toLowerCase().includes(q))),
    );
    if (match) this.go(match.id);
    else if (q.includes('github')) this.go('github');
    else if (q === 'home' || q.startsWith('pranav://')) this.go('home');
    else this.go('notfound');
  }

  ringStep(dir: number): void {
    const i = LIVE.findIndex((p) => p.id === this.page());
    this.go(LIVE[(i + dir + LIVE.length) % LIVE.length].id);
  }

  openProjects(): void {
    this.wm.open('projects');
  }

  hostOf(id: PageId): string {
    if (id === 'github') return 'github.com';
    if (id === 'notfound') return 'the void';
    const p = PROJECTS_LIST.find((x) => x.id === id);
    return p?.live?.host.split('/')[0] ?? (p?.status === 'self-hosted' ? '100.64.0.42' : 'github.com');
  }

  private dial(id: PageId): void {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.dialing.set(false);
      return;
    }
    const host = this.hostOf(id);
    const p = PROJECTS_LIST.find((x) => x.id === id);
    const lines = [
      'ATZ',
      'OK',
      'ATDT 1-800-PRANAV',
      'RING… RING…',
      'CONNECT 56000/V.90',
      `Resolving ${host}…`,
      p?.id === 'sky' ? 'Poking the server awake (Render free tier)…' : p?.id === 'portfolio' ? 'Warning: destination is this computer.' : 'Handshake OK.',
    ];
    this.dialing.set(true);
    this.modemLog.set([]);
    this.sound.modem();
    lines.forEach((l, i) => this.timers.push(setTimeout(() => this.modemLog.update((log) => [...log, l]), 120 + i * 220)));
    this.timers.push(setTimeout(() => this.dialing.set(false), 120 + lines.length * 220 + 250));
  }

  isProject(p: Project | null): p is Project {
    return !!p;
  }
}
