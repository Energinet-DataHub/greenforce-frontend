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
import { NgIf } from '@angular/common';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';

import { DhUsersTabComponent } from './tabs/users-tab/dh-users-tab.component';
import { DhUserRolesTabComponent } from './tabs/roles-tab/dh-roles-tab.component';
import { DhPermissionsTabComponent } from './tabs/permissions-tab/dh-permissions-tab.component';

@Component({
  selector: 'dh-admin-feature-user-management',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs'">
      <watt-tabs>
        <watt-tab [label]="t('users.tabLabel')">
          <dh-users-tab />
        </watt-tab>

        <watt-tab (changed)="roleTabSelected = true" [label]="t('roles.tabLabel')">
          <dh-roles-tab *ngIf="roleTabSelected" />
        </watt-tab>

        <watt-tab (changed)="permissionTabSelected = true" [label]="t('permissions.tabLabel')">
          <dh-permissions-tab *ngIf="permissionTabSelected" />
        </watt-tab>
      </watt-tabs>
    </ng-container>
  `,
  imports: [
    NgIf,
    TranslocoDirective,

    WATT_TABS,
    DhUsersTabComponent,
    DhUserRolesTabComponent,
    DhPermissionsTabComponent,
  ],
})
export class DhAdminFeatureUserManagementComponent {
  permissionTabSelected = false;
  roleTabSelected = false;
}
