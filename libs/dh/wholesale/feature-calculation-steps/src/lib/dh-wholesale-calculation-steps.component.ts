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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { ApolloError } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { Subject, takeUntil } from 'rxjs';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';

import { graphql } from '@energinet-datahub/dh/shared/domain';
import { navigateToWholesaleSearchBatch } from '@energinet-datahub/dh/wholesale/routing';
import { DhWholesaleActorsComponent } from './actors/dh-wholesale-actors.component';

@Component({
  templateUrl: './dh-wholesale-calculation-steps.component.html',
  styleUrls: ['./dh-wholesale-calculation-steps.component.scss'],
  standalone: true,
  imports: [
    ...WATT_BREADCRUMBS,
    ...WATT_EXPANDABLE_CARD_COMPONENTS,
    CommonModule,
    DhSharedUiDateTimeModule,
    LetModule,
    TranslocoModule,
    RouterModule,
    WattBadgeComponent,
    WattButtonModule,
    WattCardModule,
    WattDrawerModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattTopBarComponent,
    DhWholesaleActorsComponent,
  ],
})
export class DhWholesaleCalculationStepsComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  @ViewChild('drawer') drawer!: WattDrawerComponent;

  isDrawerOpen = false;

  batch?: graphql.Batch;
  gridArea?: graphql.GridArea;
  loading = false;
  error?: ApolloError;

  ngOnInit() {
    const routeGridAreaCode = this.route.snapshot.params['gridAreaCode'];

    this.apollo
      .watchQuery({
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetBatchDocument,
        variables: { id: this.route.snapshot.params['batchId'] },
      })
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        // Redirect user to search batch page if batch is failed
        if (result.data?.batch?.executionState === graphql.BatchState.Failed) {
          this.navigateToSearchBatch(result.data?.batch);
          return;
        }

        this.batch = result.data?.batch ?? undefined;
        this.gridArea = result.data?.batch?.gridAreas.find((g) => g.code === routeGridAreaCode);
        this.loading = result.loading;
        this.error = result.error;
      });

    const step = this.getCurrentStep();
    const gln = this.route.firstChild?.snapshot.url?.[1]?.path;
    if (step) this.openDrawer({ step, gln });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentStep() {
    return this.route.firstChild?.snapshot.url?.[0]?.path;
  }

  openDrawer(options: { step: string; gln?: string }) {
    const { step, gln } = options;
    this.router.navigate([step, gln].filter(Boolean), {
      relativeTo: this.route,
    });

    // This is used to open the drawer when the user navigates to the page with a step in the url
    this.isDrawerOpen = true;

    // This is used to open the drawer when the user clicks on a step in the list
    this.drawer?.open();
  }

  onDrawerClosed() {
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  navigateToSearchBatch(batch?: graphql.Batch): void {
    navigateToWholesaleSearchBatch(this.router, batch?.id);
  }
}
