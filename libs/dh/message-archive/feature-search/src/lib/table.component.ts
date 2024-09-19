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
import { Component, effect, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import type { ResultOf } from '@graphql-typed-document-node/core';
import {
  GetArchivedMessagesDocument,
  GetArchivedMessagesQueryVariables,
  SortEnumType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattTableColumnDef, WattTableComponent } from '@energinet-datahub/watt/table';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';

type ArchivedMessage = NonNullable<
  NonNullable<ResultOf<typeof GetArchivedMessagesDocument>['archivedMessages']>['nodes']
>[number];

@Component({
  selector: 'dh-message-archive-search-table',
  standalone: true,
  imports: [
    TranslocoDirective,
    WattButtonComponent,
    WattDataTableComponent,
    WattTableComponent,
    VaterUtilityDirective,
  ],
  template: `
    <watt-data-table *transloco="let t; read: 'messageArchive.search'" vater inset="ml">
      <h3>{{ t('searchResult') }}</h3>
      <watt-button variant="secondary" icon="plus" (click)="start.emit()">
        {{ t('new') }}
      </watt-button>
      <watt-table
        #table
        description="Search result"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="t"
      />
    </watt-data-table>
  `,
})
export class DhMessageArchiveSearchTableComponent {
  variables = input<GetArchivedMessagesQueryVariables | undefined>();
  start = output();

  dataSource = new GetArchivedMessagesDataSource({
    skip: true,
    variables: {
      created: { start: new Date(), end: new Date() },
      order: { createdAt: SortEnumType.Desc },
    },
  });

  refetch = effect(() => this.variables() && this.dataSource.refetch(this.variables()));

  columns: WattTableColumnDef<ArchivedMessage> = {
    messageId: { accessor: 'messageId' },
    documentType: { accessor: 'documentType' },
    senderNumber: { accessor: (m) => m.sender?.displayName },
    receiverNumber: { accessor: (m) => m.receiver?.displayName },
    createdAt: { accessor: 'createdAt' },
  };
}
