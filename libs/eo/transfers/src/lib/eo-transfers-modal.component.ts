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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRange } from '@energinet-datahub/watt/date';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { EoTransfersService } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-modal',
  imports: [
    WATT_MODAL,
    WATT_FORM_FIELD,
    WattButtonComponent,
    ReactiveFormsModule,
    WattInputDirective,
    WattDatepickerComponent,
    FormsModule,
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
          <watt-label>Receiver</watt-label>
          <input
            wattInput
            required="true"
            type="text"
            formControlName="tin"
            [maxlength]="8"
            data-testid="new-agreement-receiver-input"
          />
          <watt-error *ngIf="form.controls.tin.errors">
            An 8-digit TIN/CVR number is required
          </watt-error>
        </watt-form-field>
        <watt-form-field>
          <watt-label>Period</watt-label>
          <watt-datepicker
            required="true"
            formControlName="dateRange"
            [range]="true"
            data-testid="new-agreement-daterange-input"
          />
          <watt-error *ngIf="form.controls.dateRange.errors">
            A start and end date is required
          </watt-error>
        </watt-form-field>
      </form>
      <watt-modal-actions>
        <watt-button
          variant="secondary"
          data-testid="close-new-agreement-button"
          (click)="modal.close(false)"
        >
          Cancel
        </watt-button>
        <watt-button
          data-testid="create-new-agreement-button"
          [disabled]="!form.valid"
          (click)="createAgreement()"
        >
          Create transfer agreement
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoTransfersModalComponent {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @Input() title = '';

  form = new FormGroup({
    tin: new FormControl('', [Validators.minLength(8), Validators.pattern('^[0-9]*$')]),
    dateRange: new FormControl<WattDateRange>({ start: '', end: '' }, [
      WattRangeValidators.required(),
    ]),
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
    this.modal.open();
  }

  createAgreement() {
    if (!this.form.valid || !this.form.controls['dateRange'].value) return;

    const transfer = {
      startDate: Math.round(new Date(this.form.controls['dateRange'].value.start).getTime() / 1000),
      endDate: Math.round(new Date(this.form.controls['dateRange'].value.end).getTime() / 1000),
      receiverTin: this.form.controls['tin'].value as string,
    };

    this.requestLoading = true;
    this.service.createAgreement(transfer).subscribe({
      next: (transfer) => {
        this.store.addTransfer(transfer);
        this.requestLoading = false;
        this.cd.detectChanges();
        this.modal.close(true);
      },
      error: () => {
        this.requestLoading = false;
        this.cd.detectChanges();
      },
    });
  }

  private resetFormValues() {
    this.form.patchValue({ tin: '', dateRange: { start: '', end: '' } });
    this.form.markAsUntouched();
  }
}
