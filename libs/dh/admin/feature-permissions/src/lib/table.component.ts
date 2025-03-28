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
import { RouterOutlet } from '@angular/router';
import { Component, computed, inject } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattDataActionsComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';

import { Permission } from '@energinet-datahub/dh/admin/data-access-api';
import { SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetFilteredPermissionsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhPermissionsDownloadComponent } from './download.component';

@Component({
  selector: 'dh-permissions-table',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }
    `,
  ],
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    RouterOutlet,
    WATT_CARD,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataActionsComponent,
    VaterUtilityDirective,
    DhPermissionsDownloadComponent,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      vater
      inset="ml"
      *transloco="let t; read: 'admin.userManagement.permissionsTab'"
      [searchLabel]="'shared.search' | transloco"
      [error]="dataSource.error"
      [ready]="dataSource.called"
    >
      <h3>{{ t('headline') }}</h3>

      <watt-data-actions>
        <dh-permissions-download [permissions]="dataSource.filteredData" [url]="url()" />
      </watt-data-actions>

      <watt-table
        [dataSource]="dataSource"
        [columns]="columns"
        (rowClick)="open($event.id)"
        [activeRow]="selection()"
        [loading]="dataSource.loading"
        [sortClear]="false"
      >
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
    <router-outlet />
  `,
})
export class DhPermissionsTableComponent {
  private navigation = inject(DhNavigationService);

  columns: WattTableColumnDef<Permission> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new GetFilteredPermissionsDataSource({
    variables: {
      order: { name: SortEnumType.Asc },
    },
  });

  url = computed(
    () => this.dataSource.query.data()?.filteredPermissions?.permissionRelationsUrl ?? ''
  );

  selection = () =>
    this.dataSource.filteredData.find((row) => row.id === parseInt(this.navigation.id() ?? '0'));

  open(id: number) {
    this.navigation.navigate('details', id);
  }
}
