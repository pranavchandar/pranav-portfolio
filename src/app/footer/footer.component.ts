import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SocialLink {
  href: string;
  label: string;
  icon: string;
  external: boolean;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  links: SocialLink[] = [
    { href: 'mailto:hello@pranavchandar.com', label: 'Email', icon: 'assets/icons/Mail.svg', external: false },
    { href: 'tel:+10000000000', label: 'Phone', icon: 'assets/icons/Phone.svg', external: false },
    { href: 'https://github.com/pranavchandar', label: 'GitHub', icon: 'assets/icons/Github.svg', external: true },
    { href: 'https://www.instagram.com/pranavchandarvb/', label: 'Instagram', icon: 'assets/icons/Instagram.svg', external: true },
    { href: 'https://www.linkedin.com/in/pranav-chandar-v-b-530950147/', label: 'LinkedIn', icon: 'assets/icons/Linkedin.svg', external: true },
    { href: 'https://www.youtube.com/@pranavchandar7080', label: 'YouTube', icon: 'assets/icons/Youtube.svg', external: true },
    { href: 'https://pranavchandar.github.io/pranav-portfolio/', label: 'Personal site', icon: 'assets/icons/Globe.svg', external: true },
  ];
}
