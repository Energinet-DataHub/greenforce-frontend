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
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { DhMeteringGridAreaImbalanceTableComponent } from './table/dh-table.component';
import { DhMeteringGridAreaImbalance } from './dh-metering-gridarea-imbalance';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhMeteringGridAreaImbalanceFiltersComponent } from './filters/dh-filters.component';
import { DhMeteringGridAreaImbalanceFilters } from './dh-metering-gridarea-imbalance-filters';
import {
  DownloadMeteringGridAreaImbalanceDocument,
  GetMeteringGridAreaImbalanceDocument,
  MeteringGridImbalanceValuesToInclude,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { dhMGASortMetadataMapper } from './util/dh-sort-metadata-mapper.operator';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  standalone: true,
  selector: 'dh-metering-gridarea-imbalance',
  templateUrl: './dh-metering-gridarea-imbalance.component.html',
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
    RxPush,
    WATT_CARD,
    WattPaginatorComponent,
    WattButtonComponent,
    WattSearchComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,

    DhMeteringGridAreaImbalanceFiltersComponent,
    DhMeteringGridAreaImbalanceTableComponent,
  ],
})
export class DhMeteringGridAreaImbalanceComponent implements OnInit {
  private _apollo = inject(Apollo);
  private _destroyRef = inject(DestroyRef);

  tableDataSource = new WattTableDataSource<DhMeteringGridAreaImbalance>([]);
  totalCount = 0;

  private pageMetaData$ = new BehaviorSubject<Pick<PageEvent, 'pageIndex' | 'pageSize'>>({
    pageIndex: 0,
    pageSize: 100,
  });

  pageSize$ = this.pageMetaData$.pipe(map(({ pageSize }) => pageSize));

  sortMetadata$ = new BehaviorSubject<Sort>({
    active: 'received',
    direction: 'desc',
  });

  isLoading = false;
  isDownloading = false;
  hasError = false;

  filter$ = new BehaviorSubject<DhMeteringGridAreaImbalanceFilters>({
    period: {
      start: sub(startOfDay(new Date()), { days: 2 }),
      end: endOfDay(new Date()),
    },
    valuesToInclude: MeteringGridImbalanceValuesToInclude.Imbalances,
  });

  documentIdSearch$ = new BehaviorSubject<string>('');

  private queryVariables$ = combineLatest({
    filters: this.filter$,
    pageMetaData: this.pageMetaData$,
    documentIdSearch: this.documentIdSearch$.pipe(debounceTime(750)),
    sortMetadata: this.sortMetadata$.pipe(dhMGASortMetadataMapper),
  }).pipe(
    map(({ filters, pageMetaData, documentIdSearch, sortMetadata }) => {
      return {
        filters: documentIdSearch
          ? { valuesToInclude: MeteringGridImbalanceValuesToInclude.Imbalances }
          : filters,
        pageMetaData,
        documentIdSearch,
        sortMetadata,
      };
    })
  );

  meteringGridAreaImbalance$ = this.queryVariables$.pipe(
    switchMap(({ filters, pageMetaData, documentIdSearch, sortMetadata }) =>
      this._apollo
        .watchQuery({
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetMeteringGridAreaImbalanceDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageMetaData.pageIndex + 1,
            pageSize: pageMetaData.pageSize,
            gridAreaCode: filters.gridArea,
            periodFrom: filters.period?.start,
            periodTo: filters.period?.end,
            documentId: documentIdSearch,
            sortProperty: sortMetadata.sortProperty,
            sortDirection: sortMetadata.sortDirection,
            valuesToInclude: filters.valuesToInclude,
          },
        })
        .valueChanges.pipe(catchError(() => of({ loading: false, data: null, errors: [] })))
    ),
    takeUntilDestroyed()
  );

  ngOnInit() {
    this.meteringGridAreaImbalance$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.meteringGridAreaImbalance.items ?? [];
        this.totalCount = result.data?.meteringGridAreaImbalance.totalCount ?? 0;

        this.hasError = !!result.errors;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  handlePageEvent({ pageIndex, pageSize }: PageEvent): void {
    this.pageMetaData$.next({ pageIndex, pageSize });
  }

  download() {
    this.isDownloading = true;
    this.queryVariables$
      .pipe(
        switchMap(
          ({ filters, documentIdSearch, sortMetadata }) =>
            this._apollo.watchQuery({
              returnPartialData: false,
              useInitialLoading: false,
              notifyOnNetworkStatusChange: true,
              fetchPolicy: 'no-cache',
              query: DownloadMeteringGridAreaImbalanceDocument,
              variables: {
                locale: 'da-DK',
                gridAreaCode: filters.gridArea,
                periodFrom: filters.period?.start,
                periodTo: filters.period?.end,
                documentId: documentIdSearch,
                sortProperty: sortMetadata.sortProperty,
                sortDirection: sortMetadata.sortDirection,
                valuesToInclude: filters.valuesToInclude,
              },
            }).valueChanges
        ),
        take(1)
      )
      .subscribe({
        next: (result) => {
          this.isDownloading = result.loading;

          exportToCSVRaw({
            content: result?.data?.downloadMeteringGridAreaImbalance,
            fileName: 'eSett-metering-grid-area-imbalance-messages',
          });

          this.hasError = !!result.errors;
        },
        error: () => {
          this.hasError = true;
          this.isDownloading = false;
        },
      });
  }
}
