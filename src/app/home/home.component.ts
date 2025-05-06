import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NavigationComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  // Keep template reference variables for robustness
  @ViewChild('homeContainer') homeContainer!: ElementRef<HTMLElement>;
  @ViewChild('interactiveAreaContainer') interactiveAreaContainer!: ElementRef<HTMLElement>;

  heroImageUrls: string[] = [
    'assets/images/1top.png',
    'assets/images/2topmid.png',
    'assets/images/3mid.png',
    'assets/images/4botmid.png',
    'assets/images/5bot.png'
  ];

  currentHeroImageUrl: string = this.heroImageUrls[0];

  private activeSectionIndex: number = -1;

  constructor(private router: Router) {} // ElementRef injection not strictly necessary for this component's logic

  ngAfterViewInit() {
    // Ensure elements are available
    if (!this.homeContainer || !this.interactiveAreaContainer) {
      console.error('Required view elements not found!');
      // Potentially handle this more gracefully or ensure it doesn't break if they are missing
    }
  }

  // Handles the logo click fade-out and navigation
  handleLogoClick() {
    // Use optional chaining in case homeContainer is null (though ngAfterViewInit check helps)
    this.homeContainer?.nativeElement.classList.add('fade-out');

    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }

  // Handles mousemove on the interactive area
  onMouseMove(event: MouseEvent): void {
    // Use optional chaining
    const containerElement = this.interactiveAreaContainer?.nativeElement;

    if (!containerElement) {
      return; // Exit if the container is not ready
    }

    const containerRect = containerElement.getBoundingClientRect();
    const mouseY = event.clientY - containerRect.top; // Y position relative to container top

    const sectionHeight = containerRect.height / this.heroImageUrls.length; // Calculate height based on image count (5 sections)

    let newActiveSectionIndex = -1;
    for (let i = 0; i < this.heroImageUrls.length; i++) { // Loop based on image count
      if (mouseY >= i * sectionHeight && mouseY < (i + 1) * sectionHeight) {
        newActiveSectionIndex = i;
        break;
      }
    }

    // Update the hero image only if the active section has changed
    if (newActiveSectionIndex !== -1 && newActiveSectionIndex !== this.activeSectionIndex) {
      this.activeSectionIndex = newActiveSectionIndex;
      // Ensure index is within bounds
      if (this.activeSectionIndex >= 0 && this.activeSectionIndex < this.heroImageUrls.length) {
         this.currentHeroImageUrl = this.heroImageUrls[this.activeSectionIndex];
      }
    }
  }

  // Optional: Handle mouseleave - Added optional chaining
  // @HostListener('mouseleave', ['$event'])
  // onMouseLeave(event: MouseEvent): void {
  //   const containerElement = this.interactiveAreaContainer?.nativeElement;
  //   if (containerElement && !containerElement.contains(event.relatedTarget as Node)) {
  //      this.currentHeroImageUrl = this.heroImageUrls[0]; // Revert to default
  //      this.activeSectionIndex = -1; // Reset active index
  //   }
  // }
}