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

import { EoLandingPageColumnLayoutScam } from './layout/eo-landing-page-column-layout.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-landing-page-company',
  styles: [
    `
      :host {
        display: block;
        /* position: relative; */
      }

      .padding-left {
        padding-left: calc(10 * var(--watt-space-xs));
      }
    `,
  ],
  template: `
    <eo-landing-page-column-layout layoutType="smallFirst">
      <ng-container contentLeftSmall>
        <h2>Who are we?</h2>

        <p>
          Energinet is an <strong>independent public enterprise</strong> owned
          by the Danish Ministry of Climate and Energy. We own, operate and
          develop the transmission systems for electricity and natural gas in
          Denmark.
        </p>
      </ng-container>

      <ng-container contentRightLarge>
        <div class="padding-left">
          <img
            class="img--grow"
            src="/assets/images/landing-page/landing-page-energy-origin-energi-huset.jpg"
            alt="EnergyOrigin - Energihuset"
          />
        </div>
      </ng-container>
    </eo-landing-page-column-layout>
  `,
})
export class EoLandingPageCompanyComponent {}

@NgModule({
  declarations: [EoLandingPageCompanyComponent],
  exports: [EoLandingPageCompanyComponent],
  imports: [EoLandingPageColumnLayoutScam],
})
export class EoLandingPageCompanyScam {}
