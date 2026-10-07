import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TAPES, Tape, embedFor, thumbFor } from '../../data/videos';
import { SoundService } from '../../os/sound.service';

type DeckState = 'empty' | 'inserting' | 'loaded' | 'playing';

@Component({
  selector: 'app-cgi',
  templateUrl: './cgi.app.html',
  styleUrl: './cgi.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CgiApp {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly sound = inject(SoundService);

  readonly filters = ['All', 'Showcase', 'CGI Short'] as const;
  readonly filter = signal<'All' | Tape['kind']>('All');
  readonly tapes = computed(() => TAPES.filter((t) => this.filter() === 'All' || t.kind === this.filter()));
  readonly tape = signal<Tape | null>(null);
  readonly state = signal<DeckState>('empty');
  readonly thumb = thumbFor;
  private readonly embeds = new Map<string, SafeResourceUrl>();

  readonly display = computed(() => {
    const t = this.tape();
    switch (this.state()) {
      case 'empty': return '12:00';
      case 'inserting': return 'LOAD';
      case 'loaded': return 'STOP ' + (t?.title.slice(0, 10).toUpperCase() ?? '');
      case 'playing': return 'PLAY ' + (t?.title.slice(0, 10).toUpperCase() ?? '');
    }
  });

  embed(t: Tape): SafeResourceUrl {
    let url = this.embeds.get(t.id);
    if (!url) {
      // Static YouTube embed of a hard-coded video id from this repo.
      url = this.sanitizer.bypassSecurityTrustResourceUrl(embedFor(t.id));
      this.embeds.set(t.id, url);
    }
    return url;
  }

  insert(t: Tape): void {
    if (this.tape()?.id === t.id && this.state() !== 'empty') {
      this.play();
      return;
    }
    this.tape.set(t);
    this.state.set('inserting');
    this.sound.punch();
    setTimeout(() => {
      if (this.tape()?.id === t.id) {
        this.state.set('loaded');
        this.sound.click();
      }
    }, 650);
  }

  play(): void {
    if (!this.tape()) return;
    this.sound.click();
    this.state.set('playing');
  }

  stop(): void {
    if (this.state() === 'playing') this.state.set('loaded');
  }

  eject(): void {
    if (!this.tape()) return;
    this.sound.minimize();
    this.state.set('empty');
    this.tape.set(null);
  }

  thumbError(e: Event, id: string): void {
    const img = e.target as HTMLImageElement;
    if (!img.src.includes('mqdefault')) img.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  }
}
