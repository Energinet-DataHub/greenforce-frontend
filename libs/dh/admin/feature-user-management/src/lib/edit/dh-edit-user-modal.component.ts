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
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { DhUser } from '@energinet-datahub/dh/admin/shared';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import { UpdateActorUserRolesInput } from '@energinet-datahub/dh/shared/domain/graphql';

import { UpdateUserRoles, DhAdminEditUserStore } from '@energinet-datahub/dh/admin/data-access-api';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattModalComponent, WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    RxPush,

    WATT_MODAL,
    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattFieldErrorComponent,
    WattTextFieldComponent,
    WattPhoneFieldComponent,

    DhUserRolesComponent,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styles: [
    `
      .name-field {
        max-width: 384px;
        margin-right: var(--watt-space-ml);
      }

      .phone-field {
        max-width: 256px;
      }

      .reinvite-link {
        margin-right: auto;
      }
    `,
  ],
  providers: [DhAdminEditUserStore],
})
export class DhEditUserModalComponent extends WattTypedModal<DhUser> {
  private readonly editUserStore = inject(DhAdminEditUserStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);

  private _updateUserRoles: UpdateUserRoles | null = null;

  updatedPhoneNumber: string | null = null;

  userInfoForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', Validators.required],
  });

  @ViewChild('editUserModal') editUserModal!: WattModalComponent;
  @ViewChild('userRoles') userRoles!: DhUserRolesComponent;

  isSaving$ = this.editUserStore.isSaving$;

  constructor() {
    super();

    const { firstName, lastName, phoneNumber } = this.modalData;
    this.userInfoForm.patchValue({
      firstName,
      lastName,
      phoneNumber: phoneNumber ?? '',
    });
  }

  get firstNameControl() {
    return this.userInfoForm.controls.firstName;
  }

  get lastNameControl() {
    return this.userInfoForm.controls.lastName;
  }

  get phoneNumberControl() {
    return this.userInfoForm.controls.phoneNumber;
  }

  save() {
    if (
      this.modalData === null ||
      this.userInfoForm.invalid ||
      this._updateUserRoles?.actors.some((actor) => !actor.atLeastOneRoleIsAssigned)
    ) {
      return;
    }

    if (this.userInfoForm.pristine) {
      return this.closeModal(false);
    }

    const { firstName, lastName, phoneNumber } = this.modalData;

    if (
      this.firstNameControl.value === firstName &&
      this.lastNameControl.value === lastName &&
      this.phoneNumberControl.value === phoneNumber &&
      this._updateUserRoles === null
    ) {
      return this.closeModal(false);
    }

    this.startEditUserRequest(
      this.firstNameControl.value,
      this.lastNameControl.value,
      this.phoneNumberControl.value,
      this._updateUserRoles ?? undefined
    );
  }

  closeModal(status: boolean): void {
    this.userRoles.resetUpdateUserRoles();
    this.editUserModal.close(status);
  }

  close(): void {
    this.closeModal(false);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this._updateUserRoles = updateUserRoles;
    this.userInfoForm.markAsDirty();
  }

  private startEditUserRequest(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    updateUserRoles: UpdateUserRoles | undefined
  ) {
    const onSuccessFn = () => {
      this.toastService.open({
        type: 'success',
        message: this.transloco.translate('admin.userManagement.editUser.saveSuccess'),
      });

      this.userRoles.resetUpdateUserRoles();
      this.closeModal(true);
    };

    const onErrorFn = (statusCode: HttpStatusCode, apiErrorCollection: ApiErrorCollection[]) => {
      if (statusCode !== HttpStatusCode.BadRequest) {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('admin.userManagement.editUser.saveError'),
        });
      }

      if (statusCode === HttpStatusCode.BadRequest) {
        const message =
          apiErrorCollection.length > 0
            ? readApiErrorResponse(apiErrorCollection)
            : this.transloco.translate('admin.userManagement.editUser.saveError');

        this.toastService.open({ type: 'danger', message, duration: 60_000 });
      }
    };

    const phoneParts = phoneNumber.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    const updateActorUserRolesInput: UpdateActorUserRolesInput[] = updateUserRoles
      ? updateUserRoles?.actors.map((actor) => {
          return {
            actorId: actor.id,
            assignments: actor.userRolesToUpdate,
          };
        })
      : [];

    if (this.modalData) {
      this.editUserStore.editUser({
        userId: this.modalData.id,
        firstName,
        lastName,
        phoneNumber: formattedPhoneNumber,
        updateUserRoles: updateActorUserRolesInput,
        onSuccessFn,
        onErrorFn,
      });
    }
  }
}
