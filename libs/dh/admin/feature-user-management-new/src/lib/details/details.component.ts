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
  computed,
  Component,
  viewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattModalComponent, WATT_MODAL, WattModalService } from '@energinet-datahub/watt/modal';

import { DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  UserStatus,
  Reset2faDocument,
  GetUserByIdDocument,
  ReInviteUserDocument,
  DeactivateUserDocument,
  ReActivateUserDocument,
  UserOverviewSearchDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhEditUserModalComponent } from '../edit/edit.component';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { DhUserAuditLogsComponent } from './tabs/audit-logs.component';
import { DhUserMasterDataComponent } from './tabs/master-data.component';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-user-details',
  standalone: true,
  templateUrl: './details.component.html',
  imports: [
    TranslocoDirective,
    MatMenuModule,

    WATT_TABS,
    WATT_MODAL,
    WATT_DRAWER,
    WattButtonComponent,

    DhUserStatusComponent,
    DhPermissionRequiredDirective,
    DhUserAuditLogsComponent,
    DhUserMasterDataComponent,
    DhUserRolesComponent,
  ],
})
export class DhUserDetailsComponent {
  private modalService = inject(WattModalService);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private navigation = inject(DhNavigationService);

  drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  // Router param
  id = input.required<string>();

  deactivateConfirmationModal = viewChild.required<WattModalComponent>(
    'deactivateConfirmationModal'
  );

  reActivateConfirmationModal = viewChild.required<WattModalComponent>(
    'reActivateConfirmationModal'
  );

  selectedUserQuery = lazyQuery(GetUserByIdDocument, {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache',
  });

  selectedUser = computed(() => this.selectedUserQuery.data()?.userById);
  isLoading = computed(() => this.selectedUserQuery.loading());

  UserStatus = UserStatus;

  reInviteUserMutation = mutation(ReInviteUserDocument, {
    refetchQueries: [UserOverviewSearchDocument],
  });
  reset2faMutation = mutation(Reset2faDocument, { refetchQueries: [UserOverviewSearchDocument] });
  deactivateUserMutation = mutation(DeactivateUserDocument, {
    refetchQueries: [UserOverviewSearchDocument],
  });
  reActivateUserMutation = mutation(ReActivateUserDocument, {
    refetchQueries: [UserOverviewSearchDocument],
  });

  isReinviting = this.reInviteUserMutation.loading;
  isDeactivating = this.deactivateUserMutation.loading;
  isReActivating = this.reActivateUserMutation.loading;

  constructor() {
    effect(() => {
      const id = this.id();
      const drawer = this.drawer();
      if (!id || !drawer) return;
      this.drawer().open();
      this.selectedUserQuery.refetch({ id });
      drawer.open();
    });
  }

  onClose(): void {
    this.drawer().close();
    this.navigation.back();
  }

  showEditUserModal(): void {
    this.modalService.open({
      component: DhEditUserModalComponent,
      data: this.selectedUser(),
    });
  }

  reinvite = () =>
    this.reInviteUserMutation.mutate({
      variables: { input: { userId: this.id() } },
      onCompleted: (data) =>
        data.reInviteUser.errors
          ? this.showToast('danger', 'reinviteError')
          : this.showToast('success', 'reinviteSuccess'),
      onError: () => this.showToast('danger', 'reinviteError'),
    });

  resetUser2Fa = () =>
    this.reset2faMutation.mutate({
      variables: { input: { userId: this.id() } },
      onCompleted: (data) =>
        data.resetTwoFactorAuthentication.errors
          ? this.showToast('danger', 'reset2faError')
          : this.showToast('success', 'reset2faSuccess'),
      onError: () => this.showToast('danger', 'reset2faError'),
    });

  requestDeactivateUser = () => this.deactivateConfirmationModal().open();

  deactivate = (success: boolean) =>
    success &&
    this.deactivateUserMutation.mutate({
      variables: { input: { userId: this.id() } },
      onCompleted: (data) =>
        data.deactivateUser.errors
          ? this.showToast('danger', 'deactivateError')
          : this.showToast('success', 'deactivateSuccess'),
      onError: () => this.showToast('danger', 'deactivateError'),
    });

  requestReActivateUser = () => this.reActivateConfirmationModal().open();

  reActivate = (success: boolean) =>
    success &&
    this.reActivateUserMutation.mutate({
      variables: { input: { userId: this.id() } },
      onError: () => this.showToast('danger', 'reactivateError'),
      onCompleted: (data) =>
        data.reActivateUser.errors
          ? this.showToast('danger', 'reactivateError')
          : this.showToast('success', 'reactivateSuccess'),
    });

  private showToast(type: WattToastType, label: string): void {
    this.toastService.open({
      type,
      message: this.transloco.translate(`admin.userManagement.drawer.${label}`),
    });
  }
}
