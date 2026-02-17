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
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, computed, effect, inject, input, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet/watt/phone-field';
import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';
import { WattToastService, WattToastType } from '@energinet/watt/toast';

import { mutation, MutationResult, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  UpdateMarketParticipantDocument,
  UpdateMarketParticipantMutation,
  GetMarketParticipantEditableFieldsDocument,
  GetMarketParticipantDetailsDocument,
  GetPaginatedMarketParticipantsDocument,
  GetMarketParticipantAuditLogsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhMarketParticipantNameMaxLength,
  dhMarketParticipantNameMaxLengthValidatorFn,
} from '../validators/dh-market-participant-name-max-length.validator';

@Component({
  selector: 'dh-edit-market-participant',
  templateUrl: './edit.component.html',
  styles: [
    `
      .actor-field {
        width: 25em;
      }

      .contact-field {
        width: 25em;
      }

      .phone-field {
        width: 15em;
      }

      .email-suffix {
        padding-right: var(--watt-space-s);
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattPhoneFieldComponent,
  ],
})
export class DhEditMarketParticipantComponent {
  private readonly navigation = inject(DhNavigationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);
  private readonly permissionService = inject(PermissionService);
  private readonly modal = viewChild.required(WattModalComponent);
  private readonly updateMarketParticipantMutation = mutation(UpdateMarketParticipantDocument);
  private readonly query = query(GetMarketParticipantEditableFieldsDocument, () => ({
    variables: { marketParticipantId: this.id() },
  }));

  name = computed(() => this.query.data()?.marketParticipantById.name ?? '');

  nameMaxLength = dhMarketParticipantNameMaxLength;
  departmentNameMaxLength = 250;

  form = this.formBuilder.group({
    name: ['', [Validators.required, dhMarketParticipantNameMaxLengthValidatorFn]],
    departmentName: ['', [Validators.required, Validators.maxLength(this.departmentNameMaxLength)]],
    departmentEmail: ['', [Validators.required, Validators.email]],
    departmentPhone: ['', Validators.required],
  });

  id = input.required<string>();

  isLoading = computed(
    () => this.query.loading() || this.updateMarketParticipantMutation.loading()
  );

  hasMarketParticipantManagePermission = toSignal(
    this.permissionService.hasPermission('actors:manage'),
    {
      initialValue: false,
    }
  );

  constructor() {
    effect(() => {
      this.hasMarketParticipantManagePermission()
        ? this.form.controls.name.enable()
        : this.form.controls.name.disable();
    });

    effect(() => {
      const marketParticipantEditableFields = this.query.data()?.marketParticipantById;

      if (!marketParticipantEditableFields) {
        return;
      }

      const { name, contact } = marketParticipantEditableFields;

      this.form.patchValue({
        name,
        departmentName: contact?.name,
        departmentPhone: contact?.phone,
        departmentEmail: contact?.email,
      });
    });
  }

  save() {
    const { departmentEmail, departmentName, departmentPhone, name } = this.form.getRawValue();

    if (!name || !departmentName || !departmentPhone || !departmentEmail || !this.form.valid) {
      return;
    }

    this.updateMarketParticipantMutation.mutate({
      variables: {
        input: {
          marketParticipantId: this.id(),
          marketParticipantName: name,
          departmentName,
          departmentPhone,
          departmentEmail,
        },
      },
      refetchQueries: (result) => {
        if (this.isUpdateSuccessful(result.data)) {
          return [
            GetPaginatedMarketParticipantsDocument,
            GetMarketParticipantDetailsDocument,
            GetMarketParticipantAuditLogsDocument,
          ];
        }

        return [];
      },
      onCompleted: (data) => {
        if (data.updateMarketParticipant.errors) {
          this.showToast('danger', 'error');
        } else {
          this.showToast('success', 'success');
        }

        this.modal().close(true);
      },
      onError: () => {
        this.showToast('danger', 'error');
      },
    });
  }

  closed() {
    this.navigation.navigate('details', this.id());
  }

  private showToast(type: WattToastType, label: string): void {
    this.toastService.open({
      type,
      message: this.transloco.translate(
        `marketParticipant.actorsOverview.edit.updateRequest.${label}`
      ),
    });
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<UpdateMarketParticipantMutation>['data']
  ): boolean {
    return !mutationResult?.updateMarketParticipant.errors?.length;
  }
}
