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
  selector: 'eo-landing-page-origin-of-energy',
  styles: [
    `
      @use '@energinet-datahub/eo/shared/styles/layout' as eo-layout;
      @use '@energinet-datahub/eo/shared/styles/spacing' as eo-spacing;

      :host {
        @include eo-layout.centered-content;
        @include eo-spacing.inset-xxl;

        display: block;
      }
    `,
  ],
  template: `
    <eo-media [eoMediaMaxWidthPixels]="landingPage.contentMaxWidthPixels">
      <h2>View the origin of your energy</h2>
      <p>
        Imagine if we all knew, where our energy came from, at all times, and
        were able to
        <strong>choose the green energy</strong> by the hour. That is the
        vision, we are working for with the platform Energy Origin.
      </p>

      <p>
        Simultaneity between <strong>production</strong> of sustainable energy
        and <strong>consumption</strong> of energy will be a real factor in the
        <strong>green transition</strong> and therefore has great potential for
        future green solutions.
      </p>

      <img
        eoMediaImage
        [eoMediaImageMaxWidthPixels]="520"
        src="/assets/images/landing-page/landing-page-graph-of-energy-with-dashboard.png"
        alt="Energy Origin graph of energy"
      />
    </eo-media>
  `,
})
export class EoLandingPageOriginOfEnergyComponent {
  constructor(public landingPage: EoLandingPagePresenter) {}
}

@NgModule({
  declarations: [EoLandingPageOriginOfEnergyComponent],
  exports: [EoLandingPageOriginOfEnergyComponent],
  imports: [EoMediaModule],
})
export class EoLandingPageOriginOfEnergyScam {}
