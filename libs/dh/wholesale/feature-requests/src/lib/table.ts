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
import { Component, output } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';

import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetRequestsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';

type Request = ExtractNodeType<GetRequestsDataSource>;

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-table',
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ReactiveFormsModule,
    WattTableComponent,
    WattTableCellDirective,
    WattDatePipe,
    WattButtonComponent,
    VaterUtilityDirective,
    WattBadgeComponent,
    WattDataTableComponent,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'wholesale.requests'"
      vater
      inset="ml"
      [enableSearch]="false"
      [searchLabel]="t('searchById')"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('results') }}</h3>

      <watt-button variant="secondary" icon="plus" (click)="new.emit()">
        {{ t('button') }}
      </watt-button>

      <watt-table
        *transloco="let resolveHeader; read: 'wholesale.requests.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
      >
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.lifeCycle.createdAt | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns['calculationType']; let row">
          {{ 'wholesale.shared.' + row.calculationType | transloco }}
        </ng-container>

        <ng-container *wattTableCell="columns['period']; let row">
          {{ row.period | wattDate }}
        </ng-container>

        <ng-container *wattTableCell="columns['meteringPointTypeOrPriceType']; let row">
          @if (row.__typename === 'RequestAggregatedMeasureData') {
            {{ t('meteringPointTypesAndPriceTypes.' + row.meteringPointType) }}
          } @else {
            {{ t('meteringPointTypesAndPriceTypes.' + row.priceType) }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns['state']; let row">
          <watt-badge [type]="row.lifeCycle.statusType">
            {{ t('states.' + row.lifeCycle.state) }}
          </watt-badge>
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhWholesaleRequestsTable {
  new = output();

  columns: WattTableColumnDef<Request> = {
    createdAt: { accessor: (x) => x.lifeCycle.createdAt },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: 'period' },
    meteringPointTypeOrPriceType: {
      accessor: (x) =>
        x.__typename === 'RequestAggregatedMeasureData' ? x.meteringPointType : x.priceType,
    },
    createdBy: { accessor: (x) => x.lifeCycle.createdBy?.displayName },
    state: { accessor: (x) => x.lifeCycle.state },
  };

  dataSource = new GetRequestsDataSource({
    variables: {
      order: { createdAt: SortEnumType.Desc },
    },
  });
}
