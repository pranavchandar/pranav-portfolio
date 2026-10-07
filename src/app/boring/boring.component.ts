import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PixelIconComponent } from '../os/pixel-icon.component';
import { ART } from '../data/art';
import { TAPES, thumbFor } from '../data/videos';
import {
  ABOUT, CV_PATH, EDUCATION, EXPERIENCE, LINKS, NAME, PROJECTS, SKILLS, SUMMARY,
} from '../data/profile';

/**
 * Everything on the site, as one plain, fast, accessible page.
 * For recruiters, screen readers, search engines and people who hate fun.
 */
@Component({
  selector: 'app-boring',
  imports: [RouterLink, PixelIconComponent],
  templateUrl: './boring.component.html',
  styleUrl: './boring.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoringComponent implements OnDestroy {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly name = NAME;
  readonly summary = SUMMARY;
  readonly about = ABOUT;
  readonly jobs = EXPERIENCE;
  readonly skills = SKILLS;
  readonly projects = PROJECTS;
  readonly education = EDUCATION;
  readonly links = LINKS;
  readonly cv = CV_PATH;
  readonly art = ART.slice(0, 12);
  readonly artCount = ART.length;
  readonly tapes = TAPES.filter((t) => t.orientation === 'wide');
  readonly thumb = thumbFor;

  constructor() {
    if (this.browser) document.body.classList.add('boring');
  }

  ngOnDestroy(): void {
    if (this.browser) document.body.classList.remove('boring');
  }
}
