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
import { Component, DoCheck, Input, NgModule, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import DatalabelsPlugin, { Context } from 'chartjs-plugin-datalabels';

@Component({
  selector: 'eo-pie-chart',
  template: `<canvas
    baseChart
    data-testid="pie-chart"
    [data]="pieChartData"
    [type]="pieChartType"
    [options]="pieChartOptions"
    [plugins]="pieChartPlugins"
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
  @Input() data: number[] = [50, 50];

  #colorGreen = getComputedStyle(document.documentElement).getPropertyValue(
    '--watt-color-state-success'
  );
  #colorGrey = getComputedStyle(document.documentElement).getPropertyValue(
    '--watt-color-neutral-grey-700'
  );

  #wattPrimaryFontFamily = 'Open Sans';
  #wattTextNormalFontWeight = 700;
  #wattTextNormalSize = 16;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
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
        data: [],
        backgroundColor: [this.#colorGreen, this.#colorGrey],
        hoverBackgroundColor: [this.#colorGreen, this.#colorGrey],
        borderWidth: 0,
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  ngDoCheck() {
    if (this.data !== this.pieChartData.datasets[0].data) {
      this.pieChartData.datasets[0].data = this.data;
      this.chart?.update();
    }
  }
}

@NgModule({
  declarations: [EoPieChartComponent],
  exports: [EoPieChartComponent],
  imports: [NgChartsModule],
})
export class EoPieChartScam {}
