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

import { EoLandingPageColumnLayoutScam } from './eo-landing-page-column-layout.component';

const selector = 'eo-landing-page-image-text-layout';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
        position: relative;
      }
      .${selector}__img {
        width: 100%;
        height: auto;
      }
      .${selector}__img--small {
        width: 400px;
      }
      .margin-bottom-xxl {
        margin-bottom: calc(2 * var(--watt-space-xl));
      }
      .padding-left {
        padding-left: calc(10 * var(--watt-space-xs));
      }
      .${selector}__p {
        @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
      }
      .${selector}__h2.${selector}__h2 {
        @include watt.typography-watt-headline-2; // This overrides the styles applied from Angular Material on h2 tags
        text-transform: none; // This overrides the uppercased styling from watt
      }
      .${selector}__link.${selector}__link {
        display: inline-block;
        color: var(
          --watt-color-primary
        ); // This overrides the '--watt-color-primary-dark' color which is currently added by the watt-text-s class
      }
      .${selector}__full-width-wrapper {
        height: calc(92 * var(--watt-space-xs));
        margin-bottom: calc(2 * var(--watt-space-xl));
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(
          --watt-color-focus-selection
        ); // This is the light-blue-ish background color
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout
      class="margin-bottom-xxl"
      [layoutType]="'smallFirst'"
    >
      <ng-container contentLeftSmall>
        <h2 class="${selector}__h2">View the origin of your energy</h2>
        <p class="${selector}__p">
          Imagine if we all knew, where our energy came from, at all times, and
          were able to
          <strong>choose the green energy</strong> by the hour. That is the vision, we are
          working for with the platform Energy Origin.
        </p>
        <p class="${selector}__p">
          Simultaneity between <strong>production</strong> of sustainable energy and
          <strong>consumption</strong> of energy will be a real factor in the
          <strong>green transition</strong> and therefore has great potential for future
          green solutions.
        </p>
      </ng-container>
      <ng-container contentRightLarge>
        <div class="padding-left">
          <img
            class="${selector}__img"
            src="/assets/images/landing-page/landing-page-graph-of-energy-with-dashboard.png"
            alt="EnergyOrigin graph of energy"
          />
        </div>
      </ng-container>
    </eo-landing-page-column-layout>

    <div class="${selector}__full-width-wrapper">
      <eo-landing-page-column-layout [layoutType]="'largeFirst'">
        <ng-container contentLeftLarge>
          <img
            class="${selector}__img ${selector}__img--small"
            src="/assets/images/landing-page/landing-page-office-people.png"
            alt="EnergyOrigin"
          />
        </ng-container>
        <ng-container contentRightSmall>
          <h2 class="${selector}__h2">Who is it for?</h2>
          <p class="${selector}__p">
            This first version of Energy Origin is for
            <strong>companies in Denmark</strong>. Later it will be available for private
            individuals as well.
          </p>
        </ng-container>
      </eo-landing-page-column-layout>
    </div>

    <eo-landing-page-column-layout
      class="margin-bottom-xxl"
      [layoutType]="'smallFirst'"
    >
      <ng-container contentLeftSmall>
        <h2 class="${selector}__h2">Who are we?</h2>
        <p class="${selector}__p">
          Energinet is an <strong>independent public enterprise</strong> owned by the
          Danish Ministry of Climate and Energy. We own, operate and develop the
          transmission systems for electricity and natural gas in Denmark.
        </p>
      </ng-container>
      <ng-container contentRightLarge>
        <div class="padding-left">
          <img
            class="${selector}__img"
            src="/assets/images/landing-page/landing-page-energy-origin-energi-huset.jpg"
            alt="EnergyOrigin - Energihuset"
          />
        </div>
      </ng-container>
    </eo-landing-page-column-layout>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EoLandingPageImageTextLayoutComponent {}

@NgModule({
  declarations: [EoLandingPageImageTextLayoutComponent],
  exports: [EoLandingPageImageTextLayoutComponent],
  imports: [EoLandingPageColumnLayoutScam],
})
export class EoLandingPageImageTextLayoutScam {}
