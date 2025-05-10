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
  styleUrl: './about.component.scss' // Ensure this is correct
})
export class AboutComponent {

  @ViewChild('aboutContainer') aboutContainer!: ElementRef<HTMLElement>;

  handleLogoClick() {
    this.aboutContainer?.nativeElement.classList.add('fade-out');

    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }

  constructor(private router: Router) {}
}