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
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject, switchMap, map } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetBalanceResponsibleMessagesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { DhBalanceResponsibleTableComponent } from './table/dh-table.component';
import { DhBalanceResponsibleMessage } from './dh-balance-responsible-message';

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

    DhBalanceResponsibleTableComponent,
  ],
})
export class DhBalanceResponsibleComponent implements OnInit {
  private apollo = inject(Apollo);
  private destroyRef = inject(DestroyRef);

  private pageMetaData$ = new BehaviorSubject<Pick<PageEvent, 'pageIndex' | 'pageSize'>>({
    pageIndex: 0,
    pageSize: 100,
  });

  tableDataSource = new WattTableDataSource<DhBalanceResponsibleMessage>([]);
  totalCount = 0;

  isLoading = false;
  hasError = false;

  pageSize$ = this.pageMetaData$.pipe(map(({ pageSize }) => pageSize));

  outgoingMessages$ = this.pageMetaData$.pipe(
    switchMap(
      ({ pageIndex, pageSize }) =>
        this.apollo.watchQuery({
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'cache-and-network',
          query: GetBalanceResponsibleMessagesDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageIndex + 1,
            pageSize,
            // Note: Search functionality intentionally left out for now
            searchText: '',
          },
        }).valueChanges
    ),
    takeUntilDestroyed(this.destroyRef)
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.searchEsettBalanceResponsible.items;
        this.totalCount = result.data?.searchEsettBalanceResponsible.totalCount;

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
}
