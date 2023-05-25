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
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template/push';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MarketParticipantUserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import { UpdateUserRoles, DbAdminEditUserStore } from '@energinet-datahub/dh/admin/data-access-api';
import { danishPhoneNumberPattern } from '@energinet-datahub/dh/admin/domain';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    WATT_MODAL,
    WattButtonComponent,
    TranslocoModule,
    WattTabComponent,
    WattTabsComponent,
    WattInputDirective,
    WATT_FORM_FIELD,
    PushModule,
    DhUserRolesComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styles: [
    `
      .tab-master-data {
        margin: calc(var(--watt-space-ml) * 2) 0 0 var(--watt-space-ml);
      }

      .full-name-field {
        max-width: 512px;
      }

      .phone-field {
        max-width: 256px;
      }
    `,
  ],
  providers: [DbAdminEditUserStore],
})
export class DhEditUserModalComponent implements AfterViewInit, OnChanges {
  private readonly editUserStore = inject(DbAdminEditUserStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);

  private _updateUserRoles: UpdateUserRoles | null = null;

  updatedPhoneNumber: string | null = null;

  userInfoForm = this.formBuilder.nonNullable.group({
    name: [{ value: '', disabled: true }],
    phoneNumber: ['', [Validators.required, Validators.pattern(danishPhoneNumberPattern)]],
  });

  @ViewChild('editUserModal') editUserModal!: WattModalComponent;
  @ViewChild('userRoles') userRoles!: DhUserRolesComponent;

  @Output() closed = new EventEmitter<void>();
  @Input() user: MarketParticipantUserOverviewItemDto | null = null;

  isSaving$ = this.editUserStore.isSaving$;

  get phoneNumberControl() {
    return this.userInfoForm.controls.phoneNumber;
  }

  ngAfterViewInit(): void {
    this.editUserModal.open();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.user) {
      this.userInfoForm.patchValue({
        name: this.user?.name ?? '',
        phoneNumber: this.user?.phoneNumber ?? '',
      });
    }
  }

  save() {
    if (this.user === null || this.userInfoForm.invalid) {
      return;
    }

    if (this.userInfoForm.pristine) {
      return this.closeModal(false);
    }

    let phoneNumber: string | undefined;
    let updateUserRoles: UpdateUserRoles | undefined;

    if (this.phoneNumberControl.value !== this.user.phoneNumber) {
      phoneNumber = this.phoneNumberControl.value;
    }

    if (this._updateUserRoles !== null) {
      updateUserRoles = this._updateUserRoles;
    }

    if (phoneNumber === undefined && updateUserRoles === undefined) {
      return this.closeModal(false);
    }

    this.startEditUserRequest(phoneNumber, updateUserRoles);
  }

  private startEditUserRequest(
    phoneNumber: string | undefined,
    updateUserRoles: UpdateUserRoles | undefined
  ) {
    const onSuccessFn = () => {
      if (this.user && phoneNumber) {
        this.user.phoneNumber = phoneNumber;
      }

      const message = this.transloco.translate('admin.userManagement.editUser.saveSuccess');
      this.toastService.open({ type: 'success', message });

      this.userRoles.resetUpdateUserRoles();
      this.closeModal(true);
    };

    const onErrorFn = (statusCode: HttpStatusCode) => {
      if (statusCode !== HttpStatusCode.BadRequest) {
        const message = this.transloco.translate('admin.userManagement.editUser.saveError');

        this.toastService.open({ type: 'danger', message });
      }
    };

    if (this.user) {
      this.editUserStore.editUser({
        userId: this.user.id,
        phoneNumber,
        updateUserRoles,
        onSuccessFn,
        onErrorFn,
      });
    }
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
    this.userInfoForm.markAsDirty();
  }
}
