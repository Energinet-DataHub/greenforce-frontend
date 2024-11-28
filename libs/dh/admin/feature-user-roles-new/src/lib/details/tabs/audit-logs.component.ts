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
import { Component, computed, effect, input } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetUserRoleAuditLogsDocument,
  UserRoleAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-role-audit-logs',
  standalone: true,
  templateUrl: './audit-logs.component.html',
  styles: [
    `
      h4 {
        margin: 0;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WATT_TABLE,
    WattDatePipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,

    VaterFlexComponent,
  ],
})
export class DhRoleAuditLogsComponent {
  private auditLogsQuery = lazyQuery(GetUserRoleAuditLogsDocument);
  private auditLogs = computed(() => this.auditLogsQuery.data()?.userRoleAuditLogs ?? []);

  isLoading = this.auditLogsQuery.loading;
  hasError = this.auditLogsQuery.hasError;

  dataSource = new WattTableDataSource<UserRoleAuditedChangeAuditLogDto>();

  columns: WattTableColumnDef<UserRoleAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  id = input.required<string>();

  constructor() {
    effect(() => {
      this.auditLogsQuery.query({ variables: { id: this.id() } });
    });

    effect(() => {
      this.dataSource.data = [...this.auditLogs()].reverse();
    });
  }
}
