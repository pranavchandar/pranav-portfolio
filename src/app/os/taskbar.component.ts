import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, inject, signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { APPS, AppId } from './apps';
import { OsService } from './os.service';
import { PixelIconComponent } from './pixel-icon.component';
import { SoundService } from './sound.service';
import { WindowManager } from './window-manager.service';
import { CAREER_START, elapsedSince } from '../data/profile';

@Component({
  selector: 'os-taskbar',
  imports: [PixelIconComponent, RouterLink],
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:pointerdown)': 'outside($event)' },
})
export class TaskbarComponent implements OnInit {
  readonly wm = inject(WindowManager);
  readonly os = inject(OsService);
  private readonly sound = inject(SoundService);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly menuOpen = signal(false);
  readonly clock = signal('--:--');
  readonly uptime = signal('');

  readonly menu: AppId[] = ['about', 'resume', 'art', 'cgi', 'code', 'terminal', 'contact', 'punch', 'intro', 'settings'];
  readonly apps = APPS;

  ngOnInit(): void {
    if (!this.os.browser) return;
    const tick = () => {
      const now = new Date();
      this.clock.set(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const e = elapsedSince(CAREER_START, now);
      this.uptime.set(`${e.years}y ${e.months}m ${e.days}d ${e.hours}h ${e.minutes}m ${e.seconds}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    this.destroyRef.onDestroy(() => clearInterval(t));
  }

  toggleMenu(): void {
    this.sound.click();
    this.menuOpen.update((v) => !v);
  }

  launch(id: AppId): void {
    this.menuOpen.set(false);
    this.wm.open(id);
  }

  shutdown(): void {
    this.menuOpen.set(false);
    this.os.shutdown();
  }

  outside(e: PointerEvent): void {
    if (this.menuOpen() && !this.el.nativeElement.contains(e.target as Node)) this.menuOpen.set(false);
  }

  toggleSound(): void {
    this.os.set('sound', !this.os.settings().sound);
    this.sound.click();
  }

  summonAssistant(): void {
    this.os.assistantPing.update((n) => n + 1);
  }
}
