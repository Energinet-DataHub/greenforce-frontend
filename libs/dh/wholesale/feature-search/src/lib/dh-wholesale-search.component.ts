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
import {
  Component,
  inject,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { first, of, Subject } from 'rxjs';
import { LetModule, PushModule } from '@rx-angular/template';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

import { BatchDto, BatchSearchDto } from '@energinet-datahub/dh/shared/domain';
import { batch } from '@energinet-datahub/dh/wholesale/domain';

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
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
    WattTopBarComponent,
  ],
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
})
export class DhWholesaleSearchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('batchDetails') batchDetails!: DhWholesaleBatchDetailsComponent;

  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private toastService = inject(WattToastService);
  private translations = inject(TranslocoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);

  data$ = this.store.batches$;
  destroy$ = new Subject<void>();
  selectedBatch$ = this.store.selectedBatch$;
  selectedBatchErrorTrigger$ = this.store.loadingBatchErrorTrigger$;
  loadingBatchesTrigger$ = this.store.loadingBatches$;
  loadingBatchesErrorTrigger$ = this.store.loadingBatchesErrorTrigger$;

  searchSubmitted = false;

  ngAfterViewInit() {
    const selectedBatch = this.route.snapshot.queryParams.batch;
    if (selectedBatch) {
      this.store.getBatch(selectedBatch);
      this.batchDetails.open();
    } else {
      this.store.setSelectedBatch(undefined);
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(search: BatchSearchDto) {
    this.searchSubmitted = true;
    this.store.getBatches(of(search));
    this.changeDetectorRef.detectChanges();
  }

  onDownloadBasisData(batch: BatchDto) {
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

  onBatchSelected(batch: batch) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { batch: batch.batchId },
    });
    this.store.setSelectedBatch(batch);
    this.batchDetails.open();
  }

  onBatchDetailsClosed() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { batch: null },
    });
    this.store.setSelectedBatch(undefined);
  }
}
