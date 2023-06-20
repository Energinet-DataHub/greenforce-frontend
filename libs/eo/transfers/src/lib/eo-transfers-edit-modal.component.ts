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
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { add, subDays } from 'date-fns';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';

import { EoListedTransfer, EoTransfersService } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-edit-modal',
  imports: [
    WATT_MODAL,
    WATT_FORM_FIELD,
    WattDatepickerComponent,
    WattButtonComponent,
    ReactiveFormsModule,
    NgIf,
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
      [loading]="requestLoading"
      (closed)="whenClosed()"
    >
      <form [formGroup]="form">
        <watt-form-field>
          <watt-label>End date of the period</watt-label>
          <watt-datepicker
            required="true"
            formControlName="endDate"
            [min]="minDate"
            data-testid="transfer-agreement-end-date-input"
          />
          <watt-error *ngIf="form.controls.endDate.errors"> An end date is required </watt-error>
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
          [disabled]="!form.valid"
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
  @Input() title = '';
  @Input() transfer?: EoListedTransfer;

  minDate = new Date();
  form = new FormGroup({
    endDate: new FormControl(
      this.transfer?.endDate ? new Date(this.transfer?.endDate).toISOString() : '',
      [Validators.required]
    ),
  });
  requestLoading = false;

  constructor(
    private service: EoTransfersService,
    private store: EoTransfersStore,
    private cd: ChangeDetectorRef
  ) {}

  whenClosed() {
    this.resetFormValues();
  }

  open() {
    const { endDate } = this.transfer || {};
    if (endDate) {
      this.form.controls['endDate'].setValue(subDays(endDate, 1).toISOString());
    }
    this.modal.open();
  }

  saveTransferAgreement() {
    const endDate = this.form.controls['endDate'].value;
    if (!this.form.valid || !endDate || !this.transfer) return;
    const nextDay = add(new Date(endDate), { days: 1 });
    const formattedEndDate = Math.round(nextDay.getTime() / 1000);

    this.requestLoading = true;
    this.service.updateAgreement(this.transfer?.id, formattedEndDate).subscribe({
      next: (transfer: any) => {
        this.store.setTransfer(transfer);
        this.modal.close(true);
        this.requestLoading = false;
      },
      error: () => {
        alert('An error occurred while updating the transfer agreement.');
        this.requestLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  private resetFormValues() {
    this.form.reset();
    this.form.markAsUntouched();
  }
}
