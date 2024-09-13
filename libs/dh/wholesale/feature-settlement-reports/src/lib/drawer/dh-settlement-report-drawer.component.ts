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
import { Component, effect, input, output, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhDurationComponent } from '../util/dh-duration.component';
import { DhSettlementReport } from '../dh-settlement-report';
import { DhSettlementReportsStatusComponent } from '../util/dh-settlement-reports-status.component';

@Component({
  selector: 'dh-settlement-report-drawer',
  standalone: true,
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WATT_DRAWER,
    WattDatePipe,
    VaterStackComponent,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhDurationComponent,
    DhSettlementReportsStatusComponent,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      .report-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .metadata__item {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }

      .card-metadata {
        margin: var(--watt-space-ml);
        width: 60%;
      }

      .card-grid-areas {
        margin: var(--watt-space-ml);
      }
    `,
  ],
  templateUrl: './dh-settlement-report-drawer.component.html',
})
export class DhSettlementReportDrawerComponent {
  drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  tableSource = new WattTableDataSource<DhSettlementReport['gridAreas'][0]>();

  columns: WattTableColumnDef<string> = {
    code: { accessor: (value) => value },
  };

  report = input.required<DhSettlementReport | undefined>();

  closed = output();
  download = output<Event>();

  constructor() {
    effect(() => {
      if (this.report()) {
        this.drawer().open();
        this.tableSource.data = this.report()?.gridAreas ?? [];
      } else {
        this.drawer().close();
      }
    });
  }
}
