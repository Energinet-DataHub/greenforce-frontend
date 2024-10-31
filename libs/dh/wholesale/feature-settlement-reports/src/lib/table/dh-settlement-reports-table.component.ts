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
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { AddTokenToDownloadUrlDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDurationComponent } from '../util/dh-duration.component';
import { DhSettlementReport, DhSettlementReports } from '../dh-settlement-report';
import { DhSettlementReportsStatusComponent } from '../util/dh-settlement-reports-status.component';
import { DhSettlementReportDrawerComponent } from '../drawer/dh-settlement-report-drawer.component';

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
    WattDatePipe,
    WattEmptyStateComponent,

    VaterFlexComponent,
    VaterStackComponent,

    DhSettlementReportsStatusComponent,
    DhSettlementReportDrawerComponent,
    DhDurationComponent,
  ],
})
export class DhSettlementReportsTableComponent {
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  private permissionService = inject(PermissionService);
  private httpClient = inject(HttpClient);
  private toastService = inject(WattToastService);

  columns: WattTableColumnDef<DhSettlementReport> = {
    startedAt: { accessor: (report) => report.executionTime.start },
    actorName: { accessor: (report) => report.actor?.name },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: (report) => report.period.start },
    numberOfGridAreasInReport: { accessor: 'numberOfGridAreasInReport' },
    status: { accessor: 'statusType' },
  };

  displayedColumns = Object.keys(this.columns);

  addTokenToDownloadUrlMutation = mutation(AddTokenToDownloadUrlDocument);

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
    // this.activeRow.set(settlementReport);
    this.router.navigate([settlementReport.id], { relativeTo: this.activeRoute });
  }

  async downloadReport(event: Event, settlementReport: DhSettlementReport) {
    let { settlementReportDownloadUrl } = settlementReport;

    // Prevent the row click event from firing
    // so the drawer doesn't open
    event.stopPropagation();

    if (!settlementReportDownloadUrl) {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });

      return;
    }

    settlementReportDownloadUrl = `${settlementReportDownloadUrl}&filename=${this.settlementReportName(settlementReport)}`;

    const result = await this.addTokenToDownloadUrlMutation.mutate({
      variables: { url: settlementReportDownloadUrl },
    });

    const downloadUrl = result.data?.addTokenToDownloadUrl.downloadUrlWithToken;

    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.click();
      link.remove();
    }
  }

  private settlementReportName(report: DhSettlementReport): string {
    const baseTranslationPath = 'wholesale.settlementReports';

    const calculationPeriod = wattFormatDate(report.period, 'short');
    const calculationType = translate(
      `${baseTranslationPath}.calculationTypes.${report.calculationType}`
    );

    let name = translate(`${baseTranslationPath}.downloadReport.baseName`);
    name += ` - ${calculationType}`;

    if (report.gridAreas.length === 1) {
      name += ` - ` + report.gridAreas[0];
    } else if (report.gridAreas.length > 1) {
      name += ` - ` + translate(`${baseTranslationPath}.downloadReport.multipleGridAreas`);
    }

    return `${name} - ${calculationPeriod}.zip`;
  }
}
