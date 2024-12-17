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

import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { GridAreaAuditedChange } from '@energinet-datahub/dh/shared/domain/graphql';

import { GridArea } from './details.component';

type AuditLog = NonNullable<GridArea['auditLog']>[0];

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
  imports: [TranslocoDirective, WATT_TABLE, WATT_CARD, WattDatePipe, DhResultComponent],
  template: `<dh-result
    [empty]="dataSource.data.length === 0"
    *transloco="let t; read: 'marketParticipant.gridAreas.history'"
  >
    <h4 dh-result-empty-title>{{ t('emptyTitle') }}</h4>

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
          @if (entry.change === 'CONSOLIDATION_REQUESTED') {
            <div
              [innerHTML]="
                t('changeTypes.CONSOLIDATION_REQUESTED', {
                  auditedBy: entry.auditedBy,
                  previousOwner: entry.previousOwner,
                  currentOwner: entry.currentOwner,
                  gridArea: this.gridArea()?.code,
                  gridAreaStopsAt: this.gridArea()?.validTo | wattDate,
                })
              "
            ></div>
          } @else if (entry.change === 'CONSOLIDATION_COMPLETED') {
            <div
              [innerHTML]="
                t('changeTypes.CONSOLIDATION_COMPLETED', {
                  previousOwner: entry.previousOwner,
                })
              "
            ></div>
          } @else if (entry.change === 'DECOMMISSIONED') {
            <div
              [innerHTML]="
                t('changeTypes.DECOMMISSIONED', {
                  gridArea: this.gridArea()?.code,
                })
              "
            ></div>
          }
        </ng-container>
      </watt-table>
    </watt-card>
  </dh-result>`,
})
export class DhAuditLogComponent {
  gridArea = input<GridArea>();

  dataSource = new WattTableDataSource<AuditLog>([]);

  columns: WattTableColumnDef<AuditLog> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: null, size: '1fr' },
  };

  constructor() {
    effect(() => {
      const gridArea = this.gridArea();

      if (gridArea) {
        this.dataSource.data =
          gridArea.auditLog.filter((x) => x.change !== GridAreaAuditedChange.Name) ?? [];
      }
    });
  }
}
