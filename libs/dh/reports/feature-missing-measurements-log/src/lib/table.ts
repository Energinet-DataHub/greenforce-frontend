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
import { ReactiveFormsModule } from '@angular/forms';
import { Component, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-reports-missing-measurements-log-table',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattTableComponent,
    WattButtonComponent,
    VaterUtilityDirective,
    WattDataTableComponent,
  ],
  template: `
    <watt-data-table
      *transloco="let t; read: 'reports.missingMeasurementsLog'"
      vater
      inset="ml"
      [enableSearch]="false"
      [enableCount]="false"
      [enableEmptyState]="false"
    >
      <h3>{{ t('results') }}</h3>

      <watt-button variant="secondary" icon="plus" data-testid="newRequest" (click)="new.emit()">
        {{ t('button') }}
      </watt-button>

      <watt-table
        *transloco="let resolveHeader; read: 'reports.missingMeasurementsLog.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="resolveHeader"
      />
    </watt-data-table>
  `,
})
export class DhReportsMissingMeasurementsLogTable {
  new = output();
  columns: WattTableColumnDef<Request> = {};

  dataSource = new WattTableDataSource([]);
}
