import { NgTemplateOutlet } from '@angular/common';
import { Component, input, computed, effect } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  GetPermissionAuditLogsDocument,
  PermissionAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-admin-permission-audit-logs',
  standalone: true,
  templateUrl: './dh-admin-permission-audit-logs.component.html',
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    NgTemplateOutlet,

    VaterFlexComponent,

    WATT_CARD,
    WATT_TABLE,
    WattDatePipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
  ],
})
export class DhPermissionAuditLogsComponent {
  private readonly getPermissionAuditLogsQuery = lazyQuery(GetPermissionAuditLogsDocument, {
    fetchPolicy: 'cache-and-network',
  });
  private readonly auditLogs = computed(() => {
    return this.getPermissionAuditLogsQuery.data()?.permissionAuditLogs ?? [];
  });

  isLoading = this.getPermissionAuditLogsQuery.loading;
  hasError = this.getPermissionAuditLogsQuery.hasError;

  dataSource = new WattTableDataSource<PermissionAuditedChangeAuditLogDto>();

  columns: WattTableColumnDef<PermissionAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    entry: { accessor: null },
  };

  selectedPermission = input.required<PermissionDto>();

  constructor() {
    effect(() => {
      this.dataSource.data = [...this.auditLogs()].reverse();
    });

    effect(() => {
      this.getPermissionAuditLogsQuery.refetch({ id: this.selectedPermission().id });
    });
  }
}
