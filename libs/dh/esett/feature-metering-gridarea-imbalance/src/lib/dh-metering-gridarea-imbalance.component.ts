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
import { BehaviorSubject, catchError, debounceTime, of, switchMap, take } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattPaginatorComponent, WattTableDataSource } from '@energinet-datahub/watt/table';
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
import {
  DownloadMeteringGridAreaImbalanceDocument,
  GetMeteringGridAreaImbalanceDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhMeteringGridAreaImbalanceFiltersComponent } from './filters/dh-filters.component';
import { DhMeteringGridAreaImbalanceFilters } from './dh-metering-gridarea-imbalance-filters';
import { DhMeteringGridAreaImbalanceStore } from './dh-metering-gridarea-imbalance.store';

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
    RxLet,

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
  providers: [DhMeteringGridAreaImbalanceStore],
})
export class DhMeteringGridAreaImbalanceComponent implements OnInit {
  private _apollo = inject(Apollo);
  private _destroyRef = inject(DestroyRef);
  private _toastService = inject(WattToastService);
  private _store = inject(DhMeteringGridAreaImbalanceStore);

  tableDataSource = new WattTableDataSource<DhMeteringGridAreaImbalance>([], {
    disableClientSideSort: true,
  });
  totalCount = 0;

  pageMetaData$ = this._store.pageMetaData$;
  sortMetaData$ = this._store.sortMetaData$;
  filters$ = this._store.filters$;

  documentIdSearch$ = new BehaviorSubject<string>('');

  isLoading = false;
  isDownloading = false;
  hasError = false;

  meteringGridAreaImbalance$ = this._store.queryVariables$.pipe(
    switchMap(({ filters, pageMetaData, documentId, sortMetaData }) =>
      this._apollo
        .watchQuery({
          fetchPolicy: 'cache-and-network',
          query: GetMeteringGridAreaImbalanceDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageMetaData.pageIndex + 1,
            pageSize: pageMetaData.pageSize,
            gridAreaCode: filters.gridArea,
            createdFrom: filters.created?.start,
            createdTo: filters.created?.end,
            calculationPeriod: filters.calculationPeriod,
            documentId,
            sortProperty: sortMetaData.sortProperty,
            sortDirection: sortMetaData.sortDirection,
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

    this._store.documentIdUpdate(this.documentIdSearch$.pipe(debounceTime(250)));
  }

  onFiltersEvent(filters: DhMeteringGridAreaImbalanceFilters): void {
    this._store.patchState((state) => ({
      ...state,
      filters,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    }));
  }

  onSortEvent(sortMetaData: Sort): void {
    this._store.patchState((state) => ({
      ...state,
      sortMetaData,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    }));
  }

  onPageEvent({ pageIndex, pageSize }: PageEvent): void {
    this._store.patchState((state) => ({ ...state, pageMetaData: { pageIndex, pageSize } }));
  }

  download() {
    this.isDownloading = true;

    this._store.queryVariables$
      .pipe(
        take(1),
        switchMap(({ filters, documentId, sortMetaData }) =>
          this._apollo.query({
            returnPartialData: false,
            fetchPolicy: 'no-cache',
            query: DownloadMeteringGridAreaImbalanceDocument,
            variables: {
              locale: translate('selectedLanguageIso'),
              gridAreaCode: filters.gridArea,
              createdFrom: filters.created?.start,
              createdTo: filters.created?.end,
              calculationPeriod: filters.calculationPeriod,
              valuesToInclude: filters.valuesToInclude,
              documentId,
              sortProperty: sortMetaData.sortProperty,
              sortDirection: sortMetaData.sortDirection,
            },
          })
        )
      )
      .subscribe({
        next: (result) => {
          this.isDownloading = result.loading;

          exportToCSVRaw({
            content: result?.data?.downloadMeteringGridAreaImbalance ?? '',
            fileName: 'eSett-metering-grid-area-imbalance-messages',
          });
        },
        error: () => {
          this.isDownloading = false;
          this._toastService.open({
            message: translate('shared.error.message'),
            type: 'danger',
          });
        },
      });
  }
}
