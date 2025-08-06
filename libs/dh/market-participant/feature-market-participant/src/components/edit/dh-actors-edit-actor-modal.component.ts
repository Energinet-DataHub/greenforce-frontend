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
import { Component, computed, effect, inject, viewChild } from '@angular/core';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  GetMarketParticipantsDocument,
  UpdateMarketParticipantDocument,
  UpdateMarketParticipantMutation,
  GetMarketParticipantByIdDocument,
  GetMarketParticipantEditableFieldsDocument,
  GetMarketParticipantDetailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  dhMarketParticipantNameMaxLength,
  dhMarketParticipantNameMaxLengthValidatorFn,
} from '../../validators/dh-market-participant-name-max-length.validator';
import { DhMarketParticipantExtended } from '@energinet-datahub/dh/market-participant/domain';

@Component({
  selector: 'dh-actors-edit-actor-modal',
  templateUrl: './dh-actors-edit-actor-modal.component.html',
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
export class DhActorsEditActorModalComponent extends WattTypedModal<DhMarketParticipantExtended> {
  private formBuilder = inject(FormBuilder);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private permissionService = inject(PermissionService);

  private modal = viewChild.required<WattModalComponent>(WattModalComponent);

  marketParticipantEditableFieldsQuery = lazyQuery(GetMarketParticipantEditableFieldsDocument);
  updateMarketParticipantMutation = mutation(UpdateMarketParticipantDocument);

  nameMaxLength = dhMarketParticipantNameMaxLength;
  departmentNameMaxLength = 250;

  actorForm = this.formBuilder.group({
    name: ['', [Validators.required, dhMarketParticipantNameMaxLengthValidatorFn]],
    departmentName: ['', [Validators.required, Validators.maxLength(this.departmentNameMaxLength)]],
    departmentEmail: ['', [Validators.required, Validators.email]],
    departmentPhone: ['', Validators.required],
  });

  isLoading = computed(
    () =>
      this.marketParticipantEditableFieldsQuery.loading() ||
      this.updateMarketParticipantMutation.loading()
  );

  hasMarketParticipantManagePermission = toSignal(
    this.permissionService.hasPermission('actors:manage'),
    {
      initialValue: false,
    }
  );

  constructor() {
    super();

    this.marketParticipantEditableFieldsQuery.query({
      variables: { marketParticipantId: this.modalData.id },
    });

    effect(() => {
      this.hasMarketParticipantManagePermission()
        ? this.actorForm.controls.name.enable()
        : this.actorForm.controls.name.disable();
    });

    effect(() => {
      const marketParticipantEditableFields =
        this.marketParticipantEditableFieldsQuery.data()?.marketParticipantById;

      if (!marketParticipantEditableFields) {
        return;
      }

      const { name, contact } = marketParticipantEditableFields;

      this.actorForm.patchValue({
        name,
        departmentName: contact?.name,
        departmentPhone: contact?.phone,
        departmentEmail: contact?.email,
      });
    });
  }

  save() {
    const { departmentEmail, departmentName, departmentPhone, name } = this.actorForm.getRawValue();

    if (!name || !departmentName || !departmentPhone || !departmentEmail || !this.actorForm.valid) {
      return;
    }

    this.updateMarketParticipantMutation.mutate({
      variables: {
        input: {
          marketParticipantId: this.modalData.id,
          marketParticipantName: name,
          departmentName,
          departmentPhone,
          departmentEmail,
        },
      },
      refetchQueries: (result) => {
        if (this.isUpdateSuccessful(result.data)) {
          return [
            GetMarketParticipantsDocument,
            GetMarketParticipantByIdDocument,
            GetMarketParticipantDetailsDocument,
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

  close() {
    this.modal().close(false);
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
