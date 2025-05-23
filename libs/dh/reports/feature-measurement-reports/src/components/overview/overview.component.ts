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
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, computed, effect, inject, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhSettlementReportsService } from '@energinet-datahub/dh/shared/util-settlement-reports';

import { DhMeasurementsReport, DhMeasurementsReports } from '../../types';
import { DhReportStatus } from '../report-status.component';

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
    DhEmDashFallbackPipe,
    DhReportStatus,
  ],
  providers: [DhSettlementReportsService],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhOverview {
  private permissionService = inject(PermissionService);
  private isFas = toSignal(this.permissionService.isFas());

  columns: WattTableColumnDef<DhMeasurementsReport> = {
    startedAt: { accessor: 'createdDateTime' },
    actorName: { accessor: (report) => report.actor?.name },
    meteringPoints: { accessor: null },
    gridAreas: { accessor: 'gridAreas' },
    period: { accessor: (report) => report.period.start },
    status: { accessor: 'statusType' },
  };

  dataSource = new WattTableDataSource<DhMeasurementsReport>([]);

  displayedColumns = computed(() => {
    const tableColumns = Object.keys(this.columns);
    const isFas = this.isFas();

    return isFas ? tableColumns : tableColumns.filter((column) => column !== 'actorName');
  });

  measurementsReports = input.required<DhMeasurementsReports>();

  constructor() {
    effect(() => (this.dataSource.data = this.measurementsReports()));
  }

  downloadReport(): void {
    console.log('Download report');
  }
}
