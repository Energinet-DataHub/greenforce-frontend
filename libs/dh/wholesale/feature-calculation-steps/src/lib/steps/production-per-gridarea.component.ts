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
import { Component, ViewChild, inject } from '@angular/core';
import { LetModule } from '@rx-angular/template/let';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { combineLatest, map, Observable } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';

import { DhDatePipe } from 'libs/dh/shared/ui-date-time/src/lib/dh-date.pipe';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
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
import {
  WattDescriptionListComponent,
  WattDescriptionListGroups,
} from '@energinet-datahub/watt/description-list';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';

@Component({
  selector: 'dh-wholesale-production-per-gridarea',
  templateUrl: './production-per-gridarea.component.html',
  styleUrls: ['./production-per-gridarea.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
    WattDescriptionListComponent,
    PushModule,
  ],
})
export class DhWholesaleProductionPerGridareaComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  private store = inject(DhWholesaleBatchDataAccessApiStore);
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
}
