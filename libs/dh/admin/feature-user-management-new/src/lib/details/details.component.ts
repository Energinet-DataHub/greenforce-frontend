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

import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';

import { DhUserStatusComponent } from '@energinet-datahub/dh/admin/shared';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';

import {
  UserStatus,
  Reset2faDocument,
  ReInviteUserDocument,
  UserOverviewSearchDocument,
  GetUserDetailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDeactivteComponent } from './deactivate.component';
import { DhReactivateComponent } from './reactivate-component';
import { DhUserAuditLogsComponent } from './tabs/audit-logs.component';
import { DhUserMasterDataComponent } from './tabs/master-data.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-user-details',
  standalone: true,
  templateUrl: './details.component.html',
  imports: [
    RouterOutlet,
    TranslocoDirective,
    MatMenuModule,

    WATT_TABS,
    WATT_MODAL,
    WATT_DRAWER,
    WattButtonComponent,

    DhPermissionRequiredDirective,

    DhUserRolesComponent,
    DhDeactivteComponent,
    DhReactivateComponent,
    DhUserStatusComponent,
    DhUserAuditLogsComponent,
    DhUserMasterDataComponent,
  ],
})
export class DhUserDetailsComponent {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private navigation = inject(DhNavigationService);

  drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  // Router param
  id = input.required<string>();

  selectedUserQuery = lazyQuery(GetUserDetailsDocument, {
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

  isReinviting = this.reInviteUserMutation.loading;

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
    this.navigation.navigate('list');
  }

  edit(): void {
    this.navigation.navigate('edit', this.id());
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

  private showToast(type: WattToastType, label: string): void {
    this.toastService.open({
      type,
      message: this.transloco.translate(`admin.userManagement.drawer.${label}`),
    });
  }
}
