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
import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject, debounceTime, map } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { RxLet } from '@rx-angular/template/let';
import { Sort } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import {
  GetServiceStatusDocument,
  GetStatusReportDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import {
  DhOutgoingMessageSignalStore,
  DhOutgoingMessagesFilters,
} from '@energinet-datahub/dh/esett/data-access-outgoing-messages';

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
  providers: [DhOutgoingMessageSignalStore],
})
export class DhOutgoingMessagesComponent {
  private _apollo = inject(Apollo);

  store = inject(DhOutgoingMessageSignalStore);

  tableDataSource = computed(() => {
    return new WattTableDataSource<DhOutgoingMessage>(this.store.outgoingMessages(), {
      disableClientSideSort: true,
    });
  });

  documentIdSearch$ = new BehaviorSubject<string>('');

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

  constructor() {
    this.documentIdSearch$.pipe(takeUntilDestroyed(), debounceTime(250)).subscribe((documentId) => {
      this.store.updateDocumentId(documentId);
    });
  }

  onFiltersEvent(filters: DhOutgoingMessagesFilters): void {
    this.store.updateFilters(filters);
  }

  onSortEvent(sortMetaData: Sort): void {
    this.store.updateSort(sortMetaData);
  }

  onPageEvent(pageEvent: PageEvent): void {
    this.store.updatePaging(pageEvent);
  }

  download() {
    this.store.download(this.store.queryVariables);
  }

  resend(): void {
    this.store.resend();
  }
}
