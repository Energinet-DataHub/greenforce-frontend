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
import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { ActorUserRole } from '@energinet-datahub/dh/admin/data-access-api';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhUserByIdMarketParticipant } from './types';

@Component({
  selector: 'dh-user-roles-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WATT_TABLE],
  styles: ``,
  template: `
    <watt-table
      *transloco="let t; prefix: 'admin.userManagement.tabs.roles'"
      [dataSource]="dataSource"
      [selection]="initialSelection"
      [columns]="columns"
      sortBy="name"
      sortDirection="asc"
      [selectable]="selectMode()"
      (selectionChange)="selectionChanged.emit($event)"
    >
      <ng-container
        *wattTableCell="columns['name']; header: t('assigned.columns.name'); let element"
      >
        {{ element.name }}
      </ng-container>
      <ng-container
        *wattTableCell="
          columns['description'];
          header: t('assigned.columns.description');
          let element
        "
      >
        {{ element.description }}
      </ng-container>
    </watt-table>
  `,
})
export class DhUserRolesTableComponent {
  readonly dataSource = new WattTableDataSource<ActorUserRole>([]);
  initialSelection: DhUserByIdMarketParticipant['userRoles'] = [];

  columns: WattTableColumnDef<ActorUserRole> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  actor = input.required<DhUserByIdMarketParticipant>();
  selectMode = input.required<boolean>();

  selectionChanged = output<ActorUserRole[]>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.actor().userRoles.filter(
        (userRole) => userRole.assigned || this.selectMode()
      );

      if (this.selectMode()) {
        this.initialSelection = this.actor().userRoles.filter((userRole) => userRole.assigned);
      }
    });
  }
}
