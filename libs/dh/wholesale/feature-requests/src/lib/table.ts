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
import { ReactiveFormsModule } from '@angular/forms';
import { Component, computed, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetRequestsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';
import { toSignal } from '@angular/core/rxjs-interop';

type Request = ExtractNodeType<GetRequestsDataSource>;

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-table',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,
    WattTableComponent,
    WattTableCellDirective,
    WattDatePipe,
    WattButtonComponent,
    VaterUtilityDirective,
    WattDataTableComponent,
    DhProcessStateBadge,
    DhPermissionRequiredDirective,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'wholesale.requests'"
      vater
      inset="ml"
      [enableSearch]="false"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('results') }}</h3>

      <watt-button
        *dhPermissionRequired="[
          'request-aggregated-measured-data:view',
          'request-wholesale-settlement:view',
        ]"
        variant="secondary"
        icon="plus"
        data-testid="newRequest"
        (click)="new.emit()"
      >
        {{ t('button') }}
      </watt-button>

      <watt-table
        *transloco="let resolveHeader; read: 'wholesale.requests.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [displayedColumns]="displayedColumns()"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
      >
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.createdAt | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns['calculationType']; let row">
          {{ t('calculationTypes.' + row.calculationType) }}
        </ng-container>

        <ng-container *wattTableCell="columns['period']; let row">
          {{ row.period | wattDate }}
        </ng-container>

        <ng-container *wattTableCell="columns['meteringPointTypeOrPriceType']; let row">
          @if (row.__typename === 'RequestCalculatedEnergyTimeSeriesResult') {
            {{ t('meteringPointTypesAndPriceTypes.' + (row.meteringPointType ?? 'ALL_ENERGY')) }}
          } @else {
            {{ t('meteringPointTypesAndPriceTypes.' + (row.priceType ?? 'ALL_ENERGY')) }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns['requestedBy']; let row">
          {{ row.requestedBy?.displayName }}
          <br />
          <span>{{ row.requestedBy?.glnOrEicNumber }}</span>
        </ng-container>

        <ng-container *wattTableCell="columns['state']; let row">
          <dh-process-state-badge [status]="row.state">
            {{ 'shared.states.' + row.state | transloco }}
          </dh-process-state-badge>
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhWholesaleRequestsTable {
  private permissions = inject(PermissionService);
  private isFas = toSignal(this.permissions.isFas());

  new = output();

  columns: WattTableColumnDef<Request> = {
    messageId: { accessor: 'messageId' },
    createdAt: { accessor: (x) => x.createdAt },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: 'period' },
    meteringPointTypeOrPriceType: {
      accessor: (x) =>
        x.__typename === 'RequestCalculatedEnergyTimeSeriesResult'
          ? x.meteringPointType
          : x.priceType,
    },
    requestedBy: { accessor: (x) => x.requestedBy?.id },
    state: { accessor: (x) => x.state },
  };

  // Hide requestedBy column unless the user is a "fas" user
  displayedColumns = computed(() =>
    !this.isFas() ? Object.keys(this.columns).filter((c) => c !== 'requestedBy') : undefined
  );

  dataSource = new GetRequestsDataSource({
    variables: {
      order: { createdAt: SortEnumType.Desc },
    },
  });
}
