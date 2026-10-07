import {
  ChangeDetectionStrategy, Component, DestroyRef, OnInit, effect, inject, signal, untracked,
} from '@angular/core';
import { AppId } from './apps';
import { OsService } from './os.service';
import { PixelIconComponent } from './pixel-icon.component';
import { WindowManager } from './window-manager.service';

interface Tip {
  text: string;
  yes: string;
  no: string;
  app?: AppId;
  run?: string;
}

const TIPS: Tip[] = [
  { text: "Hi! I'm Smiley, your unpaid desktop assistant. It looks like you're trying to hire a software engineer. Would you like help with that?", yes: 'Yes, show RESUME.EXE', no: 'No, I enjoy suffering', app: 'resume' },
  { text: 'Did you know? There are 72 original drawings in ART_GALLERY. That is 72 more than most backend engineers.', yes: 'Show me', no: 'Later', app: 'art' },
  { text: "Tip: open TERMINAL and type 'sudo hire pranav'. I'm not saying what happens. I'm just saying.", yes: 'Open Terminal', no: 'Ok', app: 'terminal' },
  { text: "You've been here a while. I'm not saying you should send him an email, but... you should send him an email.", yes: 'Write email', no: 'Shh', app: 'contact' },
  { text: 'Fun fact: Pranav also makes CGI. There are 15 VHS tapes in CGI_TAPES. None of them are your wedding.', yes: 'Insert tape', no: 'Nah', app: 'cgi' },
  { text: 'Psst. ↑ ↑ ↓ ↓ ← → ← → B A', yes: '?!', no: 'I know.' },
  { text: "Whatever you do, do NOT open DONT_PRESS.EXE. It's right there on the desktop. Don't.", yes: 'Open it', no: 'I am a rule follower', app: 'dontpress' },
];

/** Clippy's cousin. Lives in the corner, emits unsolicited advice. */
@Component({
  selector: 'os-assistant',
  imports: [PixelIconComponent],
  template: `
    @if (tip(); as t) {
      <aside class="bubble bevel" role="dialog" aria-label="Assistant tip">
        <button type="button" class="x" aria-label="Dismiss" (click)="dismiss()">×</button>
        <p>{{ t.text }}</p>
        <div class="actions">
          <button type="button" class="btn95 btn95--primary" (click)="accept(t)">{{ t.yes }}</button>
          <button type="button" class="btn95" (click)="dismiss()">{{ t.no }}</button>
        </div>
        <label class="mute"><input type="checkbox" (change)="silence()" /> Don't show Smiley again</label>
      </aside>
      <div class="face" aria-hidden="true"><os-icon name="smiley" [size]="72" /></div>
    }
  `,
  styles: `
    :host { position: fixed; right: 16px; bottom: calc(var(--taskbar-h) + 14px); z-index: 4500;
      display: flex; flex-direction: column; align-items: flex-end; gap: 4px; pointer-events: none; }
    .bubble { pointer-events: auto; position: relative; width: min(340px, calc(100vw - 32px));
      padding: 16px 16px 12px; font-size: 20px; line-height: 1.15; background: #fff7d6; color: #1a1010;
      box-shadow: 4px 4px 0 #000, inset 0 0 0 2px #000; animation: in .3s steps(4) both; }
    .bubble::after { content: ''; position: absolute; right: 34px; bottom: -14px; border: 7px solid transparent;
      border-top-color: #000; border-left-color: #000; }
    p { margin: 0 18px 12px 0; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .x { position: absolute; top: 4px; right: 6px; border: 0; background: none; color: #000; font-size: 26px; line-height: 1; }
    .mute { display: block; margin-top: 10px; font-size: 16px; color: #6b5a4a; }
    .face { pointer-events: none; padding-right: 10px; filter: drop-shadow(0 0 10px rgba(61,255,110,.6));
      animation: bob 1.4s ease-in-out infinite; }
    @keyframes in { from { transform: translateY(10px) scale(.9); opacity: 0; } }
    @keyframes bob { 50% { transform: translateY(-6px) rotate(-4deg); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantComponent implements OnInit {
  private readonly os = inject(OsService);
  private readonly wm = inject(WindowManager);
  private readonly destroyRef = inject(DestroyRef);
  readonly tip = signal<Tip | null>(null);
  private index = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Clicking the tray smiley summons the next tip immediately.
    effect(() => {
      if (this.os.assistantPing() > 0) untracked(() => this.show(true));
    });
  }

  ngOnInit(): void {
    if (!this.os.browser) return;
    this.schedule(22000);
    this.destroyRef.onDestroy(() => this.timer && clearTimeout(this.timer));
  }

  private schedule(ms: number): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.show(false), ms);
  }

  private show(forced: boolean): void {
    if (!forced && (!this.os.settings().assistant || this.os.phase() !== 'desktop')) {
      this.schedule(30000);
      return;
    }
    this.tip.set(TIPS[this.index++ % TIPS.length]);
  }

  accept(t: Tip): void {
    if (t.app) this.wm.open(t.app);
    else this.os.toast('Smiley winks at you knowingly. 😉');
    this.dismiss();
  }

  dismiss(): void {
    this.tip.set(null);
    this.schedule(75000);
  }

  silence(): void {
    this.os.set('assistant', false);
    this.tip.set(null);
    this.os.toast('Smiley has been silenced. Smiley will remember this.');
  }
}
