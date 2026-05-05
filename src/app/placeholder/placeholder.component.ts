import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink, NavigationComponent, FooterComponent],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.scss',
})
export class PlaceholderComponent {
  discipline = 'Coming Soon';
  tagline = 'This section is being built.';

  constructor(route: ActivatedRoute) {
    const data = route.snapshot.data;
    if (data['discipline']) this.discipline = data['discipline'];
    if (data['tagline']) this.tagline = data['tagline'];
  }
}
