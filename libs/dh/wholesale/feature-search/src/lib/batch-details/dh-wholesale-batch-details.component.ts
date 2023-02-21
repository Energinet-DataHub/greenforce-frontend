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
  ViewChild,
  inject,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { Apollo } from 'apollo-angular';

import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import {
  WattDrawerComponent,
  WattDrawerModule,
} from '@energinet-datahub/watt/drawer';

import { graphql } from '@energinet-datahub/dh/shared/domain';
import { DhWholesaleGridAreasComponent } from '../grid-areas/dh-wholesale-grid-areas.component';

import { navigateToWholesaleCalculationSteps } from '@energinet-datahub/dh/wholesale/routing';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DhSharedUiDateTimeModule,
    DhWholesaleGridAreasComponent,
    TranslocoModule,
    WattBadgeComponent,
    WattCardModule,
    WattDrawerModule,
    ...WATT_BREADCRUMBS,
    LetModule,
    WattSpinnerModule,
    WattEmptyStateModule,
  ],
  selector: 'dh-wholesale-batch-details',
  templateUrl: './dh-wholesale-batch-details.component.html',
  styleUrls: ['./dh-wholesale-batch-details.component.scss'],
})
export class DhWholesaleBatchDetailsComponent {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  @Output() closed = new EventEmitter<void>();

  private router = inject(Router);
  private apollo = inject(Apollo);
  private changeDetectorRef = inject(ChangeDetectorRef);

  batch?: graphql.Batch;

  open(id: string): void {
    console.log('opening', id);
    // TODO: unsub
    this.drawer.open();
    this.apollo
      .watchQuery({
        returnPartialData: true,
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetBatchDocument,
        variables: { id },
      })
      .valueChanges.subscribe((result) => {
        this.batch = result.data?.batch ?? undefined;
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
        console.log(this.batch);
      });
  }

  onGridAreaSelected(batch: graphql.Batch, gridArea: graphql.GridArea): void {
    navigateToWholesaleCalculationSteps(this.router, batch, gridArea);
  }
}
