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
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';

import { batch } from "@energinet-datahub/dh/wholesale/domain";
import { DhWholesaleGridAreasComponent } from '../grid-areas/dh-wholesale-grid-areas.component';
import { BatchGridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { WHOLESALE_CALCULATION_STEPS_PATH } from 'libs/dh/wholesale/feature-calculation-steps/src';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DhSharedUiDateTimeModule,
    DhWholesaleGridAreasComponent,
    TranslocoModule,
    WattBadgeModule,
    WattCardModule,
    WattDrawerModule,
    ...WATT_BREADCRUMBS,
  ],
  selector: 'dh-wholesale-batch-details',
  templateUrl: './dh-wholesale-batch-details.component.html',
  styleUrls: ['./dh-wholesale-batch-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleBatchDetailsComponent {
  @Input() batch!: batch;
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  router = inject(Router);
  route = inject(ActivatedRoute);

  open(): void {
    this.drawer.open();
  }

  onGridAreaSelected(gridArea: BatchGridAreaDto): void {
    this.router.navigate(
      [
        '..',
        WHOLESALE_CALCULATION_STEPS_PATH,
        this.batch.batchNumber,
        gridArea.gridAreaCode,
      ],
      {
        relativeTo: this.route,
        state: { batch: this.batch, gridArea: gridArea },
      }
    );
  }
}
