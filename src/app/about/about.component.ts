import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

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