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
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import {
  DhDatePipe,
  DhDateTimePipe,
} from '@energinet-datahub/dh/shared/ui-date-time';
import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattCardModule } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListGroups,
} from '@energinet-datahub/watt/description-list';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';

import { batch } from '@energinet-datahub/dh/wholesale/domain';
import { DhWholesaleGridAreasComponent } from '../grid-areas/dh-wholesale-grid-areas.component';
import { navigateToWholesaleCalculationSteps } from '@energinet-datahub/dh/wholesale/routing';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DhWholesaleGridAreasComponent,
    TranslocoModule,
    WattBadgeComponent,
    WattCardModule,
    WattDrawerModule,
    ...WATT_BREADCRUMBS,
    LetModule,
    PushModule,
    WattSpinnerModule,
    WattEmptyStateModule,
    WattDescriptionListComponent,
  ],
  selector: 'dh-wholesale-batch-details',
  templateUrl: './dh-wholesale-batch-details.component.html',
  styleUrls: ['./dh-wholesale-batch-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleBatchDetailsComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  @Output() closed = new EventEmitter<void>();

  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  batchId$ = this.route.queryParamMap.pipe(
    map((params: ParamMap) => params.get('batch'))
  );
  batch$ = this.store.select((state) => state.selectedBatch);
  batchMetadata$: Observable<WattDescriptionListGroups> = combineLatest([
    this.transloco.selectTranslation(),
    this.batch$,
  ]).pipe(
    map(([translations, batch]) => {
      const datePipe = new DhDatePipe();
      const dateTimePipe = new DhDateTimePipe();
      return [
        {
          term: translations['wholesale.batchDetails.calculationPeriod'],
          description: `${datePipe.transform(
            batch?.periodStart
          )} - ${datePipe.transform(batch?.periodEnd)}`,
        },
        {
          term: translations['wholesale.batchDetails.executionTime'],
          description: dateTimePipe.transform(
            batch?.executionTimeStart
          ) as string,
        },
      ];
    })
  );
  errorTrigger$ = this.store.loadingBatchErrorTrigger$;

  open(): void {
    this.drawer.open();
  }

  onGridAreaSelected(batch: batch, gridArea: GridAreaDto): void {
    navigateToWholesaleCalculationSteps(this.router, batch, gridArea);
  }
}
