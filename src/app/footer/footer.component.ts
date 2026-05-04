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
    { href: 'https://www.instagram.com/', label: 'Instagram', icon: 'assets/icons/Instagram.svg', external: true },
    { href: 'https://www.linkedin.com/', label: 'LinkedIn', icon: 'assets/icons/Linkedin.svg', external: true },
    { href: 'https://www.facebook.com/', label: 'Facebook', icon: 'assets/icons/Facebook.svg', external: true },
    { href: 'https://pranavchandar.com', label: 'Personal site', icon: 'assets/icons/Globe.svg', external: true },
  ];
}
