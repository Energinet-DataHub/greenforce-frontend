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
  OnInit,
} from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { sub, startOfDay, endOfDay } from 'date-fns';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { graphql } from '@energinet-datahub/dh/shared/domain';

import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { BatchSearchDto } from '@energinet-datahub/dh/shared/domain';

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { DhWholesaleBatchDetailsComponent } from './batch-details/dh-wholesale-batch-details.component';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';
import { ApolloError } from '@apollo/client/errors';

type Batch = Omit<graphql.Batch, 'gridAreas'>;

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
export class DhWholesaleSearchComponent implements AfterViewInit, OnInit {
  @ViewChild('batchDetails')
  batchDetails!: DhWholesaleBatchDetailsComponent;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private apollo = inject(Apollo);

  selectedBatch?: Batch;
  executionTime = {
    start: sub(startOfDay(new Date()), { days: 10 }).toISOString(),
    end: endOfDay(new Date()).toISOString(),
  };

  query = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetBatchesDocument,
    variables: { executionTime: this.executionTime },
  });

  error?: ApolloError;
  loading = false;
  batches?: Batch[];

  ngOnInit() {
    this.query.valueChanges.subscribe((result) => {
      this.error = result.error;
      this.loading = result.loading;
      this.batches = result.data?.batches;
    });
  }

  ngAfterViewInit() {
    const selectedBatch = this.route.snapshot.queryParams.batch;
    if (selectedBatch) this.batchDetails.open(selectedBatch);
    this.changeDetectorRef.detectChanges(); // TODO: Is this needed?
  }

  onSearch(search: BatchSearchDto) {
    this.changeDetectorRef.detectChanges(); // TODO: Is this needed?
    this.query.refetch({
      executionTime: {
        start: search.minExecutionTime,
        end: search.maxExecutionTime,
      },
    });
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
