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
import { Component, Input, OnChanges } from '@angular/core';
import { translate, TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserRoleWithPermissionsDto } from '@energinet-datahub/dh/shared/domain';

import {
  WattTableDataSource,
  WattTableColumnDef,
  WATT_TABLE,
} from '@energinet-datahub/watt/table';

@Component({
  selector: 'dh-role-permissions',
  standalone: true,
  templateUrl: './dh-role-permissions.component.html',
  styles: [``],
  imports: [WATT_TABLE, WattCardModule, TranslocoModule],
})
export class DhRolePermissionsComponent implements OnChanges {
  @Input() role: UserRoleWithPermissionsDto | null = null;

  readonly dataSource: WattTableDataSource<string> = new WattTableDataSource(
    undefined
  );

  columns: WattTableColumnDef<string> = {
    name: { accessor: 0, cell: (row: string) => row },
  };

  ngOnChanges() {
    this.dataSource.data = this.role?.permissions ?? [];
  }

  translateHeader = (key: string) =>
    translate(`admin.userManagement.tabs.roles.table.columns.${key}`);
}
