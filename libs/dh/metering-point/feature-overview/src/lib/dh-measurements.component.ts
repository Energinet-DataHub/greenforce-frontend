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
import { Component, effect, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { dayjs, WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { GetMeasurementsByIdQueryVariables } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetMeasurementsByIdDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { MeteringData } from './types';

@Component({
  selector: 'dh-meter-data',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
    WattDatepickerComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
    VaterStackComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    h3 {
      margin: 0;
    }

    watt-datepicker {
      width: 320px;
    }
  `,
  template: `
    <watt-data-table
      vater
      inset="ml"
      [enableSearch]="false"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      *transloco="let t; read: 'meteringPoint.measurements'"
    >
      <watt-data-filters>
        <vater-stack align="flex-start">
          <watt-datepicker [formControl]="date" [max]="maxDate" [label]="t('dateLabel')" />
        </vater-stack>
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [dataSource]="dataSource"
        [loading]="dataSource.loading"
        sortDirection="desc"
        [sortClear]="false"
      >
        <ng-container *wattTableCell="columns.observationTime; let element">
          {{ element.observationTime | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns.quantity; let element">
          {{ element.quantity }}
        </ng-container>

        <ng-container *wattTableCell="columns.quality; let element">
          {{ t('qualities.' + element.quality) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsComponent {
  date = new FormControl();
  maxDate = dayjs().subtract(2, 'days').toDate();

  meteringPointId = input.required<string>();

  dataSource = new GetMeasurementsByIdDataSource({
    skip: true,
  });

  columns: WattTableColumnDef<MeteringData> = {
    observationTime: { accessor: 'observationTime' },
    quantity: { accessor: 'quantity' },
    quality: { accessor: 'quality' },
  };

  values = toSignal<GetMeasurementsByIdQueryVariables>(
    this.date.valueChanges.pipe(
      startWith(null),
      map(() => this.date.getRawValue()),
      exists(),
      map((date) => ({
        metertingPointId: this.meteringPointId(),
        date: dayjs(date).format('YYYY-MM-DD'),
      }))
    )
  );

  constructor() {
    effect(() => {
      const values = this.values();
      if (values) {
        this.dataSource.refetch(this.values());
      }
    });
  }
}
