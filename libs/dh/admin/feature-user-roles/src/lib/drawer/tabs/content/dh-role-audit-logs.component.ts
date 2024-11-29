import { Component, computed, effect, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  GetUserRoleAuditLogsDocument,
  UserRoleAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhUserRoleWithPermissions } from '@energinet-datahub/dh/admin/data-access-api';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

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
export class DhRoleAuditLogsComponent {
  private readonly auditLogsQuery = lazyQuery(GetUserRoleAuditLogsDocument, {
    fetchPolicy: 'cache-and-network',
  });
  private readonly auditLogs = computed(() => this.auditLogsQuery.data()?.userRoleAuditLogs ?? []);

  isLoading = this.auditLogsQuery.loading;
  hasFailed = computed(() => this.auditLogsQuery.error() !== undefined);

  dataSource = new WattTableDataSource<UserRoleAuditedChangeAuditLogDto>();

  columns: WattTableColumnDef<UserRoleAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  role = input.required<DhUserRoleWithPermissions>();

  refetchQueryEffect = effect(() => {
    this.auditLogsQuery.refetch({ id: this.role()?.id });
  });

  updateDataEffect = effect(() => {
    this.dataSource.data = [...this.auditLogs()].reverse();
  });
}
