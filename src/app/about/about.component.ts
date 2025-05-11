import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  @ViewChild('aboutContainer') aboutContainer!: ElementRef<HTMLElement>;

  clickCount = 0;
  isClicked = false;
  hpTexts: { top: number, opacity: number }[] = [];

  constructor(private router: Router) {}

  handleLogoClick() {
    this.aboutContainer?.nativeElement.classList.add('fade-out');
    setTimeout(() => {
      this.router.navigate(['/secret']);
    }, 2000);
  }

  onImageClick() {
    console.log('Image clicked!'); // Debugging log
    this.clickCount++;
    this.isClicked = true;
    
    // Add HP text
    this.hpTexts.push({ top: 0, opacity: 1 });
    
    // Animate HP text
    const index = this.hpTexts.length - 1;
    const animate = () => {
      if (this.hpTexts[index]) {
        this.hpTexts[index].top -= 1;
        this.hpTexts[index].opacity -= 0.02;
        if (this.hpTexts[index].opacity <= 0) {
          this.hpTexts.splice(index, 1);
        } else {
          requestAnimationFrame(animate);
        }
      }
    };
    requestAnimationFrame(animate);

    // Reset click state
    setTimeout(() => {
      this.isClicked = false;
    }, 100);
  }
}