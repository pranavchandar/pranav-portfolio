import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

interface SkillGroup {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent {
  @ViewChild('resumeContainer') resumeContainer!: ElementRef<HTMLElement>;

  summary =
    'Software engineer with 5+ years building backend systems and full-stack ' +
    'apps in Java, Spring Boot, and Angular. Currently exploring AI tooling and ' +
    'how it reshapes how we build and create. Off the keyboard: digital art, ' +
    'CGI in Blender, and sketching.';

  experience: ExperienceItem[] = [
    {
      role: 'Software Engineer',
      company: '[Add company]',
      period: '[Start] – Present',
      bullets: [
        'Designed and shipped backend services in Java and Spring Boot.',
        'Built and maintained Angular front-ends used by [scope of users].',
        'Collaborated across product, design, and ops to deliver [describe outcome].',
      ],
    },
    {
      role: '[Previous role]',
      company: '[Add company]',
      period: '[Start] – [End]',
      bullets: [
        '[Add a measurable result, e.g. "Reduced API p95 latency by 40%."]',
        '[Add a project highlight or system you owned.]',
      ],
    },
  ];

  skills: SkillGroup[] = [
    {
      title: 'Languages',
      items: ['Java', 'TypeScript', 'JavaScript', 'SQL', 'Python'],
    },
    {
      title: 'Frameworks & Platforms',
      items: ['Spring Boot', 'Angular', 'Node.js', 'REST', 'PostgreSQL'],
    },
    {
      title: 'AI & Tooling',
      items: ['LLM integrations', 'Prompt engineering', 'Vector search', 'Git', 'CI/CD'],
    },
    {
      title: 'Creative',
      items: ['Blender', 'Photoshop', 'Procreate', 'After Effects'],
    },
  ];

  education = [
    {
      degree: '[Degree]',
      school: '[University name]',
      period: '[Start] – [End]',
    },
  ];

  constructor(private router: Router) {}

  handleLogoClick() {
    this.resumeContainer?.nativeElement.classList.add('fade-out');
    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }
}
