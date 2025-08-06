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
import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { BehaviorSubject, combineLatest, debounceTime, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetMarketParticipantsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
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
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhActorsFiltersComponent } from './filters/dh-actors-filters.component';
import { dhMarketParticipantsCustomFilterPredicate } from './dh-actors-custom-filter-predicate';
import { DhActorsCreateActorModalComponent } from './create/dh-actors-create-actor-modal.component';
import { DhMergeMarketParticipantsComponent } from './dh-merge-market-participants.component';
import { DhActorsTableComponent } from './table/dh-actors-table.component';
import { dhToJSON } from '../utils/dh-json-util';
import {
  DhMarketParticipant,
  MarketParticipantsFilters,
} from '@energinet-datahub/dh/market-participant/domain';

@Component({
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
    MatMenuModule,
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

  private actorsQuery = query(GetMarketParticipantsDocument);

  tableDataSource = new WattTableDataSource<DhMarketParticipant>([]);

  filters$ = new BehaviorSubject<MarketParticipantsFilters>({
    marketParticipantStatus: null,
    marketRoles: null,
  });

  searchInput$ = new BehaviorSubject<string>('');

  isLoading = this.actorsQuery.loading;
  hasError = this.actorsQuery.hasError;

  constructor() {
    effect(() => {
      this.tableDataSource.data = this.actorsQuery.data()?.marketParticipants ?? [];
    });
  }

  ngOnInit(): void {
    this.tableDataSource.filterPredicate = dhMarketParticipantsCustomFilterPredicate;

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
