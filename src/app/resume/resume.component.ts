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

  @ViewChild('homeContainer') homeContainer!: ElementRef;

  constructor(private router: Router, private elementRef: ElementRef) {} // Inject ElementRef

  handleLogoClick() {
    const homeElement = this.homeContainer.nativeElement as HTMLElement;
    homeElement.classList.add('fade-out');

    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }
}