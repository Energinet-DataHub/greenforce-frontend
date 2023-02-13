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
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhDatePipe } from 'libs/dh/shared/ui-date-time/src/lib/dh-date.pipe';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDescriptionListComponent, WattDescriptionListGroups } from '@energinet-datahub/watt/description-list';
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
    WattDescriptionListComponent,
    PushModule,
  ],
})
export class DhWholesaleConsumptionPerEnergySupplierComponent {
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  vm$ = combineLatest({
    batch: this.store.selectedBatch$.pipe(exists()),
    gridArea: this.store.selectedGridArea$.pipe(exists()),
  });
  processStepResults$ = this.store.processStepResults$;
  metaData$: Observable<WattDescriptionListGroups> = combineLatest([
    this.transloco.selectTranslation(),
    this.processStepResults$,
    this.vm$,
  ]).pipe(
    map(([translations, processStepResults, vm]) => {
      const datePipe = new DhDatePipe();

      return [
        {
          term: translations['wholesale.processStepResults.meteringPointType'],
          description:
            translations[
              'wholesale.processStepResults.processStepMeteringPointType.' +
                processStepResults?.processStepMeteringPointType
            ],
        },
        {
          term: translations['wholesale.processStepResults.calculationPeriod'],
          description: `${datePipe.transform(
            vm.batch?.periodStart
          )} - ${datePipe.transform(vm.batch?.periodEnd)}`,
        },
        {
          term: translations['wholesale.processStepResults.sum'],
          description: `${processStepResults?.sum} kWh`,
          forceNewRow: true,
        },
        {
          term: translations['wholesale.processStepResults.min'],
          description: `${processStepResults?.min} kWh`,
        },
        {
          term: translations['wholesale.processStepResults.max'],
          description: `${processStepResults?.max} kWh`,
        }
      ];
    })
  );

  loadingProcessStepResultsErrorTrigger$ =
    this.store.loadingProcessStepResultsErrorTrigger$;

  gln: () => string = () => this.route.snapshot.params['gln'];
}
