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
import { MatCardModule } from '@angular/material/card';
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-origin-of-energy-shell',
  styles: [
    `
      :host {
        display: block;
        max-width: 1040px;
      }

      .eoGlobalGoals {
        border: 1px solid #f9d557;
        max-height: 100px;
        max-width: 360px;
        display: flex;
      }
    `,
  ],
  template: `<div style="display:flex; margin-bottom: 32px;">
      <mat-card style="height: 552px; width:584px; margin-right: 32px;">
        <h3>Your share of renewable energy in 2021</h3>
        <p>Based on the hourly declaration</p>
        <div style="width: 440px;">
          <canvas
            baseChart
            [data]="pieChartData"
            [type]="pieChartType"
            [options]="pieChartOptions"
          >
          </canvas>
        </div>
      </mat-card>
      <div>
        <eo-media
          [eoMediaMaxWidthPixels]="360"
          style="margin-bottom: 32px; border: 1px solid #f9d557; max-height:100px"
        >
          <p class="watt-space-inset-m" style="max-height: 98px;">
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
        <mat-card
          style="background-color: #b2d0d2; max-width: 360px; border-radius: 15px;"
        >
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <img
              width="70"
              src="/assets/icons/lightbulb.svg"
              alt="Global goal 7.2"
            />
            <h1 style="padding-left: 24px;">Tip</h1>
          </div>
          <p>
            You can increase your share of renewable energy by shifting your
            consumption to periods with more renewable energy in the grid.
          </p>
        </mat-card>
      </div>
    </div>
    <div style="display:flex; align-items: flex-start;">
      <mat-card
        style="margin-right: 32px; gap: 16px; display: flex; flex-direction: column; flex: 1;"
      >
        <p><strong>Renewable energy</strong></p>
        <img
          src="/assets/images/origin-of-energy/danish-ministry-of-climate-energy-and-utilities.svg"
          width="440"
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
      <mat-card
        style="display: flex; flex-direction: column; flex: 1; gap: 16px;"
      >
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
export class EoOriginOfEnergyShellComponent {
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: {
        display: false,
        position: 'chartArea',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Renewable', 'Other'],
    datasets: [
      {
        data: [81, 19],
        backgroundColor: ['#7FB069', '#616161'],
        hoverBackgroundColor: ['#7FB069', '#616161'],
        rotation: 180,
        borderWidth: 0,
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
}

@NgModule({
  declarations: [EoOriginOfEnergyShellComponent],
  exports: [EoOriginOfEnergyShellComponent],
  imports: [EoMediaModule, MatCardModule, NgChartsModule],
})
export class EoOriginOfEnergyShellScam {}
