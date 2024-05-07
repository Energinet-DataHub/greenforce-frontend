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
import { Component, effect, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhSettlementReport, DhSettlementReports } from '../dh-settlement-report';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-settlement-reports-table',
  standalone: true,
  templateUrl: './dh-settlement-reports-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterFlexComponent,
    VaterStackComponent,
  ],
})
export class DhSettlementReportsTableComponent {
  private readonly permissionService = inject(PermissionService);
  columns: WattTableColumnDef<DhSettlementReport> = {
    actorName: { accessor: 'actor' },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: 'period' },
    gridAreas: { accessor: 'gridAreas' },
    includesBaseData: { accessor: 'includesBaseData' },
    status: { accessor: 'statusType' },
  };

  displayedColumns = Object.keys(this.columns);

  tableDataSource = new WattTableDataSource<DhSettlementReport>([]);

  settlementReports = input.required<DhSettlementReports>();

  constructor() {
    effect(() => {
      this.permissionService.isFas().subscribe((isFas) => {
        this.displayedColumns = isFas
          ? this.displayedColumns
          : this.displayedColumns.filter((column) => column !== 'actorName');
      });

      this.tableDataSource.data = this.settlementReports();
    });
  }
}
