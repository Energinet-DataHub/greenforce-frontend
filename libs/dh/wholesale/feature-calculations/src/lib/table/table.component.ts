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
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';

import { Calculation } from '@energinet-datahub/dh/wholesale/domain';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared';

import {
  SortEnumType,
  CalculationsQueryInput,
  OnCalculationUpdatedDocument,
  CalculationTypeQueryParameterV1,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { GetCalculationsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { DhCalculationsFiltersComponent } from '../filters/filters.component';
import { DhCapacitySettlementsUploaderComponent } from '../file-uploader/dh-capacity-settlements-uploader.component';

@Component({
  imports: [
    RouterLink,
    MatMenuModule,
    TitleCasePipe,
    TranslocoPipe,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,

    WATT_TABLE,
    WattDatePipe,
    WattIconComponent,
    WattButtonComponent,
    WattTooltipDirective,
    WattDataTableComponent,
    WattDataFiltersComponent,

    DhProcessStateBadge,
    DhPermissionRequiredDirective,
    DhCalculationsFiltersComponent,
    DhCapacitySettlementsUploaderComponent,
  ],
  selector: 'dh-calculations-table',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhCalculationsTableComponent {
  id = input<string>();
  selectedRow = output<Calculation>();

  columns: WattTableColumnDef<Calculation> = {
    calculationType: { accessor: 'calculationType' },
    period: {
      accessor: (r) => ('period' in r ? r.period : 'yearMonth' in r ? r.yearMonth : null),
      size: 'minmax(max-content, auto)',
    },
    executionType: { accessor: 'executionType' },
    executionTime: {
      accessor: (r) => r.startedAt ?? r.scheduledAt,
      size: 'minmax(max-content, auto)',
    },
    status: { accessor: 'state', size: 'max-content' },
  };

  filter: CalculationsQueryInput = {
    calculationTypes: [
      CalculationTypeQueryParameterV1.Aggregation,
      CalculationTypeQueryParameterV1.BalanceFixing,
      CalculationTypeQueryParameterV1.WholesaleFixing,
      CalculationTypeQueryParameterV1.FirstCorrectionSettlement,
      CalculationTypeQueryParameterV1.SecondCorrectionSettlement,
      CalculationTypeQueryParameterV1.ThirdCorrectionSettlement,
      CalculationTypeQueryParameterV1.CapacitySettlement,
      CalculationTypeQueryParameterV1.MissingMeasurementsLog,
    ],
  };

  dataSource = new GetCalculationsDataSource({
    variables: {
      input: this.filter,
      order: { executionTime: SortEnumType.Desc },
    },
  });

  fetch = (input: CalculationsQueryInput) => this.dataSource.refetch({ input });

  activeRow = computed(() => this.dataSource.data.find((row) => row.id === this.id()));

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
