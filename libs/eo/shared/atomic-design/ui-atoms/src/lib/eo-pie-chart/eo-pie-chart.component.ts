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
import { Component, NgModule } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'eo-pie-chart',
  template: `<canvas
    baseChart
    [data]="pieChartData"
    [type]="pieChartType"
    [options]="pieChartOptions"
    [plugins]="pieChartPlugins"
  >
  </canvas>`,
  styles: [``],
})
export class EoPieChartComponent {
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    plugins: {
      tooltip: { enabled: false },
      legend: {
        display: false,
      },
      datalabels: {
        textAlign: 'center',
        color: ['black', 'white'],
        font: {
          family: 'Open Sans',
          weight: 'bold',
          size: 16,
        },
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return `${value}%\n${ctx.chart.data.labels[ctx.dataIndex]}`;
          }
          return '';
        },
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Renewable', 'Other'],
    datasets: [
      {
        rotation: 180,
        data: [81, 19],
        backgroundColor: ['#7FB069', '#616161'],
        hoverBackgroundColor: ['#7FB069', '#616161'],
        borderWidth: 0,
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];
}

@NgModule({
  declarations: [EoPieChartComponent],
  exports: [EoPieChartComponent],
  imports: [NgChartsModule],
})
export class EoPieChartScam {}
