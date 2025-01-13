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
import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetFilteredPermissionsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { Permission } from '@energinet-datahub/dh/admin/data-access-api';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-electricity-market-simple-view',
  imports: [
    WattDataTableComponent,
    WATT_TABLE,
    TranslocoPipe,
    TranslocoDirective,
    VaterUtilityDirective,
  ],
  template: `
    <watt-data-table
      vater
      inset="ml"
      *transloco="let t; read: 'electricityMarket.table'"
      [searchLabel]="'shared.search' | transloco"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('headline') }}</h3>

      <watt-table [dataSource]="dataSource" [columns]="columns" [loading]="dataSource.loading">
        <ng-container *wattTableCell="columns.name; header: t('permissionName'); let element">
          {{ element.name }}
        </ng-container>

        <ng-container
          *wattTableCell="columns.description; header: t('permissionDescription'); let element"
        >
          {{ element.description }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhElectricityMarketSimpleViewComponent {
  columns: WattTableColumnDef<Permission> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  // Temporary solution to avoid errors
  dataSource = new GetFilteredPermissionsDataSource({
    variables: {
      order: { name: SortEnumType.Asc },
    },
  });
}
