import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Pranav Chandar — Software Engineer & Digital Artist',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    title: 'About — Pranav Chandar',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'resume',
    title: 'Resume — Pranav Chandar',
    loadComponent: () =>
      import('./resume/resume.component').then((m) => m.ResumeComponent),
  },
  {
    path: 'work/programming',
    title: 'Programming — Pranav Chandar',
    data: { discipline: 'Programming', tagline: 'Backend systems, Angular apps, and AI experiments.' },
    loadComponent: () =>
      import('./placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
  },
  {
    path: 'work/digital-art',
    title: 'Digital Art — Pranav Chandar',
    data: { discipline: 'Digital Art', tagline: 'Sketches, illustrations, and visual experiments.' },
    loadComponent: () =>
      import('./placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
  },
  {
    path: 'work/cgi',
    title: 'CGI — Pranav Chandar',
    data: { discipline: 'CGI', tagline: 'Blender renders, lookdev, and 3D scenes.' },
    loadComponent: () =>
      import('./placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
  },
  {
    path: 'secret',
    title: 'Pranav Chandar',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'test',
    title: 'Test — Pranav Chandar',
    loadComponent: () =>
      import('./test/test.component').then((m) => m.TestComponent),
  },
  { path: '**', redirectTo: '' },
];
