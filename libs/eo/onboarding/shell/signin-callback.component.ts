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
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

interface State {
  thirdPartyClientId: string;
  redirectUrl: string;
}

@Component({
  standalone: true,
  selector: 'eo-signin-callback',
  imports: [WattSpinnerComponent],
  styles: `
    :host {
      height: 100vh;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  template: ` <watt-spinner /> `,
})
export class EoSigninCallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService: EoAuthService = inject(EoAuthService);
  private readonly transloco = inject(TranslocoService);

  ngOnInit() {
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
      .catch(() => {
        this.authService.login();
      });
  }
}
