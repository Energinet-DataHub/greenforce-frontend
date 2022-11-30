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
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'eo-line-chart',
  standalone: true,
  imports: [NgChartsModule],
  template: `<canvas
    baseChart
    data-testid="line-chart"
    [data]="chartData"
    [type]="chartType"
    [options]="chartOptions"
  >
  </canvas>`,
})
export class EoLineChartComponent implements DoCheck {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @Input() data: { name: string; value: number }[] = [];

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: { enabled: false },
      datalabels: {
        display: false,
      },
    },
  };

  public chartData: ChartData<'line', number[]> = {
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: '#7FB069',
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };
  public chartType: ChartType = 'line';

  ngDoCheck() {
    if (this.inputDiffersFromCurrentData()) {
      this.chartData.datasets[0].data = this.data.map(({ value }) => value);
      this.chartData.labels = this.data.map(({ name }) => name);
      this.chart?.update();
    }
  }

  inputDiffersFromCurrentData() {
    if (this.data.length === 0) return false;

    return (
      this.data.map(({ value }) => value) !== this.chartData.datasets[0].data
    );
  }
}
