import { Directive, HostBinding, Input } from '@angular/core';

const selector = 'eoProductLogo';

@Directive({
  exportAs: selector,
  selector: 'img[' + selector + ']',
  standalone: true,
})
export class EoProductLogoDirective {
  @HostBinding('attr.alt')
  get altAttribute(): string {
    return 'Energy Origin';
  }
  @HostBinding('attr.src')
  get srcAttribute(): string {
    if (this.version === 'secondary') {
      return '/assets/images/energy-origin-logo-secondary.svg';
    } else {
      return '/assets/images/energy-origin-logo.svg';
    }
  }

  @Input() version: 'default' | 'secondary' = 'default';
}
