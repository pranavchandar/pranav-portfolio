import { Routes } from '@angular/router';
import { AppId } from './os/apps';

const os = () => import('./os/os.component').then((m) => m.OsComponent);

/** Every old URL still works: it boots PRANAV OS and opens the matching window. */
const deepLink = (path: string, open: AppId, title: string) => ({
  path,
  title: `${title} — PRANAV OS`,
  data: { open },
  loadComponent: os,
});

export const routes: Routes = [
  { path: '', title: 'PRANAV OS 95 — Pranav Chandar', loadComponent: os },
  deepLink('about', 'about', 'ABOUT_ME.TXT'),
  deepLink('resume', 'resume', 'RESUME.EXE'),
  deepLink('work/programming', 'code', 'PRANAV.TS'),
  deepLink('work/digital-art', 'art', 'ART_GALLERY'),
  deepLink('work/cgi', 'cgi', 'CGI_TAPES'),
  deepLink('secret', 'intro', 'INTRO.MOV'),
  {
    path: 'boring',
    title: 'Pranav Chandar — Software Engineer & Digital Artist',
    loadComponent: () => import('./boring/boring.component').then((m) => m.BoringComponent),
  },
  { path: '**', redirectTo: '' },
];
