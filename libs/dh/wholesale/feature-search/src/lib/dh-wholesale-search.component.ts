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
import { Component, NgModule, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattBadgeModule,
  WattButtonModule,
  WattBadgeType,
} from '@energinet-datahub/watt';

import { MatTableModule } from '@angular/material/table';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { map, of } from 'rxjs';
import { PushModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import {
  WholesaleSearchBatchResponseDto,
  WholesaleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';

@Component({
  selector: 'dh-wholesale-search',
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleSearchComponent implements OnInit {
  constructor(private store: DhWholesaleBatchDataAccessApiStore) {}

  columnIds = [
    'batchNumber',
    'periodFrom',
    'periodTo',
    'executionTime',
    'status',
  ];

  data$ = this.store.batches$.pipe(
    map((batches: Partial<WholesaleSearchBatchResponseDto>[]) => {
      return batches.map((batch) => ({
        ...batch,
        statusType: this.getStatusType(batch.status),
      }));
    })
  );

  private getStatusType(
    status: WholesaleStatus | undefined
  ): WattBadgeType | void {
    if (status === WholesaleStatus.Pending) {
      return 'warning';
    } else if (status === WholesaleStatus.Running) {
      return 'success';
    } else if (status === WholesaleStatus.Finished) {
      return 'info';
    } else if (status === WholesaleStatus.Failed) {
      return 'danger';
    }
  }

  ngOnInit(): void {
    this.store.getBatches(
      of({ minExecutionTime: 'qqwe', maxExecutionTime: 'qwe' })
    );
  }
}

@NgModule({
  imports: [
    WattButtonModule,
    TranslocoModule,
    DhFeatureFlagDirectiveModule,
    MatTableModule,
    PushModule,
    CommonModule,
    WattBadgeModule,
    DhSharedUiDateTimeModule,
  ],
  declarations: [DhWholesaleSearchComponent],
})
export class DhWholesaleSearchScam {}
