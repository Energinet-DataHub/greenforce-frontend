import { Component, computed, effect, inject, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattModalComponent, WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import {
  GetPermissionDetailsDocument,
  GetPermissionsDocument,
  UpdatePermissionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-edit-permission-modal',
  templateUrl: './dh-edit-permission-modal.component.html',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattTabComponent,
    WattTabsComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,
  ],
})
export class DhEditPermissionModalComponent extends WattTypedModal<PermissionDto> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  private editPermissionModal = viewChild.required(WattModalComponent);
  private updatePermission = mutation(UpdatePermissionDocument);

  readonly userPermissionsForm = this.formBuilder.group({
    description: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(1000),
    ]),
  });

  isSaving = computed(() => this.updatePermission.loading());

  constructor() {
    super();
    effect(() => {
      if (this.updatePermission.error()) {
        const message = this.transloco.translate('admin.userManagement.editPermission.saveError');

        this.toastService.open({ type: 'danger', message });
      }

      if (this.updatePermission.data() && this.updatePermission.loading() === false) {
        const message = this.transloco.translate('admin.userManagement.editPermission.saveSuccess');

        this.toastService.open({ type: 'success', message });
        this.closeModal(true);
      }

      this.userPermissionsForm.controls.description.setValue(this.modalData.description);
    });
  }

  closeModal(saveSuccess: boolean): void {
    this.editPermissionModal().close(saveSuccess);
  }

  save(): void {
    if (this.userPermissionsForm.invalid) {
      return;
    }

    if (this.userPermissionsForm.pristine) {
      return this.closeModal(false);
    }

    this.updatePermission.mutate({
      refetchQueries: [GetPermissionsDocument, GetPermissionDetailsDocument],
      variables: {
        input: {
          id: this.modalData.id,
          description: this.userPermissionsForm.controls.description.value,
        },
      },
    });
  }
}
