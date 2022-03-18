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
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';
import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';

import { EoLandingPageColumnLayoutScam } from './eo-landing-page-column-layout.component';
import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';

const selector = 'eo-landing-page-call-to-action';

@Component({
  selector,
  styles: [
    `
      ${selector} {
        display: block;
        text-align: center;

        a {
          display: inline-block;

          margin-left: var(--watt-space-s);
        }
      }
      .${selector}__h2 {
        display: flex;
        align-items: center;
      }
      .${selector}__call-to-action-wrapper {
        height: calc(75 * var(--watt-space-xs));
        background: var(
          --watt-color-focus-selection
        ); // This is the light-blue-ish background color
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .${selector}__login-button > a {
        width: calc(40 * var(--watt-space-xs));
      }
    `,
  ],
  template: `
    <div class="${selector}__call-to-action-wrapper">
      <eo-landing-page-column-layout [layoutType]="'full'">
        <h2 class="${selector}__h2">
          Log in with your company NemID
          <a
            href="https://www.nemid.nu/dk-en/about_nemid/index.html"
            target="_blank"
            rel="nofollow noopener"
          >
            <watt-icon
              name="primary_info_icon"
              [size]="iconSize.Large"
            ></watt-icon>
          </a>
        </h2>

        <eo-landing-page-login-button
          class="${selector}__login-button"
        ></eo-landing-page-login-button>
      </eo-landing-page-column-layout>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageCallToActionComponent {
  iconSize = WattIconSize;
}

@NgModule({
  declarations: [EoLandingPageCallToActionComponent],
  exports: [EoLandingPageCallToActionComponent],
  imports: [
    WattIconModule,
    EoLandingPageColumnLayoutScam,
    EoLandingPageLoginButtonScam,
  ],
})
export class EoLandingPageCallToActionScam {}
