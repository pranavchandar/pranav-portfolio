import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavigationComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('homeContainer') homeContainer!: ElementRef<HTMLElement>;
  @ViewChild('interactiveAreaContainer') interactiveAreaContainer!: ElementRef<HTMLElement>;

  heroImageUrls: string[] = [
    'assets/images/1top.jpg',
    'assets/images/2topmid.jpg',
    'assets/images/3mid.jpg',
    'assets/images/4botmid.jpg',
    'assets/images/5bot.jpg',
  ];

  currentHeroImageUrl: string = this.heroImageUrls[0];

  private activeSectionIndex: number = -1;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    if (!this.homeContainer || !this.interactiveAreaContainer) {
      return;
    }
  }

  handleLogoClick() {
    this.homeContainer?.nativeElement.classList.add('fade-out');
    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }

  onMouseMove(event: MouseEvent): void {
    const containerElement = this.interactiveAreaContainer?.nativeElement;
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const mouseY = event.clientY - containerRect.top;
    const sectionHeight = containerRect.height / this.heroImageUrls.length;

    let newActiveSectionIndex = -1;
    for (let i = 0; i < this.heroImageUrls.length; i++) {
      if (mouseY >= i * sectionHeight && mouseY < (i + 1) * sectionHeight) {
        newActiveSectionIndex = i;
        break;
      }
    }

    if (newActiveSectionIndex !== -1 && newActiveSectionIndex !== this.activeSectionIndex) {
      this.activeSectionIndex = newActiveSectionIndex;
      this.currentHeroImageUrl = this.heroImageUrls[this.activeSectionIndex];
    }
  }
}
