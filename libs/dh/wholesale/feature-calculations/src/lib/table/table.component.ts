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
  Input,
  signal,
  effect,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe } from '@energinet-datahub/watt/date';

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
import {
  CalculationQueryInput,
  CalculationOrchestrationState,
  SortEnumType,
  OnCalculationUpdatedDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { GetCalculationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';

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
  CalculationOrchestrationState = CalculationOrchestrationState;

  @Input() id?: string;
  @Output() selectedRow = new EventEmitter();
  @Output() create = new EventEmitter<void>();

  columns: WattTableColumnDef<Calculation> = {
    calculationType: { accessor: 'calculationType' },
    period: { accessor: 'period', size: 'minmax(max-content, auto)' },
    executionType: { accessor: 'executionType' },
    executionTime: { accessor: 'executionTimeStart', size: 'minmax(max-content, auto)' },
    status: { accessor: 'state', size: 'max-content' },
  };

  filter = signal<CalculationQueryInput>({});

  dataSource = new GetCalculationsDataSource({
    variables: {
      input: this.filter(),
      order: { executionTime: SortEnumType.Desc },
    },
  });

  refetch = effect(() => this.dataSource.refetch({ input: this.filter() }));
  getActiveRow = () => this.dataSource.filteredData.find((row) => row.id === this.id);

  constructor() {
    this.dataSource.subscribeToMore({
      document: OnCalculationUpdatedDocument,
      updateQuery: (prev, options) => ({
        ...prev,
        calculations: prev.calculations && {
          ...prev.calculations,
          nodes: prev.calculations?.nodes?.map((c) =>
            c.id === options.subscriptionData.data.calculationUpdated.id
              ? options.subscriptionData.data.calculationUpdated
              : c
          ),
        },
      }),
    });
  }
}
