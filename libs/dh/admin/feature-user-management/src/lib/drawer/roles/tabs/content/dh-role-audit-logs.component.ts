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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { WattDatePipe } from '@energinet-datahub/watt/date';

import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  graphql,
  MarketParticipantUserRoleWithPermissionsDto,
} from '@energinet-datahub/dh/shared/domain';

import { DhAuditChangeCellComponent } from './dh-audit-change-cell.component';
import { Apollo, QueryRef } from 'apollo-angular';
import { ApolloError } from '@apollo/client';
import { UserRoleAuditLog } from '../../../../userRoleAuditLog';

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
    DhAuditChangeCellComponent,
  ],
})
export class DhRoleAuditLogsComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private getUserRoleAuditLogsQuery?: QueryRef<
    graphql.GetUserRoleAuditLogsQuery,
    {
      id: string;
    }
  >;
  private subscription?: Subscription;

  dataSource = new WattTableDataSource<UserRoleAuditLog>();

  isLoading = false;
  error?: ApolloError;

  columns: WattTableColumnDef<UserRoleAuditLog> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  @Input({ required: true }) role!: MarketParticipantUserRoleWithPermissionsDto;

  ngOnInit(): void {
    this.getUserRoleAuditLogsQuery = this.apollo.watchQuery({
      useInitialLoading: true,
      notifyOnNetworkStatusChange: true,
      query: graphql.GetUserRoleAuditLogsDocument,
      variables: { id: this.role.id },
      fetchPolicy: 'cache-and-network',
    });

    this.subscription = this.getUserRoleAuditLogsQuery.valueChanges.subscribe({
      next: (result) => {
        this.isLoading = result.loading;
        this.error = result.error;
        this.dataSource.data = result.data?.userRoleAuditLogs ?? [];
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
