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
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattButtonModule],
  selector: 'eo-landing-page-login-button',
  styles: [``],
  template: ` <watt-button (click)="login()">Start</watt-button> `,
})
export class EoLandingPageLoginButtonComponent {
  #apiBase: string;

  constructor(@Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  login() {
    window.location.href = `${this.#apiBase}/auth/login`;
  }
}
