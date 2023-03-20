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
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';
import { provideComponentStore } from '@ngrx/component-store';
import { takeUntil } from 'rxjs';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  DhAdminUserRoleAuditLogsDataAccessApiStore,
  DhRoleAuditLogEntry,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { UserRoleWithPermissionsDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-role-audit-logs',
  standalone: true,
  templateUrl: './dh-role-audit-logs.component.html',
  styles: [
    `
      h4 {
        margin: 0;
      }

      .spinner {
        display: flex;
        justify-content: center;
      }

      .no-results-text {
        margin-top: var(--watt-space-m);
        text-align: center;
      }
    `,
  ],
  providers: [provideComponentStore(DhAdminUserRoleAuditLogsDataAccessApiStore)],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    TranslocoModule,
    WattCardModule,
    WattSpinnerModule,
    WattEmptyStateModule,
    WATT_TABLE,
    DhSharedUiDateTimeModule,
  ],
})
export class DhRoleAuditLogsComponent implements OnInit, OnChanges {
  private store = inject(DhAdminUserRoleAuditLogsDataAccessApiStore);

  dataSource = new WattTableDataSource<DhRoleAuditLogEntry>();

  auditLogs$ = this.store.auditLogs$;
  auditLogCount$ = this.store.auditLogCount$;

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  columns: WattTableColumnDef<DhRoleAuditLogEntry> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: 'entry', sort: false },
  };

  @Input() role: UserRoleWithPermissionsDto | null = null;

  ngOnInit(): void {
    this.store.auditLogs$.pipe(takeUntil(this.store.destroy$)).subscribe((logs) => {
      this.dataSource.data = logs;
    });
  }

  ngOnChanges(): void {
    this.reloadAuditLogs();
  }

  reloadAuditLogs(): void {
    if (this.role) {
      this.store.getAuditLogs(this.role.id);
    }
  }
}
