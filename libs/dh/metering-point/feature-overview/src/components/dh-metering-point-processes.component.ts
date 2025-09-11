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
import { Component, computed, effect, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { dayjs, WattDatePipe } from '@energinet-datahub/watt/date';

import { GetProcessesForMeteringPointDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

type MeteringPointProcess = ExtractNodeType<GetProcessesForMeteringPointDataSource>;

@Component({
  selector: 'dh-metering-point-processes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterUtilityDirective,
    VaterStackComponent,
    WATT_TABLE,
    WattCheckboxComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDateRangeChipComponent,
    WattDatePipe,
    WattFormChipDirective,
  ],
  template: `
    <watt-data-table
      *transloco="let tMessageArchive; read: 'messageArchive'"
      vater
      inset="ml"
      [error]="dataSource.error"
      [hideHeader]="true"
    >
      <watt-data-filters>
        <form
          vater-stack
          scrollable
          direction="row"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
          *transloco="let t; read: 'meteringPoint.processes.filters'"
        >
          <watt-date-range-chip [formControl]="form.controls.created">
            {{ t('created') }}
          </watt-date-range-chip>
          <vater-stack direction="row" offset="ml" gap="l">
            <watt-checkbox [formControl]="form.controls.includeViews">
              {{ t('includeViews') }}
            </watt-checkbox>
            <watt-checkbox [formControl]="form.controls.includeMasterMeasurementAndPriceRequests">
              {{ t('includeMasterMeasurementAndPriceRequests') }}
            </watt-checkbox>
          </vater-stack>
        </form>
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.processes.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
      >
        <ng-container *wattTableCell="columns.createdAt; let process">
          {{ process.createdAt | wattDate: 'long' }}
        </ng-container>
        <ng-container *wattTableCell="columns.documentType; let process">
          {{ tMessageArchive('documentType.' + process.documentType) }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeteringPointProcessesComponent {
  readonly meteringPointId = input.required<string>();

  initialDateRange = {
    start: dayjs().subtract(7, 'days').startOf('day').toDate(),
    end: dayjs().endOf('day').toDate(),
  };

  dataSource = new GetProcessesForMeteringPointDataSource({
    skip: true,
    variables: {
      created: this.initialDateRange,
    },
  });

  columns: WattTableColumnDef<MeteringPointProcess> = {
    createdAt: { accessor: 'createdAt' },
    documentType: { accessor: 'documentType' },
  };

  form = new FormGroup({
    created: dhMakeFormControl(this.initialDateRange),
    includeViews: dhMakeFormControl(false),
    includeMasterMeasurementAndPriceRequests: dhMakeFormControl(false),
  });

  filters = toSignal(this.form.valueChanges.pipe(filter((v) => Boolean(v.created?.end))));
  variables = computed(() => ({ ...this.filters(), meteringPointId: this.meteringPointId() }));
  refetch = effect(() => this.dataSource.refetch(this.variables()));
}
