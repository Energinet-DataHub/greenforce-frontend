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
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { TranslocoModule } from '@ngneat/transloco';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import {
  DhWholesaleTableComponent,
  settlementReportsTableColumns,
} from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';
import { Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { FilteredActorDto, graphql } from '@energinet-datahub/dh/shared/domain';
import sub from 'date-fns/sub';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

@Component({
  selector: 'dh-wholesale-settlement-reports',
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    DhWholesaleFormComponent,
    DhWholesaleTableComponent,
    LetModule,
    PushModule,
    TranslocoModule,
    WattEmptyStateModule,
    WattSpinnerModule,
    WattTopBarComponent,
    WattCardModule,
  ],
  templateUrl: './dh-wholesale-settlement-reports.component.html',
  styleUrls: ['./dh-wholesale-settlement-reports.component.scss'],
  providers: [DhWholesaleBatchDataAccessApiStore],
})
export class DhWholesaleSettlementReportsComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private selectedGridAreas?: string[];
  private selectedActor?: FilteredActorDto;

  loading = false;
  error = false;
  data: settlementReportsTableColumns[] = [];
  executionTime = {
    start: sub(new Date().setHours(0, 0, 0, 0), { days: 10 }).toISOString(),
    end: new Date().toISOString(),
  };

  query = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetSettlementReportsDocument,
    variables: { executionTime: this.executionTime },
  });
  filteredActors$ = this.store.filteredActors$.pipe(exists());

  ngOnInit() {
    this.store.getFilteredActors();

    this.query.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.data = result.data?.settlementReports
          .filter((x) => {
            if (this.selectedGridAreas && this.selectedGridAreas.length > 0) {
              return this.selectedGridAreas.includes(x.gridArea.code);
            } else {
              return true;
            }
          })
          .map((x) => {
            // Only enable download for grid access providers
            const download = !!this.selectedActor?.marketRoles?.includes('GridAccessProvider');
            return { ...x, download };
          });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange(filters: any) {
    this.selectedGridAreas = filters.gridAreas;
    this.selectedActor = filters.actor;
    this.query.refetch({
      executionTime: filters.executionTime,
      period: filters.period,
    });
  }

  onDownload(settlementReport: any) {
    console.log(settlementReport);
  }
}
