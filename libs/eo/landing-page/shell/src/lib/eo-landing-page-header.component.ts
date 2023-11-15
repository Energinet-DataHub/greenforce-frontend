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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EoHeaderComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoHeaderComponent, WattButtonComponent],
  selector: 'eo-landing-page-header',
  styles: [
    `
      :host {
        display: block;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      ::ng-deep .login .mat-button.watt-button--primary {
        height: 63px;
        border-radius: 0;
        margin-right: -16px;
      }
    `,
  ],
  template: `
    <eo-header>
      <watt-button class="login" data-testid="login-button" icon="login" (click)="login()">
        Log on
      </watt-button>
    </eo-header>
  `,
})
export class EoLandingPageHeaderComponent {
  private authService = inject(EoAuthService);

  login() {
    this.authService.startLogin();
  }
}
