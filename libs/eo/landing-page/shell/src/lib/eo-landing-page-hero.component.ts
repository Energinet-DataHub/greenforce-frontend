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

import { EoLandingPageLoginButtonScam } from './eo-landing-page-login-button.component';

@Component({
  selector: 'eo-landing-page-hero',
  styles: [
    `
      :host {
        display: block;
      }

      img {
        width: 100%;
        display: block;
      }

      h1 {
        font-size: 44px; // Magic number by designer
        line-height: 54px; // Magic number by designer
      }

      eo-landing-page-login-button {
        min-width: 160px; // Magic number by designer
      }

      .call-to-action {
        display: flex;
        justify-content: center;
        align-content: space-around;

        background-color: #bed7d9; // Match bottom color from hero illustration
      }
    `,
  ],
  template: `
    <div class="watt-space-inset-m">
      <h1 class="eo-text-promotional">
        Access
        <span class="eo-text-primary"
          >your emissions and<br />energy origin</span
        >
        overview
      </h1>
    </div>

    <img src="/assets/images/landing-page/landing-page-hero-illustration.svg" />

    <div class="call-to-action watt-space-inset-l">
      <h2 class="eo-text-primary-contrast">Log in with your company NemID</h2>

      <div class="eo-margin-left-xl">
        <eo-landing-page-login-button></eo-landing-page-login-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageHeroComponent {}

@NgModule({
  declarations: [EoLandingPageHeroComponent],
  exports: [EoLandingPageHeroComponent],
  imports: [EoLandingPageLoginButtonScam],
})
export class EoLandingPageHeroScam {}
