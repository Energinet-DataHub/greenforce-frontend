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
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  DhAdminUserManagementAuditLogsDataAccessApiStore,
  DhUserAuditLogEntry,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { provideComponentStore } from '@ngrx/component-store';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { map } from 'rxjs';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-user-audit-logs',
  standalone: true,
  templateUrl: './dh-user-audit-logs.component.html',
  styleUrls: ['./dh-user-audit-logs.component.scss'],
  providers: [provideComponentStore(DhAdminUserManagementAuditLogsDataAccessApiStore)],
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
export class DhUserAuditLogsComponent implements OnChanges {
  private dataSource = new WattTableDataSource<DhUserAuditLogEntry>();

  @Input() user: UserOverviewItemDto | null = null;

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  auditLogCount$ = this.store.auditLogCount$;
  auditLogs$ = this.store.auditLogs$.pipe(
    map((logs) => {
      this.dataSource.data = logs;
      return this.dataSource;
    })
  );

  columns: WattTableColumnDef<DhUserAuditLogEntry> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: 'entry', sort: false },
  };

  constructor(
    private store: DhAdminUserManagementAuditLogsDataAccessApiStore,
    private trans: TranslocoService
  ) {}

  ngOnChanges(): void {
    this.reloadAuditLogs();
  }

  reloadAuditLogs() {
    if (this.user) {
      this.store.getAuditLogs(this.user.id);
    }
  }

  translateHeader = (columnId: string): string => {
    const baseKey = 'admin.userManagement.tabs.history.columns';
    return this.trans.translate(`${baseKey}.${columnId}`);
  };
}
