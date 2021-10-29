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
import { Directive, NgModule } from '@angular/core';
import { AuthOidcHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { AbsoluteUrlGenerator } from '@energinet-datahub/ett/core/util-browser';
import { ettDashboardRoutePath } from '@energinet-datahub/ett/dashboard/feature-shell';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Directive({
  exportAs: 'ettAuthenticationLink',
  selector: '[ettAuthenticationLink]',
})
export class EttAuthenticationDirective {
  #returnUrl = this.urlGenerator.fromCommands([ettDashboardRoutePath]);

  loginUrl$: Observable<string> = this.authOidc
    .login(this.#returnUrl)
    .pipe(map((response) => response.url));

  constructor(
    private authOidc: AuthOidcHttp,
    private urlGenerator: AbsoluteUrlGenerator
  ) {}
}

@NgModule({
  declarations: [EttAuthenticationDirective],
  exports: [EttAuthenticationDirective],
})
export class EttAuthenticationScam {}
