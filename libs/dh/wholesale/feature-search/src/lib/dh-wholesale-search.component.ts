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
import { Component, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, of } from 'rxjs';
import { LetModule, PushModule } from '@rx-angular/template';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import {
  BatchDtoV2,
  BatchSearchDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  BatchVm,
  DhWholesaleTableComponent,
} from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { DhWholesaleBatchDetailsComponent } from './batch-details/dh-wholesale-batch-details.component';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';

@Component({
  selector: 'dh-wholesale-search',
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    DhWholesaleFormComponent,
    DhWholesaleTableComponent,
    DhWholesaleBatchDetailsComponent,
    LetModule,
    PushModule,
    TranslocoModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattTopBarComponent
  ],
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleSearchComponent {
  @ViewChild('batchDetails') batchDetails!: DhWholesaleBatchDetailsComponent;

  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private toastService = inject(WattToastService);
  private translations = inject(TranslocoService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  data$ = this.store.batches$;
  loadingBatchesTrigger$ = this.store.loadingBatches$;
  loadingBatchesErrorTrigger$ = this.store.loadingBatchesErrorTrigger$;

  searchSubmitted = false;
  selectedBatch: BatchVm | null = null;

  onSearch(search: BatchSearchDto) {
    this.searchSubmitted = true;
    this.store.getBatches(of(search));
  }

  onDownloadBasisData(batch: BatchDtoV2) {
    this.store.getZippedBasisData(of(batch));
    this.store.loadingBasisDataErrorTrigger$.pipe(first()).subscribe(() => {
      this.toastService.open({
        message: this.translations.translate(
          'wholesale.searchBatch.downloadFailed'
        ),
        type: 'danger',
      });
    });
  }

  onBatchSelected(batch: BatchVm) {
    this.selectedBatch = batch;
    this.changeDetectorRef.detectChanges();

    this.batchDetails.open();
  }
}
