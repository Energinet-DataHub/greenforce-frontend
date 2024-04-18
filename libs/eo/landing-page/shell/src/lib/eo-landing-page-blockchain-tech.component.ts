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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  selector: 'eo-landing-page-blockchain-tech',
  styles: `
    :host {
      margin-top: 114px;
      display: flex;
      justify-content: center;
      padding: 0 24px;

      @media (min-width: 754px) {
        margin-top: 185px;
      }
    }

    section {
      display: grid;
      grid-template-rows: auto 1fr;
      place-items: center;
      gap: 34px;

      @media (min-width: 754px) {
        grid-template-columns: auto 1fr;
        gap: 75px;
        max-width: 1000px;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 24px;
    }


    h3, p {
      color: rgba(0, 0, 0, 0.87);
    }

    h3 {
      font-size: 28px;
      font-style: normal;
      font-weight: 400;
      line-height: 34px;
      margin-bottom: 6px;
    }

    p {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px
    }
  `,
  template: `
    <section>
      <picture>
        <source
          srcset="
            /assets/landing-page/blockchain-tech/blockchain-tech.avif    1x,
            /assets/landing-page/blockchain-tech/blockchain-tech@2x.avif 2x,
            /assets/landing-page/blockchain-tech/blockchain-tech@3x.avif 3x
          "
          type="image/avif"
        />
        <img src="/assets/landing-page/blockchain-tech/blockchain-tech.avif" />
      </picture>

      <div class="content">
        <h3>Blockchain technology ties granular certificates to renewable energy production</h3>
        <p>
          For every quarter of an hour, Energy Origin generates production certificates from
          selected energy-producing assets, based on data from DataHub.
        </p>
        <p>
          The certificates are stored in a digital wallet, with relevant meta-data, and can from now
          on be traced back to it's source.
        </p>
      </div>
    </section>
  `,
})
export class EoLandingPageBlockchainTechComponent {}
