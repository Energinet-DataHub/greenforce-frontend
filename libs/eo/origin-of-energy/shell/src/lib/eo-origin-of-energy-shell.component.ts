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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoPieChartScam } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-origin-of-energy-shell',
  styles: [
    `
      :host {
        display: block;
        max-width: 1040px; /* Magic UX number */
      }

      .chart-row {
        display: flex;
        margin-bottom: var(--watt-space-l);
      }

      .chart-card {
        max-width: 584px; /* Magic UX number */
        width: 100%;
      }

      .chart-box {
        margin-top: var(--watt-space-m);
        margin-right: calc(var(--watt-space-xl) - var(--watt-space-s));
        margin-left: calc(var(--watt-space-xl) - var(--watt-space-s));
      }

      .chart-tips {
        width: 360px; /* Magic UX number */
        gap: var(--watt-space-l);
        display: flex;
        flex-direction: column;
      }

      .global-goals-box {
        border: 1px solid #f9d557; /* Color not yet added to Watt */
        max-height: 100px; /* Magic UX number */

        p {
          height: 98px; /* offset to make sure the box doesn't grow because of text*/
        }
      }

      .tip-card {
        background-color: var(--watt-color-primary-light);
        border-radius: var(--watt-space-m);
      }

      .tip-card-header {
        display: flex;
        align-items: center;
        margin-bottom: var(--watt-space-m);
        gap: calc(var(--watt-space-l) - var(--watt-space-s));
      }

      .description-row {
        display: flex;
        align-items: flex-start;
      }

      .description-card {
        gap: var(--watt-space-m);
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    `,
  ],
  template: `<div class="chart-row">
      <mat-card class="chart-card watt-space-inline-l">
        <h3>Your share of renewable energy in 2021</h3>
        <p>Based on the hourly declaration</p>
        <div class="chart-box">
          <eo-pie-chart></eo-pie-chart>
        </div>
      </mat-card>
      <div class="chart-tips">
        <eo-media [eoMediaMaxWidthPixels]="360" class="global-goals-box">
          <p class="watt-space-inset-m">
            <strong>Global goals 7.2</strong><br />
            increase the share of renewable energy globally
          </p>
          <img
            eoMediaImage
            [eoMediaImageMaxWidthPixels]="100"
            src="/assets/images/origin-of-energy/globalgoal-7.2.svg"
            alt="Global goal 7.2"
          />
        </eo-media>
        <mat-card class="tip-card">
          <div class="tip-card-header">
            <img
              width="70"
              src="/assets/icons/lightbulb.svg"
              alt="Global goal 7.2"
            />
            <h1>Tip</h1>
          </div>
          <p>
            You can increase your share of renewable energy by shifting your
            consumption to periods with more renewable energy in the grid.
          </p>
        </mat-card>
      </div>
    </div>
    <div class="description-row">
      <mat-card class="description-card watt-space-inline-l">
        <p><strong>Renewable energy</strong></p>
        <img
          width="440"
          src="/assets/images/origin-of-energy/danish-ministry-of-climate-energy-and-utilities.svg"
          alt="Danish Ministry of Climate, Energy and Utilities logo"
        />
        <p>
          Renewable energy is a general term for bio-energy, onshore and
          offshore wind power, solar energy, geothermal energy as well as other
          technologies that differ from coal and other fossil fuels by being CO2
          neutral. The use of sustainable energy sources contributes to the
          reduction of our greenhouse gas emissions and making Denmark
          independent of fossil energy.
        </p>
        <p>
          Read more on the home page:<br />
          <a
            target="_blank"
            href="https://ens.dk/en/our-responsibilities/energy-climate-politics/greenhouse-gasses"
          >
            Danish Ministry of Climate, Energy and Utilities
          </a>
        </p>
      </mat-card>
      <mat-card class="description-card">
        <p><strong>Hourly Declaration</strong></p>
        <p>
          The hourly declaration describes the origin of the energy you have
          consumed within a given period as well as the corresponding emissions.
        </p>
        <p>
          The declaration is calculated as a weighted average based on your
          hourly electricity consumption and the corresponding hourly residual
          mix in your bidding zone.
        </p>
      </mat-card>
    </div>`,
})
export class EoOriginOfEnergyShellComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyShellComponent],
  exports: [EoOriginOfEnergyShellComponent],
  imports: [CommonModule, EoMediaModule, MatCardModule, EoPieChartScam],
})
export class EoOriginOfEnergyShellScam {}
