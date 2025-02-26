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
import { Component, computed } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { MatMenuModule } from '@angular/material/menu';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { queryTime } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointWithHistoryDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

import { MeteringPointPeriod } from '../types';
import { DhMeteringPointsMasterDataUploaderComponent } from './file-uploader/dh-metering-points-master-data-uploader.component';

@Component({
  selector: 'dh-metering-points',
  imports: [
    MatMenuModule,
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABLE,
    WattDatePipe,
    WattDataTableComponent,
    VaterUtilityDirective,
    WattDataFiltersComponent,
    WattDataActionsComponent,
    WattButtonComponent,
    DhFeatureFlagDirective,
    DhPermissionRequiredDirective,
    DhMeteringPointsMasterDataUploaderComponent,
  ],
  template: `
    <watt-data-table
      vater
      inset="0"
      *transloco="let t; read: 'electricityMarket.table'"
      [searchLabel]="'shared.search' | transloco"
      [error]="meteringPointPeriods.error"
      [ready]="meteringPointPeriods.called"
      [queryTime]="meteringPointPeriodsQueryTime()"
    >
      <h3>Metering point periods</h3>

      <watt-data-filters>
        <div>{{ t('meteringPointId', { id: meteringPointId() }) }}</div>
      </watt-data-filters>

      <watt-data-actions *dhFeatureFlag="'metering-points-master-data-upload'">
        <watt-button
          *dhPermissionRequired="['fas']"
          variant="icon"
          icon="moreVertical"
          [matMenuTriggerFor]="menu"
        />

        <dh-metering-points-master-data-uploader #uploader />

        <mat-menu #menu="matMenu">
          <button type="button" mat-menu-item (click)="uploader.selectFile()">
            {{ t('uploadButton') }}
          </button>
        </mat-menu>
      </watt-data-actions>

      <watt-table
        [dataSource]="meteringPointPeriods"
        [columns]="columns"
        [loading]="meteringPointPeriods.loading"
      >
        <ng-container *wattTableCell="columns.ownedBy; let element">
          {{ element.ownedBy }}
        </ng-container>
        <ng-container *wattTableCell="columns.connectionState; let element">
          {{ element.connectionState }}
        </ng-container>
        <ng-container *wattTableCell="columns.createdAt; let element">
          {{ element.createdAt | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.gridArea; let element">
          {{ element.gridArea?.displayName }}
        </ng-container>
        <ng-container *wattTableCell="columns.product; let element">
          {{ element.product }}
        </ng-container>
        <ng-container *wattTableCell="columns.resolution; let element">
          {{ element.resolution }}
        </ng-container>
        <ng-container *wattTableCell="columns.scheduledMeterReadingMonth; let element">
          {{ element.scheduledMeterReadingMonth }}
        </ng-container>
        <ng-container *wattTableCell="columns.type; let element">
          {{ element.type }}
        </ng-container>
        <ng-container *wattTableCell="columns.subType; let element">
          {{ element.subType }}
        </ng-container>
        <ng-container *wattTableCell="columns.validFrom; let element">
          {{ element.validFrom | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.validTo; let element">
          {{ element.validTo | wattDate }}
        </ng-container>
        <ng-container *wattTableCell="columns.unit; let element">
          {{ element.unit }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeteringPointsComponent {
  columns: WattTableColumnDef<MeteringPointPeriod> = {
    ownedBy: { accessor: 'ownedBy' },
    connectionState: { accessor: 'connectionState' },
    createdAt: { accessor: 'createdAt' },
    gridArea: { accessor: 'gridArea' },
    product: { accessor: 'product' },
    scheduledMeterReadingMonth: { accessor: 'scheduledMeterReadingMonth' },
    type: { accessor: 'type' },
    subType: { accessor: 'subType' },
    validFrom: { accessor: 'validFrom' },
    validTo: { accessor: 'validTo' },
    unit: { accessor: 'unit' },
  };

  meteringPointPeriods = new GetMeteringPointWithHistoryDataSource({ skip: true });

  meteringPointId = computed(
    () => this.meteringPointPeriods.query.data()?.meteringPointWithHistory.meteringPointId
  );

  meteringPointPeriodsQueryTime = queryTime(this.meteringPointPeriods.query);
}
