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
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { effect, inject, signal, Component, ChangeDetectionStrategy } from '@angular/core';

import { TranslocoDirective, translate } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';

import {
  GenerateCSV,
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective, DhDownloadButtonComponent,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';

import {
  GridAreaType,
  GridAreaStatus,
  GetGridAreaOverviewDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  WattDataTableComponent,
  WattDataFiltersComponent,
  WattDataActionsComponent,
} from '@energinet/watt/data';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { GetGridAreaOverviewDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';

import { GridArea } from '../types';
import { DhGridAreaStatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'dh-grid-areas',
  templateUrl: './grid-areas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0;
      }
    `,
  ],
  imports: [
    FormsModule,
    RouterOutlet,
    TranslocoDirective,
    WATT_TABLE,
    WattDropdownComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,

    VaterStackComponent,
    VaterUtilityDirective,

    DhDropdownTranslatorDirective,
    DhGridAreaStatusBadgeComponent,
    DhDownloadButtonComponent,
  ],
  providers: [DhNavigationService],
})
export class DhGridAreasComponent {
  private query = lazyQuery(GetGridAreaOverviewDocument);
  private generateCSV = GenerateCSV.fromQuery(this.query, (x) => x.gridAreaOverviewItems?.nodes);

  dataSource = new GetGridAreaOverviewDataSource({
    variables: {
      order: {
        code: 'ASC',
      },
    },
  });
  navigation = inject(DhNavigationService);
  columns: WattTableColumnDef<GridArea> = {
    code: { accessor: 'code' },
    actor: { accessor: 'actor' },
    organization: { accessor: 'organizationName' },
    priceArea: { accessor: 'priceAreaCode' },
    type: { accessor: 'type' },
    status: { accessor: 'status' },
  };

  gridAreaTypeOptions = dhEnumToWattDropdownOptions(GridAreaType, [GridAreaType.NotSet]);
  gridAreaStatusOptions = dhEnumToWattDropdownOptions(GridAreaStatus);

  selectedGridAreaStatuses = signal<GridAreaStatus[] | null>([GridAreaStatus.Active]);
  selectedGridAreaType = signal<GridAreaType | null>(null);

  constructor() {
    effect(() => {
      const gridAreaStatuses = this.selectedGridAreaStatuses();
      const gridAreaType = this.selectedGridAreaType();

      this.dataSource.refetch({
        statuses: gridAreaStatuses,
        type: gridAreaType,
      });
    });
  }

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigation.id());
  };

  async download() {
    const columnsPath = 'marketParticipant.gridAreas.columns';
    const statusPath = 'marketParticipant.gridAreas.status';
    const typesPath = 'marketParticipant.gridAreas.types';
    this.generateCSV
      .addVariables({
        ...this.dataSource.query.getOptions().variables,
        first: 10_000,
      })
      .addHeaders([
        `"${translate(columnsPath + '.code')}"`,
        `"${translate(columnsPath + '.actor')}"`,
        `"${translate(columnsPath + '.organization')}"`,
        `"${translate(columnsPath + '.priceArea')}"`,
        `"${translate(columnsPath + '.type')}"`,
        `"${translate(columnsPath + '.status')}"`,
      ])
      .mapLines((gridAreas) =>
        gridAreas.map((gridArea) => [
          `"${gridArea.code}"`,
          `"${gridArea.actor}"`,
          `"${gridArea.organizationName}"`,
          `"${gridArea.priceAreaCode}"`,
          `"${translate(typesPath + '.' + gridArea.type)}"`,
          `"${translate(statusPath + '.' + gridArea.status)}"`,
        ])
      )
      .generate('marketParticipant.gridAreas.fileName');
  }
}
