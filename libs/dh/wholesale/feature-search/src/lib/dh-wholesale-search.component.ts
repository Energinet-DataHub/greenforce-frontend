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
import { Component, inject, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template/push';
import { sub, startOfDay, endOfDay } from 'date-fns';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import {
  GetBatchesDocument,
  GetBatchesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { Batch } from '@energinet-datahub/dh/wholesale/domain';

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { DhWholesaleBatchDetailsComponent } from './batch-details/dh-wholesale-batch-details.component';

@Component({
  selector: 'dh-wholesale-search',
  standalone: true,
  imports: [
    CommonModule,
    DhWholesaleBatchDetailsComponent,
    DhWholesaleFormComponent,
    DhWholesaleTableComponent,
    PushModule,
    TranslocoModule,
    WATT_CARD,
    WattEmptyStateComponent,
    WattSearchComponent,
    WattSpinnerComponent,
  ],
  templateUrl: './dh-wholesale-search.component.html',
  styleUrls: ['./dh-wholesale-search.component.scss'],
})
export class DhWholesaleSearchComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('batchDetails')
  batchDetails!: DhWholesaleBatchDetailsComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  private routerBatchId = this.route.snapshot.queryParams.batch;

  selectedBatch?: Batch;

  filter$ = new BehaviorSubject<GetBatchesQueryVariables>({
    executionTime: {
      start: sub(startOfDay(new Date()), { days: 10 }).toISOString(),
      end: endOfDay(new Date()).toISOString(),
    },
  });

  batches$ = this.filter$.pipe(
    switchMap(
      (variables) =>
        this.apollo.watchQuery({
          pollInterval: 10000,
          useInitialLoading: true,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'network-only',
          query: GetBatchesDocument,
          variables: variables,
        }).valueChanges
    ),
    takeUntil(this.destroy$)
  );

  error = false;
  loading = false;
  search = '';
  batches: Batch[] = [];

  ngOnInit() {
    this.batches$.subscribe({
      next: (result) => {
        this.loading = result.loading;

        if (result.data?.batches) {
          this.batches = result.data.batches;
        }

        this.selectedBatch = this.batches?.find((batch) => batch.id === this.routerBatchId);
        this.error = !!result.errors;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  ngAfterViewInit() {
    if (this.routerBatchId) this.batchDetails.open(this.routerBatchId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBatchSelected(batch: Batch) {
    this.selectedBatch = batch;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { batch: batch.id },
    });

    this.batchDetails.open(batch.id);
  }

  onBatchDetailsClosed() {
    this.selectedBatch = undefined;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { batch: null },
    });
  }
}
