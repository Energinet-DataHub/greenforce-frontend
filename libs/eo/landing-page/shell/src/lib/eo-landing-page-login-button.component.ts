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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LetModule } from '@rx-angular/template';
import { Observable } from 'rxjs';

import { EoLandingPageStore } from './eo-landing-page.store';

const selector = 'eo-landing-page-login-button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: inline-block;
      }

      .link {
        // 1. Primary Watt Button.
        // 2. Normal size Watt Button.
        // 3. Custom size for Watt Button in App bar.
        // 4. Align text vertically.
        // 5. Fill container

        @include watt.typography-watt-button; // [1]

        --height: 44px; // [2]
        --inset-squished-m--y: var(--watt-space-s);

        background: var(--watt-color-primary); // [1]
        color: var(--watt-color-primary-contrast); // [1]

        width: 100%; // [5]
        min-width: 6.25rem; // [2]
        height: var(--height); // [2]
        line-height: calc(
          var(--height) - 2 * var(--inset-squished-m--y)
        ); // [2]
      }
    `,
  ],
  template: `
    <a
      class="link eo-space-inset-squished-m"
      mat-button
      mat-flat-button
      *rxLet="loginUrl$ as loginUrl"
      [href]="loginUrl"
      >Start</a
    >
  `,
})
export class EoLandingPageLoginButtonComponent {
  loginUrl$: Observable<string> = this.landingPageStore.authenticationUrl$;

  constructor(private landingPageStore: EoLandingPageStore) {}
}

@NgModule({
  declarations: [EoLandingPageLoginButtonComponent],
  exports: [EoLandingPageLoginButtonComponent],
  imports: [MatButtonModule, LetModule],
})
export class EoLandingPageLoginButtonScam {}
