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
import { Component, effect, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import {
  GetGridAreaAuditLogDocument,
  GridAreaAuditedChangeAuditLogDto,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-audit-log',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
        margin: var(--watt-space-ml);
      }
    `,
  ],
  template: `<ng-container
    *transloco="let t; read: 'marketParticipant.organizationsOverview.drawer'"
  >
    @if (isLoading()) {
      <vater-stack fill="horizontal" align="center">
        <watt-spinner />
      </vater-stack>
    } @else {
      @if (dataSource.data.length > 0) {
        <watt-card variant="solid">
          <watt-table
            [dataSource]="dataSource"
            [columns]="columns"
            [hideColumnHeaders]="true"
            [suppressRowHoverHighlight]="true"
            sortBy="timestamp"
            sortDirection="desc"
          >
            <ng-container *wattTableCell="columns['timestamp']; let element">
              {{ element.timestamp | wattDate: 'long' }}
            </ng-container>

            <ng-container *wattTableCell="columns['value']; let entry">
              {{ null | dhEmDashFallback }}
            </ng-container>
          </watt-table>
        </watt-card>
      } @else {
        <watt-empty-state
          size="small"
          [icon]="hasError() ? 'custom-power' : 'cancel'"
          [title]="hasError() ? t('tabs.shared.error') : t('tabs.shared.noData')"
        />
      }
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
    DhEmDashFallbackPipe,
  ],
})
export class DhAuditLogComponent {
  private auditLogQuery = lazyQuery(GetGridAreaAuditLogDocument);

  gridAreaId = input<string>();

  isLoading = this.auditLogQuery.loading;
  hasError = this.auditLogQuery.hasError;

  dataSource = new WattTableDataSource<GridAreaAuditedChangeAuditLogDto>([]);

  columns: WattTableColumnDef<GridAreaAuditedChangeAuditLogDto> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: null, size: '1fr' },
  };

  constructor() {
    effect(() => {
      const gridAreaId = this.gridAreaId();

      if (gridAreaId) {
        this.auditLogQuery.query({
          variables: { gridAreaId },
        });
      }
    });

    effect(() => {
      this.dataSource.data = this.auditLogQuery.data()?.gridAreaAuditLogs ?? [];
    });
  }
}
