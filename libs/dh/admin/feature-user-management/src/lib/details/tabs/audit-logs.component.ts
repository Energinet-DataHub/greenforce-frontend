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
import { Component, effect, input } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetUserAuditLogsDocument,
  UserAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-user-audit-logs',
  templateUrl: './audit-logs.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .no-results-text {
        text-align: center;
      }
    `,
  ],
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    WATT_CARD,
    WATT_TABLE,
    WattDatePipe,
    WattEmptyStateComponent,
  ],
})
export class DhUserAuditLogsComponent {
  private getUserAuditLogsQuery = lazyQuery(GetUserAuditLogsDocument);

  id = input.required<string>();

  dataSource = new WattTableDataSource<UserAuditedChangeAuditLogDto>();
  hasError = this.getUserAuditLogsQuery.hasError;
  isLoading = this.getUserAuditLogsQuery.loading;

  columns: WattTableColumnDef<UserAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  constructor() {
    effect(() => {
      this.getUserAuditLogsQuery.query({ variables: { userId: this.id() } });
    });

    effect(() => {
      this.dataSource.data = structuredClone(
        this.getUserAuditLogsQuery.data()?.userById.auditLogs || []
      ).reverse();
    });
  }
}
