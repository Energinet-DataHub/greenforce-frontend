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

import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { AuthService } from './auth.service';

interface State {
  thirdPartyClientId: string;
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
  private readonly authService = inject(AuthService);
  private readonly oldAuthService = inject(EoAuthService);

  ngOnInit() {
    this.authService.userManager
      ?.signinCallback()
      .then((user) => {
        if (!user) return;
        if (!user.id_token) return;

        this.oldAuthService.handleToken(user.id_token);
        const thirdPartyClientId = (user.state as State).thirdPartyClientId;
        this.router.navigate(['/consent'], {
          queryParams: { 'third-party-client-id': thirdPartyClientId },
        });
      })
      .catch((err) => {
        console.error('Error processing signin callback:', err);
      });
  }
}
