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
import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattTableColumnDef, WATT_TABLE, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

type DhMeasurementReport = {
  id: string;
  startedAt: Date;
  actorName: string;
  meteringPoints: string[];
  gridAreas: string[];
  statusType: string;
};

@Component({
  selector: 'dh-measurement-reports',
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    WattDataTableComponent,
    VaterUtilityDirective,
    WattDatePipe,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'reports.measurementReports'"
      vater
      inset="ml"
      [enableSearch]="false"
    >
      <h3>{{ t('title') }}</h3>

      <watt-table
        [dataSource]="dataSource"
        [columns]="columns"
        [displayedColumns]="displayedColumns()"
      >
        <ng-container
          *wattTableCell="columns['startedAt']; header: t('columns.startedAt'); let entry"
        >
          {{ entry.startedAt | wattDate: 'long' }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['actorName']; header: t('columns.actorName'); let entry"
        >
          {{ entry.actorName }}
        </ng-container>

        <ng-container
          *wattTableCell="columns['meteringPoints']; header: t('columns.meteringPoints'); let entry"
        >
          --
        </ng-container>

        <ng-container
          *wattTableCell="columns['gridAreas']; header: t('columns.gridAreas'); let entry"
        >
          @let gridAreas = entry.gridAreas;

          @if (gridAreas.length > 0) {
            @if (gridAreas.length < 4) {
              {{ gridAreas.join(', ') }}
            } @else {
              {{
                t('gridAreasAndCount', {
                  gridAreas: gridAreas.slice(0, 2).join(', '),
                  remainingGridAreasCount: gridAreas.length - 2,
                })
              }}
            }
          } @else {
            {{ t('noData') }}
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhMeasurementReports {
  private permissionService = inject(PermissionService);
  private isFas = toSignal(this.permissionService.isFas());

  columns: WattTableColumnDef<DhMeasurementReport> = {
    startedAt: { accessor: 'startedAt' },
    actorName: { accessor: 'actorName' },
    meteringPoints: { accessor: 'meteringPoints' },
    gridAreas: { accessor: 'gridAreas' },
    status: { accessor: 'statusType' },
  };

  dataSource = new WattTableDataSource([]);

  displayedColumns = computed(() => {
    const tableColumns = Object.keys(this.columns);
    const isFas = this.isFas();

    return isFas ? tableColumns : tableColumns.filter((column) => column !== 'actorName');
  });
}
