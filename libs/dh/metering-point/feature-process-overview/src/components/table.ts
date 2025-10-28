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
import { Component, computed, effect, inject, input } from '@angular/core';
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

import { GetMeteringPointProcessOverviewDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import { DhEmDashFallbackPipe, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { RouterOutlet } from '@angular/router';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';

type MeteringPointProcess = ExtractNodeType<GetMeteringPointProcessOverviewDataSource>;

@Component({
  selector: 'dh-metering-point-process-overview-table',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
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
    DhEmDashFallbackPipe,
    DhProcessStateBadge,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'messageArchive'"
      vater
      inset="ml"
      [error]="dataSource.error"
      [header]="false"
    >
      <watt-data-filters>
        <form
          vater-stack
          scrollable
          direction="row"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
          *transloco="let t; prefix: 'meteringPoint.processOverview.filters'"
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
        variant="zebra"
        *transloco="let resolveHeader; prefix: 'meteringPoint.processOverview.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigation.navigate('details', $event.id)"
      >
        <ng-container *wattTableCell="columns.createdAt; let process">
          {{ process.createdAt | wattDate: 'long' }}
        </ng-container>
        <ng-container *wattTableCell="columns.cutoffDate; let process">
          {{ process.cutoffDate | wattDate: 'long' }}
        </ng-container>
        <ng-container *wattTableCell="columns.documentType; let process">
          {{ t('documentType.' + process.documentType) }}
        </ng-container>
        <ng-container *wattTableCell="columns.state; let process">
          <dh-process-state-badge
            [status]="process.state"
            *transloco="let t; prefix: 'shared.states'"
          >
            {{ t(process.state) }}
          </dh-process-state-badge>
        </ng-container>
        <ng-container *wattTableCell="columns.initiator; let process">
          {{ process.initiator?.displayName | dhEmDashFallback }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhMeteringPointProcessOverviewTable {
  readonly meteringPointId = input.required<string>();
  readonly id = input<string>();
  protected navigation = inject(DhNavigationService);

  initialDateRange = {
    start: dayjs().subtract(7, 'days').startOf('day').toDate(),
    end: dayjs().endOf('day').toDate(),
  };

  dataSource = new GetMeteringPointProcessOverviewDataSource({
    skip: true,
    variables: {
      created: this.initialDateRange,
    },
  });

  columns: WattTableColumnDef<MeteringPointProcess> = {
    createdAt: { accessor: 'createdAt' },
    cutoffDate: { accessor: 'cutoffDate' },
    documentType: { accessor: 'documentType' },
    state: { accessor: 'state' },
    initiator: { accessor: 'initiator' },
    actions: { accessor: null },
  };

  form = new FormGroup({
    created: dhMakeFormControl(this.initialDateRange),
    includeViews: dhMakeFormControl(false),
    includeMasterMeasurementAndPriceRequests: dhMakeFormControl(false),
  });

  selection = computed(() => this.dataSource.data.find((r) => r.id === this.navigation.id()));
  filters = toSignal(this.form.valueChanges.pipe(filter((v) => Boolean(v.created?.end))));
  variables = computed(() => ({ ...this.filters(), meteringPointId: this.meteringPointId() }));
  refetch = effect(() => this.dataSource.refetch(this.variables()));
}
