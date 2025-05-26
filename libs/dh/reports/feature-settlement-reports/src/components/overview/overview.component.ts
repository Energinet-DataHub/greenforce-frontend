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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, effect, inject, input, signal } from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhSettlementReport, DhSettlementReports } from '@energinet-datahub/dh/shared/domain';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-reports';

import { DhReportStatus } from '../report-status.component';
import { DhDetails } from '../details/details.component';
import { DhCancelReportRequest } from './cancel-report-request.component';

@Component({
  selector: 'dh-overview',
  templateUrl: './overview.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    WATT_TABLE,
    WattDatePipe,
    VaterFlexComponent,
    DhReportStatus,
    DhDetails,
    DhCancelReportRequest,
  ],
  providers: [DhSettlementReportsService],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhOverview {
  private permissionService = inject(PermissionService);
  private settlementReporsService = inject(DhSettlementReportsService);

  columns: WattTableColumnDef<DhSettlementReport> = {
    startedAt: { accessor: (report) => report.executionTime.start },
    actorName: { accessor: (report) => report.actor?.name },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: (report) => report.period.start },
    numberOfGridAreasInReport: { accessor: 'numberOfGridAreasInReport' },
    status: { accessor: 'statusType' },
    cancel: { accessor: 'id' },
  };

  displayedColumns = Object.keys(this.columns);

  tableDataSource = new WattTableDataSource<DhSettlementReport>([]);

  settlementReports = input.required<DhSettlementReports>();

  activeRow = signal<DhSettlementReport | undefined>(undefined);

  constructor() {
    this.permissionService
      .isFas()
      .pipe(takeUntilDestroyed())
      .subscribe((isFas) => {
        this.displayedColumns = isFas
          ? this.displayedColumns
          : this.displayedColumns.filter((column) => column !== 'actorName');
      });

    effect(() => (this.tableDataSource.data = this.settlementReports()));
  }

  onRowClick(settlementReport: DhSettlementReport): void {
    this.activeRow.set(settlementReport);
  }

  downloadReport(event: Event, settlementReport: DhSettlementReport): void {
    // Stop the row click event from propagating
    // so the drawer doesn't open
    event.stopPropagation();

    this.settlementReporsService.downloadReport(settlementReport);
  }
}
