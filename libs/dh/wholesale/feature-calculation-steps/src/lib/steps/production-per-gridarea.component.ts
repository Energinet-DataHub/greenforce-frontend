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
import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import {
  WattDescriptionListComponent,
  WattDescriptionListGroups,
} from '@energinet-datahub/watt/description-list';

import { DhWholesaleTimeSeriesPointsComponent } from '../time-series-points/dh-wholesale-time-series-points.component';
import { Apollo } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { ActivatedRoute } from '@angular/router';
import { DhDatePipe } from '@energinet-datahub/dh/shared/ui-date-time';

@Component({
  selector: 'dh-wholesale-production-per-gridarea',
  templateUrl: './production-per-gridarea.component.html',
  styleUrls: ['./production-per-gridarea.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DhWholesaleTimeSeriesPointsComponent,
    TranslocoModule,
    WattBadgeComponent,
    WattButtonModule,
    WattCardModule,
    WattDrawerModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    ...WATT_BREADCRUMBS,
    WattDescriptionListComponent,
  ],
})
export class DhWholesaleProductionPerGridareaComponent implements OnInit {
  @ViewChild(WattDrawerComponent) drawer!: WattDrawerComponent;

  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);

  loading = false;
  processStepError = false;
  batchError = false;

  processStepQuery = this.apollo.watchQuery({
    query: graphql.GetProcessStepResultDocument,
    errorPolicy: 'all',
    useInitialLoading: true,
    variables: {
      step: 1,
      batchId: this.route.parent?.snapshot.params['batchId'],
      gridArea: this.route.parent?.snapshot.params['gridAreaCode'],
      gln: 'grid_area',
    },
  });

  // could read from cache?
  batchQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetBatchDocument,
    variables: { id: this.route.parent?.snapshot.params['batchId'] },
  });

  batch?: graphql.Batch;
  gridArea?: graphql.GridArea;
  processStepResults?: graphql.ProcessStepResult;

  getMetadata(): WattDescriptionListGroups {
    const datePipe = new DhDatePipe();
    return [
      {
        term: translate('wholesale.processStepResults.meteringPointType'),
        description: translate(
          'wholesale.processStepResults.timeSeriesType.' + this.processStepResults?.timeSeriesType
        ),
      },
      {
        term: translate('wholesale.processStepResults.calculationPeriod'),
        description: `${datePipe.transform(this.batch?.period?.start)} - ${datePipe.transform(
          this.batch?.period?.end
        )}`,
      },
      {
        term: translate('wholesale.processStepResults.sum'),
        description: `${this.processStepResults?.sum} kWh`,
        forceNewRow: true,
      },
      {
        term: translate('wholesale.processStepResults.min'),
        description: `${this.processStepResults?.min} kWh`,
      },
      {
        term: translate('wholesale.processStepResults.max'),
        description: `${this.processStepResults?.max} kWh`,
      },
    ];
  }

  ngOnInit() {
    // TODO: Unsub
    this.processStepQuery.valueChanges.subscribe({
      next: (result) => {
        this.processStepResults = result.data?.processStep?.result ?? undefined;
        this.loading = result.loading;
        this.processStepError = !!result.errors;
      },
      error: () => {
        this.processStepError = true;
        this.loading = false;
      },
    });

    this.batchQuery.valueChanges.subscribe({
      next: (result) => {
        const routeGridArea = this.route.parent?.snapshot.params['gridAreaCode'];
        this.batch = result.data?.batch ?? undefined;
        this.gridArea = this.batch?.gridAreas[routeGridArea];
        this.batchError = !!result.errors;
      },
      error: () => {
        this.batchError = true;
        this.loading = false;
      },
    });
  }
}
