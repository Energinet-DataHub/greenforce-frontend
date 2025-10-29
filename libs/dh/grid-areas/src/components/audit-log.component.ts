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
} from '@energinet/watt/table';

import { WattDatePipe } from '@energinet/watt/date';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDataTableComponent } from '@energinet/watt/data';

import { GridAreaAuditedChange } from '@energinet-datahub/dh/shared/domain/graphql';

import { GridArea } from './details.component';

type AuditLog = NonNullable<GridArea['auditLog']>[0];

@Component({
  selector: 'dh-audit-log',
  styles: [
    `
      :host {
        display: block;
        position: relative;
        height: 100%;
      }
    `,
  ],
  template: `
    <watt-data-table
      vater
      inset="0"
      variant="solid"
      *transloco="let t; prefix: 'marketParticipant.gridAreas.history'"
      [enableSearch]="false"
      [enablePaginator]="false"
      [enableCount]="false"
    >
      <watt-table
        [columns]="columns"
        [dataSource]="dataSource()"
        sortBy="timestamp"
        sortDirection="desc"
        [sortClear]="false"
        [hideColumnHeaders]="true"
        [suppressRowHoverHighlight]="true"
      >
        <ng-container *wattTableCell="columns.timestamp; let element">
          {{ element.timestamp | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns.value; let entry">
          @if (entry.change === 'CONSOLIDATION_REQUESTED') {
            <div
              [innerHTML]="
                t('changeTypes.CONSOLIDATION_REQUESTED', {
                  auditedBy: entry.auditedBy,
                  previousOwner: entry.previousOwner,
                  currentOwner: entry.currentOwner,
                  gridArea: this.gridArea()?.code,
                  gridAreaStopsAt: entry.consolidatedAt | wattDate,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhGridAreaAuditLogComponent {
  gridArea = input<GridArea>();

  auditLogs = computed(() => this.gridArea()?.auditLog ?? []);

  dataSource = computed(
    () =>
      new WattTableDataSource<AuditLog>(
        this.auditLogs().filter((x) => x.change !== GridAreaAuditedChange.Name)
      )
  );

  columns: WattTableColumnDef<AuditLog> = {
    timestamp: { accessor: 'timestamp' },
    value: { accessor: null, size: '1fr' },
  };
}
