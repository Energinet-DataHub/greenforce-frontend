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
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { BehaviorSubject, Observable, combineLatest, debounceTime, map } from 'rxjs';
import { Apollo } from 'apollo-angular';
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

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { ActorsFilters, AllFiltersCombined } from './actors-filters';
import { dhActorsCustomFilterPredicate } from './dh-actors-custom-filter-predicate';
import { DhActorsCreateActorModalComponent } from './create/dh-actors-create-actor-modal.component';
import { DhActorsTableComponent } from './table/dh-actors-table.component';
import { DhActor } from './dh-actor';
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
    DhActorsCreateActorModalComponent,
  ],
})
export class DhActorsOverviewComponent implements OnInit {
  private _apollo = inject(Apollo);
  private _destroyRef = inject(DestroyRef);
  private _modalService = inject(WattModalService);

  getActorsQuery$ = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorsDocument,
  });

  tableDataSource = new WattTableDataSource<DhActor>([]);

  filters$ = new BehaviorSubject<ActorsFilters>({
    actorStatus: null,
    marketRoles: null,
  });

  searchInput$ = new BehaviorSubject<string>('');

  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    const subscription = this.getActorsQuery$.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (result) => {
          this.isLoading = result.loading;

          this.tableDataSource.data = result.data?.actors ?? [];
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        },
      });

    this.tableDataSource.filterPredicate = dhActorsCustomFilterPredicate;

    const filtersCombined$: Observable<AllFiltersCombined> = combineLatest([
      this.filters$,
      this.searchInput$.pipe(debounceTime(250)),
    ]).pipe(map(([filters, searchInput]) => ({ ...filters, searchInput })));

    subscription?.add(
      filtersCombined$.subscribe({
        next: (filters) => {
          this.tableDataSource.filter = dhToJSON(filters);
        },
      })
    );
  }

  openCreateNewActorModal(): void {
    this._modalService.open({
      component: DhActorsCreateActorModalComponent,
      onClosed: (result) => {
        if (result) {
          this.getActorsQuery$.refetch();
        }
      },
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
    ];

    const lines = dataSorted.map((actor) => [
      `"${actor.id}"`,
      `"${actor.glnOrEicNumber}"`,
      `"${actor.name}"`,
      `"${
        actor.marketRole == null
          ? ''
          : translate('marketParticipant.marketRoles.' + actor.marketRole)
      }"`,
      `"${actor.status == null ? '' : translate(actorsOverviewPath + '.status.' + actor.status)}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'actors' });
  }
}
