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
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { BehaviorSubject, switchMap, map, combineLatest, catchError, of } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetBalanceResponsibleMessagesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';

import { DhBalanceResponsibleTableComponent } from './table/dh-table.component';
import { DhBalanceResponsibleMessage } from './dh-balance-responsible-message';
import { dhSortMetadataMapper } from './util/dh-sort-metadata-mapper.operator';

@Component({
  standalone: true,
  selector: 'dh-balance-responsible',
  templateUrl: './dh-balance-responsible.component.html',
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
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    WattButtonComponent,

    DhBalanceResponsibleTableComponent,
  ],
})
export class DhBalanceResponsibleComponent implements OnInit {
  private apollo = inject(Apollo);
  private destroyRef = inject(DestroyRef);

  private pageMetadata$ = new BehaviorSubject<Pick<PageEvent, 'pageIndex' | 'pageSize'>>({
    pageIndex: 0,
    pageSize: 100,
  });

  sortMetadata$ = new BehaviorSubject<Sort>({
    active: 'received',
    direction: 'desc',
  });

  tableDataSource = new WattTableDataSource<DhBalanceResponsibleMessage>([]);
  totalCount = 0;

  isLoading = false;
  hasError = false;

  pageSize$ = this.pageMetadata$.pipe(map(({ pageSize }) => pageSize));

  private queryVariables$ = combineLatest({
    pageMetadata: this.pageMetadata$,
    sortMetadata: this.sortMetadata$.pipe(dhSortMetadataMapper),
  });

  outgoingMessages$ = this.queryVariables$.pipe(
    switchMap(({ pageMetadata, sortMetadata }) =>
      this.apollo
        .watchQuery({
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetBalanceResponsibleMessagesDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageMetadata.pageIndex + 1,
            pageSize: pageMetadata.pageSize,
            sortProperty: sortMetadata.sortProperty,
            sortDirection: sortMetadata.sortDirection,
          },
        })
        .valueChanges.pipe(catchError(() => of({ loading: false, data: null, errors: [] })))
    )
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.balanceResponsible.page ?? [];
        this.totalCount = result.data?.balanceResponsible.totalCount ?? 0;

        this.hasError = !!result.errors;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  handlePageEvent({ pageIndex, pageSize }: PageEvent): void {
    this.pageMetadata$.next({ pageIndex, pageSize });
  }

  download(): void {
    if (!this.tableDataSource.sort) {
      return;
    }

    const dataToSort = structuredClone<DhBalanceResponsibleMessage[]>(
      this.tableDataSource.filteredData
    );
    const dataSorted = this.tableDataSource.sortData(dataToSort, this.tableDataSource.sort);

    const outgoingMessagesPath = 'eSett.balanceResponsible';

    const headers = [
      translate(outgoingMessagesPath + '.columns.validFrom'),
      translate(outgoingMessagesPath + '.columns.validTo'),
      translate(outgoingMessagesPath + '.columns.electricitySupplier'),
      translate(outgoingMessagesPath + '.columns.balanceResponsible'),
      translate(outgoingMessagesPath + '.columns.gridArea'),
      translate(outgoingMessagesPath + '.columns.meteringPointType'),
      translate(outgoingMessagesPath + '.columns.received'),
    ];

    const lines = dataSorted.map((message) => [
      message.validFromDate.toISOString(),
      message.validToDate?.toISOString() ?? '',
      message.supplierWithName?.value ?? '',
      message.balanceResponsibleWithName?.value ?? '',
      message.gridArea,
      translate('eSett.outgoingMessages.shared.messageType.' + message.meteringPointType),
      message.receivedDateTime.toISOString(),
    ]);

    exportToCSV({ headers, lines, fileName: 'eSett-balance-responsible-messages' });
  }
}
