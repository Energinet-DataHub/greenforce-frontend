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

const selector = 'eo-landing-page-hero';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        margin-bottom: calc(2 * var(--watt-space-xl));

        .${selector}__h1 {
          @include watt.typography-watt-headline-1; // This overrides the styles applied from Angular Material on h1 tags
          text-transform: uppercase;
          margin-left: var(--watt-space-m);

          > span {
            color: var(--watt-color-primary);
          }
        }

        .${selector}__img {
          width: 100%;
          display: block;
        }

        .${selector}__call-to-action {
          text-align: center;
          background: #BED7D9;
          outline: 1px solid #BED7D9;
          padding-bottom: var(--watt-space-l);

          > * {
            display: inline-block;
          }

          eo-landing-page-login-button {
            margin-left: var(--watt-space-xl);
          }
          .${selector}__h2 {
            @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
            text-transform: none;
            color: var(--watt-color-neutral-black);
          }
        }
      }
    `,
  ],
  template: `
    <h1 class="${selector}__h1">
      Access
      <span class="font-primary-color"
      >your emissions and<br />energy origin</span
      >
      overview
    </h1>

    <img
      class="${selector}__img"
      src="/assets/images/landing-page/landing-page-hero-illustration.png"
    />

    <div class="${selector}__call-to-action">
      <h2 class="${selector}__h2">Log in with your company NemID</h2>
      <eo-landing-page-login-button
        class="eo-text-center watt-space-stack-l"
      ></eo-landing-page-login-button>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageHeroComponent {}

@NgModule({
  declarations: [EoLandingPageHeroComponent],
  exports: [EoLandingPageHeroComponent],
  imports: [EoLandingPageColumnLayoutScam, EoLandingPageLoginButtonScam],
})
export class EoLandingPageHeroScam {}
