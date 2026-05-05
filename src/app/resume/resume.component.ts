import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

interface ProjectItem {
  title: string;
  description: string;
}

interface ElapsedTime {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent implements OnInit, OnDestroy {
  @ViewChild('resumeContainer') resumeContainer!: ElementRef<HTMLElement>;

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private readonly startDate = new Date(2019, 7, 19); // August 19, 2019

  elapsed: ElapsedTime = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  // Summary is now inline in the template with keyword highlights

  experience: ExperienceItem[] = [
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

  skills: SkillGroup[] = [
    {
      title: 'Backend',
      items: ['Java 21', 'Spring Boot', 'Spring Security', 'REST APIs', 'Hibernate', 'JPA', 'HQL'],
    },
    {
      title: 'Frontend',
      items: ['Angular 14', 'TypeScript', 'RxJS', 'HTML5', 'SCSS'],
    },
    {
      title: 'Architecture',
      items: ['Microservices', 'Agile/Scrum', 'CI/CD Pipelines'],
    },
    {
      title: 'DevOps & CI/CD',
      items: ['Git', 'Jenkins', 'Docker', 'Kubernetes', 'JFrog Artifactory', 'SonarQube', 'Fortify'],
    },
    {
      title: 'Testing',
      items: ['JUnit 5', 'Mockito', 'Cucumber', 'Selenium', 'Postman'],
    },
    {
      title: 'Cloud & Tools',
      items: ['AWS (EC2, S3)', 'GitHub Actions', 'Swagger', 'Jira'],
    },
    {
      title: 'Creative',
      items: ['Blender', 'Photoshop', 'Procreate', 'After Effects', 'DaVinci Resolve'],
    },
  ];

  education = [
    {
      degree: 'Masters of Computer Applications',
      school: 'SRM Institute of Science and Technology',
      period: '2017 – 2019',
    },
    {
      degree: 'Bachelor of Computer Applications',
      school: 'Vels University',
      period: '2014 – 2017',
    },
  ];

  projects: ProjectItem[] = [
    {
      title: 'Hybrid Fund Transaction & Fee Calculation Platform',
      description: 'Developed backend services handling liquidity, commitment, retrocession, and miscellaneous fee workflows for financial instruments.',
    },
    {
      title: 'Drawdown & Portfolio Management Systems',
      description: 'Built tools for portfolio analysis, financing via drawdowns, trade execution, due diligence workflows, and simulation utilities.',
    },
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateElapsed();
      this.timerInterval = setInterval(() => this.updateElapsed(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private updateElapsed(): void {
    const now = new Date();
    let years = now.getFullYear() - this.startDate.getFullYear();
    let months = now.getMonth() - this.startDate.getMonth();
    let totalDays: number;

    if (months < 0) {
      years--;
      months += 12;
    }

    // Get remaining days after full months
    const monthStart = new Date(now.getFullYear(), now.getMonth(), this.startDate.getDate(),
      this.startDate.getHours(), this.startDate.getMinutes(), this.startDate.getSeconds());

    if (now < monthStart) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); // last day of prev month
      totalDays = prevMonth.getDate() - this.startDate.getDate() + now.getDate();
    } else {
      totalDays = now.getDate() - this.startDate.getDate();
    }

    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    // Time components
    let hours = now.getHours() - this.startDate.getHours();
    let minutes = now.getMinutes() - this.startDate.getMinutes();
    let seconds = now.getSeconds() - this.startDate.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; }

    this.elapsed = { years, months, weeks, days, hours, minutes, seconds };
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  handleLogoClick() {
    this.resumeContainer?.nativeElement.classList.add('fade-out');
    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }
}
