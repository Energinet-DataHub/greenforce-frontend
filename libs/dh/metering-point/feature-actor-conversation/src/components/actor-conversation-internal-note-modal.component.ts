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
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextFieldComponent } from '@energinet/watt/text-field';

import {
  GetConversationDocument,
  GetConversationsDocument,
  UpdateInternalConversationNoteDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { injectToast } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-actor-conversation-internal-note-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
    ReactiveFormsModule,
    TranslocoDirective,
  ],
  template: `
    <watt-modal #modal *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <h2 class="watt-modal-title">{{ t('editInternalNote.title') }}</h2>
      <form [formGroup]="form" id="edit-internal-note-form" (ngSubmit)="save(modal)">
        <watt-text-field
          [label]="t('internalNoteLabel')"
          [formControl]="form.controls.internalNote"
          [maxLength]="80"
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('editInternalNote.closeButton') }}
        </watt-button>
        <watt-button
          formId="edit-internal-note-form"
          [loading]="updateMutation.loading()"
          type="submit"
        >
          {{ t('editInternalNote.saveButton') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhActorConversationInternalNoteModalComponent extends WattTypedModal<{
  conversationId: string;
  internalNote: string | null;
}> {
  private readonly fb = inject(NonNullableFormBuilder);
  updateMutation = mutation(UpdateInternalConversationNoteDocument);
  private readonly updateToast = injectToast(
    'meteringPoint.actorConversation.editInternalNote.toast'
  );
  private readonly updateToastEffect = effect(() =>
    this.updateToast(this.updateMutation.status())
  );

  form = this.fb.group({
    internalNote: this.fb.control(this.modalData.internalNote ?? '', Validators.maxLength(80)),
  });

  async save(modal: { close: (result: boolean) => void }) {
    if (this.form.invalid) return;

    const { internalNote } = this.form.getRawValue();

    await this.updateMutation.mutate({
      variables: {
        conversationId: this.modalData.conversationId,
        internalNote,
      },
      refetchQueries: [GetConversationDocument, GetConversationsDocument],
    });

    modal.close(true);
  }
}
