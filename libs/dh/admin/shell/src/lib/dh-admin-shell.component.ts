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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { AdminSubPaths, combinePaths } from '@energinet-datahub/dh/core/routing';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-admin-shell',
  standalone: true,
  template: `
    <watt-link-tabs *transloco="let t; read: 'admin.userManagement.tabs'">
      <watt-link-tab [label]="t('users.tabLabel')" [link]="getLink('users')" />
      <watt-link-tab [label]="t('roles.tabLabel')" [link]="getLink('roles')" />
      <watt-link-tab
        *dhPermissionRequired="['fas']"
        [label]="t('permissions.tabLabel')"
        [link]="getLink('permissions')"
      />
    </watt-link-tabs>
  `,
  imports: [TranslocoDirective, DhPermissionRequiredDirective, WATT_LINK_TABS],
})
export class DhAdminShellComponent {
  getLink = (path: AdminSubPaths) => combinePaths('admin', path);
}
