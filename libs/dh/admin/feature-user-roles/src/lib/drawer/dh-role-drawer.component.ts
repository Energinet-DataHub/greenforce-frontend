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
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { provideComponentStore } from '@ngrx/component-store';

import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';

import {
  DhRoleStatusComponent,
  DhTabDataGeneralErrorComponent,
} from '@energinet-datahub/dh/admin/shared';
import { DhAdminUserRoleWithPermissionsManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { UserRoleDto } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDrawerRoleTabsComponent } from './tabs/dh-drawer-role-tabs.component';
import { DhEditUserRoleModalComponent } from '../edit/dh-edit-user-role-modal.component';

@Component({
  selector: 'dh-role-drawer',
  standalone: true,
  templateUrl: './dh-role-drawer.component.html',
  styleUrls: [`./dh-role-drawer.component.scss`],
  providers: [provideComponentStore(DhAdminUserRoleWithPermissionsManagementDataAccessApiStore)],
  imports: [
    RxLet,
    RxPush,
    TranslocoDirective,

    WATT_MODAL,
    WATT_DRAWER,
    WattButtonComponent,
    WattSpinnerComponent,

    DhPermissionRequiredDirective,

    DhRoleStatusComponent,
    DhDrawerRoleTabsComponent,
    DhEditUserRoleModalComponent,
    DhTabDataGeneralErrorComponent,
  ],
})
export class DhRoleDrawerComponent {
  private readonly store = inject(DhAdminUserRoleWithPermissionsManagementDataAccessApiStore);
  private toastService = inject(WattToastService);
  private translocoService = inject(TranslocoService);
  basicUserRole: UserRoleDto | null = null;

  userRoleWithPermissions$ = this.store.userRole$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  @ViewChild('confirmationModal') confirmationModal!: WattModalComponent;

  isEditUserRoleModalVisible = false;

  @Output() closed = new EventEmitter<void>();
  @Output() userRoleDeactivated = new EventEmitter<void>();

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.basicUserRole = null;
  }

  onDeActivated(): void {
    this.drawer.close();
    this.userRoleDeactivated.emit();
    this.basicUserRole = null;
  }

  open(role: UserRoleDto): void {
    this.basicUserRole = role;
    this.drawer.open();
    this.loadUserRoleWithPermissions();
  }

  modalOnClose({ saveSuccess }: { saveSuccess: boolean }): void {
    this.isEditUserRoleModalVisible = false;

    if (saveSuccess) {
      this.loadUserRoleWithPermissions();
    }
  }

  confirmationClosed(succes: boolean): void {
    if (succes && this.basicUserRole) {
      this.toastService.open({
        message: this.translocoService.translate('admin.userManagement.drawer.disablingUserRole'),
        type: 'info',
      });
      this.store.disableUserRole({
        userRoleId: this.basicUserRole.id,
        onSuccessFn: () => {
          this.toastService.open({
            message: this.translocoService.translate(
              'admin.userManagement.drawer.userroleDisabled'
            ),
            type: 'success',
          });
          this.onDeActivated();
        },
      });
    }
  }

  loadUserRoleWithPermissions() {
    if (this.basicUserRole) {
      this.store.getUserRole(this.basicUserRole.id);
    }
  }

  disableUserRole() {
    this.confirmationModal.open();
  }
}
