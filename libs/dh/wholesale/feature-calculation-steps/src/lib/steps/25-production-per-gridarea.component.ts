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
import {
  Component,
  Input,
  ViewChild,
  inject,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';

import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';
import { TranslocoModule } from '@ngneat/transloco';

import { batch } from '@energinet-datahub/dh/wholesale/domain';
import { navigateToWholesaleSearchBatch } from '@energinet-datahub/dh/wholesale/routing';
import {
  GridAreaDto,
  ProcessStepType,
} from '@energinet-datahub/dh/shared/domain';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { PushModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';

@Component({
  selector: 'dh-wholesale-production-per-gridarea',
  templateUrl: './25-production-per-gridarea.component.html',
  styleUrls: ['./25-production-per-gridarea.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    WattCardModule,
    WattBadgeModule,
    WattButtonModule,
    WattDrawerModule,
    DhWholesaleTimeSeriesPointsComponent,
    ...WATT_BREADCRUMBS,
    TranslocoModule,
    PushModule,
  ],
})
export class DhWholesaleProductionPerGridareaComponent
  implements AfterViewInit
{
  @Input() batch!: batch;
  @Input() gridArea!: GridAreaDto;
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  processStepResults$ = this.store.processStepResults$;

  ngAfterViewInit(): void {
    const selectedStep = this.route.snapshot.queryParams['step'];
    if (selectedStep) {
      this.openDetails();
    }
  }

  openDetails(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: 25 },
    });

    this.drawer.open();

    this.store.getProcessStepResults({
      batchId: this.batch.batchId,
      gridAreaCode: this.gridArea.code,
      processStepResult: ProcessStepType.AggregateProductionPerGridArea,
    });
  }

  onDrawerClosed(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { step: null },
    });
  }

  navigateToSearchBatch(batchId?: string): void {
    navigateToWholesaleSearchBatch(this.router, batchId);
  }
}
