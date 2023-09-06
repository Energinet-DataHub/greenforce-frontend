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
import { Component } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { endOfDay, startOfDay, sub } from 'date-fns';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSearchComponent } from '@energinet-datahub/watt/search';

import { DhOutgoingMessagesFiltersComponent } from './filters/dh-filters.component';
import { DhOutgoingMessagesTableComponent } from './table/dh-outgoing-messages-table.component';
import { DhOutgoingMessage } from './dh-outgoing-message';
import { GetESettOutgoingMessagesQueryVariables } from './dh-outgoing-messages-filters';

@Component({
  standalone: true,
  selector: 'dh-outgoing-messages',
  templateUrl: './dh-outgoing-messages.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      watt-card-title {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }

      watt-search {
        margin-left: auto;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WATT_CARD,
    WattSearchComponent,

    DhOutgoingMessagesFiltersComponent,
    DhOutgoingMessagesTableComponent,
  ],
})
export class DhOutgoingMessagesComponent {
  tableDataSource = new WattTableDataSource<DhOutgoingMessage>([]);

  searchInput$ = new BehaviorSubject<string>('');

  isLoading = false;
  hasError = false;

  filter$ = new BehaviorSubject<GetESettOutgoingMessagesQueryVariables>({
    period: {
      start: sub(startOfDay(new Date()), { days: 2 }),
      end: endOfDay(new Date()),
    },
  });
}
