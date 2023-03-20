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
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { Subscription } from 'rxjs';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { PermissionAuditLog } from '../../permissionAuditLog';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { ApolloError } from '@apollo/client';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-admin-permission-audit-logs',
  standalone: true,
  templateUrl: './dh-admin-permission-audit-logs.component.html',
  styleUrls: ['./dh-admin-permission-audit-logs.component.scss'],
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
export class DhPermissionAuditLogsComponent implements OnInit, OnDestroy {
  dataSource = new WattTableDataSource<PermissionAuditLog>();

  @Input() selectedPermission: PermissionDto | null = null;
  auditLogs: PermissionAuditLog | null = null;

  private apollo = inject(Apollo);
  subscription!: Subscription;
  permissionLogs?: PermissionAuditLog[];
  loading = false;
  error?: ApolloError;

  columns: WattTableColumnDef<PermissionAuditLog> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: 'permissionId', sort: false },
  };

  constructor(private trans: TranslocoService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.apollo
      .watchQuery({
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetPermissionLogsDocument,
        variables: { id: this.selectedPermission?.id.toString() ?? '' },
      })
      .valueChanges.subscribe({
        next: (result) => {
          this.permissionLogs = result.data?.permissionLogs ?? undefined;
          this.loading = result.loading;
          this.error = result.error;
          this.dataSource.data = result.data?.permissionLogs ?? [];
        },
        error: (error) => {
          this.error = error;
        },
      });
  }

  translateHeader = (columnId: string): string => {
    const baseKey = 'admin.userManagement.tabs.history.columns';
    return this.trans.translate(`${baseKey}.${columnId}`);
  };
}
