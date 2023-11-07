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

import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, NgChartsModule, ThemeService } from 'ng2-charts';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [WATT_CARD, NgChartsModule],
  providers: [ThemeService],
  selector: 'eo-dashboard-consumption',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        max-width: 100%;

        h5 {
          // TODO: NEW FONT STYLES
          font-size: 30px;
          line-height: 28px;
          color: var(--watt-on-light-high-emphasis);
          font-weight: 400;
        }

        small {
          color: var(--watt-on-light-low-emphasis);
        }

        .chart-container {
          position: relative;
          width: calc(100vw - 80px);
          height: 196px;
          padding-top: var(--watt-space-m);
          max-width: 100%;

          @include watt.media('>=Large') {
            width: calc(100vw - 372px);
          }
        }
      }
    `,
  ],
  template: `<watt-card>
    <watt-card-title>
      <h4>Green consumption</h4>
    </watt-card-title>

    <h5>0 Wh</h5>
    <small>Out of 0 Wh total consumption</small>

    <div class="chart-container">
      <canvas
        baseChart
        [data]="barChartData"
        [options]="barChartOptions"
        [legend]="false"
        [type]="'bar'"
      >
      </canvas>
    </div>
  </watt-card>`,
})
export class EoDashboardConsumptionComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  protected isLoading = true;
  protected barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.generateLabels(),
    datasets: [
      {
        data: [80, 30, 40, 20, 0, 0, 100],
        label: 'Claimed',
        borderRadius: Number.MAX_VALUE,
        maxBarThickness: 8,
        backgroundColor: '#00C898',
      },
      {
        data: [20, 40, 50, 80, 80, 30, 0],
        label: 'Consumption',
        borderRadius: Number.MAX_VALUE,
        maxBarThickness: 8,
        backgroundColor: '#02525E',
      },
    ],
  };

  protected barChartOptions: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkipPadding: 12,
        }
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Wh', align: 'end' },
      },
    },
  };

  private generateLabels() {
    // TODO: Should be localized when translations are available
    const datePipe = new DatePipe('en-US');
    const dates = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return datePipe.transform(d, 'd MMM');
    });
    return dates.reverse();
  }
}
