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
import { Component, effect, input } from '@angular/core';
import { translate, TranslocoDirective } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  DhUserRolePermissionDetails,
  DhUserRoleWithPermissions,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

@Component({
  selector: 'dh-role-permissions',
  standalone: true,
  templateUrl: './dh-role-permissions.component.html',
  imports: [TranslocoDirective, WATT_TABLE, WATT_CARD],
})
export class DhRolePermissionsComponent {
  role = input.required<DhUserRoleWithPermissions | null>();

  readonly dataSource = new WattTableDataSource<DhUserRolePermissionDetails>(undefined);

  columns: WattTableColumnDef<DhUserRolePermissionDetails> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.role()?.permissions ?? [];
    });
  }

  translateHeader = (key: string) =>
    translate(`admin.userManagement.tabs.roles.table.columns.${key}`);
}
