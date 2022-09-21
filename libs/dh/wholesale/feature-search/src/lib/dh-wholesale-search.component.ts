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
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { LetModule } from '@rx-angular/template';
import { TranslocoModule } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import {
  WattButtonModule,
  WattEmptyStateModule,
  WattSpinnerModule,
} from '@energinet-datahub/watt';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
import { zonedTimeToUtc } from 'date-fns-tz';

@Component({
  selector: 'dh-wholesale-search',
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleSearchComponent implements OnInit {
  constructor(private store: DhWholesaleBatchDataAccessApiStore) {}

  data$ = this.store.batches$;
  loadingBatchesErrorTrigger$ = this.store.loadingBatchesErrorTrigger$;

  ngOnInit(): void {
    this.store.getBatches(
      of({
        minExecutionTime: '2022-09-01T07:12:40.086Z',
        maxExecutionTime: zonedTimeToUtc(
          new Date(),
          'Europe/Copenhagen'
        ).toISOString(),
      })
    );
  }
}

@NgModule({
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    DhWholesaleTableComponent,
    LetModule,
    TranslocoModule,
    WattButtonModule,
    WattSpinnerModule,
    WattEmptyStateModule,
    MatCardModule,
  ],
  declarations: [DhWholesaleSearchComponent],
})
export class DhWholesaleSearchScam {}
