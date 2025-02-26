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
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { dayjs, WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

type DhMeterData = {
  timestamp: Date;
  value: number;
  unit: string;
  quality: string;
};

@Component({
  selector: 'dh-meter-data',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_TABLE,
    WATT_CARD,
    WattDatePipe,
    VaterFlexComponent,
    VaterUtilityDirective,
    WattDatepickerComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .page-grid {
      padding: var(--watt-space-ml);
      height: 100%;
    }

    h3 {
      margin: 0;
    }

    watt-datepicker {
      width: 320px;
    }
  `,
  template: `
    <div class="page-grid" *transloco="let t; read: 'meteringPoint.meterData'">
      <watt-datepicker [formControl]="date" [max]="maxDate" [label]="t('dateLabel')" />

      <watt-card vater fill="vertical">
        <vater-flex fill="vertical" gap="m">
          <h3>{{ date.value | wattDate | dhEmDashFallback }}</h3>

          <vater-flex fill="vertical" scrollable>
            <watt-table
              [columns]="columns"
              [dataSource]="dataSource"
              sortDirection="desc"
              [sortClear]="false"
            >
              <ng-container
                *wattTableCell="columns.timestamp; header: t('columns.time'); let element"
              >
                {{ element.timestamp | wattDate: 'long' }}
              </ng-container>

              <ng-container *wattTableCell="columns.value; header: t('columns.value'); let element">
                {{ element.value }}
              </ng-container>
            </watt-table>
          </vater-flex>
        </vater-flex>
      </watt-card>
    </div>
  `,
})
export class DhMeterDataComponent {
  date = new FormControl();
  maxDate = dayjs().subtract(2, 'days').toDate();

  dataSource = new WattTableDataSource<DhMeterData>([]);

  columns: WattTableColumnDef<DhMeterData> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: 'value' },
    unit: { accessor: 'unit' },
    quality: { accessor: 'quality' },
  };
}
