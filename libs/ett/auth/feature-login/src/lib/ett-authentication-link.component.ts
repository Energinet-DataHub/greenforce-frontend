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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { AuthOidcHttp } from '@energinet-datahub/ett/auth/data-access-api';
import { AbsoluteUrlGenerator } from '@energinet-datahub/ett/shared/util-browser';
import { ettDashboardRoutePath } from '@energinet-datahub/ett/dashboard/routing-dashboard';
import { LetModule } from '@rx-angular/template';
import { catchError, map, Observable, of } from 'rxjs';

const selector = 'ett-authentication-link';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      .${selector}__error.${selector}__error {
        margin: 0;
      }
    `,
  ],
  template: `
    <a *rxLet="loginUrl$ as loginUrl; rxError: loginError" [href]="loginUrl"
      >NemID or MitID</a
    >
    <ng-template #loginError let-error="$error">
      <p class="${selector}__error">
        NemID and MitID login are currently unavailable. Please try again later.
      </p>
    </ng-template>
  `,
})
export class EttAuthenticationLinkComponent {
  #returnUrl = this.urlGenerator.fromCommands([ettDashboardRoutePath]);

  loginProviderError$: Observable<unknown>;
  loginUrl$: Observable<string> = this.authOidc
    .login(this.#returnUrl)
    .pipe(map((response) => response.url));

  constructor(
    private authOidc: AuthOidcHttp,
    private urlGenerator: AbsoluteUrlGenerator
  ) {
    this.loginProviderError$ = this.loginUrl$.pipe(
      catchError((error: unknown) => of(error))
    );
  }
}

@NgModule({
  declarations: [EttAuthenticationLinkComponent],
  exports: [EttAuthenticationLinkComponent],
  imports: [LetModule],
})
export class EttAuthenticationLinkScam {}
