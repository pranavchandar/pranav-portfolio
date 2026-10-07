import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ART, ART_CATEGORIES, ArtPiece, placardFor } from '../../data/art';
import { OsService } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';

const GUARD_LINES = [
  '🚨 Please do not touch the art.',
  '🚨 Sir/Madam. The art.',
  '🚨 Security has been notified.',
  '🚨 Okay that\'s it, you\'re banned from the gift shop.',
];

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.app.html',
  styleUrl: './gallery.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(keydown)': 'onKey($event)', tabindex: '-1' },
})
export class GalleryApp {
  private readonly os = inject(OsService);
  private readonly sound = inject(SoundService);

  readonly categories = ART_CATEGORIES;
  readonly total = ART.length;
  readonly category = signal('All');
  readonly query = signal('');
  readonly current = signal<ArtPiece | null>(null);
  private touches = 0;

  readonly pieces = computed(() => {
    const q = this.query().toLowerCase().trim();
    const c = this.category();
    return ART.filter((p) => (c === 'All' || p.category === c) && (!q || p.title.toLowerCase().includes(q)));
  });

  readonly placard = computed(() => {
    const p = this.current();
    return p ? placardFor(p) : null;
  });

  readonly position = computed(() => {
    const p = this.current();
    return p ? this.pieces().findIndex((x) => x.id === p.id) + 1 : 0;
  });

  open(p: ArtPiece): void {
    this.sound.click();
    this.current.set(p);
  }

  step(dir: number): void {
    const list = this.pieces();
    const p = this.current();
    if (!p || !list.length) return;
    const i = list.findIndex((x) => x.id === p.id);
    this.current.set(list[(i + dir + list.length) % list.length]);
    this.sound.key();
  }

  touchArt(): void {
    this.os.toast(GUARD_LINES[Math.min(this.touches++, GUARD_LINES.length - 1)], 'frame');
    this.sound.error();
  }

  setWallpaper(p: ArtPiece): void {
    this.os.set('wallpaper', `art:${p.slug}`);
    this.sound.ding();
    this.os.toast(`"${p.title}" is now your wallpaper. Minimize everything to admire it.`, 'frame');
  }

  random(): void {
    const list = this.pieces();
    if (list.length) this.open(list[Math.floor(Math.random() * list.length)]);
  }

  onKey(e: KeyboardEvent): void {
    if (!this.current()) return;
    if (e.key === 'ArrowRight') this.step(1);
    if (e.key === 'ArrowLeft') this.step(-1);
    if (e.key === 'Escape') {
      e.stopPropagation();
      this.current.set(null);
    }
  }
}
