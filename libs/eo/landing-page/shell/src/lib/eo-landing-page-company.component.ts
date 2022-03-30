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

import { EoLandingPagePresenter } from './eo-landing-page.presenter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-company',
  styles: [
    `
      @use '@energinet-datahub/eo/shared/styles/layout' as eo-layout;
      @use '@energinet-datahub/eo/shared/styles/spacing' as eo-spacing;

      :host {
        @include eo-layout.centered-content;
        @include eo-spacing.inset-xxl;
      }
    `,
  ],
  template: `
    <eo-media
      [eoMediaGapPixels]="landingPage.gutterPixels"
      [eoMediaMaxWidthPixels]="landingPage.contentMaxWidthPixels"
    >
      <h2>Who are we?</h2>

      <p>
        Energinet is an <strong>independent public enterprise</strong> owned by
        the Danish Ministry of Climate and Energy. We own, operate and develop
        the transmission systems for electricity and natural gas in Denmark.
      </p>

      <img
        eoMediaImage
        eoMediaImageAlign="end"
        [eoMediaImageMaxWidthPixels]="520"
        src="/assets/images/landing-page/landing-page-energy-origin-energi-huset.jpg"
        alt="EnergyOrigin - Energihuset"
      />
    </eo-media>
  `,
})
export class EoLandingPageCompanyComponent {
  constructor(public landingPage: EoLandingPagePresenter) {}
}

@NgModule({
  declarations: [EoLandingPageCompanyComponent],
  exports: [EoLandingPageCompanyComponent],
  imports: [EoMediaModule],
})
export class EoLandingPageCompanyScam {}
