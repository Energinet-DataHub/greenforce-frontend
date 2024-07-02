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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { RxPush } from '@rx-angular/template/push';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhAdminInviteUserStore,
  DhAdminUserStatusStore,
  User,
} from '@energinet-datahub/dh/admin/data-access-api';

import { GetUserByIdDocument, UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhTabsComponent } from './tabs/dh-drawer-tabs.component';
import { DhEditUserModalComponent } from '../edit/dh-edit-user-modal.component';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DhAdminInviteUserStore, DhAdminUserStatusStore],
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  imports: [
    RxPush,
    TranslocoDirective,
    MatMenuModule,

    WATT_MODAL,
    WATT_DRAWER,
    WattSpinnerComponent,
    WattButtonComponent,

    DhTabsComponent,
    DhUserStatusComponent,
    DhEditUserModalComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhUserDrawerComponent {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private inviteUserStore = inject(DhAdminInviteUserStore);
  private userStatusStore = inject(DhAdminUserStatusStore);

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  @ViewChild('deactivateConfirmationModal')
  deactivateConfirmationModal!: WattModalComponent;

  @ViewChild('reActivateConfirmationModal')
  reActivateConfirmationModal!: WattModalComponent;

  @Output() closed = new EventEmitter<void>();

  isEditUserModalVisible = false;

  userId = signal<string | null>(null);
  userIdWithDefaultValue = computed(() => this.userId() ?? '');

  selectedUserQuery = lazyQuery(GetUserByIdDocument);

  selectedUser = computed(() => this.selectedUserQuery.data()?.userById);
  isLoading = computed(() => this.selectedUserQuery.loading());

  refetch = effect(() => {
    const userId = this.userId();
    if (!userId) return;
    this.selectedUserQuery.refetch({ id: userId });
  });

  UserStatus = UserStatus;

  isReinviting$ = this.inviteUserStore.isSaving$;
  isDeactivating$ = this.userStatusStore.isSaving$;
  isReActivating$ = this.userStatusStore.isSaving$;

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
  }

  open(user: User): void {
    this.userId.set(user.id);
    this.drawer.open();
  }

  modalOnClose(): void {
    this.isEditUserModalVisible = false;
  }

  reinvite = () =>
    this.inviteUserStore.reinviteUser({
      id: this.userIdWithDefaultValue(),
      onSuccess: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reinviteSuccess'),
          type: 'success',
        }),
      onError: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reinviteError'),
          type: 'danger',
        }),
    });

  resetUser2Fa = () =>
    this.inviteUserStore.resetUser2Fa({
      id: this.userIdWithDefaultValue(),
      onSuccess: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reset2faSuccess'),
          type: 'success',
        }),
      onError: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reset2faError'),
          type: 'danger',
        }),
    });

  requestDeactivateUser = () => this.deactivateConfirmationModal.open();

  deactivate = (success: boolean) =>
    success &&
    this.userStatusStore.deactivateUser({
      id: this.userIdWithDefaultValue(),
      onSuccess: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.deactivateSuccess'),
          type: 'success',
        }),
      onError: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.deactivateError'),
          type: 'danger',
        }),
    });

  requestReActivateUser = () => this.reActivateConfirmationModal.open();

  reActivate = (success: boolean) =>
    success &&
    this.userStatusStore.reActivateUser({
      id: this.userIdWithDefaultValue(),
      onSuccess: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reactivateSuccess'),
          type: 'success',
        }),
      onError: () =>
        this.toastService.open({
          message: this.transloco.translate('admin.userManagement.drawer.reactivateError'),
          type: 'danger',
        }),
    });
}
