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
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { GetSettlementReportsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDataTableComponent, WattDataActionsComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhSettlementReport } from '@energinet-datahub/dh/shared/domain';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-reports';

import { DhNewReportRequest } from './new-report-request.component';
import { DhReportStatus } from './report-status.component';
import { DhDetails } from './details/details.component';
import { DhCancelReportRequest } from './overview/cancel-report-request.component';

@Component({
  selector: 'dh-settlement-reports',
  imports: [
    TranslocoDirective,
    VaterUtilityDirective,
    WattDataTableComponent,
    WattDataActionsComponent,
    WATT_TABLE,
    WattDatePipe,
    DhNewReportRequest,
    DhReportStatus,
    DhDetails,
    DhCancelReportRequest,
  ],
  providers: [DhSettlementReportsService],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-data-table
      *transloco="let t; read: 'reports.settlementReports'"
      vater
      inset="ml"
      [error]="hasError()"
      [ready]="!isLoading()"
      [count]="totalCount()"
      [enableSearch]="false"
    >
      <h3>{{ t('title') }}</h3>

      <watt-data-actions>
        <dh-new-report-request />
      </watt-data-actions>

      <watt-table
        [dataSource]="tableDataSource"
        [columns]="columns"
        [displayedColumns]="displayedColumns"
        [loading]="isLoading()"
        [activeRow]="activeRow()"
        (rowClick)="onRowClick($event)"
      >
        <ng-container
          *wattTableCell="columns['startedAt']; header: t('columns.startedAt'); let entry"
        >
          {{ entry.executionTime.start | wattDate: 'long' }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['actorName']; header: t('columns.actorName'); let entry"
        >
          {{ entry.actor?.name }}
        </ng-container>

        <ng-container
          *wattTableCell="
            columns['calculationType'];
            header: t('columns.calculationType');
            let entry
          "
        >
          {{ t('calculationTypes.' + entry.calculationType) }}
        </ng-container>

        <ng-container *wattTableCell="columns['period']; header: t('columns.period'); let entry">
          {{ entry.period | wattDate: 'short' }}
        </ng-container>

        <ng-container
          *wattTableCell="
            columns['numberOfGridAreasInReport'];
            header: t('columns.numberOfGridAreasInReport');
            let entry
          "
        >
          @let gridAreas = entry.gridAreas;

          @if (gridAreas.length > 0) {
            @if (gridAreas.length < 4) {
              {{ gridAreas.join(', ') }}
            } @else {
              {{
                t('itemsAndCount', {
                  items: gridAreas.slice(0, 2).join(', '),
                  remainingCount: gridAreas.length - 2,
                })
              }}
            }
          } @else {
            @if (entry.numberOfGridAreasInReport > 0) {
              [{{ entry.numberOfGridAreasInReport }}]
            } @else {
              {{ t('noData') }}
            }
          }
        </ng-container>

        <ng-container *wattTableCell="columns['status']; header: t('columns.status'); let entry">
          @let reportIsEmpty = entry.statusType === 'COMPLETED' && entry.gridAreas.length === 0;

          @if (reportIsEmpty === false) {
            <dh-report-status
              [status]="entry.statusType"
              (download)="downloadReport($event, entry)"
            />
          }
        </ng-container>
        <ng-container *wattTableCell="columns['cancel']; header: ''; let entry">
          @if (entry.statusType === 'IN_PROGRESS') {
            <dh-cancel-report-request [reportId]="entry.id" />
          }
        </ng-container>
      </watt-table>
    </watt-data-table>

    <dh-details
      #reportDetails
      (closed)="activeRow.set(undefined)"
      (download)="downloadReport($event, activeRow()!)"
    />
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhSettlementReports {
  private readonly permissionService = inject(PermissionService);
  private readonly settlementReportsService = inject(DhSettlementReportsService);

  private readonly settlementReportsQuery = query(GetSettlementReportsDocument, {
    fetchPolicy: 'network-only',
  });

  settlementReports = computed(() => this.settlementReportsQuery.data()?.settlementReports ?? []);
  totalCount = computed(() => this.settlementReports().length);
  isLoading = this.settlementReportsQuery.loading;
  hasError = this.settlementReportsQuery.hasError;

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

  activeRow = signal<DhSettlementReport | undefined>(undefined);

  reportDetails = viewChild.required(DhDetails);

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
    this.reportDetails().open(settlementReport);
  }

  downloadReport(event: Event, settlementReport: DhSettlementReport): void {
    // Stop the row click event from propagating
    // so the drawer doesn't open
    event.stopPropagation();

    this.settlementReportsService.downloadReport(settlementReport);
  }
}
