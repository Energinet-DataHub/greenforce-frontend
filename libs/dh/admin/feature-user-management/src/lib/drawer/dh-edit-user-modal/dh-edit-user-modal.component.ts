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
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketParticipantUserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { PushModule } from '@rx-angular/template/push';
import { WattModalComponent, WattModalModule } from '@energinet-datahub/watt/modal';

import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import {
  DhAdminUserRolesStore,
  UpdateUserRoles,
  DhAdminUserIdentityDataAccessApiStore,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabComponent,
    WattTabsComponent,
    WattInputModule,
    WattFormFieldModule,
    PushModule,
    DhUserRolesComponent,
    FormsModule,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styles: [
    `
      .master-data-form {
        display: flex;
        flex-direction: column;
        margin: var(--watt-space-ml) var(--watt-space-ml) 0 var(--watt-space-ml);
      }

      .full-name-field {
        max-width: 512px;
      }

      .phone-field {
        max-width: 256px;
      }
    `,
  ],
})
export class DhEditUserModalComponent implements AfterViewInit, OnChanges {
  private readonly userRolesStore = inject(DhAdminUserRolesStore);
  private readonly identityStore = inject(DhAdminUserIdentityDataAccessApiStore);
  private _updateUserRoles: UpdateUserRoles | null = null;
  updatedPhoneNumber: string | null = null;

  @ViewChild('editUserModal') editUserModal!: WattModalComponent;
  @ViewChild('userRoles') userRoles!: DhUserRolesComponent;

  @Output() closed = new EventEmitter<void>();
  @Input() user: MarketParticipantUserOverviewItemDto | null = null;

  isLoading$ = this.userRolesStore.isLoading$;
  isSaving$ = this.userRolesStore.isSaving$;

  ngAfterViewInit(): void {
    this.editUserModal.open();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.user) {
      this.updatedPhoneNumber = this.user?.phoneNumber ?? null;
    }
  }

  save() {
    if (this.user === null) {
      this.closeModal(false);
      return;
    }

    if (this.updatedPhoneNumber != this.user.phoneNumber) {
      this.updatePhoneNumber(this.updatedPhoneNumber ?? "", this.user.id);
    }

    if (this._updateUserRoles != null) {
      this.updateUserRoles(this.user.id, this._updateUserRoles);
    }
    else {
      this.closeModal(true);
    }
  }

  private updateUserRoles(userId: string, updateUserRoles: UpdateUserRoles) {
    this.userRolesStore.assignRoles({
      userId: userId,
      updateUserRoles: updateUserRoles,
      onSuccess: () => {
        this.userRolesStore.getUserRolesView(userId);
        this.userRoles.resetUpdateUserRoles();
        this.closeModal(true);
      },
    });
  }

  private updatePhoneNumber(userId: string, updatePhoneNumber: string) {
    this.identityStore.updateUserIdentity({
      userId: userId,
      updatedUserIdentity: { phoneNumber: updatePhoneNumber },
      onSuccessFn: () => {
        if (this.user) {
          this.user.phoneNumber = updatePhoneNumber;
        }
      },
      onErrorFn: () => { console.error('error'); }
    });
  }

  closeModal(status: boolean): void {
    this.userRoles.resetUpdateUserRoles();
    this.editUserModal.close(status);
    this.closed.emit();
  }

  close(): void {
    this.closeModal(false);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this._updateUserRoles = updateUserRoles;
  }
}
