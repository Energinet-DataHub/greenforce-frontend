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
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { EoLandingPageLoginButtonComponent } from './eo-landing-page-login-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconModule, EoLandingPageLoginButtonComponent],
  selector: 'eo-landing-page-call-to-action',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: var(--watt-color-primary-ultralight);
        position: relative;
      }

      eo-landing-page-login-button ::ng-deep button {
        width: 160px; // Magic number by designer
      }

      .call-out {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 99px; // Magic UX number

        @include watt.media('<Large') {
          padding: var(--watt-space-l) var(--watt-space-xl);
        }
      }

      img {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 360px; // Magic UX number

        @include watt.media('<Large') {
          width: 180px; // Magic UX number
        }
      }

      .icon-link {
        padding-left: var(--watt-space-s);

        @include watt.media('<Small') {
          padding-top: 38px; // Magic UX number
        }
      }
    `,
  ],
  template: `
    <img src="/assets/images/landing-page/landing-page-mesh-bottom.png" />
    <div class="call-out">
      <div
        class="watt-space-stack-m"
        style="display: flex; flex-direction: row;align-items: center;"
      >
        <h1 style="display: inline-flex; align-items: center;">
          Log in with your company NemID
          <a
            href="https://www.nemid.nu/dk-en/about_nemid/index.html"
            target="_blank"
            rel="nofollow noopener"
            class="icon-link"
          >
            <watt-icon name="custom-primary-info"></watt-icon>
          </a>
        </h1>
      </div>
      <eo-landing-page-login-button></eo-landing-page-login-button>
    </div>
  `,
})
export class EoLandingPageCallToActionComponent {}
