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
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  selector: 'dh-app',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `<router-outlet />`,
  standalone: true,
  imports: [RouterOutlet],
})
export class DataHubAppComponent implements OnInit {
  private authService = inject(MsalService);
  private router = inject(Router);
  private featureFlagService = inject(DhFeatureFlagsService);

  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe((data) => {
      if (data) {
        this.authService.instance.setActiveAccount(data.account);
      }

      if (
        !data &&
        this.authService.instance.getAllAccounts().length === 0 &&
        this.featureFlagService.isEnabled('new-login-flow')
      ) {
        this.router.navigate(['/login']);
      }
    });
  }
}
