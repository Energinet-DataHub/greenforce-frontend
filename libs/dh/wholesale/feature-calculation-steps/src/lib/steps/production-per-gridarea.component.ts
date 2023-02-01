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
import { LetModule } from '@rx-angular/template/let';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { combineLatest, map } from 'rxjs';

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

import { TimeSeriesType } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

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

  vm$ = combineLatest({
    batch: this.store.selectedBatch$.pipe(exists()),
    gridArea: this.store.selectedGridArea$.pipe(exists()),
  });

  processStepResults$ = this.store.processStepResults$;
  loadingProcessStepResultsErrorTrigger$ =
    this.store.loadingProcessStepResultsErrorTrigger$;

  ngAfterViewInit() {
    this.store.getProcessStepResults(
      this.vm$.pipe(
        map((vm) => ({
          batchId: vm.batch.batchId,
          gridAreaCode: vm.gridArea.code,
          timeSeriesType: TimeSeriesType.Production,
          gln: '' // TODO: THIS PROPERPLY BREAKS THE API
        }))
      )
    );
  }
}
