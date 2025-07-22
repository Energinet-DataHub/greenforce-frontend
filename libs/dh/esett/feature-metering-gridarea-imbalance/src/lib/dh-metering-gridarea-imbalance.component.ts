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
import { Component, DestroyRef, OnInit, AfterViewInit, inject, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { BehaviorSubject, Subject, catchError, debounceTime, of, switchMap, take } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattDataTableComponent,
  WattDataActionsComponent,
  WattDataFiltersComponent,
} from '@energinet-datahub/watt/data';
import { DhMeteringGridAreaImbalance } from './dh-metering-gridarea-imbalance';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  DownloadMeteringGridAreaImbalanceDocument,
  GetMeteringGridAreaImbalanceDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhMeteringGridAreaImbalanceFiltersComponent } from './filters/dh-filters.component';
import { DhMeteringGridAreaImbalanceFilters } from './dh-metering-gridarea-imbalance-filters';
import { DhMeteringGridAreaImbalanceStore } from './dh-metering-gridarea-imbalance.store';
import { DhMeteringGridAreaImbalanceDrawerComponent } from './drawer/dh-drawer.component';

@Component({
  selector: 'dh-metering-gridarea-imbalance',
  templateUrl: './dh-metering-gridarea-imbalance.component.html',
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
    RxPush,
    WattButtonComponent,
    VaterUtilityDirective,
    DhMeteringGridAreaImbalanceFiltersComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    WATT_TABLE,
    WattDatePipe,
    DhEmDashFallbackPipe,
    DhMeteringGridAreaImbalanceDrawerComponent,
  ],
  providers: [DhMeteringGridAreaImbalanceStore],
})
export class DhMeteringGridAreaImbalanceComponent implements OnInit, AfterViewInit {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(WattToastService);
  private readonly store = inject(DhMeteringGridAreaImbalanceStore);

  dataTable = viewChild(WattDataTableComponent);

  tableDataSource = new WattTableDataSource<DhMeteringGridAreaImbalance>([]);
  totalCount = 0;

  pageMetaData$ = this.store.pageMetaData$;
  sortMetaData$ = this.store.sortMetaData$;
  filters$ = this.store.filters$;

  private searchSubject = new Subject<string>();

  isLoading = false;
  isDownloading = false;
  hasError = false;

  activeRow: DhMeteringGridAreaImbalance | undefined = undefined;

  columns: WattTableColumnDef<DhMeteringGridAreaImbalance> = {
    documentDateTime: { accessor: 'documentDateTime' },
    receivedDateTime: { accessor: 'receivedDateTime' },
    id: { accessor: 'id' },
    gridArea: { accessor: 'gridArea' },
    period: { accessor: null },
  };

  drawer = viewChild.required(DhMeteringGridAreaImbalanceDrawerComponent);

  meteringGridAreaImbalance$ = this.store.queryVariables$.pipe(
    switchMap(({ filters, pageMetaData, documentId, sortMetaData }) =>
      this.apollo
        .watchQuery({
          fetchPolicy: 'cache-and-network',
          query: GetMeteringGridAreaImbalanceDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageMetaData.pageIndex + 1,
            pageSize: pageMetaData.pageSize,
            gridAreaCodes: filters.gridAreas,
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
    this.meteringGridAreaImbalance$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    // Set up debounced search
    this.searchSubject
      .pipe(
        debounceTime(300), // 300ms debounce
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.store.documentIdUpdate(value);
      });
  }

  ngAfterViewInit(): void {
    // Access the search component from the data table and listen to its changes
    const dataTableComponent = this.dataTable();
    if (dataTableComponent) {
      // Override the onSearch method to prevent client-side filtering
      dataTableComponent.onSearch = (value: string) => {
        // Use the subject for debounced server-side search instead of client-side filtering
        this.searchSubject.next(value);
        if (!value) dataTableComponent.clear.emit();
      };
    }
  }

  clearSearch(): void {
    // Clear search using the data table's search component
    const dataTableComponent = this.dataTable();
    if (dataTableComponent && dataTableComponent.search) {
      const searchComponent = dataTableComponent.search();
      if (searchComponent) {
        searchComponent.clear();
      }
    }
  }

  onFiltersEvent(filters: DhMeteringGridAreaImbalanceFilters): void {
    this.store.patchState((state) => ({
      ...state,
      filters,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    }));
  }

  onSortEvent(sortMetaData: Sort): void {
    this.store.patchState((state) => ({
      ...state,
      sortMetaData,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    }));
  }

  onPageEvent({ pageIndex, pageSize }: PageEvent): void {
    this.store.patchState((state) => ({ ...state, pageMetaData: { pageIndex, pageSize } }));
  }

  download() {
    this.isDownloading = true;

    this.store.queryVariables$
      .pipe(
        take(1),
        switchMap(({ filters, documentId, sortMetaData }) =>
          this.apollo.query({
            returnPartialData: false,
            fetchPolicy: 'no-cache',
            query: DownloadMeteringGridAreaImbalanceDocument,
            variables: {
              locale: translate('selectedLanguageIso'),
              gridAreaCodes: filters.gridAreas,
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
          this.toastService.open({
            message: translate('shared.error.message'),
            type: 'danger',
          });
        },
      });
  }

  onRowClick(activeRow: DhMeteringGridAreaImbalance): void {
    this.activeRow = activeRow;
    this.drawer().open(activeRow);
  }

  onClose(): void {
    this.activeRow = undefined;
  }
}
