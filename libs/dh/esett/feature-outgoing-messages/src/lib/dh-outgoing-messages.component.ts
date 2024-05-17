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
import { BehaviorSubject, catchError, debounceTime, map, of, switchMap, take } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { RxLet } from '@rx-angular/template/let';
import { Sort } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource, WattPaginatorComponent } from '@energinet-datahub/watt/table';
import {
  DownloadEsettExchangeEventsDocument,
  GetOutgoingMessagesDocument,
  GetServiceStatusDocument,
  GetStatusReportDocument,
  ResendExchangeMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import {
  DhOutgoingMessagesFilters,
  DhOutgoingMessagesStore,
} from '@energinet-datahub/dh/esett/data-access-outgoing-messages';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { DhOutgoingMessagesTableComponent } from './table/dh-table.component';
import { DhOutgoingMessage } from './dh-outgoing-message';

@Component({
  standalone: true,
  selector: 'dh-outgoing-messages',
  templateUrl: './dh-outgoing-messages.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }

      .health-icons {
        display: flex;
        flex-direction: row;
      }

      .resend-container .watt-chip-label {
        padding: 10px;
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
    WattIconComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    VaterUtilityDirective,

    DhOutgoingMessagesFiltersComponent,
    DhOutgoingMessagesTableComponent,
  ],
  providers: [DhOutgoingMessagesStore],
})
export class DhOutgoingMessagesComponent implements OnInit {
  private _apollo = inject(Apollo);
  private _destroyRef = inject(DestroyRef);
  private _store = inject(DhOutgoingMessagesStore);
  private _toastService = inject(WattToastService);

  tableDataSource = new WattTableDataSource<DhOutgoingMessage>([], { disableClientSideSort: true });
  totalCount = 0;
  gridAreaCount = 0;

  filters$ = this._store.filters$;
  pageMetaData$ = this._store.pageMetaData$;
  sortMetaData$ = this._store.sortMetaData$;

  documentIdSearch$ = new BehaviorSubject<string>('');

  isLoading = false;
  isDownloading = false;
  hasError = false;

  serviceStatus$ = this._apollo
    .watchQuery({
      fetchPolicy: 'cache-and-network',
      query: GetServiceStatusDocument,
    })
    .valueChanges.pipe(
      takeUntilDestroyed(),
      map(({ data }) => data?.esettServiceStatus ?? [])
    );

  statusReport$ = this._apollo
    .watchQuery({
      query: GetStatusReportDocument,
    })
    .valueChanges.pipe(
      takeUntilDestroyed(),
      map(({ data }) => data?.esettExchangeStatusReport ?? 0)
    );

  /**
   * Represents an observable stream of outgoing messages.
   * Emits the result of a GraphQL query to retrieve outgoing messages based on the provided variables.
   * @type {Observable<QueryResult<GetOutgoingMessagesQuery>>}
   */
  outgoingMessages$ = this._store.queryVariables$.pipe(
    switchMap(({ filters, pageMetaData, documentId, sortMetaData }) =>
      this._apollo
        .watchQuery({
          fetchPolicy: 'cache-and-network',
          query: GetOutgoingMessagesDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageMetaData.pageIndex + 1,
            pageSize: pageMetaData.pageSize,
            calculationType: filters.calculationTypes,
            timeSeriesType: filters.messageTypes,
            gridAreaCode: filters.gridAreas,
            actorNumber: filters.actorNumber,
            documentStatus: filters.status,
            periodInterval: filters.period,
            createdInterval: filters.created,
            sentInterval: filters.latestDispatch,
            documentId,
            sortProperty: sortMetaData.sortProperty,
            sortDirection: sortMetaData.sortDirection,
          },
        })
        .valueChanges.pipe(catchError(() => of({ loading: false, data: null, errors: [] })))
    ),
    takeUntilDestroyed()
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.esettExchangeEvents.items ?? [];
        this.totalCount = result.data?.esettExchangeEvents.totalCount ?? 0;
        this.gridAreaCount = result.data?.esettExchangeEvents.gridAreaCount ?? 0;

        this.hasError = !!result.errors;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });

    this._store.documentIdUpdate(this.documentIdSearch$.pipe(debounceTime(250)));
  }

  onFiltersEvent(filters: DhOutgoingMessagesFilters): void {
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
            query: DownloadEsettExchangeEventsDocument,
            variables: {
              locale: translate('selectedLanguageIso'),
              periodInterval: filters.period,
              createdInterval: filters.created,
              sentInterval: filters.latestDispatch,
              gridAreaCode: filters.gridAreas,
              calculationType: filters.calculationTypes,
              timeSeriesType: filters.messageTypes,
              documentStatus: filters.status,
              documentId,
              actorNumber: filters.actorNumber,
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
            content: result?.data?.downloadEsettExchangeEvents ?? '',
            fileName: 'eSett-outgoing-messages',
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

  resend(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this._apollo
        .mutate({
          mutation: ResendExchangeMessagesDocument,
          refetchQueries: [GetStatusReportDocument],
        })
        .subscribe(() => (this.isLoading = false));
    }
  }
}
