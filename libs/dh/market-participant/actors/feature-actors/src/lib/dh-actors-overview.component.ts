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
import { Component, OnInit, effect, inject, viewChild, signal, computed } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { MatMenuModule } from '@angular/material/menu';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { exportToCSV, DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActor } from '@energinet-datahub/dh/market-participant/actors/domain';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { ActorsFilters } from './actors-filters';
import { DhActorsCreateActorModalComponent } from './create/dh-actors-create-actor-modal.component';
import { DhMergeMarketParticipantsComponent } from './merge/dh-merge-market-participants.component';
import { DhActorStatusBadgeComponent } from './status-badge/dh-actor-status-badge.component';
import { DhActorDrawerComponent } from './drawer/dh-actor-drawer.component';
import {
  WattDataTableComponent,
  WattDataActionsComponent,
  WattDataFiltersComponent,
} from '@energinet-datahub/watt/data';

@Component({
  standalone: true,
  selector: 'dh-actors-overview',
  templateUrl: './dh-actors-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    MatMenuModule,
    VaterUtilityDirective,
    WattButtonComponent,
    DhActorsFiltersComponent,
    DhPermissionRequiredDirective,
    DhActorStatusBadgeComponent,
    DhActorDrawerComponent,
    DhEmDashFallbackPipe,
    WATT_TABLE,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
  ],
})
export class DhActorsOverviewComponent implements OnInit {
  private readonly modalService = inject(WattModalService);

  private readonly actorsQuery = query(GetActorsDocument);

  tableDataSource = new WattTableDataSource<DhActor>([]);

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

  // Convert filters to a signal
  filters = signal<ActorsFilters>({
    actorStatus: null,
    marketRoles: null,
  });

  isLoading = this.actorsQuery.loading;
  hasError = this.actorsQuery.hasError;

  private readonly drawer = viewChild.required(DhActorDrawerComponent);

  activeRow = () => this._activeRow;
  private _activeRow?: DhActor;

  // Computed signal for filtered actors
  private readonly filteredActors = computed(() => {
    const actors = this.actorsQuery.data()?.actors ?? [];
    const filters = this.filters();

    return actors.filter((actor) => {
      // Check status filter
      if (
        filters.actorStatus &&
        filters.actorStatus.length > 0 &&
        !filters.actorStatus.includes(actor.status)
      ) {
        return false;
      }

      // Check market roles filter
      return !(
        filters.marketRoles &&
        filters.marketRoles.length > 0 &&
        !filters.marketRoles.includes(actor.marketRole)
      );
    });
  });

  constructor() {
    // Update table data whenever filtered actors change
    effect(() => {
      this.tableDataSource.data = this.filteredActors();
    });
  }

  ngOnInit(): void {
    // Filter predicate now only handles search
    this.tableDataSource.filterPredicate = (data: DhActor, filter: string) => {
      if (!filter) return true;

      const searchStr = filter.toLowerCase();
      return (
        data.glnOrEicNumber.toLowerCase().includes(searchStr) ||
        data.name.toLowerCase().includes(searchStr) ||
        (data.marketRole
          ? translate(`marketParticipant.marketRoles.${data.marketRole}`)
              .toLowerCase()
              .includes(searchStr)
          : false) ||
        (data.status
          ? translate(`marketParticipant.actorsOverview.status.${data.status}`)
              .toLowerCase()
              .includes(searchStr)
          : false)
      );
    };
  }

  createNewActor(): void {
    this.modalService.open({
      component: DhActorsCreateActorModalComponent,
      disableClose: true,
    });
  }

  mergeMarketParticipants(): void {
    this.modalService.open({
      component: DhMergeMarketParticipantsComponent,
    });
  }

  onFiltersReset(): void {
    this.filters.set({
      actorStatus: null,
      marketRoles: null,
    });
  }

  download(): void {
    if (!this.tableDataSource.sort) {
      return;
    }

    // Get filtered data (includes both custom filters and search)
    const dataSorted = this.tableDataSource.sortData(
      [...this.tableDataSource.filteredData],
      this.tableDataSource.sort
    );

    const actorsOverviewPath = 'marketParticipant.actorsOverview';

    const headers = [
      `"ID"`,
      `"${translate(actorsOverviewPath + '.columns.glnOrEic')}"`,
      `"${translate(actorsOverviewPath + '.columns.name')}"`,
      `"${translate(actorsOverviewPath + '.columns.marketRole')}"`,
      `"${translate(actorsOverviewPath + '.columns.status')}"`,
      `"${translate(actorsOverviewPath + '.columns.mail')}"`,
    ];

    const lines = dataSorted.map((actor) => [
      `"${actor.id}"`,
      `"""${actor.glnOrEicNumber}"""`,
      `"${actor.name}"`,
      `"${
        actor.marketRole == null
          ? ''
          : translate('marketParticipant.marketRoles.' + actor.marketRole)
      }"`,
      `"${actor.status == null ? '' : translate(actorsOverviewPath + '.status.' + actor.status)}"`,
      `"${actor.publicMail?.mail ?? ''}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Market Participants' });
  }

  onRowClick(actor: DhActor): void {
    this._activeRow = actor;
    this.drawer().open(actor.id);
  }

  onDrawerClose(): void {
    this._activeRow = undefined;
  }
}
