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
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Subject, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattModalActionsComponent } from '@energinet-datahub/watt/modal';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';

import {
  compareValidator,
  endDateMustBeLaterThanStartDateValidator,
  minTodayValidator,
  nextHourOrLaterValidator,
  overlappingTransferAgreementsValidator,
} from '../validations';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { EoExistingTransferAgreement } from '../eo-transfers.store';
import { EoTransfersPeriodComponent } from './eo-transfers-period.component';
import { EoTransfersDateTimeComponent } from './eo-transfers-date-time.component';
import { EoTransferErrorsComponent } from './eo-transfers-errors.component';

export interface EoTransfersFormInitialValues {
  receiverTin: string;
  startDate: number;
  endDate: number | null;
}

export interface EoTransferFormPeriod {
  startDate: FormControl<number | null>;
  endDate: FormControl<number | null>;
}

export interface EoTransfersForm {
  receiverTin: FormControl<string | null>;
  period: FormGroup<EoTransferFormPeriod>;
}

type FormField = 'receiverTin' | 'startDate' | 'endDate';

@Component({
  selector: 'eo-transfers-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WattInputDirective,
    WattDatepickerComponent,
    WattModalActionsComponent,
    WattButtonComponent,
    EoTransfersPeriodComponent,
    EoTransfersTimepickerComponent,
    WattRadioComponent,
    NgIf,
    NgClass,
    WattDatePipe,
    CommonModule,
    EoTransfersDateTimeComponent,
    EoTransferErrorsComponent,
    WATT_STEPPER,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      eo-transfers-form {
        fieldset {
          display: flex;
          flex-wrap: wrap;
        }

        .receiver {
          max-width: 280px;
          margin-top: var(--watt-space-l);
        }
      }
    `,
  ],
  template: `
    <ng-container *ngIf="mode === 'create'; then create; else edit"></ng-container>

    <ng-template #create>
      <form [formGroup]="form">
        <watt-stepper (completed)="onSubmit()">
          <watt-stepper-step
            label="Recipient"
            nextButtonLabel="Agreement details"
            [stepControl]="form.controls.receiverTin"
          >
            <div style="min-height: 280px;">
              <ng-container *ngTemplateOutlet="receiver"></ng-container>
            </div>
          </watt-stepper-step>
          <watt-stepper-step
            label="Agreement details"
            previousButtonLabel="Recipient"
            [nextButtonLabel]="submitButtonText"
            [stepControl]="form.controls.period"
          >
            <eo-transfers-form-period
              formGroupName="period"
              [existingTransferAgreements]="existingTransferAgreements"
            ></eo-transfers-form-period>
          </watt-stepper-step>
        </watt-stepper>
      </form>
    </ng-template>

    <ng-template #edit>
      <form [formGroup]="form">
        <ng-container *ngTemplateOutlet="receiver"></ng-container>
        <eo-transfers-form-period
          formGroupName="period"
          [existingTransferAgreements]="existingTransferAgreements"
        ></eo-transfers-form-period>

        <watt-modal-actions>
          <watt-button
            variant="secondary"
            data-testid="close-new-agreement-button"
            (click)="onCancel()"
          >
            Cancel
          </watt-button>
          <watt-button data-testid="create-new-agreement-button" (click)="onSubmit()">
            {{ submitButtonText }}
          </watt-button>
        </watt-modal-actions>
      </form>
    </ng-template>

    <ng-template #receiver>
      <ng-container [formGroup]="form">
        <watt-form-field class="receiver">
          <watt-label>Receiver</watt-label>
          <input
            wattInput
            required="true"
            inputmode="numeric"
            type="text"
            formControlName="receiverTin"
            [maxlength]="8"
            (keydown)="preventNonNumericInput($event)"
            data-testid="new-agreement-receiver-input"
          />
        </watt-form-field>
        <eo-transfers-errors
          [showError]="form.controls.receiverTin.touched || form.controls.receiverTin.dirty"
        >
          <watt-error
            [style.opacity]="form.controls.receiverTin.errors?.['receiverTinEqualsSenderTin'] ? 1 : 0"
          >
            The receiver cannot be your own TIN/CVR
          </watt-error>
          <watt-error
            [style.opacity]="
              form.controls.receiverTin.errors &&
              !form.controls.receiverTin.errors['receiverTinEqualsSenderTin']
                ? 1
                : 0
            "
          >
            An 8-digit TIN/CVR number is required
          </watt-error>
        </eo-transfers-errors>
      </ng-container>
    </ng-template>
  `,
})
export class EoTransfersFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() senderTin?: string;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() submitButtonText = 'Create';
  @Input() initialValues: EoTransfersFormInitialValues = {
    receiverTin: '',
    startDate: new Date().setHours(new Date().getHours() + 1, 0, 0, 0),
    endDate: null,
  };
  @Input() editableFields: FormField[] = ['receiverTin', 'startDate', 'endDate'];
  @Input() existingTransferAgreements: EoExistingTransferAgreement[] = [];

  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() receiverTinChanged = new EventEmitter<string | null>();

  protected form!: FormGroup<EoTransfersForm>;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();

    this.form.controls['receiverTin'].valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return of(this.form.controls['receiverTin'].valid);
        }),
        distinctUntilChanged()
      )
      .subscribe((receiverTinValidity) => {
        const receiverTin = receiverTinValidity ? this.form.controls['receiverTin'].value : null;
        this.receiverTinChanged.emit(receiverTin);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existingTransferAgreements'] && this.form) {
      this.form.controls.period.setValidators(this.getPeriodValidators());
      this.form.controls.period.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onCancel() {
    this.canceled.emit();
  }

  protected onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.form.value);
  }

  protected preventNonNumericInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
    const isNumericInput = /^[0-9]+$/.test(event.key);
    const isSpecialKey = allowedKeys.includes(event.key);

    if (!isNumericInput && !isSpecialKey) {
      event.preventDefault();
    }
  }

  private initForm() {
    const { receiverTin, startDate, endDate } = this.initialValues;

    this.form = new FormGroup<EoTransfersForm>({
      receiverTin: new FormControl(
        {
          value: receiverTin || '',
          disabled: !this.editableFields.includes('receiverTin'),
        },
        {
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]{8}$'),
            compareValidator(this.senderTin || '', 'receiverTinEqualsSenderTin'),
          ],
        }
      ),
      period: new FormGroup(
        {
          startDate: new FormControl(
            {
              value: startDate,
              disabled: !this.editableFields.includes('startDate'),
            },
            {
              validators: [nextHourOrLaterValidator()],
            }
          ),
          endDate: new FormControl(
            {
              value: endDate,
              disabled: !this.editableFields.includes('endDate'),
            },
            { validators: [minTodayValidator()] }
          ),
        },
        {
          validators: this.getPeriodValidators(),
        }
      ),
    });
  }

  getPeriodValidators() {
    return [
      endDateMustBeLaterThanStartDateValidator(),
      overlappingTransferAgreementsValidator(this.existingTransferAgreements),
    ];
  }
}
