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
import { Component, inject, Input, OnChanges } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { catchError, map, of, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  GetUserRoleAuditLogsDocument,
  UserRoleAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhUserRoleWithPermissions } from '@energinet-datahub/dh/admin/data-access-api';

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
    RxLet,
    NgTemplateOutlet,
    RxPush,
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WATT_TABLE,
    WattDatePipe,
  ],
})
export class DhRoleAuditLogsComponent implements OnChanges {
  private readonly apollo = inject(Apollo);
  private readonly getUserRoleAuditLogsQuery = this.apollo.watchQuery({
    query: GetUserRoleAuditLogsDocument,
    fetchPolicy: 'cache-and-network',
  });

  dataSource = new WattTableDataSource<UserRoleAuditedChangeAuditLogDto>();

  hasFailed$ = this.getUserRoleAuditLogsQuery.valueChanges.pipe(
    map((result) => !!result.error),
    catchError(() => of(true))
  );

  isLoading$ = this.getUserRoleAuditLogsQuery.valueChanges.pipe(
    tap((result) => (this.dataSource.data = [...(result.data?.userRoleAuditLogs ?? [])].reverse())),
    map((result) => result.loading),
    catchError(() => of(false))
  );

  columns: WattTableColumnDef<UserRoleAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  @Input({ required: true }) role!: DhUserRoleWithPermissions;

  ngOnChanges(): void {
    this.getUserRoleAuditLogsQuery?.refetch({ id: this.role?.id });
  }
}
