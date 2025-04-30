import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Output() logoClick = new EventEmitter<void>();
  isMenuOpen = false;
  isSubmenuOpen = false;

  constructor(private elementRef: ElementRef) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubmenu(event: MouseEvent): void {
    event.stopPropagation(); // Prevent dropdown toggle on click bubbling
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  navigateToEasterEgg(): void {
    this.logoClick.emit();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isSubmenuOpen = false;
    }
  }
}
