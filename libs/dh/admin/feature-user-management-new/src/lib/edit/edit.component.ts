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
import { Component, computed, effect, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { UpdateUserRoles } from '@energinet-datahub/dh/admin/shared';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import {
  GetUserByIdDocument,
  UpdateActorUserRolesInput,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhAdminEditUserStore } from '@energinet-datahub/dh/admin/data-access-api';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
  selector: 'dh-edit-user',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    RxPush,

    WATT_MODAL,
    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattTextFieldComponent,
    WattPhoneFieldComponent,

    DhUserRolesComponent,
  ],
  templateUrl: './edit.component.html',
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
export class DhEditUserComponent {
  private editUserStore = inject(DhAdminEditUserStore);
  private formBuilder = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private getUserQuery = lazyQuery(GetUserByIdDocument);
  private navigation = inject(DhNavigationService);

  private updateUserRoles: UpdateUserRoles | null = null;

  userInfoForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', Validators.required],
  });

  modal = viewChild.required(WattModalComponent);
  userRoles = viewChild.required(DhUserRolesComponent);

  isSaving$ = this.editUserStore.isSaving$;

  user = computed(() => this.getUserQuery.data()?.userById);

  loading = this.getUserQuery.loading;

  // Router param value
  id = computed(() => this.navigation.id());

  constructor() {
    effect(() => {
      const id = this.id();
      if (!id) return;
      this.getUserQuery.query({ variables: { id } });
      this.modal().open();
    });

    effect(() => {
      const user = this.user();
      if (user) {
        this.userInfoForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber ?? '',
        });
      }
    });
  }

  save() {
    if (
      this.userInfoForm.invalid ||
      this.updateUserRoles?.actors.some((actor) => !actor.atLeastOneRoleIsAssigned)
    ) {
      return;
    }

    if (this.userInfoForm.pristine) {
      return this.close();
    }

    const user = this.user();

    const { firstName, lastName, phoneNumber } = this.userInfoForm.getRawValue();

    if (
      firstName === user?.firstName &&
      lastName === user?.lastName &&
      phoneNumber === user?.phoneNumber &&
      this.updateUserRoles === null
    ) {
      return this.close();
    }

    this.startEditUserRequest(firstName, lastName, phoneNumber, this.updateUserRoles ?? undefined);
  }

  close(): void {
    this.navigation.navigate('details', this.id());
    this.modal().close(false);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this.updateUserRoles = updateUserRoles;
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

      this.userRoles().resetUpdateUserRoles();
      this.close();
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

    const user = this.user();
    if (user) {
      this.editUserStore.editUser({
        userId: user.id,
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
