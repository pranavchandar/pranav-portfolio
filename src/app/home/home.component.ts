import { Component, ElementRef, ViewChild } from '@angular/core';
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
export class HomeComponent {
  @ViewChild('homeContainer') homeContainer!: ElementRef;

  constructor(private router: Router) {}

  handleLogoClick() {
    const homeElement = this.homeContainer.nativeElement as HTMLElement;
    homeElement.classList.add('fade-out');

    // Add a 1-second delay to match the black overlay's fade-out transition (2 seconds)
    // We set the timeout duration to the CSS transition duration (2000ms)
    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000); // <--- Increased delay to 2000ms (2 seconds)
  }
}