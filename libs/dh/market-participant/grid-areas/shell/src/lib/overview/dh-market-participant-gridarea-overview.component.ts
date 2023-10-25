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
import { Component, Input, OnChanges } from '@angular/core';
import { RxLet } from '@rx-angular/template/let';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { GridAreaOverviewRow } from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattDatePipe } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-market-participant-gridarea-overview',
  styles: [
    `
      .card-container {
        padding: var(--watt-space-m);
        box-shadow: 0px 1px 6px rgba(11, 60, 93, 0.12), 0px 4px 18px 3px rgba(46, 50, 52, 0.08);
        border-radius: 4px;
      }
    `,
  ],
  templateUrl: './dh-market-participant-gridarea-overview.component.html',
  standalone: true,
  imports: [RxLet, TranslocoDirective, DhEmDashFallbackPipe, WattDatePipe, WATT_TABLE],
})
export class DhMarketParticipantGridAreaOverviewComponent implements OnChanges {
  columns: WattTableColumnDef<GridAreaOverviewRow> = {
    code: { accessor: 'code' },
    name: { accessor: 'name' },
    actorName: { accessor: 'actorName' },
    actorNumber: { accessor: 'actorNumber' },
    priceAreaCode: { accessor: 'priceAreaCode' },
    validFrom: { accessor: 'validFrom' },
    validTo: { accessor: 'validTo' },
  };

  @Input() gridAreas: GridAreaOverviewRow[] = [];

  readonly dataSource = new WattTableDataSource<GridAreaOverviewRow>();

  ngOnChanges() {
    this.dataSource.data = this.gridAreas;
  }
}
