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
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';

import { DhUserRolesComponent } from '../../shared/dh-user-roles.component/dh-user-roles.component';
import {
  DhAdminUserRolesStore,
  UpdateUserRoles,
} from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabsModule,
    DhUserRolesComponent,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styles: ['.margin-right-auto {margin-right:auto}'],
})
export class DhEditUserModalComponent {
  private readonly store = inject(DhAdminUserRolesStore);
  user: UserOverviewItemDto | null = null;
  private _updateUserRoles: UpdateUserRoles | null = null;
  @ViewChild('editUserModal') editUserModal!: WattModalComponent;
  @ViewChild('userRoles') userRoles!: DhUserRolesComponent;

  open(user: UserOverviewItemDto | null): void {
    this.user = user;
    this.editUserModal.open();
  }

  save() {
    if (this.user === null || this._updateUserRoles === null) {
      this.editUserModal.close(false);
      return;
    }
    this.store.assignRoles({
      userId: this.user.id,
      updateUserRoles: this._updateUserRoles,
    });

    this.store.getUserRolesView(this.user.id);
    this.userRoles.resetUpdateUserRoles();
    this.editUserModal.close(true);
  }

  deactivedUser(): void {
    console.error('Not implemented yet');
  }

  close(): void {
    this.userRoles.resetUpdateUserRoles();
    this.editUserModal.close(true);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this._updateUserRoles = updateUserRoles;
  }
}
