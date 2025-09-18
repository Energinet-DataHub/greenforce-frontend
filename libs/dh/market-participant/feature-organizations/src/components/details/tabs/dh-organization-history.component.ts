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
import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WattTableCellDirective,
} from '@energinet-datahub/watt/table';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';

import { query } from '@energinet-datahub/dh/shared/util-apollo';

import {
  GetAuditLogByOrganizationIdDocument,
  OrganizationAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-organization-history',
  template: `
    <watt-data-table
      vater
      inset="0"
      variant="solid"
      *transloco="let t; read: 'marketParticipant.organizationsOverview.drawer'"
      [enableSearch]="false"
      [enablePaginator]="false"
      [enableCount]="false"
      [error]="hasError()"
      [ready]="ready()"
    >
      <watt-table
        [columns]="columns"
        [dataSource]="dataSource()"
        sortBy="timestamp"
        [loading]="isLoading()"
        sortDirection="desc"
        [sortClear]="false"
        [hideColumnHeaders]="true"
        [suppressRowHoverHighlight]="true"
      >
        <ng-container *wattTableCell="columns.timestamp; let element">
          {{ element.timestamp | wattDate: 'long' }}
        </ng-container>
        <ng-container *wattTableCell="columns.value; let entry">
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
    </watt-data-table>
  `,
  imports: [
    TranslocoDirective,
    WattDatePipe,
    WattTableComponent,
    WattTableCellDirective,
    WattDataTableComponent,
    VaterUtilityDirective,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhOrganizationHistoryComponent {
  private query = query(GetAuditLogByOrganizationIdDocument, () => ({
    variables: { organizationId: this.organizationId() },
  }));

  organizationId = input.required<string>();

  dataSource = computed(
    () =>
      new WattTableDataSource<OrganizationAuditedChangeAuditLogDto>(
        this.query.data()?.organizationById.auditLogs || []
      )
  );
  hasError = this.query.hasError;
  isLoading = this.query.loading;
  ready = this.query.called;

  columns: WattTableColumnDef<OrganizationAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: null },
  };
}
