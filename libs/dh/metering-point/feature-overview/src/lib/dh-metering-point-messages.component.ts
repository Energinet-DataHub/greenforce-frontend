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
import { Component, signal } from '@angular/core';
import { DhMessageArchiveSearchTableComponent } from '@energinet-datahub/dh/message-archive/feature-search';
import { ArchivedMessage, SortEnumType } from '@energinet-datahub/dh/shared/domain/graphql';
import { GetArchivedMessagesDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-metering-point-messages',
  imports: [
    DhMessageArchiveSearchTableComponent,
    WattCardComponent,
    WattPaginatorComponent,
    VaterFlexComponent,
    VaterUtilityDirective,
  ],
  styles: [
    `
      watt-paginator {
        margin: calc(-1 * var(--watt-space-m)) -24px -24px;
      }
    `,
  ],
  template: `
    <watt-card vater inset="ml">
      <vater-flex fill="vertical" gap="m">
        <dh-message-archive-search-table
          vater
          fill="vertical"
          [dataSource]="dataSource"
          [(activeRow)]="selection"
        />
        <watt-paginator [for]="dataSource" [length]="dataSource.totalCount" />
      </vater-flex>
    </watt-card>
  `,
})
export class DhMeteringPointMessagesComponent {
  selection = signal<ArchivedMessage | undefined>(undefined);
  dataSource = new GetArchivedMessagesDataSource({
    variables: {
      filter: '123',
      created: { start: new Date(), end: new Date() },
      order: { createdAt: SortEnumType.Desc },
    },
  });
}

// (open)="open($event)" (new)="new()"
//
