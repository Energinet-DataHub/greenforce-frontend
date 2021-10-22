/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { APP_BASE_HREF, Location as AppLocation } from '@angular/common';
import { Directive, Inject, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AuthOidcHttp } from '@energinet-datahub/ett/auth/data-access';
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
