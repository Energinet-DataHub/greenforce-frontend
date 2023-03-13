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
import { Component, ViewChild, inject, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dh-wholesale-results',
  templateUrl: './dh-wholesale-results.component.html',
  styleUrls: ['./dh-wholesale-results.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DhWholesaleTimeSeriesPointsComponent,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonModule,
    WattCardModule,
    WattDrawerModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    ...WATT_BREADCRUMBS,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    DhSharedUiDateTimeModule,
  ],
})
export class DhWholesaleResultsComponent implements OnInit, OnDestroy {
  @Input() marketRole?: string;
  @Input() title?: string;

  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  loading = false;
  processStepError = false;
  batchError = false;

  batch?: graphql.Batch;
  gridArea?: graphql.GridArea;
  processStepResults?: graphql.ProcessStepResult;

  step = Number.parseInt(this.route.snapshot.url?.[0]?.path as string);
  batchId = this.route.parent?.snapshot.params['batchId'];
  gridAreaCode = this.route.parent?.snapshot.params['gridAreaCode'];
  gln = this.route.snapshot.params['gln'] ?? 'grid_area';

  processResultQuery = this.apollo.watchQuery({
    query: graphql.GetProcessStepResultDocument,
    errorPolicy: 'all',
    useInitialLoading: true,
    variables: {
      step: this.step,
      batchId: this.batchId,
      gridArea: this.gridAreaCode,
      gln: this.gln,
    },
  });

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.gln && params.gln === this.gln) return;
      this.processResultQuery.refetch({
        step: this.step,
        batchId: this.batchId,
        gridArea: this.gridAreaCode,
        gln: params.gln ?? 'grid_area',
      });
    });

    this.processResultQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.processStepResults = result.data?.processStep?.result ?? undefined;
        this.loading = result.loading;
        this.processStepError = !!result.errors;
      },
      error: () => {
        this.processStepError = true;
        this.loading = false;
      },
    });

    this.apollo
      .watchQuery({
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetBatchDocument,
        variables: { id: this.route.parent?.snapshot.params['batchId'] },
      })
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          const routeGridArea = this.route.parent?.snapshot.params['gridAreaCode'];
          this.batch = result.data?.batch ?? undefined;
          this.gridArea = this.batch?.gridAreas[routeGridArea];
          this.batchError = !!result.errors;
        },
        error: () => {
          this.batchError = true;
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
