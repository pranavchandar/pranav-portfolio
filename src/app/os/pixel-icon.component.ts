import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { IconName, pixelSvg } from './pixel-icons';

@Component({
  selector: 'os-icon',
  template: '',
  host: {
    '[innerHTML]': 'svg()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    'aria-hidden': 'true',
  },
  styles: `
    :host { display: inline-block; flex: none; image-rendering: pixelated; }
    :host ::ng-deep svg { width: 100%; height: 100%; display: block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PixelIconComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<IconName>();
  readonly size = input(32);
  // Icons are static strings defined in this repo, so trusting them is safe.
  readonly svg = computed(() => this.sanitizer.bypassSecurityTrustHtml(pixelSvg(this.name())));
}
