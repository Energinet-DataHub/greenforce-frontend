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
import { TranslocoModule } from '@ngneat/transloco';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

export interface GridAreaOverviewRow {
  id: string;
  code: string;
  actor: string;
  organization: string;
}

@Component({
  standalone: true,
  selector: 'dh-market-participant-gridarea-overview',
  templateUrl: './dh-market-participant-gridarea-overview.component.html',
  styles: [
    `
      h3 {
        margin: 0;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    TranslocoModule,

    WATT_CARD,
    WATT_TABLE,

    WattPaginatorComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattSearchComponent,
    WattButtonComponent,

    DhEmDashFallbackPipe,

    WattSearchComponent,
    WattButtonComponent,
    WattDatePipe,
  ],
})
export class DhMarketParticipantGridAreaOverviewComponent implements OnChanges {
  columns: WattTableColumnDef<GridAreaOverviewRow> = {
    code: { accessor: 'code' },
    actor: { accessor: 'actor' },
    organization: { accessor: 'organization' },
  };

  @Input() gridAreas: GridAreaOverviewRow[] = [];
  @Input() isLoading = false;

  readonly dataSource = new WattTableDataSource<GridAreaOverviewRow>();

  ngOnChanges() {
    this.dataSource.data = this.gridAreas;
  }
}
