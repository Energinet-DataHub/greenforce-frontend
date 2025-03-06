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
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';

import {
  GetAuditLogByOrganizationIdDocument,
  OrganizationAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-organization-history',
  template: ` <dh-result
    *transloco="let t; read: 'marketParticipant.organizationsOverview.drawer'"
    [loading]="isLoading()"
    [hasError]="hasError()"
    [empty]="auditLog.data.length === 0"
  >
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
          @if (entry.change === 'DOMAIN') {
            @if (entry.currentValue) {
              <div
                [innerHTML]="t('tabs.history.changeTypes.' + entry.change + '_ADDED', entry)"
              ></div>
            } @else if (entry.previousValue) {
              <div
                [innerHTML]="t('tabs.history.changeTypes.' + entry.change + '_REMOVED', entry)"
              ></div>
            }
          } @else {
            <div [innerHTML]="t('tabs.history.changeTypes.' + entry.change, entry)"></div>
          }
        </ng-container>
      </watt-table>
    </watt-card>
  </dh-result>`,
  imports: [TranslocoDirective, WATT_TABLE, WATT_CARD, WattDatePipe, DhResultComponent],
})
export class DhOrganizationHistoryComponent {
  private query = query(GetAuditLogByOrganizationIdDocument, () => ({
    variables: { organizationId: this.organizationId() },
  }));

  organizationId = input.required<string>();

  isLoading = this.query.loading;
  hasError = this.query.hasError;

  auditLog = new WattTableDataSource<OrganizationAuditedChangeAuditLogDto>([]);

  auditLogColumns: WattTableColumnDef<OrganizationAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: null },
  };

  constructor() {
    effect(() => {
      this.auditLog.data = this.query.data()?.organizationById.auditLogs ?? [];
    });
  }
}
