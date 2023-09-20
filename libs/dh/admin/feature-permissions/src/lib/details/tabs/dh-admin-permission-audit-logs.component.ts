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
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { Subscription } from 'rxjs';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { PermissionAuditLog } from '../../permissionAuditLog';
import { Apollo, QueryRef } from 'apollo-angular';
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
    RxLet,
    RxPush,
    TranslocoModule,
    WATT_CARD,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WATT_TABLE,
    WattDatePipe,
  ],
})
export class DhPermissionAuditLogsComponent implements OnInit, OnChanges, OnDestroy {
  dataSource = new WattTableDataSource<PermissionAuditLog>();

  @Input({ required: true }) selectedPermission!: PermissionDto;
  auditLogs: PermissionAuditLog | null = null;

  private apollo = inject(Apollo);
  private getPermissionLogsQuery?: QueryRef<
    graphql.GetPermissionLogsQuery,
    {
      id: number;
    }
  >;
  private subscription?: Subscription;

  permissionLogs: PermissionAuditLog[] = [];
  loading = false;
  error?: ApolloError;

  columns: WattTableColumnDef<PermissionAuditLog> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  constructor(private trans: TranslocoService) {}

  ngOnInit(): void {
    this.getPermissionLogsQuery = this.apollo.watchQuery({
      useInitialLoading: true,
      notifyOnNetworkStatusChange: true,
      query: graphql.GetPermissionLogsDocument,
      variables: { id: this.selectedPermission.id },
    });

    this.subscription = this.getPermissionLogsQuery.valueChanges.subscribe({
      next: (result) => {
        this.permissionLogs = result.data?.permissionLogs ?? [];
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = result.data?.permissionLogs ?? [];
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedPermission.firstChange === false &&
      changes.selectedPermission.currentValue
    ) {
      const id = changes.selectedPermission.currentValue.id.toString();

      this.getPermissionLogsQuery?.refetch({ id });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  translateHeader = (columnId: string): string => {
    const baseKey = 'admin.userManagement.tabs.history.columns';
    return this.trans.translate(`${baseKey}.${columnId}`);
  };
}
