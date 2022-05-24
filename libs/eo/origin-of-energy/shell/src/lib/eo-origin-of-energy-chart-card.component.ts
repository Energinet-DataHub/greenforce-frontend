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
import { Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EoPieChartScam } from './eo-origin-of-energy-pie-chart/eo-origin-of-energy-pie-chart.component';
import { EoOriginOfEnergyStore } from './eo-origin-of-energy.store';

@Component({
  selector: 'eo-origin-of-energy-pie-chart',
  template: ` <mat-card class="chart-card watt-space-inline-l">
    <h3>Your share of renewable energy in 2021</h3>
    <p>Based on the hourly declaration</p>
    <ng-container>
      <eo-pie-chart
        class="watt-space-inset-squish-l"
        [data]="[
          (share$ | async)?.renewable || 50,
          (share$ | async)?.other || 50
        ]"
      ></eo-pie-chart>
    </ng-container>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .chart-card {
        width: 536px; /* Magic UX number */
      }
    `,
  ],
  viewProviders: [EoOriginOfEnergyStore],
})
export class EoOriginOfEnergyPieChartComponent {
  share$ = this.originOfEnergyStore.share$;

  constructor(private originOfEnergyStore: EoOriginOfEnergyStore) {}
}

@NgModule({
  declarations: [EoOriginOfEnergyPieChartComponent],
  exports: [EoOriginOfEnergyPieChartComponent],
  imports: [MatCardModule, EoPieChartScam, CommonModule],
})
export class EoOriginOfEnergyPieChartScam {}
