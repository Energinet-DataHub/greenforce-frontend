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
import { Component, ViewChild, inject, AfterViewInit } from '@angular/core';
import { LetModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';

import { ProcessStepType } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'dh-wholesale-production-per-gridarea',
  templateUrl: './production-per-gridarea.component.html',
  styleUrls: ['./production-per-gridarea.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DhSharedUiDateTimeModule,
    DhWholesaleTimeSeriesPointsComponent,
    LetModule,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonModule,
    WattCardModule,
    WattDrawerModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    ...WATT_BREADCRUMBS,
  ],
})
export class DhWholesaleProductionPerGridareaComponent
  implements AfterViewInit
{
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  private store = inject(DhWholesaleBatchDataAccessApiStore);

  batch$ = this.store.selectedBatch$;
  gridArea$ = this.store.selectedGridArea$;
  processStepResults$ = this.store.processStepResults$;
  loadingProcessStepResultsErrorTrigger$ =
    this.store.loadingProcessStepResultsErrorTrigger$;

  ngAfterViewInit(): void {
    combineLatest([this.batch$, this.gridArea$]).subscribe(
      ([batch, gridArea]) => {
        if (batch && gridArea) {
          this.store.getProcessStepResults({
            batchId: batch.batchId,
            gridAreaCode: gridArea.code,
            processStepResult: ProcessStepType.AggregateProductionPerGridArea,
          });
        }
      }
    );
  }
}
