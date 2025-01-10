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
import { Component, input, computed, effect } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetPermissionAuditLogsDocument,
  PermissionAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-admin-permission-audit-logs',
  imports: [TranslocoDirective, WATT_CARD, WATT_TABLE, WattDatePipe, DhResultComponent],
  template: `
    <watt-card variant="solid" *transloco="let t; read: 'admin.userManagement.tabs.history'">
      <watt-card-title>
        <h4>
          @let count = dataSource.totalCount;
          @if (count === 1) {
            {{ t('changesSingular', { auditLogCount: count }) }}
          } @else {
            {{ t('changesPlural', { auditLogCount: count }) }}
          }
        </h4>
      </watt-card-title>
      <dh-result
        [loading]="loading()"
        [hasError]="hasError()"
        [empty]="dataSource.totalCount === 0"
      >
        <watt-table
          [columns]="columns"
          [dataSource]="dataSource"
          sortBy="timestamp"
          sortDirection="desc"
          [sortClear]="false"
        >
          <ng-container
            *wattTableCell="columns.timestamp; header: t('table.columns.timestamp'); let element"
          >
            {{ element.timestamp | wattDate: 'long' }}
          </ng-container>

          <ng-container
            *wattTableCell="columns.entry; header: t('table.columns.entry'); let element"
          >
            <span
              [innerHTML]="t('logs.permissionsDetails.auditLogType.' + element.change, element)"
            >
            </span>
          </ng-container>
        </watt-table>
      </dh-result>
    </watt-card>
  `,
})
export class DhPermissionAuditLogsComponent {
  private query = lazyQuery(GetPermissionAuditLogsDocument);
  private auditLogs = computed(() => this.query.data()?.permissionAuditLogs ?? []);

  loading = this.query.loading;
  hasError = this.query.hasError;

  dataSource = new WattTableDataSource<PermissionAuditedChangeAuditLogDto>();

  columns: WattTableColumnDef<PermissionAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  selectedPermission = input.required<PermissionDto>();

  constructor() {
    effect(() => {
      this.dataSource.data = [...this.auditLogs()].reverse();
    });

    effect(() => {
      this.query.refetch({ id: this.selectedPermission().id });
    });
  }
}
