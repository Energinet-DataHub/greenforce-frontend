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
import {
  Component,
  NgModule,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { EoLandingPageColumnLayoutScam } from './eo-landing-page-column-layout.component';
import { EoLandingPageLogInButtonScam } from './eo-landing-page-login-button.component';

const selector = 'eo-landing-page-bottom-layout';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        margin-top: var(--watt-space-xl);
        text-align: center;

        .${selector}__h2 {
          @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
          text-transform: none; // This overrides the uppercased styling from watt
        }
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout [layoutType]="'full'">
      <h2 class="${selector}__h2">Log in with your commercial NemID</h2>
      <eo-landing-page-login-button></eo-landing-page-login-button>
    </eo-landing-page-column-layout>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageBottomLayoutComponent {}

@NgModule({
  declarations: [EoLandingPageBottomLayoutComponent],
  exports: [EoLandingPageBottomLayoutComponent],
  imports: [EoLandingPageColumnLayoutScam, EoLandingPageLogInButtonScam],
})
export class EoLandingPageBottomLayoutScam {}
