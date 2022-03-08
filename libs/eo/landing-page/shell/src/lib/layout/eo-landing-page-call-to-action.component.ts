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
import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';

const selector = 'eo-landing-page-call-to-action';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        text-align: center;

      }
      .${selector}__h2 {
        @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
        text-transform: none; // This overrides the uppercased styling from watt
      }
      .${selector}__call-to-action-wrapper {
        padding: calc(2 * var(--watt-space-xl));
        background: var(
          --watt-color-focus-selection
        ); // This is the light-blue-ish background color
      }
    `,
  ],
  template: `
    <div class="${selector}__call-to-action-wrapper">
      <eo-landing-page-column-layout [layoutType]="'full'">
        <h2 class="${selector}__h2">Log in with your company NemID</h2>
        <eo-landing-page-login-button></eo-landing-page-login-button>
      </eo-landing-page-column-layout>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageCallToActionComponent {}

@NgModule({
  declarations: [EoLandingPageCallToActionComponent],
  exports: [EoLandingPageCallToActionComponent],
  imports: [EoLandingPageColumnLayoutScam, EoLandingPageLoginButtonScam],
})
export class EoLandingPageCallToActionScam {}
