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
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { UserRoleWithPermissionsDto } from '@energinet-datahub/dh/shared/domain';

import { DhRoleMasterDataComponent } from './content/dh-role-master-data.component';
import { DhRolePermissionsComponent } from './content/dh-role-permissions.component';
import { DhRoleAuditLogsComponent } from './content/dh-role-audit-logs.component';

@Component({
  selector: 'dh-drawer-role-tabs',
  standalone: true,
  templateUrl: './dh-drawer-role-tabs.component.html',
  styles: [
    `
      dh-role-master-data,
      dh-role-permissions,
      dh-role-audit-logs {
        padding: var(--watt-space-ml);
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    WattTabComponent,
    WattTabsComponent,
    DhRoleMasterDataComponent,
    DhRolePermissionsComponent,
    DhRoleAuditLogsComponent,
  ],
})
export class DhDrawerRoleTabsComponent {
  @Input() role: UserRoleWithPermissionsDto | null = null;
}
