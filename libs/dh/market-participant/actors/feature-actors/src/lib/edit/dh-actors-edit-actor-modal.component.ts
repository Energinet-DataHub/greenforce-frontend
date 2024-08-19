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
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Component, computed, effect, inject, input, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MutationResult } from 'apollo-angular';

import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetActorByIdDocument,
  GetActorEditableFieldsDocument,
  GetActorsDocument,
  GetAuditLogByActorIdDocument,
  UpdateActorDocument,
  UpdateActorMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhMarketParticipantNameMaxLength,
  dhMarketParticipantNameMaxLengthValidatorFn,
} from '../dh-market-participant-name-max-length.validator';

@Component({
  standalone: true,
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
export class DhActorsEditActorModalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);

  innerModal = viewChild.required<WattModalComponent>(WattModalComponent);

  actor = input<DhActorExtended>();

  actorName = computed(() => this.actor()?.name ?? '');

  actorEditableFieldsQuery = lazyQuery(GetActorEditableFieldsDocument);
  updateActorMutation = mutation(UpdateActorDocument);

  nameMaxLength = dhMarketParticipantNameMaxLength;
  departmentNameMaxLength = 250;

  actorForm = this.formBuilder.group({
    name: ['', [Validators.required, dhMarketParticipantNameMaxLengthValidatorFn]],
    departmentName: ['', [Validators.required, Validators.maxLength(this.departmentNameMaxLength)]],
    departmentEmail: ['', [Validators.required, Validators.email]],
    departmentPhone: ['', Validators.required],
  });

  isLoading = computed(
    () => this.actorEditableFieldsQuery.loading() || this.updateActorMutation.loading()
  );

  constructor() {
    effect(
      () => {
        const actorEditableFields = this.actorEditableFieldsQuery.data()?.actorById;
        if (!actorEditableFields) return;

        const { name, contact } = actorEditableFields;

        this.actorForm.patchValue({
          name,
          departmentName: contact?.name,
          departmentPhone: contact?.phone,
          departmentEmail: contact?.email,
        });
      },
      { allowSignalWrites: true }
    );
  }

  open() {
    const actorId = this.actor()?.id;
    if (actorId) {
      this.actorEditableFieldsQuery.query({ variables: { actorId } });
      this.innerModal().open();
    }
  }

  save() {
    const actorId = this.actor()?.id;
    const { departmentEmail, departmentName, departmentPhone, name } = this.actorForm.getRawValue();
    if (
      !actorId ||
      !name ||
      !departmentName ||
      !departmentPhone ||
      !departmentEmail ||
      !this.actorForm.valid
    )
      return;

    this.updateActorMutation.mutate({
      variables: {
        input: {
          actorId,
          actorName: name,
          departmentName,
          departmentPhone,
          departmentEmail,
        },
      },
      refetchQueries: (result) => {
        if (this.isUpdateSuccessful(result.data)) {
          return [GetActorsDocument, GetActorByIdDocument, GetAuditLogByActorIdDocument];
        }

        return [];
      },
      onCompleted: (data) => {
        if (data.updateActor.errors) {
          this.showToast('danger', 'error');
        } else {
          this.showToast('success', 'success');
        }
        this.innerModal().close(true);
      },
      onError: () => {
        this.showToast('danger', 'error');
      },
    });
  }

  close() {
    this.innerModal().close(false);
  }

  private showToast(type: WattToastType, label: string): void {
    this.toastService.open({
      type,
      message: this.transloco.translate(
        `marketParticipant.actorsOverview.edit.updateRequest.${label}`
      ),
    });
  }

  private isUpdateSuccessful(mutationResult: MutationResult<UpdateActorMutation>['data']): boolean {
    return !mutationResult?.updateActor.errors?.length;
  }
}
