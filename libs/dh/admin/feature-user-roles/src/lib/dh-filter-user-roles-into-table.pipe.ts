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
import { Pipe, PipeTransform } from '@angular/core';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { UserRoleViewDto } from '@energinet-datahub/dh/shared/domain';

@Pipe({ name: 'filterUserRoles', standalone: true })
export class FilterUserRolesPipe implements PipeTransform {
  transform(userRoles: UserRoleViewDto[] | null | undefined, includeAllUserRoles: boolean = false) {
    return (userRoles || []).filter((userRole) => userRole.userActorId || includeAllUserRoles);
  }
}

@Pipe({ name: 'userRolesIntoTable', standalone: true })
export class UserRolesIntoTablePipe implements PipeTransform {
  readonly dataSource: WattTableDataSource<UserRoleViewDto> =
    new WattTableDataSource<UserRoleViewDto>();

  transform(userRoles: UserRoleViewDto[] | null | undefined) {
    this.dataSource.data = userRoles || [];
    return this.dataSource;
  }
}
