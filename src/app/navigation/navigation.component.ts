import { Component, Output, EventEmitter } from '@angular/core';
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

toggleMenu() {
this.isMenuOpen = !this.isMenuOpen;
}

navigateToEasterEgg() {
this.logoClick.emit();
}
}