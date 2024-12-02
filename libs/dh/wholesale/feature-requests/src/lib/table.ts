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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent, WattDataFiltersComponent } from '@energinet-datahub/watt/data';

import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';
import { Request } from '@energinet-datahub/dh/wholesale/domain';
import { GetRequestsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-requests-table',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattTableComponent,
    WattTableCellDirective,
    WattDatePipe,
    WattButtonComponent,
    VaterUtilityDirective,
    WattDataTableComponent,
    WattDataFiltersComponent,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'wholesale.requests'"
      vater
      inset="ml"
      [searchLabel]="t('searchById')"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('results') }}</h3>

      <watt-button variant="secondary" icon="plus">
        {{ t('new') }}
      </watt-button>

      <watt-table
        *transloco="let resolveHeader; read: 'wholesale.requests.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="dataSource.loading"
        [resolveHeader]="resolveHeader"
      >
        <ng-container *wattTableCell="columns['createdAt']; let row">
          {{ row.lifeCycle.startedAt | wattDate: 'long' }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhWholesaleRequestsTable {
  columns: WattTableColumnDef<Request> = {
    createdAt: { accessor: (x) => x.lifeCycle.startedAt },
    calculationType: { accessor: 'calculationType' },
  };

  dataSource = new GetRequestsDataSource({
    variables: {
      order: { createdAt: SortEnumType.Desc },
    },
  });
}
