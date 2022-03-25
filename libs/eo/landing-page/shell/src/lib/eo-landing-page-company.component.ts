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
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-company',
  styles: [
    `
      @use '@energinet-datahub/eo/shared/styles/spacing' as eo-spacing;

      :host {
        display: block;

        @include eo-spacing.inset-xxl;
      }

      // 1. Center content with max width.
      .landing-page-content-wrapper {
        margin: 0 auto; // [1]
        max-width: var(--eo-landing-page-content-max-width); // [1]
      }
    `,
  ],
  template: `
    <div class="landing-page-content-wrapper">
      <eo-media>
        <h2>Who are we?</h2>

        <p>
          Energinet is an <strong>independent public enterprise</strong> owned
          by the Danish Ministry of Climate and Energy. We own, operate and
          develop the transmission systems for electricity and natural gas in
          Denmark.
        </p>

        <eo-media-image>
          <img
            src="/assets/images/landing-page/landing-page-energy-origin-energi-huset.jpg"
            alt="EnergyOrigin - Energihuset"
          />
        </eo-media-image>
      </eo-media>
    </div>
  `,
})
export class EoLandingPageCompanyComponent {}

@NgModule({
  declarations: [EoLandingPageCompanyComponent],
  exports: [EoLandingPageCompanyComponent],
  imports: [EoMediaModule],
})
export class EoLandingPageCompanyScam {}
