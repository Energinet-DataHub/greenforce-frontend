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
import { Component, input, computed, effect } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import {
  GetPermissionAuditLogsDocument,
  PermissionAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-admin-permission-audit-logs',
  standalone: true,
  templateUrl: './dh-admin-permission-audit-logs.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .no-results-text {
        text-align: center;
      }

      .spinner {
        display: flex;
        justify-content: center;
      }
    `,
  ],
  imports: [
    NgTemplateOutlet,
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WATT_TABLE,
    WattDatePipe,
  ],
})
export class DhPermissionAuditLogsComponent {
  private readonly getPermissionAuditLogsQuery = lazyQuery(GetPermissionAuditLogsDocument, {
    fetchPolicy: 'cache-and-network',
  });
  private readonly auditLogs = computed(() => {
    return this.getPermissionAuditLogsQuery.data()?.permissionAuditLogs ?? [];
  });

  isLoading = this.getPermissionAuditLogsQuery.loading;
  hasError = computed(() => this.getPermissionAuditLogsQuery.error() !== undefined);

  dataSource = new WattTableDataSource<PermissionAuditedChangeAuditLogDto>();

  columns: WattTableColumnDef<PermissionAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  selectedPermission = input.required<PermissionDto>();

  private auditLogsEffect = effect(() => {
    this.dataSource.data = [...this.auditLogs()].reverse();
  });

  private queryRefetchEffect = effect(() => {
    this.getPermissionAuditLogsQuery.refetch({ id: this.selectedPermission()?.id });
  });
}
