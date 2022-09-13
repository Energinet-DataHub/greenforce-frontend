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
import { Component, NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { WattButtonModule } from '@energinet-datahub/watt';

import { MatTableModule } from '@angular/material/table';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  selector: 'dh-wholesale-search',
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleSearchComponent {
  constructor(private store: DhWholesaleBatchDataAccessApiStore) {}

  columnIds = [
    'batchNumber',
    'periodFrom',
    'periodTo',
    'executionTime',
    'status'
  ];
}

@NgModule({
  imports: [
    WattButtonModule,
    TranslocoModule,
    DhFeatureFlagDirectiveModule,
    MatTableModule,
  ],
  declarations: [DhWholesaleSearchComponent],
})
export class DhWholesaleSearchScam {}
