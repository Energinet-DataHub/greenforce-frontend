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
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { PushModule } from '@rx-angular/template/push';
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
    PushModule,
    DhUserRolesComponent,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styles: ['.margin-right-auto {margin-right:auto}'],
})
export class DhEditUserModalComponent implements AfterViewInit {
  private readonly store = inject(DhAdminUserRolesStore);
  private _updateUserRoles: UpdateUserRoles | null = null;
  @ViewChild('editUserModal') editUserModal!: WattModalComponent;
  @ViewChild('userRoles') userRoles!: DhUserRolesComponent;

  @Output() closed = new EventEmitter<void>();

  @Input() user: UserOverviewItemDto | null = null;

  isLoading$ = this.store.isLoading$;

  ngAfterViewInit(): void {
    this.editUserModal.open();
  }

  save() {
    if (this.user === null || this._updateUserRoles === null) {
      this.closeModal(false);
      return;
    }

    this.store.assignRoles({
      userId: this.user.id,
      updateUserRoles: this._updateUserRoles,
      onSuccess: () => {
        if (this.user?.id) {
          this.store.getUserRolesView(this.user.id);
        }
        this.userRoles.resetUpdateUserRoles();
        this.closeModal(true);
      },
    });
  }

  closeModal(status: boolean): void {
    this.userRoles.resetUpdateUserRoles();
    this.editUserModal.close(status);
    this.closed.emit();
  }

  deactivedUser(): void {
    console.error('Not implemented yet');
  }

  close(): void {
    this.closeModal(false);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this._updateUserRoles = updateUserRoles;
  }
}
