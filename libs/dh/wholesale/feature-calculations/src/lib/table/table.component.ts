//#region License
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
//#endregion
import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  Input,
  signal,
  effect,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { MatMenuModule } from '@angular/material/menu';

import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDatePipe } from '@energinet-datahub/watt/date';

import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  CalculationsQueryInput,
  SortEnumType,
  OnCalculationUpdatedDocument,
  CalculationTypeQueryParameterV1,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { GetCalculationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhCalculationsFiltersComponent } from '../filters/filters.component';
import { DhCapacitySettlementsUploaderComponent } from '../file-uploader/dh-capacity-settlements-uploader.component';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';

@Component({
  imports: [
    MatMenuModule,
    TranslocoDirective,
    TranslocoPipe,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattDatePipe,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattIconComponent,
    WattTooltipDirective,
    DhCalculationsFiltersComponent,
    DhCapacitySettlementsUploaderComponent,
    DhPermissionRequiredDirective,
    DhProcessStateBadge,
  ],
  selector: 'dh-calculations-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsTableComponent {
  @Input() id?: string;
  @Output() selectedRow = new EventEmitter();
  @Output() create = new EventEmitter<void>();

  columns: WattTableColumnDef<Calculation> = {
    calculationType: { accessor: 'calculationType' },
    period: {
      accessor: (r) => (r.__typename === 'WholesaleAndEnergyCalculation' ? r.period : null),
      size: 'minmax(max-content, auto)',
    },
    executionType: { accessor: 'executionType' },
    executionTime: {
      accessor: (r) => r.startedAt ?? r.scheduledAt,
      size: 'minmax(max-content, auto)',
    },
    status: { accessor: 'state', size: 'max-content' },
  };

  filter = signal<CalculationsQueryInput>({
    calculationTypes: [
      CalculationTypeQueryParameterV1.Aggregation,
      CalculationTypeQueryParameterV1.BalanceFixing,
      CalculationTypeQueryParameterV1.WholesaleFixing,
      CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
      CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
      CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
      CalculationTypeQueryParameterV1.CapacitySettlement,
    ],
  });

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
