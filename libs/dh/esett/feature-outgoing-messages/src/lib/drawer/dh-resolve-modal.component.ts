import { Component, inject } from '@angular/core';
import { translate, TranslocoDirective } from '@ngneat/transloco';

import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  EsettOutgoingMessage,
  GetOutgoingMessageByIdDocument,
  GetOutgoingMessagesDocument,
  ManuallyHandleOutgoingMessageDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { WattToastService } from '@energinet-datahub/watt/toast';

@Component({
  selector: 'dh-resolve-modal',
  standalone: true,
  template: `
    <watt-modal
      size="small"
      #modal
      *transloco="let t; read: 'eSett.outgoingMessages.drawer.resolveModal'"
      [title]="t('markAsResolved')"
    >
      <form id="resolve-form" [formGroup]="resolveForm" (ngSubmit)="resolve()">
        <watt-textarea-field
          class="comment-textarea"
          [formControl]="resolveForm.controls.comment"
          [label]="t('resolveField')"
          [required]="true"
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button
          variant="secondary"
          type="submit"
          formId="resolve-form"
          [disabled]="loading()"
          [loading]="loading()"
        >
          {{ t('markAsResolved') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattTextAreaFieldComponent,
  ],
})
export class DhResolveModalComponent extends WattTypedModal<{
  message: EsettOutgoingMessage;
}> {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly toastService = inject(WattToastService);

  resolveMutation = mutation(ManuallyHandleOutgoingMessageDocument, {
    refetchQueries: [GetOutgoingMessagesDocument, GetOutgoingMessageByIdDocument],
  });

  loading = this.resolveMutation.loading;

  resolveForm = this.formBuilder.group({
    comment: ['', [Validators.required, Validators.maxLength(1024)]],
  });

  async resolve() {
    if (this.resolveForm.controls.comment.valid === false) {
      return;
    }

    const result = await this.resolveMutation.mutate({
      variables: {
        input: {
          documentId: this.modalData.message.documentId,
          comment: this.resolveForm.controls.comment.value,
        },
      },
    });

    if (result.error) {
      this.toastService.open({
        type: 'danger',
        message: translate('eSett.outgoingMessages.drawer.resolveModal.resolvedError'),
      });
    }

    if (result.data?.manuallyHandleOutgoingMessage.success) {
      this.toastService.open({
        type: 'success',
        message: translate('eSett.outgoingMessages.drawer.resolveModal.resolvedSuccess'),
      });

      this.dialogRef.close(true);
    }
  }
}
