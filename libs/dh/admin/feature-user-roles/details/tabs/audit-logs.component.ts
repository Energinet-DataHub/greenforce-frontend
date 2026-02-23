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
import { Component, computed, input } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WattTableCellDirective,
} from '@energinet/watt/table';

import { WattDatePipe } from '@energinet/watt/date';
import { WattDataTableComponent } from '@energinet/watt/data';
import { VaterUtilityDirective } from '@energinet/watt/vater';

import {
  GetUserRoleAuditLogsDocument,
  UserRoleAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-role-audit-logs',
  templateUrl: './audit-logs.component.html',
  imports: [
    TranslocoDirective,
    WattDatePipe,
    WattTableComponent,
    WattTableCellDirective,
    WattDataTableComponent,
    VaterUtilityDirective,
  ],
})
export class DhRoleAuditLogsComponent {
  private getUserRoleAuditLogsQuery = query(GetUserRoleAuditLogsDocument, () => ({
    variables: { id: this.id() },
  }));

  id = input.required<string>();

  dataSource = computed(
    () =>
      new WattTableDataSource<UserRoleAuditedChangeAuditLogDto>(
        this.getUserRoleAuditLogsQuery.data()?.userRoleById.auditLogs || []
      )
  );
  hasError = this.getUserRoleAuditLogsQuery.hasError;
  isLoading = this.getUserRoleAuditLogsQuery.loading;
  ready = this.getUserRoleAuditLogsQuery.called;

  columns: WattTableColumnDef<UserRoleAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };
}
