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
import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { first, tap, finalize } from 'rxjs';
import { EoPieChartScam } from './eo-origin-of-energy-pie-chart/eo-origin-of-energy-pie-chart.component';
import { EoOriginOfEnergyService } from './eo-origin-of-energy.service';

@Component({
  selector: 'eo-origin-of-energy-pie-chart',
  template: ` <mat-card class="chart-card watt-space-inline-l">
    <h3>Your share of renewable energy in 2021</h3>
    <p>Based on the hourly declaration</p>
    <ng-container>
      <div *ngIf="!doneLoading" class="loadingObfuscator">
        <watt-spinner [diameter]="100"></watt-spinner>
      </div>
      <eo-pie-chart
        class="watt-space-inset-squish-l"
        [data]="[renewableShare, otherShare]"
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
  doneLoading = false;
  renewableShare = 50;
  otherShare = 50;

  constructor(
    private originOfEnergyService: EoOriginOfEnergyService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.originOfEnergyService
      .getRenewableShare()
      .pipe(
        first(),
        tap((result: number) => {
          this.renewableShare = this.convertToPercentage(result);
          this.otherShare = 100 - this.renewableShare;
        }),
        finalize(() => {
          this.doneLoading = true;
          changeDetector.markForCheck();
        })
      )
      .subscribe();
  }

  convertToPercentage(num: number): number {
    if (!num || Number.isNaN(num)) return 0;

    return num * 100;
  }
}

@NgModule({
  declarations: [EoOriginOfEnergyPieChartComponent],
  exports: [EoOriginOfEnergyPieChartComponent],
  imports: [MatCardModule, EoPieChartScam, CommonModule, WattSpinnerModule],
})
export class EoOriginOfEnergyPieChartScam {}
