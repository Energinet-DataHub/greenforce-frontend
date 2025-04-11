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
import { Component, input, model } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import {
  WattTableCellDirective,
  WattTableColumnDef,
  WattTableComponent,
} from '@energinet-datahub/watt/table';

import type { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ArchivedMessage } from '@energinet-datahub/dh/message-archive/domain';

@Component({
  selector: 'dh-message-archive-search-table',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    WattTableComponent,
    WattTableCellDirective,
    WattDatePipe,
  ],
  template: `
    <watt-table
      *transloco="let resolveHeader; read: 'messageArchive.columns'"
      #table
      description="Search result"
      [dataSource]="dataSource()"
      [columns]="columns"
      [loading]="dataSource().loading"
      [resolveHeader]="resolveHeader"
      [activeRow]="activeRow()"
      (rowClick)="activeRow.set($event)"
    >
      <ng-container *wattTableCell="columns['documentType']; let row">
        {{ 'messageArchive.documentType.' + row.documentType | transloco }}
      </ng-container>
      <ng-container *wattTableCell="columns['sender']; let row">
        <div>
          {{ row.sender?.displayName }}
          <br />
          <span>{{ row.sender?.glnOrEicNumber }}</span>
        </div>
      </ng-container>
      <ng-container *wattTableCell="columns['receiver']; let row">
        <div>
          {{ row.receiver?.displayName }}
          <br />
          <span>{{ row.receiver?.glnOrEicNumber }}</span>
        </div>
      </ng-container>
      <ng-container *wattTableCell="columns['createdAt']; let row">
        {{ row.createdAt | wattDate: 'long' }}
      </ng-container>
    </watt-table>
  `,
})
export class DhMessageArchiveSearchTableComponent {
  protected columns: WattTableColumnDef<ArchivedMessage> = {
    messageId: { accessor: 'messageId' },
    documentType: { accessor: 'documentType' },
    sender: { accessor: (m) => m.sender?.displayName },
    receiver: { accessor: (m) => m.receiver?.displayName },
    createdAt: { accessor: 'createdAt' },
  };

  activeRow = model<ArchivedMessage>();
  dataSource = input.required<GetArchivedMessagesDataSource>();
}
