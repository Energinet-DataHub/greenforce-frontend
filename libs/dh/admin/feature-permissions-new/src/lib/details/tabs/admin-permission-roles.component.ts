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

import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { PermissionDetailDto } from '@energinet-datahub/dh/shared/domain';
import { DhPermissionDetailsUserRole } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  standalone: true,
  selector: 'dh-admin-permission-roles',
  imports: [TranslocoDirective, WATT_CARD, WATT_TABLE, DhResultComponent],
  template: `
    <watt-card
      variant="solid"
      *transloco="let t; read: 'admin.userManagement.permissionDetail.tabs.userRoles'"
    >
      @if (userRolesCount() === 1) {
        <watt-card-title>
          <h4>
            {{ t('rolesSingular', { userRoleCount: userRolesCount() }) }}
          </h4>
        </watt-card-title>
      } @else if (userRolesCount() !== 1) {
        <watt-card-title>
          <h4>
            {{ t('rolesPlural', { userRoleCount: userRolesCount() }) }}
          </h4>
        </watt-card-title>
      }

      <dh-result [loading]="loading()" [hasError]="hasError()" [empty]="userRolesCount() === 0">
        <watt-table
          [columns]="columns"
          [dataSource]="dataSource"
          sortBy="name"
          sortDirection="desc"
          [sortClear]="false"
        >
          <ng-container *wattTableCell="columns.name; header: t('columns.name'); let element">
            {{ element.name }}
          </ng-container>
          <ng-container
            *wattTableCell="columns.eicFunction; header: t('columns.eicFunction'); let element"
          >
            <ng-container
              *transloco="let translateMarketRole; read: 'marketParticipant.marketRoles'"
            >
              {{ translateMarketRole(element.eicFunction) }}
            </ng-container>
          </ng-container>
        </watt-table>
      </dh-result>
    </watt-card>
  `,
})
export class DhAdminPermissionRolesComponent {
  private userRoles = computed(() => this.selectedPermission().userRoles ?? []);

  selectedPermission = input.required<PermissionDetailDto>();

  userRolesCount = computed(() => this.userRoles().length);

  loading = input.required<boolean>();
  hasError = input.required<boolean>();

  dataSource = new WattTableDataSource<DhPermissionDetailsUserRole>();

  columns: WattTableColumnDef<DhPermissionDetailsUserRole> = {
    name: { accessor: 'name' },
    eicFunction: { accessor: 'eicFunction' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.userRoles();
    });
  }
}
