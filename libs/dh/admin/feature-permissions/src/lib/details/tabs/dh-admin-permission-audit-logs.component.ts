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
import { Component, Input, inject, OnChanges } from '@angular/core';
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
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import {
  GetPermissionAuditLogsDocument,
  PermissionAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

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
    RxLet,
    RxPush,
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
export class DhPermissionAuditLogsComponent implements OnChanges {
  private readonly apollo = inject(Apollo);
  private readonly getPermissionAuditLogsQuery = this.apollo.watchQuery({
    query: GetPermissionAuditLogsDocument,
    fetchPolicy: 'cache-and-network',
  });

  dataSource = new WattTableDataSource<PermissionAuditedChangeAuditLogDto>();

  hasFailed$ = this.getPermissionAuditLogsQuery.valueChanges.pipe(
    map((result) => !!result.error),
    catchError(() => of(true))
  );

  isLoading$ = this.getPermissionAuditLogsQuery.valueChanges.pipe(
    tap(
      (result) => (this.dataSource.data = [...(result.data?.permissionAuditLogs ?? [])].reverse())
    ),
    map((result) => result.loading),
    catchError(() => of(false))
  );

  columns: WattTableColumnDef<PermissionAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  @Input({ required: true }) selectedPermission!: PermissionDto;

  ngOnChanges(): void {
    this.getPermissionAuditLogsQuery?.refetch({ id: this.selectedPermission?.id });
  }
}
