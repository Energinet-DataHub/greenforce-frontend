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
import { output, computed, Component, viewChild } from '@angular/core';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';

import {
  DhRoleStatusComponent,
  DhTabDataGeneralErrorComponent,
} from '@energinet-datahub/dh/admin/shared';

import {
  UserRoleDto,
  UserRoleStatus,
  GetUserRoleWithPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDeactivedUserRoleComponent } from './deactivate.component';
import { DhDrawerRoleTabsComponent } from './tabs/dh-drawer-role-tabs.component';
import { DhEditUserRoleModalComponent } from '../edit/dh-edit-user-role-modal.component';

@Component({
  selector: 'dh-user-role-details',
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_MODAL,
    WATT_DRAWER,
    WattButtonComponent,

    DhPermissionRequiredDirective,

    DhRoleStatusComponent,
    DhDrawerRoleTabsComponent,
    DhEditUserRoleModalComponent,
    DhTabDataGeneralErrorComponent,
    DhDeactivedUserRoleComponent,
  ],
  template: ` @let userRole = userRoleWithPermissions();
    <watt-drawer
      *transloco="let t; read: 'admin.userManagement.drawer'"
      #drawer
      size="large"
      (closed)="onClose()"
      [loading]="isLoading()"
    >
      @if (drawer.isOpen && userRole) {
        <watt-drawer-topbar>
          <dh-role-status [status]="userRole.status" />
        </watt-drawer-topbar>
      }

      @if (drawer.isOpen && userRole) {
        <watt-drawer-heading>
          <h2>{{ userRole.name }}</h2>
        </watt-drawer-heading>
      }

      @if (basicUserRole?.status !== UserRoleStatus.Inactive) {
        <watt-drawer-actions>
          <watt-button
            *dhPermissionRequired="['user-roles:manage']"
            variant="secondary"
            (click)="deactivate.open()"
            [loading]="deactivate.isDeactivating()"
            >{{ t('disable') }}</watt-button
          >

          <watt-button
            *dhPermissionRequired="['user-roles:manage']"
            variant="secondary"
            (click)="isEditUserRoleModalVisible = true"
            >{{ t('editRole') }}</watt-button
          >
        </watt-drawer-actions>
      }

      @if (drawer.isOpen) {
        <watt-drawer-content>
          @if (userRole) {
            <dh-drawer-role-tabs [role]="userRole" />
          }

          @if (hasError()) {
            <dh-tab-data-general-error (reload)="reload()" />
          }
        </watt-drawer-content>
      }
    </watt-drawer>

    @if (isEditUserRoleModalVisible && userRole && userRole.status === 'ACTIVE') {
      <dh-edit-user-role-modal (closed)="modalOnClose($event)" />
    }

    <dh-deactivate-user-role [id]="basicUserRole?.id" #deactivate />`,
})
export class DhUserRoleDetailsComponent {
  private userRolesWithPermissionsQuery = lazyQuery(GetUserRoleWithPermissionsDocument);

  basicUserRole: UserRoleDto | null = null;

  UserRoleStatus = UserRoleStatus;

  userRoleWithPermissions = computed(() => this.userRolesWithPermissionsQuery.data()?.userRoleById);
  isLoading = this.userRolesWithPermissionsQuery.loading;
  hasError = this.userRolesWithPermissionsQuery.hasError;

  drawer = viewChild.required(WattDrawerComponent);

  confirmationModal = viewChild.required(WattModalComponent);

  isEditUserRoleModalVisible = false;

  closed = output<void>();
  userRoleDeactivated = output<void>();

  onClose(): void {
    this.drawer().close();
    this.closed.emit();
    this.basicUserRole = null;
  }

  onDeActivated(): void {
    this.drawer().close();
    this.userRoleDeactivated.emit();
    this.basicUserRole = null;
  }

  reload() {
    this.userRolesWithPermissionsQuery.refetch();
  }

  modalOnClose({ saveSuccess }: { saveSuccess: boolean }): void {
    this.isEditUserRoleModalVisible = false;

    if (saveSuccess) {
      this.reload();
    }
  }

  open(role: UserRoleDto): void {
    this.basicUserRole = role;
    this.drawer().open();

    this.userRolesWithPermissionsQuery.query({
      variables: {
        id: role.id,
      },
    });
  }
}
