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
import { combineLatest } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import { WattDescriptionListComponent } from '@energinet-datahub/watt/description-list';

import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';
import { mapMetaData } from './meta-data';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { ActivatedRoute, Router } from '@angular/router';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apollo = inject(Apollo);

  query = this.apollo.watchQuery({
    query: graphql.GetProcessStepResultDocument,
    variables: {
      step: 1,
      batchId: this.route.parent?.snapshot.params['batchId'],
      gridArea: this.route.parent?.snapshot.params['gridAreaCode'],
      gln: 'grid_area',
    },
  });

  query2 = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetBatchDocument,
    variables: { id: this.route.parent?.snapshot.params['batchId'] },
  });

  processStepResults$ = this.store.processStepResults$;
  batch$ = this.store.selectedBatch$;
  metaData$ = mapMetaData(
    this.transloco.selectTranslation(),
    this.store.processStepResults$,
    this.store.selectedBatch$
  );
  vm$ = combineLatest({
    batch: this.batch$,
    gridArea: this.store.selectedGridArea$.pipe(exists()),
  });

  loadingProcessStepResultsErrorTrigger$ = this.store.loadingProcessStepResultsErrorTrigger$;

  ngOnInit() {
    this.query.valueChanges.subscribe((result) => {
      console.log(result);
    });

    this.query2.valueChanges.subscribe((result) => {
      console.log(result);
    });
  }
}
