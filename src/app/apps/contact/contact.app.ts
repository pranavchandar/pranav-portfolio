import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LINKS } from '../../data/profile';
import { OsService } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';

const SUBJECTS = [
  'We need to talk about your website',
  'Saw the BSOD. Loved it. Are you free Thursday?',
  'Job offer (not spam, we promise)',
  'I typed sudo hire pranav and it told me to email you',
  'Commission request: draw my cat as a Hindu deity',
];

@Component({
  selector: 'app-contact',
  templateUrl: './contact.app.html',
  styleUrl: './contact.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactApp {
  private readonly os = inject(OsService);
  private readonly sound = inject(SoundService);
  readonly email = LINKS.find((l) => l.label === 'Email')!;
  readonly socials = LINKS.filter((l) => l.label !== 'Email');
  readonly subject = signal(SUBJECTS[0]);
  readonly body = signal("Hi Pranav,\n\nI found your portfolio. It's an operating system. Anyway,\n\n");
  readonly urgency = signal(2);
  private subjectIndex = 0;

  shuffle(): void {
    this.subjectIndex = (this.subjectIndex + 1) % SUBJECTS.length;
    this.subject.set(SUBJECTS[this.subjectIndex]);
    this.sound.key();
  }

  urgencyLabel(): string {
    return ['whenever', 'soon-ish', 'normal', 'urgent', 'EXTREMELY URGENT', 'my building is on fire but this matters more'][this.urgency()];
  }

  mailto(): string {
    const subject = (this.urgency() >= 4 ? '[URGENT] ' : '') + this.subject();
    return `${this.email.href}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.body())}`;
  }

  sent(): void {
    this.sound.ding();
    this.os.toast('Handing off to your mail app… Pranav usually replies faster than his renders finish.', 'mail');
  }
}
