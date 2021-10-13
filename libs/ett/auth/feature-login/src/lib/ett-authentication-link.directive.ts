import { APP_BASE_HREF, Location as AppLocation } from '@angular/common';
import { Directive, Inject, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AuthOidcHttp } from '@energinet-datahub/ett/core/data-access-auth';
import { browserLocationToken } from '@energinet-datahub/ett/core/util-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
  exportAs: 'ettAuthenticationLink',
  selector: '[ettAuthenticationLink]',
})
export class EttAuthenticationDirective {
  #returnUrl =
    this.browserLocation.origin +
    (this.appLocation.normalize(this.baseHref) ?? '') +
    this.router.serializeUrl(this.router.createUrlTree(['dashboard']));

  loginUrl$: Observable<string> = this.authOidc
    .login(this.#returnUrl)
    .pipe(map((response) => response.url));

  constructor(
    private appLocation: AppLocation,
    private authOidc: AuthOidcHttp,
    @Inject(APP_BASE_HREF) private baseHref: string,
    @Inject(browserLocationToken) private browserLocation: Location,
    private router: Router
  ) {}
}

@NgModule({
  declarations: [EttAuthenticationDirective],
  exports: [EttAuthenticationDirective],
})
export class EttAuthenticationScam {}
