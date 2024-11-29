import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, computed, effect, inject, viewChild } from '@angular/core';

import { MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattToastService, WattToastType } from '@energinet-datahub/watt/toast';

import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
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
export class DhActorsEditActorModalComponent extends WattTypedModal<DhActorExtended> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);
  private readonly permissionService = inject(PermissionService);

  private modal = viewChild.required<WattModalComponent>(WattModalComponent);

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

  hasActorManagePermission = toSignal(this.permissionService.hasPermission('actors:manage'), {
    initialValue: false,
  });

  constructor() {
    super();

    this.actorEditableFieldsQuery.query({ variables: { actorId: this.modalData.id } });

    effect(() => {
      this.hasActorManagePermission()
        ? this.actorForm.controls.name.enable()
        : this.actorForm.controls.name.disable();
    });

    effect(() => {
      const actorEditableFields = this.actorEditableFieldsQuery.data()?.actorById;

      if (!actorEditableFields) {
        return;
      }

      const { name, contact } = actorEditableFields;

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

    this.updateActorMutation.mutate({
      variables: {
        input: {
          actorId: this.modalData.id,
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

  private isUpdateSuccessful(mutationResult: MutationResult<UpdateActorMutation>['data']): boolean {
    return !mutationResult?.updateActor.errors?.length;
  }
}
