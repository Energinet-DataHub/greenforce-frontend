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
import { Component, computed, input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WattTableCellDirective,
} from '@energinet-datahub/watt/table';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';

import {
  GetPermissionAuditLogsDocument,
  PermissionAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-admin-permission-audit-logs',
  template: `
    <watt-data-table
      vater
      inset="0"
      variant="solid"
      *transloco="let t; prefix: 'admin.userManagement.tabs.history'"
      [enableSearch]="false"
      [enablePaginator]="false"
      [count]="
        dataSource().totalCount === 1
          ? t('changesSingular', { auditLogCount: dataSource().totalCount })
          : t('changesPlural', { auditLogCount: dataSource().totalCount })
      "
      [error]="hasError()"
      [ready]="ready()"
    >
      <watt-table
        [columns]="columns"
        [dataSource]="dataSource()"
        sortBy="timestamp"
        [loading]="isLoading()"
        sortDirection="desc"
        [sortClear]="false"
      >
        <ng-container
          *wattTableCell="columns.timestamp; header: t('table.columns.timestamp'); let element"
        >
          {{ element.timestamp | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns.entry; header: t('table.columns.entry'); let element">
          <span [innerHTML]="t('logs.permissionsDetails.auditLogType.' + element.change, element)">
          </span>
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
  imports: [
    TranslocoDirective,
    WattDatePipe,
    WattTableComponent,
    WattTableCellDirective,
    WattDataTableComponent,
    VaterUtilityDirective,
  ],
  standalone: true,
})
export class DhPermissionAuditLogsComponent {
  private getPermissionAuditLogsQuery = query(GetPermissionAuditLogsDocument, () => ({
    variables: { id: this.selectedPermission().id },
  }));

  selectedPermission = input.required<PermissionDto>();

  dataSource = computed(
    () =>
      new WattTableDataSource<PermissionAuditedChangeAuditLogDto>(
        this.getPermissionAuditLogsQuery.data()?.permissionById.auditLogs || []
      )
  );
  hasError = this.getPermissionAuditLogsQuery.hasError;
  isLoading = this.getPermissionAuditLogsQuery.loading;
  ready = this.getPermissionAuditLogsQuery.called;

  columns: WattTableColumnDef<PermissionAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };
}
