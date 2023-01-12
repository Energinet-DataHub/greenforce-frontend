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
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { UserRoleInfoDto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';

import { DhRolesTabTableComponent } from './dh-roles-tab-table.component';
import { Router } from '@angular/router';
import { dhAdminPath, dhAdminUserManagementPath, dhAdminUserRoleManagementCreatePath } from '@energinet-datahub/dh/admin/routing';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-roles-tab',
  templateUrl: './dh-roles-tab.component.html',
  styleUrls: ['./dh-roles-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    DhRolesTabTableComponent,
    DhSharedUiPaginatorComponent,
    WattButtonModule
  ],
})
export class DhUserRolesTabComponent {
  @Input() roles: UserRoleInfoDto[] = [];

  constructor(
    private router: Router
  ) {}

  readonly createUserRole = () => {
    const url = this.router.createUrlTree([
      dhAdminPath,
      dhAdminUserManagementPath,
      dhAdminUserRoleManagementCreatePath,
    ]);

    this.router.navigateByUrl(url);
  };
}
