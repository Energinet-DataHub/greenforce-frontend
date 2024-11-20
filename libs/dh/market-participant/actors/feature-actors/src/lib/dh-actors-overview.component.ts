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
import { Component, DestroyRef, OnInit, computed, effect, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { BehaviorSubject, combineLatest, debounceTime, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActor } from '@energinet-datahub/dh/market-participant/actors/domain';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { ActorsFilters } from './actors-filters';
import { dhActorsCustomFilterPredicate } from './dh-actors-custom-filter-predicate';
import { DhActorsCreateActorModalComponent } from './create/dh-actors-create-actor-modal.component';
import { DhActorsTableComponent } from './table/dh-actors-table.component';
import { dhToJSON } from './dh-json-util';

@Component({
  standalone: true,
  selector: 'dh-actors-overview',
  templateUrl: './dh-actors-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

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
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WattPaginatorComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WattSearchComponent,
    WattButtonComponent,

    DhActorsFiltersComponent,
    DhActorsTableComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhActorsOverviewComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private modalService = inject(WattModalService);

  private actorsQuery = query(GetActorsDocument);

  tableDataSource = new WattTableDataSource<DhActor>([]);

  filters$ = new BehaviorSubject<ActorsFilters>({
    actorStatus: null,
    marketRoles: null,
  });

  searchInput$ = new BehaviorSubject<string>('');

  isLoading = this.actorsQuery.loading;
  hasError = computed(() => this.actorsQuery.error() !== undefined);

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.actorsQuery.data()?.actors ?? [];
    });
  }

  ngOnInit(): void {
    this.tableDataSource.filterPredicate = dhActorsCustomFilterPredicate;

    combineLatest([this.filters$, this.searchInput$.pipe(debounceTime(250))])
      .pipe(
        map(([filters, searchInput]) => ({ ...filters, searchInput })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (filters) => {
          this.tableDataSource.filter = dhToJSON(filters);
        },
      });
  }

  openCreateNewActorModal(): void {
    this.modalService.open({
      component: DhActorsCreateActorModalComponent,
      disableClose: true,
    });
  }

  download(): void {
    if (!this.tableDataSource.sort) {
      return;
    }

    const dataSorted = this.tableDataSource.sortData(
      this.tableDataSource.filteredData,
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
}
