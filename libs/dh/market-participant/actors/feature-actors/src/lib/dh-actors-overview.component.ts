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
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { BehaviorSubject, Observable, Subscription, combineLatest, debounceTime, map } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattSearchComponent } from '@energinet-datahub/watt/search';

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { ActorsFilters, AllFiltersCombined } from './actors-filters';
import { DhActorStatusBadgeComponent } from './status-badge/dh-actor-status-badge.component';
import { DhActor } from './dh-actor';
import { dhActorsCustomFilterPredicate } from './dh-actors-custom-filter-predicate';
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

      watt-card-title {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }

      watt-search {
        margin-left: auto;
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
    NgIf,
    DhActorsFiltersComponent,
    DhActorStatusBadgeComponent,
    DhEmDashFallbackPipe,
    WATT_TABLE,
    WATT_CARD,
    WattSearchComponent,
    WattPaginatorComponent,
    WattEmptyStateComponent,
  ],
})
export class DhActorsOverviewComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private subscription: Subscription | null = null;

  getActorsQuery$ = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorsDocument,
  });

  dataSource = new WattTableDataSource<DhActor>([]);

  columns: WattTableColumnDef<DhActor> = {
    glnOrEicNumber: { accessor: 'glnOrEicNumber' },
    name: { accessor: 'name' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  filters$ = new BehaviorSubject<ActorsFilters>({
    actorStatus: null,
    marketRoles: null,
  });

  searchInput$ = new BehaviorSubject<string>('');

  loading = true;
  error = false;

  ngOnInit(): void {
    this.subscription = this.getActorsQuery$.valueChanges.subscribe({
      next: (result) => {
        this.loading = result.loading;

        this.dataSource.data = result.data?.actors;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });

    this.dataSource.filterPredicate = dhActorsCustomFilterPredicate();

    const filtersCombined$: Observable<AllFiltersCombined> = combineLatest([
      this.filters$,
      this.searchInput$.pipe(debounceTime(250)),
    ]).pipe(map(([filters, searchInput]) => ({ ...filters, searchInput })));

    this.subscription?.add(
      filtersCombined$.subscribe({
        next: (filters) => {
          this.dataSource.filter = dhToJSON(filters);
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }
}
