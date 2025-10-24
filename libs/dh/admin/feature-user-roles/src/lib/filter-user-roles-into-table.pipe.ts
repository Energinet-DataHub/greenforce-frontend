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
import { Pipe, PipeTransform } from '@angular/core';

import { ActorUserRoles, ActorUserRole } from '@energinet-datahub/dh/admin/data-access-api';
import { WattTableDataSource } from '@energinet-datahub/watt/table';

@Pipe({ name: 'filterUserRoles' })
export class FilterUserRolesPipe implements PipeTransform {
  transform(userRoles: ActorUserRoles | null | undefined, includeAllUserRoles = false) {
    return (userRoles || []).filter((userRole) => userRole.assigned || includeAllUserRoles);
  }
}

@Pipe({ name: 'userRolesIntoTable' })
export class UserRolesIntoTablePipe implements PipeTransform {
  readonly dataSource = new WattTableDataSource<ActorUserRole>();

  transform(userRoles: ActorUserRoles | null | undefined) {
    this.dataSource.data = userRoles || [];
    return this.dataSource;
  }
}
