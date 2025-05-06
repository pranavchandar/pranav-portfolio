import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { NavigationComponent } from '../navigation/navigation.component'; // Import NavigationComponent
import { FooterComponent } from '../footer/footer.component'; // Import FooterComponent
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume',
  standalone: true, // Mark as standalone
  imports: [CommonModule, NavigationComponent, FooterComponent], // Import necessary components and modules
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent {
  // Renamed ViewChild selector and variable to match HTML
  @ViewChild('aboutContainer') aboutContainer!: ElementRef<HTMLElement>;

  // Note: This method is duplicated from HomeComponent.
  // Consider moving the fade-out logic related to logo click
  // higher up (e.g., to the app-navigation component itself if applicable,
  // or a shared service/parent container) if this pattern repeats often.
  handleLogoClick() {
    // Use optional chaining
    this.aboutContainer?.nativeElement.classList.add('fade-out');

    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }

  // ElementRef injection not strictly necessary for this component's logic
  constructor(private router: Router) {}
}