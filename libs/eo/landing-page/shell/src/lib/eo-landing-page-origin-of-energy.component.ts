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
import { EoLandingPagePresenter } from './eo-landing-page.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'eo-landing-page-origin-of-energy',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      :host {
        padding: var(--eo-space-xxl) 0;
        display: block;
        max-width: 960px; // Magic UX number
        margin: 0 auto;

        @include watt.media('<Large') {
          max-width: 100%;
          padding: var(--watt-space-xl) var(--watt-space-m);
        }
      }

      h2 {
        padding-bottom: var(--watt-space-s);
      }

      .content {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include watt.media('<Large') {
          flex-direction: column;
        }
      }

      .content-text {
        flex-direction: column;

        @include watt.media('>=Large') {
          max-width: 400px; // Magic UX number
        }
      }
    `,
  ],
  template: `
    <div class="content">
      <div class="content-text">
        <h2>View the origin of your energy</h2>
        <p class="watt-space-stack-l">
          Imagine if we all knew, where our energy came from, at all times, and were able to
          <strong>choose the green energy</strong> by the hour. That is the vision, we are working
          for with the platform Energy Origin.
        </p>
        <p class="watt-space-stack-l">
          Simultaneity between <strong>production</strong> of sustainable energy and
          <strong>consumption</strong> of energy will be a real factor in the
          <strong>green transition</strong> and therefore has great potential for future green
          solutions.
        </p>
      </div>
      <img
        width="520"
        src="/assets/images/landing-page/landing-page-graph-of-energy-with-dashboard.png"
        alt="Energy Origin graph of energy"
      />
    </div>
  `,
})
export class EoLandingPageOriginOfEnergyComponent {
  constructor(public landingPage: EoLandingPagePresenter) {}
}
