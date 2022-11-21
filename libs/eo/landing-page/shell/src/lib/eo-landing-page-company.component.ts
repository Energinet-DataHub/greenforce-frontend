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
  selector: 'eo-landing-page-company',
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

      @include watt.media('<Large') {
        img {
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div class="content">
      <div class="content-text">
        <h2>Who are we?</h2>
        <p class="watt-space-stack-l">
          Energinet is an <strong>independent public enterprise</strong> owned
          by the Danish Ministry of Climate and Energy. We own, operate and
          develop the transmission systems for electricity and natural gas in
          Denmark.
        </p>
      </div>
      <img
        [width]="520"
        src="/assets/images/landing-page/energihuset.jpg"
        alt="Energinet - Energihuset"
      />
    </div>
  `,
})
export class EoLandingPageCompanyComponent {
  constructor(public landingPage: EoLandingPagePresenter) {}
}
