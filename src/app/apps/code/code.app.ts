import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SKILLS, LINKS } from '../../data/profile';
import { SoundService } from '../../os/sound.service';
import { WindowManager } from '../../os/window-manager.service';

const email = LINKS.find((l) => l.label === 'Email')?.handle ?? '';
const key = (title: string) => title.toLowerCase().replace(/[^a-z]+(.)?/g, (_, c: string) => (c ? c.toUpperCase() : ''));
const stack = SKILLS.map((g) => `    ${key(g.title)}: [${g.items.map((i) => `'${i}'`).join(', ')}],`).join('\n');

const PRANAV_TS = `/**
 * pranav.ts
 * The canonical implementation of Pranav Chandar.
 * Build: passing · Coverage: 97% (the other 3% is sleep)
 */
import { Engineer, Artist, Human } from '@universe/core';
import { Coffee } from '@kitchen/essentials';
import { Blender } from '@night-shift/cgi';

type Mood = 'shipping' | 'rendering' | 'debugging' | 'drawing';

@Injectable({ providedIn: 'world' })
export class Pranav extends Human implements Engineer, Artist {
  readonly name = 'Pranav Chandar';
  readonly role = 'Senior Software Engineer';
  readonly employer = 'BNP Paribas';
  readonly since = new Date(2019, 7, 19);
  mood: Mood = 'shipping';

  readonly stack = {
${stack}
  };

  // The highlights. RESUME.EXE has the long version.
  readonly shipped = [
    'Java 4 → 8/11, SVN → Git, Ext JS → Angular migrations',
    'BDD test automation (Cucumber + Selenium): ~70% less manual NRT',
    'Release manager for 6 critical apps: 0 prod incidents, 10k+ users',
    'CI/CD with Jenkins, Docker, Kubernetes and JFrog',
    'SonarQube + Fortify wired into every pipeline',
  ];

  constructor(private coffee: Coffee, private blender: Blender) {
    super();
  }

  async dayJob(): Promise<Feature[]> {
    this.mood = 'shipping';
    return this.designBackends().then(this.test).then(this.ship);
  }

  async nightJob(): Promise<Render> {
    this.mood = 'rendering';
    return this.blender.render({ samples: 4096, patience: Infinity });
  }

  sleep(): never {
    throw new Error('Not implemented');
  }

  hire(company: Company): Promise<Success> {
    // TODO(you): this could literally be done right now
    return company.sendEmail('${email}');
  }
}
`;

const PACKAGE_JSON = `{
  "name": "pranav",
  "version": "6.2.0",
  "description": "Engineer by day, artist by night, debugger by necessity",
  "main": "pranav.ts",
  "scripts": {
    "start": "coffee && code",
    "build": "ng build --but-make-it-pretty",
    "test": "cucumber --all-the-scenarios",
    "render": "blender --background --samples 4096 # see you in 3 days",
    "sleep": "echo 'not found' && exit 1"
  },
  "dependencies": {
    "java": "^21.0.0",
    "spring-boot": "^3.0.0",
    "angular": "latest",
    "coffee": "^∞",
    "blender": "^4.0.0",
    "procreate": "*",
    "imposter-syndrome": "~0.0.1"
  },
  "devDependencies": {
    "lo-fi-beats": "^24.7.0",
    "rubber-duck": "^1.0.0"
  },
  "license": "HIRE-ME"
}
`;

const KEYWORDS = new Set(
  'import from export class extends implements readonly private public constructor super async await return new throw type this const let if else'.split(' '),
);

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** A syntax highlighter in 20 lines. It is wrong in many ways and right in the ways that matter. */
function highlight(line: string): string {
  if (/^\s*(\/\*\*?|\*)/.test(line)) return `<span class="t-com">${escape(line)}</span>`;
  const token = /(\/\/.*$)|('[^']*'|"[^"]*")|(@\w+)|(\b\d[\d.]*\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;
  let out = '';
  for (const m of line.matchAll(token)) {
    const [text, com, str, deco, num, word] = m;
    const e = escape(text);
    if (com) out += `<span class="t-com">${e}</span>`;
    else if (str) out += `<span class="t-str">${e}</span>`;
    else if (deco) out += `<span class="t-deco">${e}</span>`;
    else if (num) out += `<span class="t-num">${e}</span>`;
    else if (word && KEYWORDS.has(word)) out += `<span class="t-kw">${e}</span>`;
    else if (word && /^[A-Z]/.test(word)) out += `<span class="t-type">${e}</span>`;
    else out += e;
  }
  return out || ' ';
}

const FILES = {
  'pranav.ts': PRANAV_TS.split('\n').map(highlight),
  'package.json': PACKAGE_JSON.split('\n').map(highlight),
};

type FileName = keyof typeof FILES;

const RUN_OUTPUT = [
  '$ npx tsc pranav.ts --strict',
  '',
  '✔ Compiled successfully in 6.2 years',
  '⚠ warning TS9001: Method \'sleep()\' is declared but its value is never read.',
  '⚠ warning TS9002: Property \'mood\' changes suspiciously often after midnight.',
  '',
  '$ node -e "new Pranav().hire(yourCompany)"',
  '→ Promise { <pending> }   // resolves when you open CONTACT.EML',
];

@Component({
  selector: 'app-code',
  templateUrl: './code.app.html',
  styleUrl: './code.app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeApp {
  private readonly sound = inject(SoundService);
  private readonly wm = inject(WindowManager);
  readonly files = Object.keys(FILES) as FileName[];
  readonly file = signal<FileName>('pranav.ts');
  readonly output = signal<string[] | null>(null);

  lines(): string[] {
    return FILES[this.file()];
  }

  run(): void {
    this.sound.click();
    this.output.set([]);
    RUN_OUTPUT.forEach((line, i) =>
      setTimeout(() => {
        this.output.update((o) => [...(o ?? []), line]);
        if (i === RUN_OUTPUT.length - 1) this.sound.ding();
      }, 180 * i),
    );
  }

  contact(): void {
    this.wm.open('contact');
  }
}
