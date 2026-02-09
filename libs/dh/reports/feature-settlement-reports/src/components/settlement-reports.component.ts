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
import { Component, computed, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WATT_CARD } from '@energinet/watt/card';
import { WattDataActionsComponent, WattDataTableComponent } from '@energinet/watt/data';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetSettlementReportsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhSettlementReport } from '@energinet-datahub/dh/shared/domain';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-reports';

import { DhDetails } from './details/details.component';
import { DhNewReportRequest } from './new-report-request.component';
import { WattDatePipe } from '@energinet/watt/core/date';
import { DhReportStatus } from './report-status.component';
import { DhCancelReportRequest } from './cancel-report-request.component';

@Component({
  selector: 'dh-settlement-reports',
  providers: [DhSettlementReportsService],
  imports: [
    TranslocoDirective,
    VATER,
    WATT_CARD,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDatePipe,
    DhCancelReportRequest,
    DhDetails,
    DhNewReportRequest,
    DhReportStatus,
  ],
  template: `
    @if (activeRow(); as report) {
      <dh-details
        #reportDetails
        [report]="report"
        (closed)="activeRow.set(undefined)"
        (download)="settlementReportsService.downloadReport($event)"
      />
    }
    <watt-data-table
      [enableCount]="false"
      [enableSearch]="false"
      [error]="settlementReports.error()"
      *transloco="let t; prefix: 'reports.settlementReports'"
    >
      <watt-data-actions>
        <dh-new-report-request />
      </watt-data-actions>
      <watt-table
        *transloco="let resolveHeader; prefix: 'reports.settlementReports.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [displayedColumns]="displayedColumns()"
        [resolveHeader]="resolveHeader"
        [activeRow]="activeRow()"
        [loading]="settlementReports.loading()"
        (rowClick)="activeRow.set($event)"
      >
        <ng-container *wattTableCell="columns['startedAt']; let entry">
          {{ entry.executionTime.start | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns['actorName']; let entry">
          {{ entry.actor?.name }}
        </ng-container>

        <ng-container *wattTableCell="columns['calculationType']; let entry">
          {{ t('calculationTypes.' + entry.calculationType) }}
        </ng-container>

        <ng-container *wattTableCell="columns['period']; let entry">
          {{ entry.period | wattDate: 'short' }}
        </ng-container>

        <ng-container *wattTableCell="columns['numberOfGridAreasInReport']; let entry">
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

        <ng-container *wattTableCell="columns['status']; let entry">
          @let reportIsEmpty = entry.statusType === 'COMPLETED' && entry.gridAreas.length === 0;
          @if (reportIsEmpty === false) {
            <dh-report-status
              [status]="entry.statusType"
              (download)="settlementReportsService.downloadReport(entry)"
              (click)="$event.stopPropagation()"
            />
          }
        </ng-container>

        <ng-container *wattTableCell="columns['cancel']; let entry">
          @if (entry.statusType === 'IN_PROGRESS') {
            <dh-cancel-report-request [reportId]="entry.id" (click)="$event.stopPropagation()" />
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhSettlementReports {
  private permissionService = inject(PermissionService);
  protected settlementReportsService = inject(DhSettlementReportsService);

  settlementReports = query(GetSettlementReportsDocument, { fetchPolicy: 'network-only' });
  dataSource = dataSource(() => this.settlementReports.data()?.settlementReports ?? []);
  activeRow = model<DhSettlementReport>();
  columns: WattTableColumnDef<DhSettlementReport> = {
    startedAt: { accessor: (report) => report.executionTime.start },
    actorName: { accessor: (report) => report.actor?.name },
    calculationType: { accessor: 'calculationType' },
    period: { accessor: (report) => report.period.start },
    numberOfGridAreasInReport: { accessor: 'numberOfGridAreasInReport' },
    status: { accessor: 'statusType' },
    cancel: { accessor: 'id', header: '' },
  };

  isFas = toSignal(this.permissionService.isFas());
  displayedColumns = computed(() =>
    this.isFas()
      ? Object.keys(this.columns)
      : Object.keys(this.columns).filter((column) => column !== 'actorName')
  );
}
