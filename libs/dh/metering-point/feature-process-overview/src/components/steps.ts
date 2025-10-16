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
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { GetMeteringPointProcessOverviewDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { ExtractNodeType } from '@energinet-datahub/dh/shared/util-apollo';

type MeteringPointProcess = ExtractNodeType<GetMeteringPointProcessOverviewDataSource>;

@Component({
  selector: 'dh-metering-point-process-overview-steps',
  imports: [TranslocoDirective, WATT_TABLE],
  template: `
    <watt-table
      *transloco="let resolveHeader; read: 'meteringPoint.processes.columns'"
      [dataSource]="dataSource"
      [columns]="columns"
      [resolveHeader]="resolveHeader"
    />
  `,
})
export class DhMeteringPointProcessOverviewSteps {
  readonly meteringPointProcessId = input.required<string>();

  dataSource = new WattTableDataSource<MeteringPointProcess>();

  columns: WattTableColumnDef<MeteringPointProcess> = {
    createdAt: { accessor: 'createdAt' },
    documentType: { accessor: 'documentType' },
  };
}
