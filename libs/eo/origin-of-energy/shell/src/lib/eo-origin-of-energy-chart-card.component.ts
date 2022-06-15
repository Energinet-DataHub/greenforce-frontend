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
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { EoPieChartScam } from './eo-origin-of-energy-pie-chart/eo-origin-of-energy-pie-chart.component';
import { EoOriginOfEnergyStore } from './eo-origin-of-energy.store';

@Component({
  selector: 'eo-origin-of-energy-pie-chart',
  template: ` <mat-card class="chart-card watt-space-inline-l">
    <h3>Your share of renewable energy in 2021</h3>
    <p>Based on the hourly declaration</p>
    <ng-container>
      <div *ngIf="(loadingDone$ | async) === false" class="loadingObfuscator">
        <watt-spinner [diameter]="100"></watt-spinner>
      </div>
      <eo-pie-chart
        class="watt-space-inset-squish-l"
        [data]="[
          convertToPercentage((renewableShare$ | async) || 0.5),
          convertToPercentage(1 - ((renewableShare$ | async) || 0.5))
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

      .loadingObfuscator {
        position: absolute;
        height: calc(100% - 80px);
        width: calc(100% - 32px);
        background-color: var(--watt-on-dark-high-emphasis);
        padding-top: calc(50% - 80px);
        padding-left: calc(50% - 64px);
      }
    `,
  ],
})
export class EoOriginOfEnergyPieChartComponent {
  loadingDone$ = this.originOfEnergyStore.loadingDone$;
  renewableShare$ = this.originOfEnergyStore.renewable$;

  constructor(private originOfEnergyStore: EoOriginOfEnergyStore) {}

  convertToPercentage(num: number): number {
    if (!num || Number.isNaN(num)) return 0;

    return Number((num * 100).toFixed(2));
  }
}

@NgModule({
  providers: [EoOriginOfEnergyStore],
  declarations: [EoOriginOfEnergyPieChartComponent],
  exports: [EoOriginOfEnergyPieChartComponent],
  imports: [MatCardModule, EoPieChartScam, CommonModule, WattSpinnerModule],
})
export class EoOriginOfEnergyPieChartScam {}
