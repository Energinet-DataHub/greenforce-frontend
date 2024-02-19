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
import { BehaviorSubject, combineLatest, debounceTime, map, switchMap } from 'rxjs';
import { endOfDay, startOfDay, sub } from 'date-fns';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import {
  GetOutgoingMessagesDocument,
  GetServiceStatusDocument,
  GetStatusReportDocument,
  ResendExchangeMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { DhOutgoingMessagesTableComponent } from './table/dh-table.component';
import { DhOutgoingMessage } from './dh-outgoing-message';
import { DhOutgoingMessagesFilters } from './dh-outgoing-messages-filters';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { RxLet } from '@rx-angular/template/let';
import { Sort } from '@angular/material/sort';
import { dhExchangeSortMetadataMapper } from './util/dh-sort-metadata-mapper.operator';

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

      .resend-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        .watt-chip-label {
          padding: 10px;
        }
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
})
export class DhOutgoingMessagesComponent implements OnInit {
  private _apollo = inject(Apollo);
  private _destroyRef = inject(DestroyRef);

  tableDataSource = new WattTableDataSource<DhOutgoingMessage>([]);
  totalCount = 0;

  sortMetadata$ = new BehaviorSubject<Sort>({
    active: 'received',
    direction: 'desc',
  });

  private pageMetaData$ = new BehaviorSubject<Pick<PageEvent, 'pageIndex' | 'pageSize'>>({
    pageIndex: 0,
    pageSize: 100,
  });

  pageSize$ = this.pageMetaData$.pipe(map(({ pageSize }) => pageSize));

  isLoading = false;
  hasError = false;

  filter$ = new BehaviorSubject<DhOutgoingMessagesFilters>({
    period: {
      start: sub(startOfDay(new Date()), { days: 2 }),
      end: endOfDay(new Date()),
    },
  });

  serviceStatus$ = this._apollo
    .watchQuery({
      useInitialLoading: true,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      query: GetServiceStatusDocument,
    })
    .valueChanges.pipe(
      takeUntilDestroyed(),
      map(({ data }) => data?.esettServiceStatus ?? [])
    );

  statusReport$ = this._apollo
    .watchQuery({
      useInitialLoading: true,
      notifyOnNetworkStatusChange: true,
      query: GetStatusReportDocument,
    })
    .valueChanges.pipe(
      takeUntilDestroyed(),
      map(({ data }) => data?.esettExchangeStatusReport ?? 0)
    );

  documentIdSearch$ = new BehaviorSubject<string>('');

  private queryVariables$ = combineLatest({
    filters: this.filter$,
    pageMetaData: this.pageMetaData$,
    documentIdSearch: this.documentIdSearch$.pipe(debounceTime(250)),
    sortMetadata: this.sortMetadata$.pipe(dhExchangeSortMetadataMapper),
  }).pipe(
    map(({ filters, pageMetaData, documentIdSearch, sortMetadata }) => {
      return { filters: documentIdSearch ? {} : filters, pageMetaData, documentIdSearch, sortMetadata };
    })
  );

  outgoingMessages$ = this.queryVariables$.pipe(
    switchMap(
      ({ filters, pageMetaData, documentIdSearch, sortMetadata }) =>
        this._apollo.watchQuery({
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
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
            documentStatus: filters.status,
            periodFrom: filters.period?.start,
            periodTo: filters.period?.end,
            documentId: documentIdSearch,
            sortProperty: sortMetadata.sortProperty,
            sortDirection: sortMetadata.sortDirection
          },
        }).valueChanges
    ),
    takeUntilDestroyed()
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.esettExchangeEvents.items ?? [];
        this.totalCount = result.data?.esettExchangeEvents.totalCount ?? 0;

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

  download(): void {
    if (!this.tableDataSource.sort) {
      return;
    }

    const dataToSort = structuredClone<DhOutgoingMessage[]>(this.tableDataSource.filteredData);
    const dataSorted = this.tableDataSource.sortData(dataToSort, this.tableDataSource.sort);

    const outgoingMessagesPath = 'eSett.outgoingMessages';

    const headers = [
      `"${translate(outgoingMessagesPath + '.columns.created')}"`,
      `"${translate(outgoingMessagesPath + '.columns.id')}"`,
      `"${translate(outgoingMessagesPath + '.columns.calculationType')}"`,
      `"${translate(outgoingMessagesPath + '.columns.messageType')}"`,
      `"${translate(outgoingMessagesPath + '.columns.gridArea')}"`,
      `"${translate(outgoingMessagesPath + '.columns.status')}"`,
    ];

    const lines = dataSorted.map((message) => [
      `"${message.created.toISOString()}"`,
      `"${message.documentId}"`,
      `"${translate(outgoingMessagesPath + '.shared.calculationType.' + message.calculationType)}"`,
      `"${translate(outgoingMessagesPath + '.shared.messageType.' + message.timeSeriesType)}"`,
      `"${message.gridAreaCode}"`,
      `"${translate(outgoingMessagesPath + '.shared.documentStatus.' + message.documentStatus)}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'eSett-outgoing-messages' });
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
