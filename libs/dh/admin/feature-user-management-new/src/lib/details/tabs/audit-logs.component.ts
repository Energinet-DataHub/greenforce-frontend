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
  standalone: true,
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
      this.getUserAuditLogsQuery.query({ variables: { id: this.id() } });
    });

    effect(() => {
      this.dataSource.data = structuredClone(
        this.getUserAuditLogsQuery.data()?.userAuditLogs || []
      ).reverse();
    });
  }
}
