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
import { Component, DoCheck, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DatalabelsPlugin, { Context } from 'chartjs-plugin-datalabels';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';

@Component({
  standalone: true,
  imports: [NgChartsModule],
  selector: 'eo-pie-chart',
  template: `<canvas
    baseChart
    data-testid="pie-chart"
    [data]="chartData"
    [type]="chartType"
    [options]="chartOptions"
    [plugins]="chartPlugins"
  >
  </canvas>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class EoPieChartComponent implements DoCheck {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @Input() data: number[] = [1];
  @Input() labels: string[] = [];

  #colorGreen = getComputedStyle(document.documentElement).getPropertyValue(
    '--watt-color-state-success'
  );
  #colorGrey = getComputedStyle(document.documentElement).getPropertyValue(
    '--watt-color-neutral-grey-700'
  );

  #wattPrimaryFontFamily = 'Open Sans';
  #wattTextNormalFontWeight = 700;
  #wattTextNormalSize = 16;

  public chartOptions: ChartConfiguration['options'] = {
    plugins: {
      tooltip: { enabled: false },
      legend: {
        display: false,
      },
      datalabels: {
        textAlign: 'center',
        color: ['black', 'white'],
        font: {
          family: this.#wattPrimaryFontFamily,
          weight: this.#wattTextNormalFontWeight,
          size: this.#wattTextNormalSize,
        },
        formatter: (value: number | string, ctx: Context) => {
          if (ctx.chart.data?.labels?.length) {
            return `${value}%\n${ctx.chart.data.labels[ctx.dataIndex]}`;
          }
          return '';
        },
      },
    },
  };

  public chartData: ChartData<'pie', number[], string | string[]> = {
    datasets: [
      {
        rotation: 180,
        data: [],
        borderWidth: 0,
      },
    ],
  };
  public chartType: ChartType = 'pie';
  public chartPlugins = [DatalabelsPlugin];

  updateChartColors() {
    const colors = this.data.length > 0 ? [this.#colorGreen, this.#colorGrey] : 'lightgrey';

    this.chartData.datasets[0].backgroundColor = colors;
    this.chartData.datasets[0].hoverBackgroundColor = colors;
  }

  ngDoCheck() {
    if (this.data !== this.chartData.datasets[0].data) {
      this.chartData.labels = this.data.length > 0 ? this.labels : [];
      this.chartData.datasets[0].data = this.data.length > 0 ? this.data : [1];
      this.updateChartColors();

      this.chart?.update();
    }
  }
}
