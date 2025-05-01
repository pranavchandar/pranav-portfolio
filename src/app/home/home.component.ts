import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component'; // Adjust path
import { FooterComponent } from '../footer/footer.component'; // Adjust path

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit { // Implement AfterViewInit

  @ViewChild('homeContainer') homeContainer!: ElementRef;
  // Get reference to the container that holds the interactive sections
  @ViewChild('interactiveAreaContainer') interactiveAreaContainer!: ElementRef;

  // Array of image URLs for the hero section
  heroImageUrls: string[] = [
    'assets/images/1top.png', // Image for section 1 (index 0)
    'assets/images/2topmid.png', // Example Image for section 2 (index 1)
    'assets/images/3mid.png', // Example Image for section 3 (index 2)
    'assets/images/4botmid.png', // Example Image for section 4 (index 3)
    'assets/images/5bot.png'  // Example Image for section 5 (index 4)
  ];

  // Default hero image URL
  currentHeroImageUrl: string = this.heroImageUrls[0]; // Start with the first image

  // Track the index of the currently active section (for optimization)
  private activeSectionIndex: number = -1;

  constructor(private router: Router, private elementRef: ElementRef) {} // Inject ElementRef

  ngAfterViewInit() {
    // Ensure the interactiveAreaContainer is available after view initialization
    if (!this.interactiveAreaContainer) {
      console.error('interactiveAreaContainer not found!');
    }
  }

  handleLogoClick() {
    const homeElement = this.homeContainer.nativeElement as HTMLElement;
    homeElement.classList.add('fade-out');

    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }

  // Method to handle mousemove event
  onMouseMove(event: MouseEvent): void {
    if (!this.interactiveAreaContainer) {
      return; // Exit if the container is not ready
    }

    const containerElement = this.interactiveAreaContainer.nativeElement as HTMLElement;
    const containerRect = containerElement.getBoundingClientRect(); // Get container position and size

    // Calculate the relative Y position of the mouse within the container
    const mouseY = event.clientY - containerRect.top;

    // Calculate the height of each interactive section
    const sectionHeight = containerRect.height / 5;

    // Determine which section the mouse is over
    let newActiveSectionIndex = -1;
    for (let i = 0; i < 5; i++) {
      if (mouseY >= i * sectionHeight && mouseY < (i + 1) * sectionHeight) {
        newActiveSectionIndex = i;
        break;
      }
    }

    // Update the hero image if the active section has changed
    if (newActiveSectionIndex !== -1 && newActiveSectionIndex !== this.activeSectionIndex) {
      this.activeSectionIndex = newActiveSectionIndex;
      this.currentHeroImageUrl = this.heroImageUrls[this.activeSectionIndex];
    }
  }

  // Optional: Handle mouseleave to revert to a default image if needed
  // @HostListener('mouseleave', ['$event'])
  // onMouseLeave(event: MouseEvent): void {
  //   // Check if mouse is leaving the interactive area container
  //   const containerElement = this.interactiveAreaContainer.nativeElement as HTMLElement;
  //   if (!containerElement.contains(event.relatedTarget as Node)) {
  //      this.currentHeroImageUrl = this.heroImageUrls[0]; // Revert to default
  //      this.activeSectionIndex = -1; // Reset active index
  //   }
  // }

}