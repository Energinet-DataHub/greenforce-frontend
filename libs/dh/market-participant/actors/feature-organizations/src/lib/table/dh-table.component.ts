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
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhOrganization } from '@energinet-datahub/dh/market-participant/actors/domain';

@Component({
  selector: 'dh-organizations-table',
  standalone: true,
  templateUrl: './dh-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WATT_TABLE,
    WattEmptyStateComponent,
    VaterFlexComponent,
    VaterStackComponent,
  ],
})
export class DhOrganizationsTableComponent {
  columns: WattTableColumnDef<DhOrganization> = {
    cvrOrBusinessRegisterId: { accessor: 'businessRegisterIdentifier' },
    name: { accessor: 'name' },
  };

  id = input<string>();
  dataSource = input.required<WattTableDataSource<DhOrganization>>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  selectedRow = output<DhOrganization>();

  getActiveRow = () => this.dataSource().filteredData.find((row) => row.id === this.id());
}
