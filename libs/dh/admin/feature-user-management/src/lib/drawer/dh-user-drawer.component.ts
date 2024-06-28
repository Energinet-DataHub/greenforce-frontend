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
  EnvironmentInjector,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';

import { RxPush } from '@rx-angular/template/push';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';

import { lazyQuery, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhAdminInviteUserStore,
  DhAdminUserStatusStore,
  UserOverviewItem,
} from '@energinet-datahub/dh/admin/data-access-api';

import { GetUserByIdDocument, UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhTabsComponent } from './tabs/dh-drawer-tabs.component';
import { DhEditUserModalComponent } from '../edit/dh-edit-user-modal.component';
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

    WATT_DRAWER,
    WattButtonComponent,
    WATT_MODAL,

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
  private environmentInjector = inject(EnvironmentInjector);

  @ViewChild('drawer')
  drawer!: WattDrawerComponent;

  @ViewChild('deactivateConfirmationModal')
  deactivateConfirmationModal!: WattModalComponent;

  @ViewChild('reActivateConfirmationModal')
  reActivateConfirmationModal!: WattModalComponent;

  selectedUser: UserOverviewItem | null = null;

  @Output() closed = new EventEmitter<void>();

  isEditUserModalVisible = false;

  userId = signal<string | null>(null);

  userQuery = lazyQuery(GetUserByIdDocument);

  refetch = effect(() => {
    this.userQuery.refetch({ id: this.userId() ?? '' });
  });

  UserStatus = UserStatus;

  isReinviting$ = this.inviteUserStore.isSaving$;
  isDeactivating$ = this.userStatusStore.isSaving$;
  isReActivating$ = this.userStatusStore.isSaving$;

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.selectedUser = null;
  }

  open(user: UserOverviewItem): void {
    this.selectedUser = user;
    this.userId.set(user.id);
    this.drawer.open();
  }

  modalOnClose(): void {
    this.isEditUserModalVisible = false;
  }

  reinvite = () =>
    this.inviteUserStore.reinviteUser({
      id: this.selectedUser?.id ?? '',
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
      id: this.selectedUser?.id ?? '',
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
      id: this.selectedUser?.id ?? '',
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
      id: this.selectedUser?.id ?? '',
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
