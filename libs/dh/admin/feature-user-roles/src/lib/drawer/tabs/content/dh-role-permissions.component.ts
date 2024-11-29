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
