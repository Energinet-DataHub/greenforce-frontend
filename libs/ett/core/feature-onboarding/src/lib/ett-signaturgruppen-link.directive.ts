import { Directive, HostBinding, Inject, NgModule } from '@angular/core';

import { locationToken } from './location.token';

@Directive({
  exportAs: 'ettSignaturgruppenLink',
  selector: '[ettSignaturgruppenLink]',
})
export class EttSignaturgruppenLinkDirective {
  #returnUrl = this.location.href;

  @HostBinding('href')
  get href(): string {
    const query = new URLSearchParams({
      redirect_uri: this.#returnUrl,
    });

    return `/api/oidc/login?${query}`;
  }

  constructor(@Inject(locationToken) private location: Location) {}
}

@NgModule({
  declarations: [EttSignaturgruppenLinkDirective],
  exports: [EttSignaturgruppenLinkDirective],
})
export class EttSignaturGruppenLinkScam {}
