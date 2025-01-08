//#region License
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
//#endregion
import {
  inject,
  computed,
  Component,
  viewChild,
  ChangeDetectionStrategy,
  afterRenderEffect,
} from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { GraphQLErrors } from '@apollo/client/errors';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import {
  GetUsersDocument,
  GetUserEditDocument,
  GetUserAuditLogsDocument,
  UpdateActorUserRolesInput,
  UpdateUserAndRolesDocument,
  GetUserDetailsDocument,
  GetActorsAndUserRolesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { UpdateUserRoles } from '@energinet-datahub/dh/admin/shared';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-edit-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_MODAL,
    WattTabComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattPhoneFieldComponent,
    VaterFlexComponent,
    DhUserRolesComponent,
  ],
  templateUrl: './edit.component.html',
  styles: `
    watt-text-field {
      width: 50%;
    }

    watt-phone-field {
      width: 30%;
    }
  `,
})
export class DhEditUserComponent {
  private formBuilder = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private navigation = inject(DhNavigationService);
  private getUserQuery = lazyQuery(GetUserEditDocument);
  private editUserMutation = mutation(UpdateUserAndRolesDocument);

  private updateUserRoles: UpdateUserRoles | null = null;

  userInfoForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', Validators.required],
  });

  modal = viewChild.required(WattModalComponent);
  userRoles = viewChild.required(DhUserRolesComponent);

  isSaving = this.editUserMutation.loading;

  user = computed(() => this.getUserQuery.data()?.userById);

  loading = this.getUserQuery.loading;

  // Router param value
  id = computed(() => this.navigation.id());

  constructor() {
    afterRenderEffect(() => {
      const id = this.id();
      if (!id) return;
      this.getUserQuery.query({ variables: { id } });
      this.modal().open();
    });

    afterRenderEffect(() => {
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

  async save() {
    const id = this.id();
    if (
      this.userInfoForm.invalid ||
      this.updateUserRoles?.actors.some((actor) => !actor.atLeastOneRoleIsAssigned) ||
      id === undefined
    ) {
      return;
    }

    const { firstName, lastName, phoneNumber } = this.userInfoForm.getRawValue();

    const phoneParts = phoneNumber.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    const updateActorUserRolesInput: UpdateActorUserRolesInput[] = this.updateUserRoles
      ? this.updateUserRoles?.actors.map((actor) => {
          return {
            actorId: actor.id,
            assignments: actor.userRolesToUpdate,
          };
        })
      : [];

    const result = await this.editUserMutation.mutate({
      refetchQueries: [
        GetUsersDocument,
        GetUserEditDocument,
        GetUserDetailsDocument,
        GetUserAuditLogsDocument,
        GetActorsAndUserRolesDocument,
      ],
      variables: {
        updateRolesInput: {
          userId: id,
          input: updateActorUserRolesInput,
        },
        updateUserInput: {
          userId: id,
          userIdentityUpdateDto: {
            firstName,
            lastName,
            phoneNumber: formattedPhoneNumber,
          },
        },
      },
    });

    if (result.data?.updateUserIdentity.success && result.data?.updateUserRoleAssignment.success) {
      this.showSuccessToast();
    }

    if (result.error) {
      this.showErrorToast(result.error.graphQLErrors);
    }
  }

  close(): void {
    this.navigation.navigate('details', this.id());
    this.modal().close(false);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this.updateUserRoles = updateUserRoles;
    this.userInfoForm.markAsDirty();
  }

  private showSuccessToast() {
    this.toastService.open({
      type: 'success',
      message: this.transloco.translate('admin.userManagement.editUser.saveSuccess'),
    });

    this.userRoles().resetUpdateUserRoles();
    this.close();
  }

  private showErrorToast(errors: GraphQLErrors) {
    const message =
      errors.length > 0
        ? parseGraphQLErrorResponse(errors)
        : this.transloco.translate('admin.userManagement.editUser.saveError');

    this.toastService.open({ type: 'danger', message, duration: 60_000 });
  }
}
