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
import { ActivatedRoute, Router } from '@angular/router';
import { EoAuthService, EoAuthStore } from '@energinet-datahub/eo/shared/services';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { combineLatest, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'eo-login',
  imports: [WattSpinnerComponent],
  styles: [
    `
      .spinner {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  template: `<div class="spinner"><watt-spinner></watt-spinner></div>`,
})
export class EoLoginComponent {
  constructor(
    private service: EoAuthService,
    private store: EoAuthStore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.service.handleLogin();
    combineLatest([this.store.getScope$, this.store.isTokenExpired$])
      .pipe(take(1))
      .subscribe(([scope, isTokenExpired]) => {
        if (scope.length == 0) {
          this.service.startLogin();
        } else if (isTokenExpired) {
          this.service.logout();
        } else if (scope.includes('not-accepted-privacypolicy-terms')) {
          this.router.navigate(['/terms']);
        } else if (scope.includes('dashboard')) {
          const redirectionPath = this.route.snapshot.queryParamMap.get('redirectionPath');
          if (redirectionPath && redirectionPath !== 'null') {
            window.location.href = window.location.origin + redirectionPath;
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
      });
  }
}
