import { Component, effect, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import type { ResultOf } from '@graphql-typed-document-node/core';
import {
  GetArchivedMessagesDataSource,
  GetArchivedMessagesDocument,
  GetArchivedMessagesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
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
  variables = input<GetArchivedMessagesQueryVariables | null>(null);
  start = output();

  // dataSource = new GetArchivedMessagesDataSource();

  dataSource = new GetArchivedMessagesDataSource();
  refetch = effect(() => {
    const variables = this.variables();
    if (!variables) return;
    this.dataSource.query({ variables: { ...variables, first: 50 } });
  });

  columns: WattTableColumnDef<ArchivedMessage> = {
    messageId: { accessor: 'messageId' },
    documentType: { accessor: 'documentType' },
    senderGln: { accessor: 'senderNumber' },
    receiverGln: { accessor: 'receiverNumber' },
    createdDate: { accessor: 'createdAt' },
  };
}
