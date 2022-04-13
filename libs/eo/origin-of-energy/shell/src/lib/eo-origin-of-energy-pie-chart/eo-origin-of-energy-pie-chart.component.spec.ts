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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Context } from 'chartjs-plugin-datalabels';
import {
  EoPieChartComponent,
  EoPieChartScam,
} from './eo-origin-of-energy-pie-chart.component';

let component: EoPieChartComponent;
let fixture: ComponentFixture<EoPieChartComponent>;

describe(EoPieChartComponent.name, () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [EoPieChartScam],
    });

    fixture = TestBed.createComponent(EoPieChartComponent);
    component = fixture.componentInstance;
  });

  it('renders the canvas', async () => {
    render('<eo-pie-chart></eo-pie-chart>', {
      imports: [EoPieChartScam],
    });

    expect(await screen.findByTestId('pie-chart')).toBeVisible;
  });

  it('formats the labels', () => {
    const value = '12';
    const label = 'this is a test label';
    const context = {
      chart: { data: { labels: [label] } },
      dataIndex: 0,
    } as Context;

    const output = component?.pieChartOptions?.plugins?.datalabels?.formatter?.(
      value,
      context
    );

    expect(output).toContain(`12%\n${label}`);
  });
});
