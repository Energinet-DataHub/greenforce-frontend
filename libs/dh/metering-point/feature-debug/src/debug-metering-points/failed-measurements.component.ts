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
import { Component, computed, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { dayjs, WattDatePipe } from '@energinet-datahub/watt/date';

import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import { GetFailedSendMeasurementsInstancesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

type FailedSendMeasurementsInstance = ExtractNodeType<GetFailedSendMeasurementsInstancesDataSource>;

@Component({
  selector: 'dh-metering-point-failed-measurements',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterUtilityDirective,
    VaterStackComponent,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDateRangeChipComponent,
    WattDatePipe,
    WattFormChipDirective,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'meteringPoint.failedMeasurements'"
      vater
      inset="ml"
      [error]="dataSource.error"
      [ready]="dataSource.called"
      [searchLabel]="t('columns.meteringPointId')"
      [enableCount]="false"
    >
      <watt-data-filters>
        <form
          vater-stack
          scrollable
          direction="row"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
          *transloco="let t; read: 'meteringPoint.failedMeasurements.filters'"
        >
          <watt-date-range-chip [formControl]="form.controls.created">
            {{ t('created') }}
          </watt-date-range-chip>
        </form>
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.failedMeasurements.columns'"
        #table
        description="Search result"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
      >
        <ng-container *wattTableCell="columns['meteringPointId']; let row">
          {{ row.meteringPointId }}
        </ng-container>
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.createdAt | wattDate: 'long' }}
        </ng-container>
        <ng-container *wattTableCell="columns['transactionId']; let row">
          {{ row.transactionId }}
        </ng-container>
        <ng-container *wattTableCell="columns['failedAt']; let row">
          {{ row.failedAt | wattDate: 'long' }}
        </ng-container>
        <ng-container *wattTableCell="columns['errorText']; let row">
          {{ row.errorText }}
        </ng-container>
        <ng-container *wattTableCell="columns['failedCount']; let row">
          {{ row.failedCount }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeteringPointFailedMeasurementsComponent {
  selection = signal<FailedSendMeasurementsInstance | undefined>(undefined);

  columns: WattTableColumnDef<FailedSendMeasurementsInstance> = {
    meteringPointId: { accessor: (m) => m.meteringPointId, sort: false },
    createdAt: { accessor: (m) => m.createdAt, sort: false },
    transactionId: { accessor: (m) => m.transactionId, sort: false },
    failedAt: { accessor: (m) => m.failedAt, sort: false },
    failedCount: { accessor: (m) => m.failedCount, sort: false },
    errorText: { accessor: (m) => m.errorText, sort: false },
  };

  initialCreated = { start: dayjs().startOf('day').toDate(), end: dayjs().endOf('day').toDate() };
  form = new FormGroup({
    created: new FormControl(this.initialCreated, { nonNullable: true }),
  });

  filters = toSignal(this.form.valueChanges.pipe(filter((v) => {
    return Boolean(v.created?.end);
  })));

  variables = computed(() => {
    return {
      ...this.filters(),
   };
  });

  dataSource = new GetFailedSendMeasurementsInstancesDataSource({
    skip: true,
    variables: {
      created: this.initialCreated,
    },
  });

  refetch = effect(() => {
    return this.dataSource.refetch(this.variables());
  });
}
