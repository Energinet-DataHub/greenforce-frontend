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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-hero',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
      }

      eo-landing-page-login-button ::ng-deep button {
        width: 160px; // Magic UX number
      }

      img {
        width: 100%;
        display: block;
      }

      .call-to-action {
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: space-around;
        background-color: #bed7d9;
        min-width: 343px; // Magic UX number
        padding: var(--watt-space-m) var(--watt-space-m) var(--watt-space-l);
        gap: var(--watt-space-m);

        @include watt.media('>=Large') {
          gap: var(--watt-space-xl);
        }
      }

      h1 {
        text-transform: uppercase;
        text-align: center;

        @include watt.media('>=Large') {
          font-size: 42px;
          line-height: 54px;
        }
      }

      .powered-by {
        position: absolute;
        right: 0;

        @include watt.media('<Large') {
          display: none;
        }
      }
    `,
  ],
  template: `
    <div class="watt-space-inset-m">
      <h1>
        Your <span class="eo-text-primary">emissions</span> and
        <span class="eo-text-primary">renewables</span> overview
      </h1>
    </div>
    <img src="/assets/images/landing-page/hero-illustration.png" />

    <div class="call-to-action">
      <h2 class="eo-text-primary-contrast">Log in with your company NemID</h2>

      <eo-landing-page-login-button></eo-landing-page-login-button>
      <div class="powered-by">
        <img src="/assets/images/landing-page/powered-by.png" />
      </div>
    </div>
  `,
})
export class EoLandingPageHeroComponent {}

@NgModule({
  declarations: [EoLandingPageHeroComponent],
  exports: [EoLandingPageHeroComponent],
  imports: [EoLandingPageLoginButtonScam],
})
export class EoLandingPageHeroScam {}
