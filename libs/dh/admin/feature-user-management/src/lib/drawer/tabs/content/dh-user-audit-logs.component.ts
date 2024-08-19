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
import { NgTemplateOutlet } from '@angular/common';
import { Component, OnChanges, inject, input } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { catchError, map, of, tap } from 'rxjs';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetUserAuditLogsDocument,
  UserAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhUser } from '@energinet-datahub/dh/admin/shared';

@Component({
  selector: 'dh-user-audit-logs',
  standalone: true,
  templateUrl: './dh-user-audit-logs.component.html',
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
    TranslocoPipe,
    NgTemplateOutlet,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattDatePipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
  ],
})
export class DhUserAuditLogsComponent implements OnChanges {
  private readonly apollo = inject(Apollo);
  private readonly getUserAuditLogsQuery = this.apollo.watchQuery({
    query: GetUserAuditLogsDocument,
    fetchPolicy: 'cache-and-network',
  });

  readonly dataSource = new WattTableDataSource<UserAuditedChangeAuditLogDto>();

  hasFailed$ = this.getUserAuditLogsQuery.valueChanges.pipe(
    map((result) => !!result.error),
    catchError(() => of(true))
  );

  isLoading$ = this.getUserAuditLogsQuery.valueChanges.pipe(
    tap((result) => (this.dataSource.data = [...(result.data?.userAuditLogs ?? [])].reverse())),
    map((result) => result.loading),
    catchError(() => of(false))
  );

  columns: WattTableColumnDef<UserAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  user = input.required<DhUser>();

  ngOnChanges(): void {
    this.getUserAuditLogsQuery?.refetch({ id: this.user().id });
  }
}
