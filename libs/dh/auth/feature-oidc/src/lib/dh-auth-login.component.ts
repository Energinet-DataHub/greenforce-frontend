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
import { Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { PushModule } from '@rx-angular/template/push';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { LoginAzureProviderConfigId, LoginMitIdProviderConfigId } from './auth-config.module';
import { map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'dh-auth-login',
  styles: [
    `
      :host {
        display: block;
        background-color: red;
      }
    `,
  ],
  templateUrl: './dh-auth-login.component.html',
  standalone: true,
  imports: [CommonModule, PushModule, WattSpinnerModule],
})
export class DhAuthLoginComponent {
  showLoginOptions$ = this.oidcSecurityService.isAuthenticated$.pipe(
    map((result) =>
      result.allConfigsAuthenticated.some((authResult) => authResult.isAuthenticated)
    ),
    tap((isAnyAuthenticated) => {
      if (isAnyAuthenticated) {
        this.router.navigateByUrl('/');
      }
    }),
    map((isAnyAuthenticated) => !isAnyAuthenticated)
  );

  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {}

  loginB2C() {
    this.oidcSecurityService.authorize(LoginAzureProviderConfigId);
  }

  loginMitId() {
    this.oidcSecurityService.authorize(LoginMitIdProviderConfigId);
  }
}
