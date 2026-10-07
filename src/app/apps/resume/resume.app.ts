import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { PixelIconComponent } from '../../os/pixel-icon.component';
import { OsService } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';
import { WindowManager } from '../../os/window-manager.service';
import {
  CAREER_START, CV_PATH, EDUCATION, EXPERIENCE, Elapsed, PROJECTS, SKILLS, SUMMARY, elapsedSince, pad2,
} from '../../data/profile';

const STEPS = ['Welcome', 'License', 'Experience', 'Components', 'Projects', 'Installing', 'Finish'];

const INSTALL_LOG = [
  'Copying java21.jar',
  'Registering spring-boot.dll',
  'Installing angular (this may take a while)',
  'Configuring CI/CD pipelines',
  'Running 1,284 Cucumber scenarios',
  'Releasing to production (zero incidents)',
  'Unpacking 72 drawings',
  'Rendering 15 CGI shots in the background',
  'Writing sense_of_humor.ini',
  'Removing bugs (most of them)',
  'Brewing coffee',
  'Creating desktop shortcut to LinkedIn',
];

@Component({
  selector: 'app-resume',
  imports: [PixelIconComponent],
  templateUrl: './resume.app.html',
  styleUrl: './resume.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeApp implements OnInit {
  private readonly os = inject(OsService);
  private readonly wm = inject(WindowManager);
  private readonly sound = inject(SoundService);
  private readonly destroyRef = inject(DestroyRef);

  readonly steps = STEPS;
  readonly summary = SUMMARY;
  readonly jobs = EXPERIENCE;
  readonly skills = SKILLS;
  readonly projects = PROJECTS;
  readonly education = EDUCATION;
  readonly cv = CV_PATH;

  readonly step = signal(0);
  readonly accepted = signal(false);
  readonly declineCount = signal(0);
  readonly progress = signal(0);
  readonly log = signal<string[]>([]);
  readonly launchContact = signal(true);
  readonly uptime = signal<Elapsed>(elapsedSince(CAREER_START));
  readonly uptimeUnits = computed(() => {
    const u = this.uptime();
    return [
      { label: 'YR', value: pad2(u.years) },
      { label: 'MO', value: pad2(u.months) },
      { label: 'DY', value: pad2(u.days) },
      { label: 'HR', value: pad2(u.hours) },
      { label: 'MN', value: pad2(u.minutes) },
      { label: 'SC', value: pad2(u.seconds) },
    ];
  });

  ngOnInit(): void {
    if (!this.os.browser) return;
    const t = setInterval(() => this.uptime.set(elapsedSince(CAREER_START)), 1000);
    this.destroyRef.onDestroy(() => clearInterval(t));
  }

  next(): void {
    if (this.step() === 1 && !this.accepted()) return;
    this.sound.click();
    this.step.update((s) => Math.min(STEPS.length - 1, s + 1));
    if (this.step() === 5) this.install();
  }

  back(): void {
    this.sound.click();
    this.step.update((s) => Math.max(0, s - 1));
  }

  decline(): void {
    this.accepted.set(false);
    this.declineCount.update((n) => n + 1);
    this.sound.error();
  }

  declineLabel(): string {
    return [
      'I do not accept the agreement',
      'I still do not accept',
      'Are we really doing this?',
      'Fine. Clicking this does nothing.',
    ][Math.min(3, this.declineCount())];
  }

  private install(): void {
    this.progress.set(0);
    this.log.set([]);
    if (!this.os.browser) return;
    let i = 0;
    const tick = setInterval(() => {
      if (i < INSTALL_LOG.length) this.log.update((l) => [...l, INSTALL_LOG[i]]);
      i++;
      this.progress.set(Math.min(100, Math.round((i / INSTALL_LOG.length) * 100)));
      if (i >= INSTALL_LOG.length) {
        clearInterval(tick);
        setTimeout(() => {
          if (this.step() === 5) {
            this.sound.ding();
            this.step.set(6);
          }
        }, 500);
      }
    }, 260);
    this.destroyRef.onDestroy(() => clearInterval(tick));
  }

  downloaded(): void {
    this.sound.coin();
    this.os.toast('RESUME downloaded. Pranav has been successfully installed (pending HR approval).', 'floppy');
  }

  finish(): void {
    this.wm.closeApp('resume');
    if (this.launchContact()) this.wm.open('contact');
    else this.os.toast('Setup complete. Please restart your hiring process to apply changes.', 'floppy');
  }

  cancel(): void {
    const win = this.wm.windows().find((w) => w.app.id === 'resume');
    if (win) this.wm.requestClose(win.id);
  }
}
