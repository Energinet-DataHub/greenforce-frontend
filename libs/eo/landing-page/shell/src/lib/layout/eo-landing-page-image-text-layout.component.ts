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

      .${selector}__space-stack-xl-double {
        margin-top: calc(2 * var(--watt-space-xl));
        margin-bottom: calc(2 * var(--watt-space-xl));
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
    `,
  ],
  template: `
    <eo-landing-page-column-layout
      class="${selector}__space-stack-xl-double"
      [layoutType]="'smallFirst'"
    >
      <ng-container contentLeftSmall>
        <h2 class="${selector}__h2">View the origin of your energy</h2>
        <p class="${selector}__p">
          Imagine if we all knew, where our energy came from, at all times, and
          were able to choose the green energy by the hour. That is the vision,
          we are working for with the platform Energy Origin. <br /><br />
          Simultaneity between production of sustainable energy and consumption
          of energy will be a real factor in the green transition and therefore
          has great potential for future green solutions.
        </p>
      </ng-container>
      <ng-container contentRightLarge>
        <img
          class="${selector}__img"
          src="/assets/images/landing-page/landing-page-graph-of-energy-with-dashboard.png"
          alt="EnergyOrigin graph of energy"
        />
      </ng-container>
    </eo-landing-page-column-layout>

    <eo-landing-page-column-layout [layoutType]="'largeFirst'">
      <ng-container contentLeftLarge>
        <img
          class="${selector}__img"
          src="/assets/images/landing-page/landing-page-office-people.jpg"
          alt="EnergyOrigin"
        />
      </ng-container>
      <ng-container contentRightSmall>
        <h2 class="${selector}__h2">Who is it for</h2>
        <p class="${selector}__p">
          This first version of Energy Origin is for companies in Denmark and
          can be used for e.g.:
        </p>
        <ul>
          <li [innerText]="'Compiling an emissions overview for your annual ECG report'"></li>
          <li [innerText]="'Gaining an overview of the renewables share of your energy consumption'"></li>
        </ul>
      </ng-container>
    </eo-landing-page-column-layout>

    <eo-landing-page-column-layout
      class="${selector}__space-stack-xl-double"
      [layoutType]="'smallFirst'"
    >
      <ng-container contentLeftSmall>
        <h2 class="${selector}__h2">Who are we</h2>
        <p class="${selector}__p">
          Energinet is an independent public enterprise owned by the Danish
          Ministry of Climate and Energy. We own, operate and develop the
          transmission systems for electricity and natural gas in Denmark.
        </p>
      </ng-container>
      <ng-container contentRightLarge>
        <img
          class="${selector}__img"
          src="/assets/images/landing-page/landing-page-energy-origin-energi-huset.jpg"
          alt="EnergyOrigin - Energihuset"
        />
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
