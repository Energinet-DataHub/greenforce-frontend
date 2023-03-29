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
import { Router } from '@angular/router';
import { EoAuthService, EoAuthStore } from '@energinet-datahub/eo/shared/services';

@Component({
  standalone: true,
  selector: 'eo-login',
  styles: [``],
  template: ``,
})
export class EoLoginComponent {
  constructor(private service: EoAuthService, private store: EoAuthStore, private router: Router) {
    this.service.handleLogin();
    this.store.getScope$.subscribe((scope) => {
      if (scope.includes('not-accepted-terms')) {
        this.router.navigate(['/terms']);
        return;
      }
      if (scope.includes('accepted-terms') && scope.includes('dashboard')) {
        this.router.navigate(['/dashboard']);
        return;
      }

      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });

      const urlParams = new URLSearchParams(window.location.search);
      if (!urlParams.toString().includes('errorCode')) this.service.logout();
    });
  }
}
