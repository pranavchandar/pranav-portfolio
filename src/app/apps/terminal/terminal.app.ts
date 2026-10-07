import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild,
} from '@angular/core';
import { APPS, AppId } from '../../os/apps';
import { OsService } from '../../os/os.service';
import { SoundService } from '../../os/sound.service';
import { WindowManager } from '../../os/window-manager.service';
import { ABOUT, CAREER_START, EXPERIENCE, LINKS, NAME, SKILLS, TITLE, elapsedSince } from '../../data/profile';
import { ART } from '../../data/art';
import { TAPES } from '../../data/videos';

interface Line {
  text: string;
  cls?: 'ok' | 'err' | 'dim' | 'hot' | 'amber' | 'cmd';
  href?: string;
}

type Theme = 'green' | 'amber' | 'red' | 'blue';

const FORTUNES = [
  'There are 10 kinds of people: those who understand binary and those who are reading this fortune.',
  'It works on my machine. — Pranav, and every engineer ever',
  'A Blender render is never finished, only abandoned.',
  'The best time to write tests was before the bug. The second best time is now.',
  'Java 4 called. Pranav did not pick up.',
  'You will soon receive an email from a talented engineer. Or send one. Your call.',
  '99 little bugs in the code, 99 little bugs. Take one down, patch it around… 127 little bugs in the code.',
];

const FILES: Record<string, string> = {
  'about_me.txt': 'about',
  'resume.exe': 'resume',
  'pranav.ts': 'code',
  'contact.eml': 'contact',
  'intro.mov': 'intro',
  'punch_me.exe': 'punch',
  'dont_press.exe': 'dontpress',
};

const DIRS = ['art/', 'cgi/', 'secrets/', '.sleep/'];

