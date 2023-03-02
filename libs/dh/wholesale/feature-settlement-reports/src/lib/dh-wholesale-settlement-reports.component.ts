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

import { DhWholesaleTableComponent } from './table/dh-wholesale-table.component';
import { DhWholesaleFormComponent } from './form/dh-wholesale-form.component';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';
import {
  settlementReportsProcess,
  SettlementReportsProcessFilters,
} from '@energinet-datahub/dh/wholesale/domain';
import { Subject, takeUntil } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { graphql, ProcessType } from '@energinet-datahub/dh/shared/domain';

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
})
export class DhWholesaleSettlementReportsComponent implements OnInit, OnDestroy {
  private apollo = inject(Apollo);
  private destroy$ = new Subject<void>();

  loading = false;
  error = false;
  data: settlementReportsProcess[] = [];
  filters?: SettlementReportsProcessFilters;

  query = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetBatchesDocument,
  });

  ngOnInit() {
    this.query.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.loading = result.loading;

        if (result.data) {
          this.data = this.mapSettlementReports(
            result.data.batches as graphql.Batch[],
            this.filters
          );
        }
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

  onFilterChange(filters: SettlementReportsProcessFilters) {
    this.filters = filters;
    this.query.refetch({ executionTime: filters.executionTime });
  }

  // TODO: MOVE TO GraphQL and change fetchPolicy
  private mapSettlementReports(
    batches: graphql.Batch[],
    filters?: SettlementReportsProcessFilters
  ): settlementReportsProcess[] {
    return batches
      .filter((batch) => batch.executionState === graphql.BatchState.Completed)
      .filter((batch) => !!batch.gridAreas)
      .reduce((result: settlementReportsProcess[], batch) => {
        return result.concat(
          batch.gridAreas.map((gridArea) => ({
            ...batch,
            processType: ProcessType.BalanceFixing,
            gridAreaCode: gridArea.code,
            gridAreaName: gridArea.name,
          }))
        );
      }, [])
      .filter((settlementReport) => {
        if (filters?.gridArea) {
          return filters.gridArea.includes(settlementReport.gridAreaCode);
        }
        return true;
      })
      .filter((settlementReport) => {
        if (filters?.processType) {
          return filters.processType.includes(settlementReport.processType);
        }
        return true;
      });
  }
}
