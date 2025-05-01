import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common'; // Import NgClass

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgClass], // Add NgClass
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Output() logoClick = new EventEmitter<void>();
  isMenuOpen = false;
  // The old isSubmenuOpen is not used in the new logic.

  // Use a map or object to track which submenu is open.
  // Using number keys to map to the index of the submenu (e.g., 0 for Portfolio).
  openSubmenus: { [key: number]: boolean } = {};

  constructor(private elementRef: ElementRef) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // Close any open submenus when the main menu is closed
    if (!this.isMenuOpen) {
      this.closeAllSubmenus();
    }
  }

  // Method to toggle a specific submenu by index
  // The event argument is optional if you're just using stopPropagation
  toggleSubmenu(index: number, event?: MouseEvent): void { // Make event optional
    if (event) {
       event.stopPropagation(); // Prevent click from bubbling up
    }

    // Close other submenus if only one should be open at a time (optional)
    Object.keys(this.openSubmenus).forEach(key => {
      if (parseInt(key, 10) !== index) {
        this.openSubmenus[parseInt(key, 10)] = false;
      }
    });

    // Toggle the clicked submenu
    this.openSubmenus[index] = !this.openSubmenus[index];
  }

  closeAllSubmenus(): void {
      this.openSubmenus = {}; // Reset the map to close all submenus
  }

  // Helper method for template to check if a submenu is open by index
  isSubmenuOpenByIndex(index: number): boolean {
    // Returns true if the entry exists and is true, otherwise false
    return !!this.openSubmenus[index];
  }

  navigateToEasterEgg(): void {
    this.logoClick.emit();
  }

  // Handle clicks outside the navigation to close the menu and submenus
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    // Check if the click was inside the navigation element (including menu icon)
    const clickedInsideNavigation = this.elementRef.nativeElement.contains(event.target);

    // If the click was outside the navigation, close the menu and submenus
    if (!clickedInsideNavigation) {
      this.isMenuOpen = false; // Close the main menu
      this.closeAllSubmenus(); // Close all submenus
    }
  }

  // Close menu and submenus on route change (useful for small screens)
  @HostListener('window:popstate') // Listens for browser back/forward buttons
  onPopState() {
    this.isMenuOpen = false;
    this.closeAllSubmenus();
  }

  // Click handlers on links in the HTML template will also close the menu/submenus.
}