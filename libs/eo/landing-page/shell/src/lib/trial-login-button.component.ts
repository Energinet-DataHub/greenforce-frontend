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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon'; // If you want an icon
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  selector: 'eo-trial-login-button',
  standalone: true, // Assuming you might be using standalone components
  imports: [TranslocoPipe, WattIconComponent], // Add WattButtonComponent if you use <watt-button>
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="button secondary" (click)="onTrialClick()">
      <watt-icon name="login" />
      <!-- Or a more specific icon for trial -->
      {{ translations.loginButton.trial | transloco }}
    </button>
  `,
  // If not standalone, remove standalone: true and add to a module's declarations and exports.
})
export class EoTrialLoginButtonComponent {
  private readonly authService = inject(EoAuthService);
  protected readonly translations = translations;

  onTrialClick(): void {
    this.authService.onTrialButtonClick();
  }
}
