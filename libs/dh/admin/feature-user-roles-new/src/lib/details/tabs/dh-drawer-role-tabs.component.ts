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
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { DhUserRoleWithPermissions } from '@energinet-datahub/dh/admin/data-access-api';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhRoleMasterDataComponent } from './content/dh-role-master-data.component';
import { DhRolePermissionsComponent } from './content/dh-role-permissions.component';
import { DhRoleAuditLogsComponent } from './content/dh-role-audit-logs.component';

@Component({
  selector: 'dh-drawer-role-tabs',
  standalone: true,
  styles: `
    dh-role-master-data,
    dh-role-permissions,
    dh-role-audit-logs {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.drawer.roles.tabs'">
      <watt-tabs>
        <watt-tab [label]="t('masterData.tabLabel')">
          <dh-role-master-data [role]="role()" />
        </watt-tab>
        <watt-tab *dhPermissionRequired="['fas']" [label]="t('permissions.tabLabel')">
          <dh-role-permissions [role]="role()" />
        </watt-tab>
        <watt-tab *dhPermissionRequired="['fas']" [label]="t('history.tabLabel')">
          <dh-role-audit-logs [role]="role()" />
        </watt-tab>
      </watt-tabs>
    </ng-container>
  `,
  imports: [
    TranslocoDirective,

    WattTabComponent,
    WattTabsComponent,

    DhRoleMasterDataComponent,
    DhRolePermissionsComponent,
    DhRoleAuditLogsComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhDrawerRoleTabsComponent {
  role = input.required<DhUserRoleWithPermissions>();
}
