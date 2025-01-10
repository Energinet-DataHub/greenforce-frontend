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
import { input, inject, computed, Component, viewChild, afterRenderEffect } from '@angular/core';

import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { GraphQLErrors } from '@apollo/client/errors';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/shared';

import {
  PermissionDetailsDto,
  UpdateUserRoleDocument,
  GetFilteredUserRolesDocument,
  GetPermissionByEicFunctionDocument,
  GetUserRoleWithPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { DhUserRoleWithPermissions } from '@energinet-datahub/dh/admin/data-access-api';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
  selector: 'dh-edit-user-role',
  templateUrl: './edit.component.html',
  styles: [
    `
      .tab-master-data {
        width: 25rem;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_CARD,
    WATT_MODAL,
    WattTabComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,
    DhPermissionsTableComponent,
  ],
})
export class DhUserRoleEditComponent {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private formBuilder = inject(NonNullableFormBuilder);
  private navigationService = inject(DhNavigationService);

  private userRoleEditMutation = mutation(UpdateUserRoleDocument);
  private userRoleWithPermissionsQuery = lazyQuery(GetUserRoleWithPermissionsDocument);

  // Router param
  id = input<string>();

  userRole = computed(() => this.userRoleWithPermissionsQuery.data()?.userRoleById);
  roleName = computed(() => this.userRole()?.name ?? '');

  permissionsQuery = lazyQuery(GetPermissionByEicFunctionDocument);

  permissions = computed<PermissionDetailsDto[]>(
    () => this.permissionsQuery.data()?.permissionsByEicFunction ?? []
  );

  initiallySelectedPermissions = computed(() => {
    const marketRolePermissions = this.permissions();
    const userRole = this.userRole();

    if (!userRole) return [];

    return marketRolePermissions.filter((marketRolePermission) => {
      return userRole.permissions.some(
        (userRolePermission) => userRolePermission.id === marketRolePermission.id
      );
    });
  });

  loading = computed(
    () => this.permissionsQuery.loading() || this.userRoleWithPermissionsQuery.loading()
  );
  hasError = computed(
    () => this.permissionsQuery.hasError() || this.userRoleWithPermissionsQuery.hasError()
  );

  userRoleEditForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    description: this.formBuilder.control('', [Validators.required]),
    permissionIds: this.formBuilder.control<number[]>([], [Validators.required]),
  });

  modal = viewChild.required(WattModalComponent);

  tabs = viewChild.required(WattTabsComponent);

  constructor() {
    afterRenderEffect(() => {
      const id = this.id();

      if (id) {
        this.userRoleWithPermissionsQuery.query({ variables: { id } });
      }
      this.modal().open();
    });

    afterRenderEffect(() => {
      const userRole = this.userRole();

      if (userRole) {
        const permissionIds = userRole.permissions.map(({ id }) => id);
        this.userRoleEditForm.patchValue({
          name: userRole.name,
          description: userRole.description,
          permissionIds,
        });

        this.permissionsQuery.query({ variables: { eicFunction: userRole.eicFunction } });
      }
    });
  }

  closeModal(saveSuccess: boolean): void {
    this.modal().close(saveSuccess);
    this.navigationService.navigate('details', this.id());
  }

  onSelectionChanged(selectedPermissions: PermissionDetailsDto[]): void {
    const permissionIds = selectedPermissions.map(({ id }) => id);

    this.userRoleEditForm.patchValue({ permissionIds });
    this.userRoleEditForm.markAsDirty();
  }

  async save(userRole: DhUserRoleWithPermissions | undefined) {
    if (!userRole) return;

    if (this.focusTabOnError()) return;

    if (this.userRoleEditForm.pristine) return this.closeModal(false);

    const { name, description, permissionIds } = this.userRoleEditForm.getRawValue();

    const result = await this.userRoleEditMutation.mutate({
      refetchQueries: [GetUserRoleWithPermissionsDocument, GetFilteredUserRolesDocument],
      variables: {
        input: {
          userRole: {
            name,
            description,
            permissions: permissionIds,
            status: userRole.status,
          },
          userRoleId: userRole.id,
        },
      },
    });

    if (result.data?.updateUserRole.success) {
      this.success();
    }

    const userRoleEditErrors = result.data?.updateUserRole.errors;

    if (
      userRoleEditErrors &&
      userRoleEditErrors[0].apiErrors[0].code ===
        'market_participant.validation.market_role.reserved'
    ) {
      this.userRoleEditForm.controls.name.setErrors({
        nameAlreadyExists: true,
      });

      return;
    }

    if (result.error?.graphQLErrors || userRoleEditErrors) {
      this.error(result.error?.graphQLErrors, userRoleEditErrors);
    }
  }

  private focusTabOnError() {
    if (this.userRoleEditForm.invalid) {
      if (this.userRoleEditForm.controls.description.hasError('required')) {
        this.tabs()?.setSelectedIndex(0);
      }

      if (this.userRoleEditForm.controls.permissionIds.hasError('required')) {
        this.tabs()?.setSelectedIndex(1);
      }
    }

    return this.userRoleEditForm.invalid;
  }

  private success() {
    const message = this.transloco.translate('admin.userManagement.editUserRole.saveSuccess');

    this.toastService.open({ type: 'success', message });
    this.closeModal(true);
  }

  private error(
    errors: GraphQLErrors | undefined,
    apiErrors: ApiErrorCollection[] | undefined | null
  ) {
    let message = this.transloco.translate('admin.userManagement.editUserRole.saveError');

    if (errors) {
      message = parseGraphQLErrorResponse(errors) ?? message;
    }

    if (apiErrors) {
      message = readApiErrorResponse(apiErrors) ?? message;
    }

    this.toastService.open({ message, type: 'danger' });
  }
}
