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
import { Component, effect, input, viewChild } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDataTableComponent, WattDataActionsComponent } from '@energinet-datahub/watt/data';

@Component({
  selector: 'dh-metering-point-ids-overview',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.accessToMeasurements'">
      <watt-data-table>
        <h3>{{ t('modalTitle') }}</h3>

        <watt-data-actions>
          <ng-content />
        </watt-data-actions>

        <watt-table
          [dataSource]="tableDataSource"
          [columns]="columns"
          [sortClear]="false"
          [suppressRowHoverHighlight]="true"
        />
      </watt-data-table>
    </ng-container>
  `,
  imports: [TranslocoDirective, WattDataTableComponent, WattDataActionsComponent, WATT_TABLE],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhMeteringPointIdsOverview {
  tableDataSource = new WattTableDataSource<string>([]);

  table = viewChild.required(WattTableComponent);

  columns: WattTableColumnDef<string> = {
    meteringPointId: {
      accessor: (value) => value,
      header: translate('marketParticipant.accessToMeasurements.table.columns.meteringPointId'),
    },
  };

  data = input.required<string[]>();

  constructor() {
    effect(() => (this.tableDataSource.data = this.data()));
  }
}
