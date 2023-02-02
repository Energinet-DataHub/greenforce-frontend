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
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';

@Component({
  standalone: true,
  selector: 'dh-wholesale-consumption-per-energy-supplier',
  templateUrl: './consumption-per-energy-supplier.component.html',
  styleUrls: ['./consumption-per-energy-supplier.component.scss'],
  imports: [
    CommonModule,
    DhWholesaleTimeSeriesPointsComponent,
    LetModule,
    TranslocoModule,
    WattBadgeComponent,
    WattEmptyStateModule,
    WattSpinnerModule,
  ],
})
export class DhWholesaleConsumptionPerEnergySupplierComponent {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private route = inject(ActivatedRoute);

  vm$ = combineLatest({
    batch: this.store.selectedBatch$.pipe(exists()),
    gridArea: this.store.selectedGridArea$.pipe(exists()),
  });

  processStepResults$ = this.store.processStepResults$;
  loadingProcessStepResultsErrorTrigger$ =
    this.store.loadingProcessStepResultsErrorTrigger$;

  gln: () => string = () => this.route.snapshot.params['gln'];
}
