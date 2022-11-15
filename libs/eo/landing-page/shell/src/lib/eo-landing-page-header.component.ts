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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EoHeaderComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoLandingPageLoginButtonComponent } from './eo-landing-page-login-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EoHeaderComponent, EoLandingPageLoginButtonComponent],
  selector: 'eo-landing-page-header',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <eo-header>
      <eo-landing-page-login-button></eo-landing-page-login-button>
    </eo-header>
  `,
})
export class EoLandingPageHeaderComponent {}
