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
import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattDataTableComponent,
  WattDataActionsComponent,
} from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeasurementsReportsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhMeasurementsReportsService } from '@energinet-datahub/dh/shared/util-reports';
import { DhMeasurementsReport } from '@energinet-datahub/dh/shared/domain';

import { DhNewReportRequest } from './new-report-request.component';
import { DhReportStatus } from './report-status.component';

@Component({
  selector: 'dh-measurements-reports',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    VaterUtilityDirective,
    DhNewReportRequest,
    WattDataTableComponent,
    WattDataActionsComponent,
    WATT_TABLE,
    WattDatePipe,
    DhReportStatus,
  ],
  providers: [DhMeasurementsReportsService],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-data-table
      *transloco="let t; read: 'reports.measurementsReports'"
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
        [dataSource]="dataSource" 
        [columns]="columns" 
        [displayedColumns]="displayedColumns()"
        [loading]="isLoading()"
      >
        <ng-container *wattTableCell="columns['startedAt']; header: t('columns.startedAt'); let entry">
          {{ entry.createdDateTime | wattDate: "long" }}
        </ng-container>

        <ng-container *wattTableCell="columns['actorName']; header: t('columns.actorName'); let entry">
          {{ entry.actor?.name }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['meteringPoints']; header: t('columns.meteringPoints'); let entry"
        >
          @let meteringPointTypes = entry.meteringPointTypes;

          @if (meteringPointTypes.length < 4) {
            @for (meteringPointType of meteringPointTypes; let last = $last; track $index) {
              @if (last) {
                {{ "meteringPointType." + meteringPointType | transloco }}
              } @else {
                {{ "meteringPointType." + meteringPointType | transloco }},
              }
            }
          } @else {
            @let first = "meteringPointType." + meteringPointTypes[0] | transloco;
            @let second = "meteringPointType." + meteringPointTypes[1] | transloco;

            {{
              t("itemsAndCount", {
                items: first + ", " + second,
                remainingCount: meteringPointTypes.length - 2,
              })
            }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns['gridAreas']; header: t('columns.gridAreas'); let entry">
          @let gridAreas = entry.gridAreaCodes;

          @if (gridAreas.length > 0) {
            @if (gridAreas.length < 4) {
              {{ gridAreas.join(", ") }}
            } @else {
              {{
                t("itemsAndCount", {
                  items: gridAreas.slice(0, 2).join(", "),
                  remainingCount: gridAreas.length - 2,
                })
              }}
            }
          } @else {
            {{ t("noData") }}
          }
        </ng-container>

        <ng-container *wattTableCell="columns['period']; header: t('columns.period'); let entry">
          {{ entry.period | wattDate: "short" }}
        </ng-container>

        <ng-container *wattTableCell="columns['status']; header: t('columns.status'); let entry">
          @let reportIsEmpty = entry.statusType === "COMPLETED" && entry.gridAreaCodes.length === 0;

          @if (reportIsEmpty === false) {
            <dh-report-status [status]="entry.statusType" (download)="downloadReport(entry)" />
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhMeasurementsReports {
  private readonly measurementsReportsService = inject(DhMeasurementsReportsService);
  private readonly permissionService = inject(PermissionService);
  private readonly isFas = toSignal(this.permissionService.isFas());
  
  private readonly measurementsReportsQuery = query(GetMeasurementsReportsDocument, {
    fetchPolicy: 'network-only',
  });

  measurementsReports = computed(
    () => this.measurementsReportsQuery.data()?.measurementsReports ?? []
  );
  totalCount = computed(() => this.measurementsReports().length);
  isLoading = this.measurementsReportsQuery.loading;
  hasError = this.measurementsReportsQuery.hasError;

  columns: WattTableColumnDef<DhMeasurementsReport> = {
    startedAt: { accessor: 'createdDateTime' },
    actorName: { accessor: (report) => report.actor?.name },
    meteringPoints: { accessor: 'meteringPointTypes' },
    gridAreas: { accessor: 'gridAreaCodes' },
    period: { accessor: (report) => report.period.start },
    status: { accessor: 'statusType' },
  };

  dataSource = new WattTableDataSource<DhMeasurementsReport>([]);

  displayedColumns = computed(() => {
    const tableColumns = Object.keys(this.columns);
    const isFas = this.isFas();

    return isFas ? tableColumns : tableColumns.filter((column) => column !== 'actorName');
  });

  constructor() {
    effect(() => (this.dataSource.data = this.measurementsReports()));
  }

  downloadReport(report: DhMeasurementsReport): void {
    this.measurementsReportsService.downloadReport(report);
  }
}
