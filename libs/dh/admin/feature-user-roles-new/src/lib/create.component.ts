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
  Component,
  computed,
  effect,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';

import { toSignal } from '@angular/core/rxjs-interop';

import { GraphQLErrors } from '@apollo/client/errors';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { WattModalComponent, WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';

import {
  EicFunction,
  UserRoleStatus,
  PermissionDetailsDto,
  CreateUserRoleDtoInput,
  CreateUserRoleDocument,
  GetFilteredUserRolesDocument,
  GetPermissionByEicFunctionDocument,
  GetUserRoleAuditLogsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
} from '@energinet-datahub/dh/shared/ui-util';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/shared';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-create-user-role',
  template: `
    <watt-modal
      size="large"
      [title]="t('headline')"
      (closed)="closeModal($event)"
      *transloco="let t; read: 'admin.userManagement.createrole'"
    >
      <watt-stepper
        class="watt-modal-content--full-width"
        [linear]="true"
        (completed)="createUserRole()"
      >
        <watt-stepper-step
          [stepControl]="userRoleForm"
          [label]="t('steps.masterData.label')"
          [nextButtonLabel]="t('steps.permissions.label')"
        >
          <form [formGroup]="userRoleForm" vater-flex direction="column" gap="s" offset="m">
            <!-- Eic Function -->
            <watt-dropdown
              [label]="t('steps.masterData.eicFunction')"
              [formControl]="userRoleForm.controls.eicFunction"
              [options]="eicFunctionOptions"
              sortDirection="asc"
              dhDropdownTranslator
              translateKey="marketParticipant.marketRoles"
              [showResetOption]="false"
              [placeholder]="t('steps.masterData.eicFunction')"
            />

            <!-- Name -->
            <watt-text-field
              [label]="t('steps.masterData.name')"
              [formControl]="userRoleForm.controls.name"
            >
              @if (userRoleForm.controls.name.hasError('maxlength')) {
                <watt-field-error>
                  {{ t('steps.masterData.nameMaxLengthErrorText') }}
                </watt-field-error>
              }
            </watt-text-field>

            <!-- Description -->
            <watt-textarea-field
              [formControl]="userRoleForm.controls.description"
              [label]="t('steps.masterData.description')"
            />
          </form>
        </watt-stepper-step>

        <watt-stepper-step
          [stepControl]="selectedPermissions"
          [label]="t('steps.permissions.label')"
          [previousButtonLabel]="t('steps.masterData.label')"
          [nextButtonLabel]="t('save')"
          [loadingNextButton]="creating()"
        >
          <vater-flex direction="column" offset="m" justify="center">
            @if (
              selectedPermissions.invalid &&
              selectedPermissions.touched &&
              selectedPermissions.hasError('required')
            ) {
              <watt-field-error>
                {{ t('steps.permissions.required') }}
              </watt-field-error>
            }
          </vater-flex>

          <dh-permissions-table
            [loading]="loading()"
            [hasError]="hasError()"
            [permissions]="permissions()"
            (selectionChanged)="onSelectionChange($event)"
          />
        </watt-stepper-step>
      </watt-stepper>
    </watt-modal>
  `,
  styles: `
    form {
      width: 50%;
    }
  `,
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WATT_STEPPER,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,

    VaterFlexComponent,

    DhPermissionsTableComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhCreateUserRoleComponent extends WattTypedModal {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private formBuilder = inject(NonNullableFormBuilder);
  private createUserRoleMutation = mutation(CreateUserRoleDocument);

  creating = this.createUserRoleMutation.loading;

  modal = viewChild.required(WattModalComponent);

  initialEicFunction = EicFunction.BalanceResponsibleParty;

  permissionsQuery = lazyQuery(GetPermissionByEicFunctionDocument);

  loading = this.permissionsQuery.loading;
  hasError = this.permissionsQuery.hasError;
  permissions = computed(() => this.permissionsQuery.data()?.permissionsByEicFunction ?? []);

  userRoleForm = this.formBuilder.group({
    eicFunction: this.formBuilder.control(this.initialEicFunction, Validators.required),
    name: this.formBuilder.control('', [Validators.required, Validators.maxLength(250)]),
    description: this.formBuilder.control('', Validators.required),
    status: this.formBuilder.control(UserRoleStatus.Active),
  });

  selectedPermissions = new FormControl<number[]>([], {
    validators: Validators.required,
    nonNullable: true,
  });

  eicFunction = toSignal(this.userRoleForm.controls.eicFunction.valueChanges, {
    initialValue: this.initialEicFunction,
  });

  eicFunctionOptions = dhEnumToWattDropdownOptions(EicFunction);

  constructor() {
    super();
    effect(() => {
      this.permissionsQuery.query({ variables: { eicFunction: this.eicFunction() } });
    });
  }

  onSelectionChange(event: PermissionDetailsDto[]): void {
    const ids = event.map(({ id }) => id);

    this.selectedPermissions.setValue(ids);
    this.selectedPermissions.markAsTouched();
  }

  closeModal(saveSuccess: boolean) {
    this.modal().close(saveSuccess);
  }

  async createUserRole() {
    if (this.selectedPermissions.invalid) {
      return;
    }

    this.toastService.open({
      message: this.transloco.translate('admin.userManagement.createrole.createRoleRequest.start'),
      type: 'loading',
    });

    const createUserRoleDto: CreateUserRoleDtoInput = {
      ...this.userRoleForm.getRawValue(),
      permissions: this.selectedPermissions.value,
    };

    const result = await this.createUserRoleMutation.mutate({
      refetchQueries: [GetFilteredUserRolesDocument, GetUserRoleAuditLogsDocument],
      variables: {
        input: {
          userRole: createUserRoleDto,
        },
      },
    });

    if (result.data?.createUserRole.success) {
      this.success();
    }

    if (result.error?.graphQLErrors || result.data?.createUserRole.errors) {
      this.error(result.error?.graphQLErrors, result.data?.createUserRole.errors);
    }
  }

  private success() {
    const message = this.transloco.translate(
      'admin.userManagement.createrole.createRoleRequest.success'
    );

    this.toastService.open({ type: 'success', message });
    this.closeModal(true);
  }

  private error(
    errors: GraphQLErrors | undefined,
    apiErrors: ApiErrorCollection[] | undefined | null
  ) {
    let message = this.transloco.translate(
      'admin.userManagement.createrole.createRoleRequest.error'
    );

    if (errors) {
      message = parseGraphQLErrorResponse(errors) ?? message;
    }

    if (apiErrors) {
      message = readApiErrorResponse(apiErrors) ?? message;
    }

    this.toastService.open({ message, type: 'danger' });
  }
}