const COMMANDS = [
  'help', 'whoami', 'about', 'ls', 'cd', 'cat', 'open', 'skills', 'experience', 'uptime', 'contact', 'hire',
  'sudo', 'neofetch', 'cowsay', 'fortune', 'coffee', 'matrix', 'theme', 'party', 'date', 'echo', 'history',
  'clear', 'exit', 'vim', 'emacs', 'ping', 'rm', 'bsod', 'shutdown', 'gravity', 'art', 'tapes',
];

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.app.html',
  styleUrl: './terminal.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalApp {
  private readonly os = inject(OsService);
  private readonly wm = inject(WindowManager);
  private readonly sound = inject(SoundService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');

  readonly lines = signal<Line[]>([
    { text: 'PRANAV OS 95 [Version 6.2.2019]', cls: 'hot' },
    { text: '(c) Chandar Megatrends Inc. All rights reserved, some rights negotiable.', cls: 'dim' },
    { text: "Type 'help' to see what this thing can do. Or just start mashing.", cls: 'dim' },
    { text: '' },
  ]);
  readonly cwd = signal('~');
  readonly theme = signal<Theme>('green');
  readonly busy = signal(false);
  readonly vim = signal(false);
  private history: string[] = [];
  private historyIndex = -1;
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    afterNextRender(() => this.focus());
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));
  }

  prompt(): string {
    return this.vim() ? '' : `pranav@os:${this.cwd()}$`;
  }

  focus(): void {
    this.input().nativeElement.focus({ preventScroll: true });
  }

  onKey(e: KeyboardEvent): void {
    const el = this.input().nativeElement;
    if (e.key === 'Enter') {
      const value = el.value;
      el.value = '';
      this.historyIndex = -1;
      this.submit(value);
    } else if (e.key === 'ArrowUp' && this.history.length) {
      e.preventDefault();
      this.historyIndex = Math.min(this.history.length - 1, this.historyIndex + 1);
      el.value = this.history[this.history.length - 1 - this.historyIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.historyIndex = Math.max(-1, this.historyIndex - 1);
      el.value = this.historyIndex < 0 ? '' : this.history[this.history.length - 1 - this.historyIndex];
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const [head, ...rest] = el.value.split(' ');
      if (!rest.length) {
        const match = COMMANDS.filter((c) => c.startsWith(head));
        if (match.length === 1) el.value = match[0] + ' ';
        else if (match.length > 1) this.print({ text: match.join('  '), cls: 'dim' });
      } else {
        const last = rest[rest.length - 1];
        const pool = [...Object.keys(FILES), ...DIRS, ...Object.keys(APPS)];
        const match = pool.filter((c) => c.startsWith(last));
        if (match.length === 1) el.value = [head, ...rest.slice(0, -1), match[0]].join(' ');
      }
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      this.lines.set([]);
    } else {
      this.sound.key();
    }
  }

  private submit(raw: string): void {
    const cmd = raw.trim();
    if (this.vim()) {
      this.print({ text: raw || '~', cls: 'dim' });
      if ([':q', ':q!', ':wq', ':x', 'zz'].includes(cmd.toLowerCase())) {
        this.vim.set(false);
        this.print({ text: 'You escaped vim. Put that on your résumé. Pranav did.', cls: 'ok' });
      } else if (cmd) {
        this.print({ text: 'E37: No write since last change (add ! to override). Still trapped. Try :q', cls: 'err' });
      }
      return;
    }
    this.print({ text: `${this.prompt()} ${raw}`, cls: 'cmd' });
    if (!cmd || this.busy()) return;
    this.history.push(cmd);
    this.run(cmd);
  }

  private run(cmd: string): void {
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');
    switch (name.toLowerCase()) {
      case 'help':
        return this.help();
      case 'whoami':
        return this.print({ text: NAME, cls: 'hot' }, { text: TITLE }, { text: 'Also: a person who built an OS instead of a normal portfolio.', cls: 'dim' });
      case 'about':
        return this.print(...ABOUT.map((p) => ({ text: p })), { text: '(open about_me.txt for the cosy version)', cls: 'dim' });
      case 'ls':
        return this.ls(arg);
      case 'cd':
        return this.cd(arg);
      case 'cat':
        return this.cat(arg);
      case 'open':
      case 'start':
      case 'run':
        return this.open(arg);
      case 'skills':
        return this.skills();
      case 'experience':
      case 'uptime':
        return this.experience();
      case 'contact':
        return this.print(...LINKS.map((l) => ({ text: `${l.label.padEnd(10)} ${l.handle}`, href: l.href })));
      case 'hire':
        return this.print({ text: 'hire: permission denied. (hint: you need elevated privileges)', cls: 'err' });
      case 'sudo':
        return this.sudo(arg);
      case 'neofetch':
        return this.neofetch();
      case 'cowsay':
      case 'pranavsay':
        return this.cowsay(arg || 'moo. hire pranav. moo.');
      case 'fortune':
        return this.print({ text: FORTUNES[Math.floor(Math.random() * FORTUNES.length)], cls: 'amber' });
      case 'coffee':
        return this.coffee();
      case 'matrix':
        return this.matrix();
      case 'theme':
        return this.setTheme(arg as Theme);
      case 'party':
      case 'konami':
        this.os.party.set(true);
        this.sound.powerUp();
        this.timers.push(setTimeout(() => this.os.party.set(false), 10000));
        return this.print({ text: '🎉 PARTY MODE. (the real ones type the konami code)', cls: 'hot' });
      case 'date':
        return this.print({ text: new Date().toString() });
      case 'echo':
        return this.print({ text: arg });
      case 'history':
        return this.print(...this.history.map((h, i) => ({ text: `${String(i + 1).padStart(4)}  ${h}`, cls: 'dim' as const })));
      case 'clear':
      case 'cls':
        return this.lines.set([]);
      case 'exit':
      case 'logout':
        return this.wm.closeApp('terminal');
      case 'vim':
      case 'vi':
      case 'nvim':
        this.vim.set(true);
        return this.print({ text: '~' }, { text: '~' }, { text: '~   VIM - Vi IMproved · you are now trapped', cls: 'amber' }, { text: '~' });
      case 'emacs':
        return this.print({ text: 'This is a vim household. (We tolerate nano.)', cls: 'err' });
      case 'nano':
        return this.print({ text: 'nano: respectable. opening about_me.txt instead.', cls: 'ok' }, ...this.openApp('about'));
      case 'ping':
        return this.print({ text: `PING ${arg || 'pranav'}: 64 bytes, time=0.42ms — he's online. He's always online.`, cls: 'ok' });
      case 'rm':
        return this.rm(arg);
      case 'bsod':
        return this.os.bsod('MANUALLY_TRIGGERED_BY_A_CURIOUS_HUMAN');
      case 'shutdown':
      case 'poweroff':
        return this.os.shutdown();
      case 'reboot':
        return this.os.reboot();
      case 'gravity':
        this.os.gravity.set(true);
        this.timers.push(setTimeout(() => this.os.gravity.set(false), 5000));
        return this.print({ text: 'Newton.exe engaged. Your icons are now subject to physics.', cls: 'amber' });
      case 'art':
        return this.print({ text: `${ART.length} pieces. Random pick: "${ART[Math.floor(Math.random() * ART.length)].title}"` }, ...this.openApp('art'));
      case 'tapes':
        return this.print(...TAPES.map((t) => ({ text: `▶ ${t.title.padEnd(30)} ${t.kind}`, cls: 'dim' as const })));
      case 'hi':
      case 'hello':
      case 'hey':
        return this.print({ text: 'hello, human 👋  (try: sudo hire pranav)', cls: 'ok' });
      case 'make':
        return this.print({ text: arg === 'coffee' ? 'make: *** No rule to make target. Try: coffee' : "make: *** No targets. Pranav prefers Gradle.", cls: 'err' });
      case '42':
        return this.print({ text: 'Yes. But what was the question?', cls: 'amber' });
      default:
        if (FILES[name.toLowerCase()]) return this.open(name);
        this.sound.error();
        return this.print({ text: `command not found: ${name}. did you mean 'sudo hire pranav'?`, cls: 'err' });
    }
  }

  // ── commands ────────────────────────────────────────────────────
  private help(): void {
    const rows: [string, string][] = [
      ['whoami / about', 'who is this guy'],
      ['skills / experience', 'the professional bits'],
      ['ls · cd · cat', 'poke around the filesystem'],
      ['open <app>', 'launch an app (about, resume, art, cgi, code, contact, punch, intro…)'],
      ['contact', 'ways to reach a real human'],
      ['sudo hire pranav', '★ highly recommended ★'],
      ['neofetch · cowsay · fortune', 'essential unix culture'],
      ['coffee · matrix · party', 'questionable features'],
      ['theme green|amber|red|blue', 'change phosphor colour'],
      ['vim', 'do not'],
      ['rm -rf /', 'absolutely do not'],
    ];
    this.print({ text: 'AVAILABLE COMMANDS', cls: 'hot' }, ...rows.map(([c, d]) => ({ text: `  ${c.padEnd(30)}${d}` })), {
      text: '  ↑/↓ history · tab completes · ctrl+L clears',
      cls: 'dim',
    });
  }

  private ls(arg: string): void {
    const dir = arg.replace(/\/$/, '') || this.cwd().replace('~/', '').replace('~', '');
    if (dir === 'art') return this.print({ text: ART.map((a) => a.slug + '.webp').join('  '), cls: 'dim' });
    if (dir === 'cgi') return this.print({ text: TAPES.map((t) => t.title.replace(/\s+/g, '_') + '.vhs').join('  '), cls: 'dim' });
    if (dir === 'secrets') return this.print({ text: 'ls: cannot open directory secrets/: Permission denied', cls: 'err' });
    if (dir === '.sleep') return this.print({ text: '(empty. it has always been empty.)', cls: 'dim' });
    const all = arg.includes('-a');
    this.print({ text: [...DIRS.filter((d) => all || !d.startsWith('.')), ...Object.keys(FILES)].join('  ') });
  }

  private cd(arg: string): void {
    const dir = arg.replace(/\/$/, '');
    if (!dir || dir === '~' || dir === '..' || dir === '/') {
      this.cwd.set('~');
      return;
    }
    if (dir === 'secrets') return this.print({ text: 'cd: secrets: Permission denied. Nice try though.', cls: 'err' });
    if (dir === '.sleep') return this.print({ text: 'cd: .sleep: directory exists but nobody has been there since 2019', cls: 'err' });
    if (dir === 'art' || dir === 'cgi') {
      this.cwd.set(`~/${dir}`);
      return this.print(...this.openApp(dir));
    }
    this.print({ text: `cd: no such file or directory: ${dir}`, cls: 'err' });
  }

  private cat(arg: string): void {
    const f = arg.toLowerCase();
    if (f === 'about_me.txt') return this.print(...ABOUT.map((p) => ({ text: p })));
    if (f === 'pranav.ts') return this.print({ text: 'too long to cat. opening it in an IDE like a civilised person.', cls: 'dim' }, ...this.openApp('code'));
    if (f.endsWith('.exe') || f.endsWith('.mov')) return this.print({ text: `cat: ${arg}: binary file (try: open ${arg})`, cls: 'err' });
    if (!f) return this.print({ text: '🐈 meow. (cat needs a file)', cls: 'amber' });
    this.print({ text: `cat: ${arg}: No such file or directory`, cls: 'err' });
  }

  private open(arg: string): void {
    const key = arg.toLowerCase().replace(/\.(txt|exe|ts|eml|mov)$/, '').replace(/_/g, '');
    const aliases: Record<string, AppId> = {
      aboutme: 'about', about: 'about', resume: 'resume', cv: 'resume', art: 'art', gallery: 'art', artgallery: 'art',
      cgi: 'cgi', cgitapes: 'cgi', tapes: 'cgi', vhs: 'cgi', code: 'code', pranav: 'code', programming: 'code',
      contact: 'contact', mail: 'contact', email: 'contact', punch: 'punch', punchme: 'punch', intro: 'intro',
      settings: 'settings', controlpanel: 'settings', dontpress: 'dontpress', trash: 'trash', recyclebin: 'trash',
      terminal: 'terminal',
    };
    const id = aliases[key];
    if (!id) return this.print({ text: `open: unknown app '${arg}'. try: open resume`, cls: 'err' });
    this.print(...this.openApp(id));
  }

  private openApp(id: AppId): Line[] {
    this.wm.open(id);
    return [{ text: `→ launching ${APPS[id].label}…`, cls: 'ok' }];
  }

  private skills(): void {
    this.print(
      { text: 'SKILL TREE  (power levels self-assessed, peer-reviewed by a cat)', cls: 'hot' },
      ...SKILLS.flatMap((g) => [
        { text: `${g.title.padEnd(16)}[${'█'.repeat(Math.round(g.power / 5)).padEnd(20, '░')}] ${g.power}` },
        { text: `${''.padEnd(17)}${g.items.join(', ')}`, cls: 'dim' as const },
      ]),
    );
  }

  private experience(): void {
    const e = elapsedSince(CAREER_START);
    const job = EXPERIENCE[0];
    this.print(
      { text: `${job.role} @ ${job.company} (${job.period})`, cls: 'hot' },
      { text: `uptime: ${e.years} years, ${e.months} months, ${e.days} days, ${e.hours}h ${e.minutes}m ${e.seconds}s`, cls: 'ok' },
      ...job.bullets.map((b) => ({ text: `  • ${b}` })),
    );
  }

  private sudo(arg: string): void {
    if (!/^hire\s+(pranav|him|me)/i.test(arg)) {
      this.sound.error();
      return this.print({ text: 'recruiter is not in the sudoers file. This incident will be reported to Pranav.', cls: 'err' });
    }
    this.busy.set(true);
    const steps: [Line, number][] = [
      [{ text: '[sudo] password for recruiter: ********', cls: 'dim' }, 500],
      [{ text: 'Access granted. Welcome, person of excellent taste.', cls: 'ok' }, 700],
      [{ text: 'Initiating hire sequence…' }, 500],
      [{ text: '  [████░░░░░░░░░░░░] negotiating snacks', cls: 'dim' }, 450],
      [{ text: '  [█████████░░░░░░░] checking desk has room for a drawing tablet', cls: 'dim' }, 450],
      [{ text: '  [██████████████░░] preparing welcome doughnut (Blender-rendered)', cls: 'dim' }, 450],
      [{ text: '  [████████████████] done', cls: 'ok' }, 400],
      [{ text: '★ HIRE SEQUENCE COMPLETE ★  Final step: actually send him a message.', cls: 'hot' }, 300],
    ];
    let t = 0;
    steps.forEach(([line, wait]) => {
      t += wait;
      this.timers.push(setTimeout(() => this.print(line), t));
    });
    this.timers.push(
      setTimeout(() => {
        this.busy.set(false);
        this.os.party.set(true);
        this.sound.powerUp();
        this.wm.open('contact');
        this.timers.push(setTimeout(() => this.os.party.set(false), 6000));
      }, t + 400),
    );
  }

  private neofetch(): void {
    const e = elapsedSince(CAREER_START);
    const art = [
      '   ███     ███   ',
      '  █████   █████  ',
      '  █████   █████  ',
      '   ███     ███   ',
      '                 ',
      '  █           █  ',
      '   ██▄▄▄▄▄▄▄██   ',
      '                 ',
    ];
    const info = [
      `pranav@os`,
      '---------',
      `OS: PRANAV OS 95 (Engineer+Artist Edition)`,
      `Host: ${EXPERIENCE[0].company}`,
      `Uptime: ${e.years}y ${e.months}m ${e.days}d`,
      `Shell: java 21 / typescript / blender-python`,
      `Packages: ${ART.length} drawings, ${TAPES.length} tapes`,
      `Memory: 8 tabs of Stack Overflow / 16GB`,
    ];
    this.print(...art.map((a, i) => ({ text: `${a}  ${info[i] ?? ''}`, cls: i === 0 ? ('hot' as const) : undefined })));
  }

  private cowsay(msg: string): void {
    const text = msg.slice(0, 60);
    this.print(
      { text: ' ' + '_'.repeat(text.length + 2) },
      { text: `< ${text} >` },
      { text: ' ' + '-'.repeat(text.length + 2) },
      { text: '        \\   ^__^' },
      { text: '         \\  (oo)\\_______' },
      { text: '            (__)\\       )\\/\\' },
      { text: '                ||----w |' },
      { text: '                ||     ||' },
    );
  }

  private coffee(): void {
    this.print(
      { text: '      ( (', cls: 'dim' },
      { text: '       ) )', cls: 'dim' },
      { text: '    ........' },
      { text: '    |      |]' },
      { text: '    \\      /' },
      { text: "     `----'" },
      { text: 'brewing… ☕ caffeine +25. productivity +10. sleep -∞.', cls: 'amber' },
    );
    this.os.set('caffeine', Math.min(100, this.os.settings().caffeine + 25));
    if (this.os.settings().caffeine >= 85) this.print({ text: 'warning: caffeine critical. the desktop is now vibrating.', cls: 'err' });
  }

  private matrix(): void {
    this.busy.set(true);
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ01PRANAV#$%&';
    const theme = this.theme();
    this.theme.set('green');
    let n = 0;
    const tick = () => {
      const line = Array.from({ length: 64 }, () => (Math.random() < 0.6 ? chars[Math.floor(Math.random() * chars.length)] : ' ')).join('');
      this.print({ text: line, cls: Math.random() < 0.1 ? 'hot' : 'ok' });
      if (++n < 40) this.timers.push(setTimeout(tick, 50));
      else {
        this.print({ text: 'Wake up, recruiter… the Matrix has you. Follow the white rabbit (CONTACT.EML).', cls: 'amber' });
        this.theme.set(theme);
        this.busy.set(false);
      }
    };
    tick();
  }

  private setTheme(t: Theme): void {
    if (!['green', 'amber', 'red', 'blue'].includes(t)) {
      return this.print({ text: 'usage: theme green|amber|red|blue', cls: 'err' });
    }
    this.theme.set(t);
    this.print({ text: `phosphor set to ${t}.`, cls: 'ok' });
  }

  private rm(arg: string): void {
    if (!/-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r/i.test(arg) || !arg.includes('/')) {
      return this.print({ text: `rm: refusing to remove '${arg || '?'}': Pranav is sentimental about his files`, cls: 'err' });
    }
    this.busy.set(true);
    const victims = ['/bin', '/etc', '/home/pranav/art', '/home/pranav/cgi', '/usr/lib/java', '/sys/sense_of_humor', '/boot'];
    victims.forEach((v, i) =>
      this.timers.push(setTimeout(() => this.print({ text: `removed '${v}'`, cls: 'err' }), 200 * (i + 1))),
    );
    this.timers.push(
      setTimeout(() => {
        this.busy.set(false);
        this.os.bsod('RM_RF_SLASH_YOU_ABSOLUTE_MONSTER');
      }, 200 * victims.length + 500),
    );
  }

  private print(...lines: Line[]): void {
    this.lines.update((l) => [...l, ...lines].slice(-400));
    queueMicrotask(() => {
      const el = this.screen()?.nativeElement;
      if (el) setTimeout(() => (el.scrollTop = el.scrollHeight));
    });
  }
}
