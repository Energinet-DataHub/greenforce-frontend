//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
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
//#endregion
import { Component, OnInit, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';
import { EoHeaderComponent } from '@energinet-datahub/eo/shared/components/ui-header';
import { EoFooterComponent } from '@energinet-datahub/eo/shared/components/ui-footer';

interface State {
  thirdPartyClientId: string;
  redirectUrl: string;
}

@Component({
  selector: 'eo-signin-callback',
  imports: [
    WattSpinnerComponent,
    WattEmptyStateComponent,
    TranslocoPipe,
    EoHeaderComponent,
    EoFooterComponent,
  ],
  styles: `
    .content {
      height: 90vh;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
  `,
  template: `
    <eo-header />
    <div class="content">
      @if (isMitIDErhverv()) {
        <watt-spinner />
      } @else {
        <watt-empty-state
          icon="custom-power"
          [useHTML]="true"
          [title]="translations.shared.notMitIDErhvervError.title | transloco"
          [message]="translations.shared.notMitIDErhvervError.message | transloco"
        />
      }
    </div>
    <eo-footer />
  `,
})
export class EoSigninCallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService: EoAuthService = inject(EoAuthService);
  private readonly transloco = inject(TranslocoService);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  errorDescription = input<string>('', { alias: 'error_description' });
  protected readonly isMitIDErhverv = computed(
    () => !this.errorDescription()?.startsWith('AADB2C90273')
  );

  protected readonly translations = translations;

  ngOnInit() {
    if (!this.isMitIDErhverv()) return;
    this.handleSigninCallback();
  }

  private handleSigninCallback() {
    this.authService
      .signinCallback()
      .then((user) => {
        if (!user) return;
        if (!user.id_token) return;

        const thirdPartyClientId = (user.state as State)?.thirdPartyClientId;
        const redirectUrl = (user.state as State)?.redirectUrl;

        // Redirect to the on-boarding flow, redirect URL or fallback to the dashboard
        if (thirdPartyClientId) {
          this.router.navigate(['/consent'], {
            queryParams: {
              'third-party-client-id': thirdPartyClientId,
              'redirect-url': redirectUrl,
            },
          });
        } else if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate([this.transloco.getActiveLang(), 'dashboard']);
        }
      })
      .catch((error) => {
        // Check if the error message contains the whitelist UUID
        if (error?.message && error.message.includes(EoAuthService.WHITELIST_ERROR_UUID)) {
          // Redirect to contact-support page
          this.router.navigate([this.transloco.getActiveLang(), 'contact-support']);
        }
        // Existing error handling
        else if (error.message === 'No matching state found in storage') {
          this.router.navigate([this.transloco.getActiveLang(), 'dashboard']);
        } else {
          this.authService.login(error.state);
        }
      });
  }
}
