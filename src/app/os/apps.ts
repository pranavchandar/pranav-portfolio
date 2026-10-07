import { Type } from '@angular/core';
import { IconName } from './pixel-icons';

export type AppId =
  | 'about'
  | 'resume'
  | 'art'
  | 'cgi'
  | 'code'
  | 'terminal'
  | 'contact'
  | 'punch'
  | 'intro'
  | 'settings'
  | 'dontpress'
  | 'trash';

export interface CloseGuard {
  title: string;
  message: string;
  stay: string;
  leave: string;
}

export interface AppDef {
  id: AppId;
  /** Window title */
  title: string;
  /** Desktop icon label */
  label: string;
  icon: IconName;
  w: number;
  h: number;
  /** Deep-link path (no leading slash). Kept identical to the old site's URLs. */
  route?: string;
  /** Allow several windows of this app at once */
  multi?: boolean;
  guard?: CloseGuard;
  load: () => Promise<Type<unknown>>;
}

export const APPS: Record<AppId, AppDef> = {
  about: {
    id: 'about', title: 'ABOUT_ME.TXT — Notepad', label: 'ABOUT_ME.TXT', icon: 'notepad', w: 760, h: 620, route: 'about',
    load: () => import('../apps/about/about.app').then((m) => m.AboutApp),
  },
  resume: {
    id: 'resume', title: 'RESUME.EXE — Pranav v6.2 Setup', label: 'RESUME.EXE', icon: 'floppy', w: 860, h: 640, route: 'resume',
    guard: {
      title: 'Exit Setup',
      message: 'Setup is not complete. If you quit now, Pranav will not be installed and your organization will remain tragically Pranav-less.\n\nExit Setup?',
      stay: 'Resume Setup',
      leave: 'Exit Setup',
    },
    load: () => import('../apps/resume/resume.app').then((m) => m.ResumeApp),
  },
  art: {
    id: 'art', title: 'ART_GALLERY — The Pranavian Museum of Digital Art', label: 'ART_GALLERY', icon: 'frame', w: 1040, h: 700, route: 'work/digital-art',
    load: () => import('../apps/gallery/gallery.app').then((m) => m.GalleryApp),
  },
  cgi: {
    id: 'cgi', title: 'CGI_TAPES — VHS Deck 3000', label: 'CGI_TAPES', icon: 'vhs', w: 1040, h: 700, route: 'work/cgi',
    load: () => import('../apps/cgi/cgi.app').then((m) => m.CgiApp),
  },
  code: {
    id: 'code', title: 'pranav.ts — Visual Studio Pranav', label: 'PRANAV.TS', icon: 'code', w: 900, h: 640, route: 'work/programming',
    load: () => import('../apps/code/code.app').then((m) => m.CodeApp),
  },
  terminal: {
    id: 'terminal', title: 'TERMINAL — pranav@os: ~', label: 'TERMINAL', icon: 'terminal', w: 780, h: 480, multi: true,
    load: () => import('../apps/terminal/terminal.app').then((m) => m.TerminalApp),
  },
  contact: {
    id: 'contact', title: 'CONTACT.EML — New Message', label: 'CONTACT.EML', icon: 'mail', w: 640, h: 600,
    load: () => import('../apps/contact/contact.app').then((m) => m.ContactApp),
  },
  punch: {
    id: 'punch', title: 'PUNCH_ME.EXE — Street Pranav II Turbo', label: 'PUNCH_ME.EXE', icon: 'glove', w: 620, h: 680,
    load: () => import('../apps/punch/punch.app').then((m) => m.PunchApp),
  },
  intro: {
    id: 'intro', title: 'INTRO.MOV — Pranav Media Player', label: 'INTRO.MOV', icon: 'film', w: 900, h: 600, route: 'secret',
    load: () => import('../apps/intro/intro.app').then((m) => m.IntroApp),
  },
  settings: {
    id: 'settings', title: 'Control Panel', label: 'CONTROL_PANEL', icon: 'gear', w: 600, h: 640,
    load: () => import('../apps/settings/settings.app').then((m) => m.SettingsApp),
  },
  dontpress: {
    id: 'dontpress', title: 'DONT_PRESS.EXE', label: 'DONT_PRESS.EXE', icon: 'button', w: 440, h: 440,
    load: () => import('../apps/dont-press/dont-press.app').then((m) => m.DontPressApp),
  },
  trash: {
    id: 'trash', title: 'Recycle Bin', label: 'RECYCLE BIN', icon: 'trash', w: 680, h: 460,
    load: () => import('../apps/trash/trash.app').then((m) => m.TrashApp),
  },
};

/** Desktop icon order. `boring` is a pseudo-app that leaves the OS. */
export const DESKTOP: (AppId | 'boring')[] = [
  'about', 'resume', 'art', 'cgi', 'code', 'terminal', 'contact', 'punch', 'intro', 'settings', 'dontpress', 'boring', 'trash',
];

export const appForRoute = (path: string): AppId | null =>
  (Object.values(APPS).find((a) => a.route === path)?.id as AppId) ?? null;
