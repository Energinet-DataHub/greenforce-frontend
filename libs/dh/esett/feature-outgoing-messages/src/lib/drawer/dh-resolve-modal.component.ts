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
import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'dh-resolve-modal',
  standalone: true,
  styles: [
    `
      .comment-textarea {
        width: 25rem;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; read: 'eSett.outgoingMessages.drawer.resolveModal'"
      [title]="t('markAsResolved')"
    >
      <form id="resolve-form" [formGroup]="resolveForm" (ngSubmit)="resolve()">
        <watt-textarea-field
          class="comment-textarea"
          [formControl]="resolveForm.controls.comment"
          label="{{ t('comment') }}"
          [required]="true"
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button variant="secondary" type="submit" formId="resolve-form" [loading]="this.busy">
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
  resolve: (comment: string) => Promise<boolean>;
}> {
  private readonly formBuilder = inject(FormBuilder);

  busy = false;

  resolveForm = this.formBuilder.group({
    comment: ['', [Validators.required, Validators.maxLength(1024)]],
  });

  async resolve() {
    if (this.busy || !this.resolveForm.valid || !this.resolveForm.value.comment) {
      return;
    }

    this.busy = true;
    const result = await this.modalData.resolve(this.resolveForm.value.comment);
    this.busy = false;

    if (result) {
      this.dialogRef.close(true);
    }
  }
}
