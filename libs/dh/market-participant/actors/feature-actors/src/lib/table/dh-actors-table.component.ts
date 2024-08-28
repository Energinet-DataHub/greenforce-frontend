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
import { Component, input, ViewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhActor } from '@energinet-datahub/dh/market-participant/actors/domain';
import { DhActorStatusBadgeComponent } from '../status-badge/dh-actor-status-badge.component';
import { DhActorDrawerComponent } from '../drawer/dh-actor-drawer.component';

@Component({
  selector: 'dh-actors-table',
  standalone: true,
  templateUrl: './dh-actors-table.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_TABLE,
    WattEmptyStateComponent,
    VaterFlexComponent,
    VaterStackComponent,

    DhEmDashFallbackPipe,
    DhActorStatusBadgeComponent,
    DhActorDrawerComponent,
  ],
})
export class DhActorsTableComponent {
  activeRow: DhActor | undefined = undefined;

  columns: WattTableColumnDef<DhActor> = {
    glnOrEicNumber: { accessor: 'glnOrEicNumber' },
    name: { accessor: 'name' },
    marketRole: {
      accessor: (m) =>
        (m.marketRole && translate(`marketParticipant.marketRoles.${m.marketRole}`)) || '',
    },
    status: {
      accessor: (m) => translate(`marketParticipant.actorsOverview.status.${m.status}`),
    },
  };

  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();
  actorNumberNameLookup = input.required<{ [key: string]: { number: string; name: string } }>();
  gridAreaCodeLookup = input.required<{ [key: string]: string }>();

  tableDataSource = input.required<WattTableDataSource<DhActor>>();

  @ViewChild(DhActorDrawerComponent)
  drawer: DhActorDrawerComponent | undefined;

  onRowClick(actor: DhActor): void {
    this.activeRow = actor;

    this.drawer?.open(actor.id);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
