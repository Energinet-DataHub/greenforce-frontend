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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  OnInit,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';

import { VaterUtilityDirective, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  exportToCSV,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import {
  WattDataTableComponent,
  WattDataActionsComponent,
  WattDataFiltersComponent,
} from '@energinet-datahub/watt/data';
import {
  GetGridAreaOverviewDocument,
  GridAreaStatus,
  GridAreaType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhGridAreaStatusBadgeComponent } from './status-badge.component';
import { DhGridAreaDetailsComponent } from './details.component';
import { DhGridAreaRow } from '../types';

@Component({
  selector: 'dh-grid-areas',
  templateUrl: './grid-areas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    FormsModule,
    TranslocoPipe,
    TranslocoDirective,
    WATT_TABLE,
    WattButtonComponent,
    WattDropdownComponent,
    VaterUtilityDirective,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
    DhGridAreaStatusBadgeComponent,
    DhGridAreaDetailsComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
  ],
})
export class DhGridAreasComponent implements OnInit {
  private query = query(GetGridAreaOverviewDocument);

  columns: WattTableColumnDef<DhGridAreaRow> = {
    code: { accessor: 'code' },
    actor: { accessor: 'actor' },
    organization: { accessor: 'organization' },
    priceArea: { accessor: 'priceArea' },
    type: { accessor: 'type' },
    status: { accessor: 'status' },
  };

  gridAreas = computed<DhGridAreaRow[]>(
    () =>
      this.query.data()?.gridAreaOverviewItems.map((x) => ({
        actor: x.actor,
        code: x.code,
        id: x.id,
        organization: x.organizationName,
        period: {
          start: x.validFrom,
          end: x.validTo ?? null,
        },
        priceArea: x.priceAreaCode,
        status: x.status,
        type: x.type,
      })) ?? []
  );
  isLoading = this.query.loading;
  hasError = this.query.hasError;

  gridAreaTypeOptions = dhEnumToWattDropdownOptions(GridAreaType, [GridAreaType.NotSet]);
  gridAreaStatusOptions = dhEnumToWattDropdownOptions(GridAreaStatus);
  selectedGridAreaStatus = signal<GridAreaStatus[] | null>([GridAreaStatus.Active]);

  selectedGridAreaType = signal<GridAreaType | null>(null);

  activeRow = signal<DhGridAreaRow | undefined>(undefined);

  readonly dataSource = new WattTableDataSource<DhGridAreaRow>();

  constructor() {
    effect(() => {
      const statuses = this.selectedGridAreaStatus();
      const gridAreas = this.gridAreas();

      // Apply filters before assigning to table (pre-filter pattern)
      this.dataSource.data = gridAreas.filter(
        (gridArea) =>
          (gridArea.type === this.selectedGridAreaType() || this.selectedGridAreaType() === null) &&
          (statuses === null || statuses.includes(gridArea.status))
      );
    });
  }

  ngOnInit() {
    // Search only applies to the filtered data
    this.dataSource.filterPredicate = (data, filter) => {
      if (!filter) return true;

      const lowerCaseFilter = filter.toLowerCase();
      return (
        data.code.toLowerCase().includes(lowerCaseFilter) ||
        data.actor?.toLowerCase().includes(lowerCaseFilter) ||
        data.organization?.toLowerCase().includes(lowerCaseFilter) ||
        data.priceArea.toLowerCase().includes(lowerCaseFilter) ||
        translate(`marketParticipant.gridAreas.types.${data.type}`)
          .toLowerCase()
          .includes(lowerCaseFilter) ||
        translate(`marketParticipant.gridAreas.status.${data.status}`)
          .toLowerCase()
          .includes(lowerCaseFilter)
      );
    };
  }

  download() {
    if (!this.dataSource.sort) {
      return;
    }

    const dataSorted = this.dataSource.sortData(
      [...this.dataSource.filteredData],
      this.dataSource.sort
    );

    const columnsPath = 'marketParticipant.gridAreas.columns';

    const statusPath = 'marketParticipant.gridAreas.status';
    const typesPath = 'marketParticipant.gridAreas.types';

    const headers = [
      `"${translate(columnsPath + '.code')}"`,
      `"${translate(columnsPath + '.actor')}"`,
      `"${translate(columnsPath + '.organization')}"`,
      `"${translate(columnsPath + '.priceArea')}"`,
      `"${translate(columnsPath + '.type')}"`,
      `"${translate(columnsPath + '.status')}"`,
    ];

    const lines = dataSorted.map((gridArea) => [
      `"${gridArea.code}"`,
      `"${gridArea.actor}"`,
      `"${gridArea.organization}"`,
      `"${gridArea.priceArea}"`,
      `"${translate(typesPath + '.' + gridArea.type)}"`,
      `"${translate(statusPath + '.' + gridArea.status)}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Grid-areas' });
  }
}
