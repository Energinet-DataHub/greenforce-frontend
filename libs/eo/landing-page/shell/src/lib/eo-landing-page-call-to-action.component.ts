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
import { WattIconModule, WattIconSize } from '@energinet-datahub/watt';

import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-call-to-action',
  styles: [
    `
      // 1. Center content.
      :host {
        display: flex; // [1]
        height: 300px; // Magic number by designer
        align-items: center; // [1]
        justify-content: center; // [1]

        text-align: center; // [1]

        background: var(
          --watt-color-focus-selection
        ); // This is the light-blue-ish background color
      }

      eo-landing-page-login-button {
        min-width: 160px; // Magic number by designer
      }

      .icon-link {
        display: flex; // Center the icon vertically
      }

      .call-out {
        display: flex; // Align text and icon vertically
        align-items: center;
      }
    `,
  ],
  template: `
    <!-- Used for centering content -->
    <div>
      <div class="call-out watt-space-stack-m">
        <h1 class="watt-space-inline-s">Log in with your company NemID</h1>

        <div>
          <a
            href="https://www.nemid.nu/dk-en/about_nemid/index.html"
            target="_blank"
            rel="nofollow noopener"
            class="icon-link"
          >
            <watt-icon name="primary_info" [size]="iconSize.Large"></watt-icon>
          </a>
        </div>
      </div>

      <eo-landing-page-login-button></eo-landing-page-login-button>
    </div>
  `,
})
export class EoLandingPageCallToActionComponent {
  iconSize = WattIconSize;
}

@NgModule({
  declarations: [EoLandingPageCallToActionComponent],
  exports: [EoLandingPageCallToActionComponent],
  imports: [WattIconModule, EoLandingPageLoginButtonScam],
})
export class EoLandingPageCallToActionScam {}
