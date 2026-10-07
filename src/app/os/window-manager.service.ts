import { Injectable, Type, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { APPS, AppDef, AppId, CloseGuard } from './apps';
import { OsService } from './os.service';
import { SoundService } from './sound.service';

export interface Win {
  id: number;
  app: AppDef;
  component: Type<unknown>;
  inputs: Record<string, unknown>;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export interface GuardDialog {
  winId: number;
  guard: CloseGuard;
}

const MOBILE = 720;

@Injectable({ providedIn: 'root' })
export class WindowManager {
  private readonly os = inject(OsService);
  private readonly sound = inject(SoundService);
  private readonly location = inject(Location);

  readonly windows = signal<Win[]>([]);
  readonly dialog = signal<GuardDialog | null>(null);
  readonly loading = signal(false);
  private nextId = 1;
  private topZ = 10;

  readonly active = computed(() => {
    const visible = this.windows().filter((w) => !w.minimized);
    return visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)) : null;
  });

  isMobile(): boolean {
    return this.os.browser && window.innerWidth < MOBILE;
  }

  async open(appId: AppId, inputs: Record<string, unknown> = {}): Promise<void> {
    const app = APPS[appId];
    if (!app.multi) {
      const existing = this.windows().find((w) => w.app.id === appId);
      if (existing) {
        if (Object.keys(inputs).length) this.patch(existing.id, { inputs: { ...existing.inputs, ...inputs } });
        this.focus(existing.id);
        return;
      }
    }

    this.loading.set(true);
    let component: Type<unknown>;
    try {
      component = await app.load();
    } finally {
      this.loading.set(false);
    }

    const vw = this.os.browser ? window.innerWidth : 1280;
    const vh = this.os.browser ? window.innerHeight - 44 : 760;
    const w = Math.min(app.w, vw - 24);
    const h = Math.min(app.h, vh - 24);
    const n = this.windows().length % 6;
    const x = Math.max(8, Math.round((vw - w) / 2 - 100 + n * 36));
    const y = Math.max(8, Math.round((vh - h) / 2 - 40 + n * 30));

    const win: Win = {
      id: this.nextId++, app, component, inputs, x, y, w, h,
      z: ++this.topZ, minimized: false, maximized: this.isMobile(),
    };
    this.windows.update((list) => [...list, win]);
    this.sound.open();
    this.syncUrl();
  }

  focus(id: number): void {
    const win = this.windows().find((w) => w.id === id);
    if (!win) return;
    if (win.z === this.topZ && !win.minimized) return;
    this.patch(id, { z: ++this.topZ, minimized: false });
    this.syncUrl();
  }

  /** Taskbar click: focus, or minimize if it's already on top. */
  toggleFromTaskbar(id: number): void {
    const win = this.windows().find((w) => w.id === id);
    if (!win) return;
    if (this.active()?.id === id) this.minimize(id);
    else this.focus(id);
  }

  minimize(id: number): void {
    this.patch(id, { minimized: true });
    this.sound.minimize();
    this.syncUrl();
  }

  toggleMax(id: number): void {
    const win = this.windows().find((w) => w.id === id);
    if (!win || this.isMobile()) return;
    this.patch(id, { maximized: !win.maximized, z: ++this.topZ });
  }

  move(id: number, x: number, y: number): void {
    this.patch(id, { x, y });
  }

  resize(id: number, w: number, h: number): void {
    this.patch(id, { w: Math.max(320, w), h: Math.max(220, h) });
  }

  requestClose(id: number): void {
    const win = this.windows().find((w) => w.id === id);
    if (!win) return;
    if (win.app.guard) {
      this.focus(id);
      this.sound.error();
      this.dialog.set({ winId: id, guard: win.app.guard });
      return;
    }
    this.close(id);
  }

  resolveDialog(leave: boolean): void {
    const d = this.dialog();
    this.dialog.set(null);
    if (d && leave) this.close(d.winId);
  }

  close(id: number): void {
    this.windows.update((list) => list.filter((w) => w.id !== id));
    this.sound.close();
    this.syncUrl();
  }

  closeApp(appId: AppId): void {
    this.windows().filter((w) => w.app.id === appId).forEach((w) => this.close(w.id));
  }

  closeAll(): void {
    this.windows.set([]);
    this.dialog.set(null);
    this.syncUrl();
  }

  isOpen(appId: AppId): boolean {
    return this.windows().some((w) => w.app.id === appId && !w.minimized);
  }

  private patch(id: number, changes: Partial<Win>): void {
    this.windows.update((list) => list.map((w) => (w.id === id ? { ...w, ...changes } : w)));
  }

  /** Keep the address bar pointing at whatever window is in front, so links still deep-link. */
  private syncUrl(): void {
    if (!this.os.browser) return;
    const route = this.active()?.app.route ?? '';
    const target = '/' + route;
    if (this.location.path() !== target && !(target === '/' && this.location.path() === '')) {
      this.location.replaceState(target);
    }
  }
}
