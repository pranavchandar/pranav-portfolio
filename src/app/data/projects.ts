import { IconName } from '../os/pixel-icons';

export type ProjectStatus = 'live' | 'building' | 'self-hosted';

export interface LiveSite {
  url: string;
  /** Short address shown in the Navigator's address bar and bookmarks */
  host: string;
  /** False when the site's server forbids being shown inside another page */
  frameable: boolean;
  /** Render the site inside a phone frame (phone-first apps) */
  phone?: boolean;
  note?: string;
}

export interface Project {
  id: string;
  name: string;
  repo: string;
  icon: IconName;
  status: ProjectStatus;
  platform: string;
  year: string;
  tagline: string;
  stack: string[];
  highlights: string[];
  live?: LiveSite;
  shots?: { src: string; alt: string }[];
}

export const GITHUB_PROFILE = 'https://github.com/pranavchandar';

const gh = (name: string) => `${GITHUB_PROFILE}/${name}`;

export const PROJECTS_LIST: Project[] = [
  {
    id: 'sky',
    name: 'Sky Score',
    repo: gh('Sunset-sunrise-score'),
    icon: 'sun',
    status: 'live',
    platform: 'Web app + Node API',
    year: '2026',
    tagline: 'Predicts how vibrant the next sunrise and sunset will be, on a 0–100 scale.',
    stack: ['JavaScript', 'Node.js (zero dependencies)', 'Open-Meteo', 'Render', 'node:test'],
    highlights: [
      'Scores every event with five RPG-style "Sky Stats": Cloud Canvas, Light Path, Open Sky, Air Clarity and Dry Air.',
      "Horizon radar samples cloud at 50, 100 and 200 km along the sun's azimuth.",
      'People rate the sky they actually saw; an admin dashboard fits new weights with ridge regression.',
      "Ratings are saved to a GitHub branch, because Render's free disk is wiped on every restart.",
    ],
    live: {
      url: 'https://sky-score.onrender.com',
      host: 'sky-score.onrender.com',
      frameable: false,
      note: "Runs on Render's free plan: the server naps after 15 idle minutes, so the first visit can take 30–60 s to wake it.",
    },
  },
  {
    id: 'gym-web',
    name: 'Get Gym Done',
    repo: gh('get-gym-done-web'),
    icon: 'dumbbell',
    status: 'live',
    platform: 'Progressive Web App',
    year: '2026',
    tagline: 'A local-first workout logger that knows which day of your split is next.',
    stack: ['React', 'TypeScript', 'Vite', 'Zustand', 'PWA', 'GitHub Pages'],
    highlights: [
      'Progressive-overload prompts, a rest timer that survives a page reload, and the screen stays awake mid-set.',
      'A library of 1,324 exercises, a muscle-balance body map and estimated 1RMs (Epley).',
      'Imports history from Strong, Hevy and FitNotes; syncs to a private GitHub Gist.',
      'No account, no server: everything lives in your browser.',
    ],
    live: {
      url: 'https://pranavchandar.github.io/get-gym-done-web/',
      host: 'pranavchandar.github.io/get-gym-done-web',
      frameable: true,
      phone: true,
    },
    shots: [
      { src: 'assets/projects/gym-today.webp', alt: 'Get Gym Done: the Today screen with the next workout' },
      { src: 'assets/projects/gym-workout.webp', alt: 'Get Gym Done: an active workout with set steppers' },
      { src: 'assets/projects/gym-profile.webp', alt: 'Get Gym Done: the profile with progress charts' },
    ],
  },
  {
    id: 'portfolio',
    name: 'PRANAV OS',
    repo: gh('pranav-portfolio'),
    icon: 'smiley',
    status: 'live',
    platform: 'Website (you are here)',
    year: '2025–2026',
    tagline: 'This portfolio: a fake retro operating system with a blue screen of death.',
    stack: ['Angular 19', 'TypeScript', 'SCSS', 'WebAudio', 'SSR prerendering', 'GitHub Pages'],
    highlights: [
      'Draggable windows, a working terminal, a résumé installer and a VHS deck.',
      'Every sound is synthesised; every icon is 16×16 pixel art stored as text.',
      'Open it in Navigator to run PRANAV OS inside PRANAV OS.',
    ],
    live: {
      url: 'https://pranavchandar.github.io/pranav-portfolio/',
      host: 'pranavchandar.github.io/pranav-portfolio',
      frameable: true,
    },
  },
  {
    id: 'adda',
    name: 'Adda',
    repo: gh('adda'),
    icon: 'pin',
    status: 'building',
    platform: 'Android + Spring Boot backend',
    year: '2026',
    tagline: 'A photo-first map of where people actually go. Every photo posted warms the map.',
    stack: ['Kotlin', 'Jetpack Compose', 'Spring Boot 3.4', 'PostGIS', 'H3', 'Redis', 'MinIO', 'MapLibre', 'Docker'],
    highlights: [
      'A live heatmap built only from real posts: recency-decayed, spam-damped, never paid.',
      'Dish-first search: "best Haleem near me" is a single query.',
      'Offline-first posting, EXIF stripping, blurhash previews and full TalkBack parity.',
      'Feature-complete through milestone M6; waiting on launch accounts.',
    ],
  },
  {
    id: 'photo-index',
    name: 'Photo Index',
    repo: gh('personal-cloud'),
    icon: 'cloud',
    status: 'self-hosted',
    platform: 'Self-hosted web app',
    year: '2026',
    tagline: 'A private Google Photos that runs on a home PC, with AI tagging on the graphics card.',
    stack: ['Python', 'SQLite', 'Qwen2.5-VL (local)', 'Tailscale', 'PowerShell'],
    highlights: [
      'Indexes 55,485 photos and 9,486 videos from phone, iPhone and drone backups.',
      '705,619 tags generated locally on an RTX 3060 Ti. No cloud upload, no API bill.',
      'Searchable thumbnail grid reachable from anywhere, but only from my own devices.',
      'Running cost: ₹0.',
    ],
  },
  {
    id: 'gym-android',
    name: 'Get Gym Done (Android)',
    repo: gh('get-gym-done'),
    icon: 'android',
    status: 'building',
    platform: 'Android',
    year: '2026',
    tagline: 'The original native app the web version was ported from.',
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Hilt', 'Room', 'Navigation Compose'],
    highlights: [
      'Local-only: no cloud, no accounts.',
      'Room database seeded with a 5-day split and 26 exercises; JSON export and import.',
      'Day rotation logic drives the "Up next" card.',
    ],
  },
  {
    id: 'gym-ios',
    name: 'Get Gym Done (iOS)',
    repo: gh('Get-gym-done-ios'),
    icon: 'iphone',
    status: 'building',
    platform: 'iOS',
    year: '2026',
    tagline: 'A native SwiftUI port aiming for pixel-for-pixel parity with the web app.',
    stack: ['Swift', 'SwiftUI', 'XcodeGen', 'Playwright (reference captures)', 'GitHub Actions'],
    highlights: [
      '31 reference screenshots of the web app act as the visual spec.',
      'CI captures simulator screenshots and produces a parity report.',
      'All 42 known web-app defects are fixed rather than copied.',
    ],
  },
];

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Online',
  building: 'In development',
  'self-hosted': 'Private server',
};

export const projectById = (id: string) => PROJECTS_LIST.find((p) => p.id === id);
