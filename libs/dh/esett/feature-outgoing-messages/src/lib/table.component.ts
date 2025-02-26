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
import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  SortEnumType,
  GetStatusReportDocument,
  GetServiceStatusDocument,
  GetOutgoingMessagesDocument,
  ResendExchangeMessagesDocument,
  GetOutgoingMessagesQueryVariables,
  DownloadEsettExchangeEventsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';

import {
  WattDataTableComponent,
  WattDataActionsComponent,
  WattDataFiltersComponent,
} from '@energinet-datahub/watt/data';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { GetOutgoingMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhOutgoingMessagesFiltersComponent } from './filters.component';
import { DhOutgoingMessageDownloadComponent } from './download.component';
import { DhOutgoingMessageStatusBadgeComponent } from './status.component';

import type { ResultOf } from '@graphql-typed-document-node/core';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { RouterOutlet } from '@angular/router';

type DhOutgoingMessages = NonNullable<
  ResultOf<typeof GetOutgoingMessagesDocument>['esettExchangeEvents']
>['items'];
type DhOutgoingMessage = NonNullable<DhOutgoingMessages>[0];

type Variables = Partial<GetOutgoingMessagesQueryVariables> &
  Partial<DownloadEsettExchangeEventsQueryVariables>;

@Component({
  selector: 'dh-outgoing-messages',
  templateUrl: './table.component.html',
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
  providers: [DhNavigationService],
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattDatePipe,
    WattIconComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,

    VaterStackComponent,
    VaterUtilityDirective,

    DhEmDashFallbackPipe,
    DhOutgoingMessageDownloadComponent,
    DhOutgoingMessagesFiltersComponent,
    DhOutgoingMessageStatusBadgeComponent,
  ],
})
export class DhOutgoingMessagesComponent {
  private navigation = inject(DhNavigationService);

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
    latestDispatched: { accessor: 'lastDispatched' },
    documentId: { accessor: 'documentId' },
    energySupplier: { accessor: null },
    calculationType: { accessor: 'calculationType' },
    timeSeriesType: { accessor: 'timeSeriesType' },
    gridAreaCode: { accessor: 'gridArea' },
    gridAreaCodeOut: { accessor: null },
    documentStatus: { accessor: 'documentStatus' },
  };

  dataSource = new GetOutgoingMessagesDataSource({
    variables: {
      order: {
        created: SortEnumType.Desc,
      },
    },
  });

  gridAreaCount = computed(
    () => this.dataSource.query.data()?.esettExchangeEvents?.gridAreaCount ?? 0
  );

  isLoading = this.resendMutation.loading;
  hasError = this.resendMutation.hasError;

  navigate(id: string) {
    this.navigation.navigate('details', id);
  }

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.documentId === this.navigation.id());
  };

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
