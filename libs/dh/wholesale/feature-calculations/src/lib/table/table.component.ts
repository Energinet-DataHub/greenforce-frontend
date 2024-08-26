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
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
  Input,
  signal,
  effect,
  computed,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableDataSource, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe, dayjs } from '@energinet-datahub/watt/date';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  VaterFlexComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { DhCalculationsFiltersComponent } from '../filters/filters.component';
import { Apollo } from 'apollo-angular';
import {
  GetCalculationsDocument,
  CalculationQueryInput,
  OnCalculationProgressDocument,
  GetCalculationsQuery,
  CalculationOrchestrationState,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';

type wholesaleTableData = WattTableDataSource<Calculation>;

@Component({
  standalone: true,
  imports: [
    TranslocoDirective,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattDatePipe,
    WattBadgeComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattEmptyStateComponent,
    WattIconComponent,
    WattTooltipDirective,
    DhCalculationsFiltersComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-calculations-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsTableComponent {
  private apollo = inject(Apollo);

  CalculationOrchestrationState = CalculationOrchestrationState;

  @Input() id?: string;
  @Output() selectedRow = new EventEmitter();
  @Output() create = new EventEmitter<void>();

  loading = false;
  error = false;

  filter = signal<CalculationQueryInput>({});

  variables = computed(() => ({
    input: {
      ...this.filter(),
      executionTime: {
        start: dayjs().startOf('day').subtract(30, 'days').toDate(),
        end: null,
      },
    },
  }));

  // TODO: Fix race condition when subscription returns faster than the query.
  // This is not a problem currently since subscriptions don't return any data
  // when the BFF is deployed to API Management. This will be fixed in a later PR.

  // Create a new query each time the filter changes rather than using `refetch`,
  // since `refetch` does not properly unsubscribe to the previous query.
  query = computed(() =>
    this.apollo.watchQuery({
      fetchPolicy: 'network-only',
      query: GetCalculationsDocument,
      variables: this.variables(),
    })
  );

  valueChanges = effect((OnCleanup) => {
    const subscription = this.query().valueChanges.subscribe({
      next: (result) => {
        this.loading = result.loading;
        this.error = !!result.errors;
        if (result.data?.calculations) this.dataSource.data = result.data.calculations;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });

    OnCleanup(() => subscription.unsubscribe());
  });

  subscribe = effect((onCleanup) => {
    const unsubscribe = this.query().subscribeToMore({
      document: OnCalculationProgressDocument,
      variables: this.variables(),
      updateQuery: (prev, options) =>
        this.updateQuery(prev, options.subscriptionData.data.calculationProgress),
    });

    onCleanup(() => unsubscribe());
  });

  dataSource: wholesaleTableData = new WattTableDataSource(undefined);
  columns: WattTableColumnDef<Calculation> = {
    calculationType: { accessor: 'calculationType' },
    executionType: { accessor: 'isInternal' },
    // eslint-disable-next-line sonarjs/no-duplicate-string
    period: { accessor: 'period', size: 'minmax(max-content, auto)' },
    executionTime: { accessor: 'executionTimeStart', size: 'minmax(max-content, auto)' },
    status: { accessor: 'state', size: 'max-content' },
  };

  getActiveRow = () => this.dataSource.data.find((row) => row.id === this.id);

  updateQuery = (prev: GetCalculationsQuery, calculation: Calculation) => {
    // Check if the updated calculation is already in the cache
    const isExistingCalculation = prev.calculations.some((c) => c.id === calculation.id);

    // If the calculation exists, update it with the new values
    const calculations = isExistingCalculation
      ? prev.calculations.map((c) => (c.id === calculation.id ? calculation : c))
      : prev.calculations;

    // If it was an update, replace the cached calculations with the updated
    // array, otherwise add the new calculation to the top of the list.
    return isExistingCalculation
      ? { ...prev, calculations }
      : { ...prev, calculations: [calculation, ...calculations] };
  };
}
