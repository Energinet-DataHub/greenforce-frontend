import { Component, computed, effect, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import type { ResultOf } from '@graphql-typed-document-node/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import { PermissionDetailDto } from '@energinet-datahub/dh/shared/domain';
import { GetPermissionDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

type UserRole = ResultOf<
  typeof GetPermissionDetailsDocument
>['permissionById']['userRoles'][number];

@Component({
  selector: 'dh-admin-permission-roles',
  templateUrl: './admin-permission-roles.component.html',
  standalone: true,
  imports: [TranslocoDirective, WATT_CARD, WATT_TABLE, VaterFlexComponent],
})
export class DhAdminPermissionRolesComponent {
  private readonly userRoles = computed(() => this.selectedPermission().userRoles ?? []);

  selectedPermission = input.required<PermissionDetailDto>();

  userRolesCount = computed(() => this.userRoles().length);

  dataSource = new WattTableDataSource<UserRole>();

  columns: WattTableColumnDef<UserRole> = {
    name: { accessor: 'name' },
    eicFunction: { accessor: 'eicFunction' },
  };

  constructor() {
    effect(() => {
      this.dataSource.data = this.userRoles();
    });
  }
}
