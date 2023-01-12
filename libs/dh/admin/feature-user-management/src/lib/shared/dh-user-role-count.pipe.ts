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
import { UserRoleView } from '@energinet-datahub/dh/shared/domain';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({ name: 'userRoleCount', standalone: true })
export class UserRoleCountPipe implements PipeTransform {
  constructor(private translocoService: TranslocoService) {}
  transform(userRoleView: UserRoleView | null) {
    const numberOfRoles =
      userRoleView?.organizations?.flatMap((org) =>
        org.actors?.flatMap((actor) => actor.userRoles)
      ).length ?? 0;

    return (
      numberOfRoles.toString() +
      ' ' +
      (numberOfRoles > 1
        ? this.translocoService.translate(
            'admin.userManagement.tabs.roles.roles'
          )
        : this.translocoService.translate(
            'admin.userManagement.tabs.roles.role'
          ))
    );
  }
}
