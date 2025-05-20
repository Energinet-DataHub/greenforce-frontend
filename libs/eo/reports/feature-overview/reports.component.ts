//#region License
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
//#endregion
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WATT_CARD } from '../../../watt/package/card';
import { EoReport, EoReportsTableComponent } from './reports.table.component';

@Component({
  selector: 'eo-reports',
  imports: [CommonModule, WATT_CARD, EoReportsTableComponent],
  styles: [``],
  template: ` <watt-card>
    <watt-card-title>
      <h3>{{ 'TODO MASEP: Reports' }}</h3>
      <eo-reports-table [loading]="loading()" [reports]="reports()" />
    </watt-card-title>
  </watt-card>`,
})
export class EoReportsComponent {
  loading = signal(true);
  reports = signal<EoReport[]>([]);

  constructor() {
    setTimeout(() => this.loading.set(false), 2000);
    setTimeout(
      () =>
        this.reports.set([
          {
            createdAt: new Date(),
            interval: 'year',
            startDate: new Date(),
            endDate: new Date(),
            status: 'ready',
          },
        ]),
      2000
    );
  }
}
