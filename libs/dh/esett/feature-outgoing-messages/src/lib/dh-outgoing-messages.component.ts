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
import { Component, computed, effect, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import {
  GetServiceStatusDocument,
  GetStatusReportDocument,
  ResendExchangeMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
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
  DhOutgoingMessagesSignalStore,
} from '@energinet-datahub/dh/esett/data-access-outgoing-messages';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { DhOutgoingMessagesTableComponent } from './table/dh-table.component';
import { DhOutgoingMessage } from './dh-outgoing-message';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

    WATT_CARD,
    WattIconComponent,
    WattButtonComponent,
    WattSearchComponent,
    WattPaginatorComponent,

    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,

    DhOutgoingMessagesTableComponent,
    DhOutgoingMessagesFiltersComponent,
  ],
  providers: [DhOutgoingMessagesSignalStore],
})
export class DhOutgoingMessagesComponent {
  private store = inject(DhOutgoingMessagesSignalStore);
  private toastService = inject(WattToastService);

  tableDataSource = new WattTableDataSource<DhOutgoingMessage>([], {
    disableClientSideSort: true,
  });

  totalCount = this.store.outgoingMessagesTotalCount;
  gridAreaCount = this.store.gridAreaCount;

  filters = this.store.filters;
  pageMetaData = this.store.pageMetaData;
  sort = this.store.sort;

  downloading = this.store.downloading;

  documentIdSearch$ = new BehaviorSubject<string>('');

  serviceStatusQuery = query(GetServiceStatusDocument, { fetchPolicy: 'cache-and-network' });
  serviceStatus = computed(() => this.serviceStatusQuery.data()?.esettServiceStatus ?? []);

  statusRaportQuery = query(GetStatusReportDocument);
  statusReport = computed(
    () => this.statusRaportQuery.data()?.esettExchangeStatusReport?.waitingForExternalResponse ?? 0
  );

  resendMutation = mutation(ResendExchangeMessagesDocument, {
    refetchQueries: [GetStatusReportDocument],
  });

  isLoading = computed(() => this.resendMutation.loading() || this.store.loading());
  hasError = computed(() => this.resendMutation.error() !== undefined || this.store.hasError());

  constructor() {
    this.documentIdSearch$.pipe(debounceTime(250), takeUntilDestroyed()).subscribe((documentId) => {
      this.store.documentIdUpdate(documentId);
    });

    effect(() => {
      this.tableDataSource.data = this.store.outgoingMessages();
    });
  }

  onFiltersEvent(filters: DhOutgoingMessagesFilters): void {
    this.store.updateFilter(filters);
  }

  onSortEvent(sortMetaData: Sort): void {
    this.store.updateSort(sortMetaData);
  }

  onPageEvent(page: PageEvent): void {
    this.store.updatePage(page);
  }

  async download() {
    const document = await this.store.downloadDocument();

    if ((document.loading === false && document.error) || document.errors) {
      this.toastService.open({
        message: translate('shared.error.message'),
        type: 'danger',
      });
      return;
    }

    exportToCSVRaw({
      content: document.data?.downloadEsettExchangeEvents ?? '',
      fileName: 'eSett-outgoing-messages',
    });
  }

  resend(): void {
    if (!this.isLoading()) {
      this.resendMutation.mutate();
    }
  }
}
