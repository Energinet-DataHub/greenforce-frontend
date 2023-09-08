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
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject, Subject, combineLatest, map, switchMap, takeUntil } from 'rxjs';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { GetOutgoingMessagesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { DhOutgoingMessagesTableComponent } from './table/dh-table.component';
import { DhOutgoingMessage } from './dh-outgoing-message';
import { DhOutgoingMessagesFilters } from './dh-outgoing-messages-filters';

@Component({
  standalone: true,
  selector: 'dh-outgoing-messages',
  templateUrl: './dh-outgoing-messages.component.html',
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
    TranslocoDirective,
    TranslocoPipe,
    RxPush,

    WATT_CARD,
    WattSearchComponent,
    WattPaginatorComponent,

    DhOutgoingMessagesFiltersComponent,
    DhOutgoingMessagesTableComponent,
  ],
})
export class DhOutgoingMessagesComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  tableDataSource = new WattTableDataSource<DhOutgoingMessage>([]);
  totalCount = 0;

  searchInput$ = new BehaviorSubject<string>('');
  pageSize$ = new BehaviorSubject<number>(100);
  pageIndexUi$ = new BehaviorSubject<number>(0);

  // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
  // whereas our endpoint's `pageNumber` param starts at `1`
  private pageIndexGraphQl$ = this.pageIndexUi$.pipe(map((index) => index + 1));

  isLoading = false;
  hasError = false;

  filter$ = new BehaviorSubject<DhOutgoingMessagesFilters>({
    period: {
      start: sub(startOfDay(new Date()), { days: 2 }),
      end: endOfDay(new Date()),
    },
  });

  private queryVariables$ = combineLatest({
    filters: this.filter$,
    pageSize: this.pageSize$,
    pageIndex: this.pageIndexGraphQl$,
  });

  outgoingMessages$ = this.queryVariables$.pipe(
    switchMap(
      ({ filters, pageSize, pageIndex }) =>
        this.apollo.watchQuery({
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetOutgoingMessagesDocument,
          variables: {
            pageNumber: pageIndex,
            pageSize,
            processType: filters.calculationTypes,
            timeSeriesType: filters.messageTypes,
            gridAreaCode: filters.gridAreas,
            documentStatus: filters.status,
            periodFrom: filters.period?.start,
            periodTo: filters.period?.end,
          },
        }).valueChanges
    ),
    takeUntil(this.destroy$)
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.esettExchangeEvents.items;
        this.totalCount = result.data?.esettExchangeEvents.totalCount;

        this.hasError = !!result.errors;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
