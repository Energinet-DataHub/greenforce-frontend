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

import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import {
  GetAuditLogByOrganizationIdDocument,
  OrganizationAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-organization-history',
  standalone: true,
  template: ` <ng-container
    *transloco="let t; read: 'marketParticipant.organizationsOverview.drawer'"
  >
    @if (isLoading()) {
      <vater-stack fill="horizontal" align="center">
        <watt-spinner />
      </vater-stack>
    }

    @if (!isLoading() && auditLog.data.length === 0) {
      <watt-empty-state
        [icon]="hasError() ? 'custom-power' : 'cancel'"
        size="small"
        [title]="hasError() ? t('tabs.shared.error') : t('tabs.shared.noData')"
      />
    }
    @if (auditLog.data.length > 0 && !isLoading()) {
      <watt-card variant="solid">
        <watt-table
          [dataSource]="auditLog"
          [columns]="auditLogColumns"
          [hideColumnHeaders]="true"
          [suppressRowHoverHighlight]="true"
          sortBy="timestamp"
          sortDirection="desc"
        >
          <ng-container *wattTableCell="auditLogColumns['timestamp']; let element">
            {{ element.timestamp | wattDate: 'long' }}
          </ng-container>
          <ng-container *wattTableCell="auditLogColumns['value']; let entry">
            <div [innerHTML]="t('tabs.history.changeTypes.' + entry.change, entry)"></div>
          </ng-container>
        </watt-table>
      </watt-card>
    }
  </ng-container>`,
  imports: [
    TranslocoDirective,

    VaterStackComponent,

    WATT_TABLE,
    WATT_CARD,
    WattDatePipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
  ],
})
export class DhOrganizationHistoryComponent {
  private getAuditLogByOrganizationIdQuery = lazyQuery(GetAuditLogByOrganizationIdDocument);

  organizationId = input<string>();

  isLoading = this.getAuditLogByOrganizationIdQuery.loading;
  hasError = computed(() => this.getAuditLogByOrganizationIdQuery.error !== undefined);

  auditLog: WattTableDataSource<OrganizationAuditedChangeAuditLogDto> =
    new WattTableDataSource<OrganizationAuditedChangeAuditLogDto>([]);

  auditLogColumns: WattTableColumnDef<OrganizationAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: null },
  };

  constructor() {
    effect(() => {
      const organizationId = this.organizationId();
      if (organizationId) {
        this.getAuditLogByOrganizationIdQuery.query({
          variables: { organizationId },
        });
      }
    });

    effect(() => {
      this.auditLog.data =
        this.getAuditLogByOrganizationIdQuery.data()?.organizationAuditLogs ?? [];
    });
  }
}
