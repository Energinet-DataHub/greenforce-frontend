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
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { combineLatest, filter, first, skip, takeWhile, tap } from 'rxjs';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';

import { batch } from '@energinet-datahub/dh/wholesale/domain';
import {
  BatchState,
  ProcessStepResultRequestDtoV2,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhWholesaleProductionPerGridareaComponent } from './steps/production-per-gridarea.component';
import { navigateToWholesaleSearchBatch } from '@energinet-datahub/dh/wholesale/routing';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';
import { DhWholesaleEnergySuppliersComponent } from './energy-suppliers/dh-wholesale-energy-suppliers.component';

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
    DhWholesaleProductionPerGridareaComponent,
    DhWholesaleEnergySuppliersComponent,
  ],
})
export class DhWholesaleCalculationStepsComponent implements OnInit {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('drawer') drawer!: WattDrawerComponent;

  isDrawerOpen = false;

  batch$ = this.store.selectedBatch$.pipe(
    tap((batch) => {
      // Get batch if not already in store
      if (!batch) {
        this.store.getBatch(this.route.snapshot.params['batchId']);
      }

      // Redirect user to search batch page if batch is failed
      if ((batch as batch)?.executionState === BatchState.Failed)
        this.navigateToSearchBatch(batch);
    })
  );

  loadingBatchErrorTrigger$ = this.store.loadingBatchErrorTrigger$;

  gridArea$ = this.store.getGridArea$(
    this.route.snapshot.params['gridAreaCode']
  );

  ngOnInit() {
    if (this.getCurrentStep()) {
      this.openDrawer();
    }
  }

  getCurrentStep() {
    return this.route.firstChild?.snapshot.url?.[0]?.path;
  }

  openDrawer(commands?: unknown[]) {
    if (commands) {
      this.router.navigate(commands, { relativeTo: this.route });
    }

    this.isDrawerOpen = true;
    this.drawer?.open();

    combineLatest([this.batch$, this.gridArea$])
      .pipe(
        filter(([batch, gridArea]) => {
          return !!batch && !!gridArea;
        }),
        first()
      )
      .subscribe(([batch, gridArea]) => {
        if (batch && gridArea) {
          const gln =
            this.route.firstChild?.snapshot.url?.[1]?.path || 'grid_area';

          this.store.getProcessStepResults({
            batchId: batch.batchId,
            gridAreaCode: gridArea.code,
            timeSeriesType: TimeSeriesType.Production,
            gln,
          });
        }
      });
  }

  onDrawerClosed() {
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  navigateToSearchBatch(batch?: batch): void {
    navigateToWholesaleSearchBatch(this.router, batch?.batchId);
  }
}
