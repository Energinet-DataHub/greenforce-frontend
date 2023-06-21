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
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  inject
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { subDays } from 'date-fns';
import { PushModule } from '@rx-angular/template/push';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';

import { EoListedTransfer } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-edit-modal',
  imports: [
    NgIf,
    PushModule,
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
  ],
  standalone: true,
  styles: [
    `
      watt-form-field {
        margin-top: var(--watt-space-l);
        margin-bottom: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      [title]="title"
      size="small"
      closeLabel="Close modal"
      [loading]="patchingTransfer$ | push"
      (closed)="whenClosed()"
    >
      <form [formGroup]="form">
        <watt-form-field>
          <watt-label>End date of the period</watt-label>
          <watt-datepicker
            #endDateRef
            required="true"
            formControlName="endDate"
            [min]="minDate"
            data-testid="transfer-agreement-end-date-input"
          />
          <watt-error *ngIf="form.controls.endDate.hasError('required')"
            >An end date is required</watt-error
          >
          <watt-error *ngIf="form.controls.endDate.hasError('apiErrors')">
            {{ (patchingTransferError$ | push)?.error }}
          </watt-error>
        </watt-form-field>
      </form>
      <watt-modal-actions>
        <watt-button
          variant="secondary"
          data-testid="close-edit-transfer-agreement-button"
          (click)="modal.close(false)"
        >
          Cancel
        </watt-button>
        <watt-button
          data-testid="save-transfer-agreement-button"
          [disabled]="!form.valid || form.value.endDate === initialValue"
          (click)="saveTransferAgreement()"
        >
          Save
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoTransfersEditModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @ViewChild('endDateRef', { read: ElementRef }) endDateRef!: ElementRef;

  @Input() title = '';
  @Input() transfer?: EoListedTransfer;

  private store = inject(EoTransfersStore);
  private cd = inject(ChangeDetectorRef);

  initialValue!: string;
  minDate = new Date();
  form = new FormGroup({
    endDate: new FormControl(
      this.transfer?.endDate ? new Date(this.transfer?.endDate).toISOString() : '',
      [Validators.required]
    ),
  });

  patchingTransfer$ = this.store.patchingTransfer$;
  patchingTransferError$ = this.store.patchingTransferError$;

  whenClosed() {
    this.resetFormValues();
  }

  open() {
    const { endDate } = this.transfer || {};
    if (endDate) {
      this.initialValue = subDays(endDate, 1).toISOString();
      this.form.controls['endDate'].setValue(this.initialValue);
      this.form.markAsPristine();
    }
    this.modal.open();
  }

  saveTransferAgreement() {
    const endDate = this.form.controls['endDate'].value;
    if (!this.form.valid || !endDate || !this.transfer) return;

    this.store.patchSelectedTransfer({
      endDate,
      onSuccess: () => {
        this.modal.close(true);
      },
      onError: () => {
        this.form.controls['endDate'].setErrors({ apiErrors: true });

        // This is a hack to force the error to show, since markAsTouched() and markAsDirty() doesn't work
        this.endDateRef.nativeElement.querySelector('input').focus();
        this.endDateRef.nativeElement.querySelector('input').blur();
      },
    });
    this.cd.detectChanges();
  }

  private resetFormValues() {
    this.form.reset();
    this.form.markAsUntouched();
  }
}
