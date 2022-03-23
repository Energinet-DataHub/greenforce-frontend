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
import { EoLandingPageColumnLayoutScam } from './layout/eo-landing-page-column-layout.component';

@Component({
  selector: 'eo-landing-page-call-to-action',
  styles: [
    `
      :host {
        display: flex;
        height: 300px; // Magic number by designer
        align-items: center;
        justify-content: center;

        text-align: center;
      }

      eo-landing-page-login-button {
        min-width: 120px; // Magic number by designer
      }

      .icon-link {
        display: inline-block;
        vertical-align: middle;
      }

      .icon {
        width: 24px;
        height: 24px;
      }
    `,
  ],
  template: `
    <div class="call-to-action-wrapper">
      <eo-landing-page-column-layout [layoutType]="'full'">
        <div class="watt-space-stack-m">
          <h1>
            Log in with your company NemID
            <a
              href="https://www.nemid.nu/dk-en/about_nemid/index.html"
              target="_blank"
              rel="nofollow noopener"
              class="icon-link"
            >
              <watt-icon
                name="primary_info"
                [size]="iconSize.Large"
              ></watt-icon>
            </a>
          </h1>
        </div>
        <eo-landing-page-login-button></eo-landing-page-login-button>
      </eo-landing-page-column-layout>
    </div>
  `,
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
