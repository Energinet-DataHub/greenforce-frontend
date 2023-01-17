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
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { LetModule } from '@rx-angular/template/let';
import { EoLandingPageStore } from './eo-landing-page.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattButtonModule, LetModule],
  selector: 'eo-landing-page-login-button',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-button
      *rxLet="loginUrl$ as loginUrl"
      (click)="this.authenticate(loginUrl)"
      >Start</watt-button
    >
  `,
})
export class EoLandingPageLoginButtonComponent {
  loginUrl$ = this.landingPageStore.authenticationUrl$;

  authenticate(url: string) {
    window.location.href = url;
  }

  constructor(private landingPageStore: EoLandingPageStore) {}
}
