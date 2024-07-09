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
  effect,
  inject,
  output,
  signal,
  computed,
  Component,
  viewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattModalComponent, WATT_MODAL, WattModalService } from '@energinet-datahub/watt/modal';

import { DhUser, DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  UserStatus,
  Reset2faDocument,
  GetUserByIdDocument,
  ReInviteUserDocument,
  DeactivedUserDocument,
  ReActivedUserDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhTabsComponent } from './tabs/dh-drawer-tabs.component';
import { DhEditUserModalComponent } from '../edit/dh-edit-user-modal.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-user-drawer',
  standalone: true,
  templateUrl: './dh-user-drawer.component.html',
  imports: [
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
  private modalService = inject(WattModalService);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);

  drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  deactivateConfirmationModal = viewChild.required<WattModalComponent>(
    'deactivateConfirmationModal'
  );

  reActivateConfirmationModal = viewChild.required<WattModalComponent>(
    'reActivateConfirmationModal'
  );

  closed = output<void>();

  userId = signal<string | null>(null);
  userIdWithDefaultValue = computed(() => this.userId() ?? '');

  selectedUserQuery = lazyQuery(GetUserByIdDocument);

  selectedUser = computed(() => this.selectedUserQuery.data()?.userById);
  isLoading = computed(() => this.selectedUserQuery.loading());

  UserStatus = UserStatus;

  reInviteUserMutation = mutation(ReInviteUserDocument);
  reset2faMutation = mutation(Reset2faDocument);
  deactivedUserMutation = mutation(DeactivedUserDocument);
  reActivateUserMutation = mutation(ReActivedUserDocument);

  isReinviting = this.reInviteUserMutation.loading;
  isDeactivating = this.deactivedUserMutation.loading;
  isReActivating = this.reActivateUserMutation.loading;

  constructor() {
    effect(() => {
      const userId = this.userId();
      if (!userId) return;
      this.selectedUserQuery.refetch({ id: userId });
    });
  }

  onClose(): void {
    this.drawer().close();
    this.closed.emit();
  }

  open(user: DhUser): void {
    this.userId.set(user.id);
    this.drawer().open();
  }

  showEditUserModal(): void {
    this.modalService.open({
      component: DhEditUserModalComponent,
      data: this.selectedUser(),
    });
  }

  reinvite = () =>
    this.reInviteUserMutation
      .mutate({
        variables: { input: { userId: this.userIdWithDefaultValue() } },
      })
      .then(() => this.showToast('success', 'reinviteSuccess'))
      .catch(() => this.showToast('danger', 'reinviteError'));

  resetUser2Fa = () =>
    this.reset2faMutation
      .mutate({ variables: { input: { userId: this.userIdWithDefaultValue() } } })
      .then(() => this.showToast('success', 'reset2faSuccess'))
      .catch(() => this.showToast('danger', 'reset2faError'));

  requestDeactivateUser = () => this.deactivateConfirmationModal().open();

  deactivate = (success: boolean) =>
    success &&
    this.deactivedUserMutation
      .mutate({
        variables: { input: { userId: this.userIdWithDefaultValue() } },
      })
      .then(() => this.showToast('success', 'deactivateSuccess'))
      .catch(() => this.showToast('danger', 'deactivateError'));

  requestReActivateUser = () => this.reActivateConfirmationModal().open();

  reActivate = (success: boolean) =>
    success &&
    this.reActivateUserMutation
      .mutate({
        variables: { input: { userId: this.userIdWithDefaultValue() } },
      })
      .then(() => this.showToast('success', 'reactivateSuccess'))
      .catch(() => this.showToast('danger', 'reactivateError'));

  private showToast(type: WattToastType, label: string): void {
    this.toastService.open({
      type,
      message: this.transloco.translate(`admin.userManagement.drawer.${label}`),
    });
  }
}
