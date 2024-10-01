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

import { DhMessageArchiveSearchDetailsComponent } from './details.component';
import { DhMessageArchiveSearchStartComponent } from './start.component';
import { DhMessageArchiveSearchTableComponent } from './table.component';

@Component({
  selector: 'dh-message-archive-search-page',
  standalone: true,
  imports: [
    DhMessageArchiveSearchDetailsComponent,
    DhMessageArchiveSearchStartComponent,
    DhMessageArchiveSearchTableComponent,
  ],
  template: `
    <dh-message-archive-search-details #details (close)="table.clearSelection()" />
    <dh-message-archive-search-start #start (start)="table.fetch($event)" (clear)="table.reset()" />
    <dh-message-archive-search-table #table (open)="details.open($event)" (new)="start.open()" />
  `,
})
export class DhMessageArchiveSearchPageComponent {}
