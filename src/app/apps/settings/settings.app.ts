import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ART } from '../../data/art';
import { CAREER_START, elapsedSince } from '../../data/profile';
import { OsService, Settings } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';

type Toggle = 'crt' | 'sound' | 'trail' | 'comic' | 'assistant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.app.html',
  styleUrl: './settings.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsApp {
  readonly os = inject(OsService);
  private readonly sound = inject(SoundService);
  readonly s = this.os.settings;

  readonly toggles: { key: Toggle; label: string; note: string }[] = [
    { key: 'crt', label: 'CRT scanlines', note: 'authentic 1995 eye strain' },
    { key: 'sound', label: 'Sound effects', note: 'bleeps, bloops, one (1) punch' },
    { key: 'trail', label: 'Cursor trail', note: 'for when your mouse needs a cape' },
    { key: 'comic', label: 'Comic Sans mode', note: 'designers hate this one trick' },
    { key: 'assistant', label: 'Smiley the assistant', note: 'unsolicited advice, delivered daily' },
  ];

  readonly wallpapers = [
    { id: 'bars', label: 'Red Bars' },
    { id: 'grid', label: 'Outrun 2049' },
    { id: 'teal', label: 'Corporate Teal 95' },
  ];

  readonly artWallpaper = computed(() => {
    const w = this.s().wallpaper;
    return w.startsWith('art:') ? ART.find((p) => p.slug === w.slice(4)) ?? null : null;
  });

  readonly caffeineLabel = computed(() => {
    const c = this.s().caffeine;
    if (c < 20) return 'decaf (concerning)';
    if (c < 50) return 'functional';
    if (c < 85) return 'productive';
    return 'VIBRATING';
  });

  readonly uptime = computed(() => {
    const e = elapsedSince(CAREER_START);
    return `${e.years} years, ${e.months} months`;
  });

  toggle(key: Toggle): void {
    this.os.set(key, !this.s()[key]);
    this.sound.click();
  }

  setWallpaper(id: string): void {
    this.os.set('wallpaper', id);
    this.sound.click();
  }

  randomArt(): void {
    const p = ART[Math.floor(Math.random() * ART.length)];
    this.os.set('wallpaper', `art:${p.slug}`);
    this.sound.ding();
  }

  slide<K extends keyof Settings>(key: K, e: Event): void {
    this.os.set(key, Number((e.target as HTMLInputElement).value) as Settings[K]);
  }

  reset(): void {
    this.os.reset();
    this.sound.ding();
    this.os.toast('Factory settings restored. Pranav is back to being merely a software engineer.', 'gear');
  }
}
