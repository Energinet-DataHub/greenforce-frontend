import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, effect, inject, input, signal } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhSettlementReport, DhSettlementReports } from '@energinet-datahub/dh/shared/domain';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-settlement-reports';

import { DhSettlementReportsStatusComponent } from '../util/dh-settlement-reports-status.component';
import { DhSettlementReportDrawerComponent } from '../drawer/dh-settlement-report-drawer.component';
import { DhSettlementReportsCancelButtonComponent } from '../button/dh-settlement-reports-cancel-button.component';

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

    WATT_TABLE,
    WattDatePipe,

    VaterFlexComponent,

    DhSettlementReportsStatusComponent,
    DhSettlementReportDrawerComponent,
    DhSettlementReportsCancelButtonComponent,
  ],
  providers: [DhSettlementReportsService],
})
export class DhSettlementReportsTableComponent {
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
