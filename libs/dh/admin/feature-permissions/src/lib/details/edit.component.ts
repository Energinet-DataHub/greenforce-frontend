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
import { Component, computed, effect, inject, input, viewChild } from '@angular/core';

import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { GraphQLErrors } from '@apollo/client/errors';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';

import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { parseGraphQLErrorResponse } from '@energinet-datahub/dh/shared/data-access-graphql';

import {
  UpdatePermissionDocument,
  GetPermissionEditDocument,
  GetPermissionDetailsDocument,
  GetPermissionAuditLogsDocument,
  GetFilteredPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
    selector: 'dh-permission-edit',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        WATT_MODAL,
        WattTabComponent,
        WattTabsComponent,
        WattButtonComponent,
        WattFieldErrorComponent,
        WattTextAreaFieldComponent,
        DhResultComponent,
    ],
    template: `
    <watt-modal
      *transloco="let t; read: 'admin.userManagement.editPermission'"
      size="small"
      [title]="name()"
      (closed)="closeModal()"
    >
      <dh-result [loading]="loading()" [hasError]="hasError()">
        <form [formGroup]="userPermissionsForm" id="edit-permissions-form" (ngSubmit)="save()">
          <watt-tabs class="watt-modal-content--full-width">
            <watt-tab [label]="t('tab.masterData.tabLabel')">
              <watt-textarea-field
                [label]="t('tab.masterData.descriptionInputLabel')"
                [formControl]="userPermissionsForm.controls.description"
              >
                @let maxLengthError =
                  userPermissionsForm.controls.description.errors?.['maxlength'];
                @if (maxLengthError) {
                  <watt-field-error>{{
                    t('tab.masterData.descriptionExceedsMaxLength', maxLengthError)
                  }}</watt-field-error>
                }
              </watt-textarea-field>
            </watt-tab>
          </watt-tabs>
        </form>
      </dh-result>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="closeModal()">
          {{ t('cancel') }}
        </watt-button>
        <watt-button type="submit" formId="edit-permissions-form" [loading]="isSaving()">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `
})
export class DhPermissionEditComponent {
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private formBuilder = inject(NonNullableFormBuilder);
  private navigationService = inject(DhNavigationService);

  private updatePermission = mutation(UpdatePermissionDocument);
  private permissionQuery = lazyQuery(GetPermissionEditDocument);

  private modal = viewChild.required(WattModalComponent);

  // Param value
  id = input.required<string>();

  isSaving = computed(() => this.updatePermission.loading());
  permission = computed(() => this.permissionQuery.data()?.permissionById);
  name = computed(() => this.permission()?.name ?? '');

  loading = this.permissionQuery.loading;
  hasError = this.permissionQuery.hasError;

  userPermissionsForm = this.formBuilder.group({
    description: this.formBuilder.control('', [Validators.required, Validators.maxLength(1000)]),
  });

  constructor() {
    effect(() => {
      this.permissionQuery.query({ variables: { id: parseInt(this.id()) } });
    });

    effect(() => {
      const permission = this.permission();
      if (permission) {
        this.modal().open();
        this.userPermissionsForm.controls.description.setValue(permission.description);
      }
    });
  }

  closeModal(): void {
    this.navigationService.navigate('details', this.id());
    this.modal().close(false);
  }

  async save() {
    if (this.userPermissionsForm.invalid) {
      return;
    }

    if (this.userPermissionsForm.pristine) {
      return this.closeModal();
    }

    const result = await this.updatePermission.mutate({
      refetchQueries: [
        GetPermissionDetailsDocument,
        GetPermissionAuditLogsDocument,
        GetFilteredPermissionsDocument,
      ],
      variables: {
        input: {
          id: parseInt(this.id()),
          description: this.userPermissionsForm.controls.description.value,
        },
      },
    });

    if (result.data?.updatePermission.permission) {
      return this.success();
    }

    if (result.error?.graphQLErrors || result.data?.updatePermission.errors) {
      this.error(result.error?.graphQLErrors, result.data?.updatePermission.errors);
    }
  }

  private success() {
    const message = this.transloco.translate('admin.userManagement.editPermission.saveSuccess');

    this.toastService.open({ type: 'success', message });
    this.closeModal();
  }

  private error(
    errors: GraphQLErrors | undefined,
    apiErrors: ApiErrorCollection[] | undefined | null
  ) {
    let message = this.transloco.translate('admin.userManagement.editPermission.saveError');

    if (errors) {
      message = parseGraphQLErrorResponse(errors) ?? message;
    }

    if (apiErrors) {
      message = readApiErrorResponse(apiErrors) ?? message;
    }

    this.toastService.open({ message, type: 'danger' });
  }
}
