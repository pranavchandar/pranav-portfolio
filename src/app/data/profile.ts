export interface Job {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
  /** 0–100, purely vibes-based self-assessment for the RPG stat bars */
  power: number;
}

export interface Link {
  label: string;
  href: string;
  handle: string;
}

export const NAME = 'Pranav Chandar';
export const TITLE = 'Senior Software Engineer · Digital Artist · CGI Goblin';

/** The day the coding started. Used by every uptime counter on the site. */
export const CAREER_START = new Date(2019, 7, 19); // 19 Aug 2019

export const SUMMARY =
  'Senior Java Full-Stack Engineer with 6+ years of experience delivering high-risk, revenue-critical ' +
  'applications in the financial domain. Strong expertise in Java, Spring Boot, Angular, microservices, ' +
  'CI/CD, and test automation. Proven track record in large-scale system modernization, release ' +
  'management, and improving code quality, stability, and delivery speed in enterprise environments.';

export const ABOUT: string[] = [
  "Hey, I'm glad you're here.",
  "I'm a developer, problem-solver, and all-around curious human who loves building cool, useful things, mostly with Java, Spring Boot, and Angular. I've been in the software world for over five years now, and I still get a kick out of turning ideas into clean, working code that actually makes a difference.",
  "Lately, I've also been diving into the world of AI. I'm fascinated by how it's reshaping everything — from how we build software to how we think about creativity. I enjoy experimenting with new AI tools, exploring their potential (and limits), and finding ways to blend them into my projects to work smarter and create faster.",
  'By day, I design and build backend systems. By night (and sometimes on weekends), I dive into digital art and CGI — creating in Blender, sketching, and bringing visuals to life just for the fun of it. I like to think of my brain as split between logic and creativity — and honestly, I wouldn\'t have it any other way.',
  "I started this portfolio to showcase what I've done, what I'm learning, and what I'm excited about next. If you're into thoughtful design, solid code, AI experiments, or a bit of creative flair, you'll probably feel right at home here.",
  "Let's connect if you're building something interesting, or just want to talk tech, art, or life.",
];

export const EXPERIENCE: Job[] = [
  {
    role: 'Senior Software Engineer',
    company: 'BNP Paribas',
    period: '06/2019 – Present',
    bullets: [
      'Led modernization and continuous enhancement of 4 high-risk, high-revenue financial applications, including Java 4 → Java 8/11, SVN → Git, and Ext JS → Angular migrations.',
      'Designed and implemented BDD-based automated testing using Cucumber and Selenium across 3 applications, reducing pre-release NRT effort by ~70%.',
      'Integrated code quality and security tooling (SonarQube, Fortify) into CI pipelines, significantly improving maintainability and reducing production defects.',
      'Built and stabilized CI/CD pipelines using Jenkins, Docker, Kubernetes, and JFrog, improving deployment reliability across environments.',
      'Acted as Release Manager for 6 mission-critical applications, coordinating with global stakeholders and ensuring zero production incidents for 10,000+ users over 5 years.',
      'Played a key role in end-to-end migration of a legacy web application to a mobile-compatible Angular + Spring Boot architecture, contributing across frontend and backend layers.',
      'Collaborated closely with onshore product owners, developers, and business teams within an Agile delivery model.',
      'Mentored junior developers and reviewed code to enforce quality and best practices.',
    ],
  },
];

export const SKILLS: SkillGroup[] = [
  { title: 'Backend', power: 95, items: ['Java 21', 'Spring Boot', 'Spring Security', 'REST APIs', 'Hibernate', 'JPA', 'HQL'] },
  { title: 'Frontend', power: 85, items: ['Angular', 'TypeScript', 'RxJS', 'HTML5', 'SCSS'] },
  { title: 'Architecture', power: 80, items: ['Microservices', 'Agile/Scrum', 'CI/CD Pipelines'] },
  { title: 'DevOps & CI/CD', power: 88, items: ['Git', 'Jenkins', 'Docker', 'Kubernetes', 'JFrog Artifactory', 'SonarQube', 'Fortify'] },
  { title: 'Testing', power: 90, items: ['JUnit 5', 'Mockito', 'Cucumber', 'Selenium', 'Postman'] },
  { title: 'Cloud & Tools', power: 72, items: ['AWS (EC2, S3)', 'GitHub Actions', 'Swagger', 'Jira'] },
  { title: 'Creative', power: 99, items: ['Blender', 'Photoshop', 'Procreate', 'After Effects', 'DaVinci Resolve'] },
];

export const PROJECTS = [
  {
    title: 'Hybrid Fund Transaction & Fee Calculation Platform',
    description: 'Backend services handling liquidity, commitment, retrocession, and miscellaneous fee workflows for financial instruments.',
  },
  {
    title: 'Drawdown & Portfolio Management Systems',
    description: 'Tools for portfolio analysis, financing via drawdowns, trade execution, due-diligence workflows, and simulation utilities.',
  },
  {
    title: 'PRANAV OS (this website)',
    description: 'An entire fake operating system built in Angular so that a résumé could have a blue screen of death. Worth it.',
  },
];

export const EDUCATION = [
  { degree: 'Masters of Computer Applications', school: 'SRM Institute of Science and Technology', period: '2017 – 2019' },
  { degree: 'Bachelor of Computer Applications', school: 'Vels University', period: '2014 – 2017' },
];

export const LINKS: Link[] = [
  { label: 'Email', href: 'mailto:hello@pranavchandar.com', handle: 'hello@pranavchandar.com' },
  { label: 'GitHub', href: 'https://github.com/pranavchandar', handle: '@pranavchandar' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pranav-chandar-v-b-530950147/', handle: 'pranav-chandar-v-b' },
  { label: 'Instagram', href: 'https://www.instagram.com/pranavchandarvb/', handle: '@pranavchandarvb' },
  { label: 'YouTube', href: 'https://www.youtube.com/@pranavchandar7080', handle: '@pranavchandar7080' },
];

export const CV_PATH = 'assets/documents/Pranav_Chandar_VB.pdf';

export interface Elapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Calendar-correct time elapsed since `from` (months are clamped, so Jan 31 + 1 month = Feb 28/29). */
export function elapsedSince(from: Date, now = new Date()): Elapsed {
  const anchorAt = (months: number) => {
    const y = from.getFullYear();
    const m = from.getMonth() + months;
    const lastDay = new Date(y, m + 1, 0).getDate();
    return new Date(y, m, Math.min(from.getDate(), lastDay), from.getHours(), from.getMinutes(), from.getSeconds());
  };
  // Wall-clock difference, immune to DST shifts.
  const wall = (d: Date) =>
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());

  let total = (now.getFullYear() - from.getFullYear()) * 12 + now.getMonth() - from.getMonth();
  while (total > 0 && wall(anchorAt(total)) > wall(now)) total--;

  let rest = Math.max(0, Math.floor((wall(now) - wall(anchorAt(total))) / 1000));
  const seconds = rest % 60;
  rest = Math.floor(rest / 60);
  const minutes = rest % 60;
  rest = Math.floor(rest / 60);
  const hours = rest % 24;
  const days = Math.floor(rest / 24);
  return { years: Math.floor(total / 12), months: total % 12, days, hours, minutes, seconds };
}

export const pad2 = (n: number) => n.toString().padStart(2, '0');
