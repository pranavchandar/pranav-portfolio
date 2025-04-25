import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Import RouterLink and RouterLinkActive
import { CommonModule } from '@angular/common'; // You likely need CommonModule for ngClass, ngIf, etc.

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Add them to the imports array
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild('homeContainer') homeContainer!: ElementRef;

  constructor(private router: Router) {}

  navigateToEasterEgg() {
    const homeElement = this.homeContainer.nativeElement as HTMLElement;
    homeElement.classList.add('fade-out');
    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 500);
  }
}
