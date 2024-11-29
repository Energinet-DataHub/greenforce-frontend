import { Pipe, PipeTransform } from '@angular/core';
import { DhActorUserRole, DhActorUserRoles } from '@energinet-datahub/dh/admin/shared';

import { WattTableDataSource } from '@energinet-datahub/watt/table';

@Pipe({ name: 'filterUserRoles', standalone: true })
export class FilterUserRolesPipe implements PipeTransform {
  transform(userRoles: DhActorUserRoles | null | undefined, includeAllUserRoles = false) {
    return (userRoles || []).filter((userRole) => userRole.assigned || includeAllUserRoles);
  }
}

@Pipe({ name: 'userRolesIntoTable', standalone: true })
export class UserRolesIntoTablePipe implements PipeTransform {
  readonly dataSource = new WattTableDataSource<DhActorUserRole>();

  transform(userRoles: DhActorUserRoles | null | undefined) {
    this.dataSource.data = userRoles || [];
    return this.dataSource;
  }
}
