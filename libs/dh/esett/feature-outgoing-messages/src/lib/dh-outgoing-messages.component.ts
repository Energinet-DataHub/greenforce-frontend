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
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import {
  DownloadEsettExchangeEventsDocument,
  DownloadEsettExchangeEventsQueryVariables,
  ExchangeEventSearchResult,
  GetOutgoingMessagesDocument,
  GetOutgoingMessagesQueryVariables,
  GetServiceStatusDocument,
  GetStatusReportDocument,
  ResendExchangeMessagesDocument,
  SortEnumType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhEmDashFallbackPipe, exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { DhOutgoingMessagesFilters } from '@energinet-datahub/dh/esett/data-access-outgoing-messages';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { lazyQuery, mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet-datahub/watt/data';
import { GetOutgoingMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import type { ResultOf } from '@graphql-typed-document-node/core';
import { DhOutgoingMessageStatusBadgeComponent } from './status-badge/dh-outgoing-message-status-badge.component';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhOutgoingMessageDrawerComponent } from './drawer/dh-outgoing-message-drawer.component';
import { WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhOutgoingMessageDownloadComponent } from './dh-outgoing-messages-download.component';

type DhOutgoingMessages = NonNullable<
  ResultOf<typeof GetOutgoingMessagesDocument>['esettExchangeEvents']
>['items'];
type DhOutgoingMessage = NonNullable<DhOutgoingMessages>[0];

type Variables = Partial<GetOutgoingMessagesQueryVariables> &
  Partial<DownloadEsettExchangeEventsQueryVariables>;

@Component({
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
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    WATT_CARD,
    WattIconComponent,
    WattButtonComponent,
    WattDataTableComponent,
    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    WATT_TABLE,
    VaterUtilityDirective,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    DhEmDashFallbackPipe,
    WattDatePipe,
    DhOutgoingMessageStatusBadgeComponent,
    DhOutgoingMessagesFiltersComponent,
    DhOutgoingMessageDrawerComponent,
    DhOutgoingMessageDownloadComponent,
  ],
})
export class DhOutgoingMessagesComponent {
  private drawer = viewChild.required(DhOutgoingMessageDrawerComponent);

  activeRow: DhOutgoingMessage | undefined = undefined;
  serviceStatusQuery = query(GetServiceStatusDocument, { fetchPolicy: 'cache-and-network' });
  serviceStatus = computed(() => this.serviceStatusQuery.data()?.esettServiceStatus ?? []);

  statusRaportQuery = query(GetStatusReportDocument);
  statusReport = computed(
    () => this.statusRaportQuery.data()?.esettExchangeStatusReport?.waitingForExternalResponse ?? 0
  );

  resendMutation = mutation(ResendExchangeMessagesDocument, {
    refetchQueries: [GetStatusReportDocument],
  });

  variables = signal<Variables>({});

  columns: WattTableColumnDef<DhOutgoingMessage> = {
    lastDispatched: { accessor: 'lastDispatched' },
    id: { accessor: 'documentId' },
    energySupplier: { accessor: null },
    calculationType: { accessor: 'calculationType' },
    messageType: { accessor: 'timeSeriesType' },
    gridArea: { accessor: 'gridArea' },
    gridAreaCodeOut: { accessor: null },
    status: { accessor: 'documentStatus' },
  };

  dataSource = new GetOutgoingMessagesDataSource({
    variables: {
      order: {
        documentId: SortEnumType.Asc,
      },
    },
  });

  gridAreaCount = computed(
    () => this.dataSource.query.data()?.esettExchangeEvents?.gridAreaCount ?? 0
  );

  isLoading = this.resendMutation.loading;
  hasError = this.resendMutation.hasError;

  onRowClick(activeRow: DhOutgoingMessage): void {
    this.activeRow = activeRow;
    this.drawer().open(activeRow.documentId);
  }

  onClose(): void {
    this.activeRow = undefined;
  }

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
    this.variables.set(variables);
  };

  reset(): void {
    this.dataSource.refetch();
  }

  resend(): void {
    if (!this.isLoading()) {
      this.resendMutation.mutate();
    }
  }
}
