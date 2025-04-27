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
setTimeout(() => {
  this.router.navigate(['/secret']);
}, 500);
}
}