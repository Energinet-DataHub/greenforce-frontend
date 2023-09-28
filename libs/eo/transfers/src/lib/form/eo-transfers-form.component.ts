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
  base64EncodedWalletDepositEndpoint: string;
  startDate: number;
  endDate: number | null;
}

export interface EoTransfersFormReceiver {
  tin: FormControl<string | null>;
  base64EncodedWalletDepositEndpoint: FormControl<string | null>;
}

export interface EoTransferFormPeriod {
  startDate: FormControl<number | null>;
  endDate: FormControl<number | null>;
}

export interface EoTransfersForm {
  receiver: FormGroup<EoTransfersFormReceiver>;
  period: FormGroup<EoTransferFormPeriod>;
}

type FormField = 'receiverTin' | 'base64EncodedWalletDepositEndpoint' | 'startDate' | 'endDate';

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
      eo-transfers-form .fieldset {
        display: flex;
        flex-wrap: wrap;
      }

      eo-transfers-form .receiver {
        max-width: 300px;
        margin-top: 17px;
      }

      eo-transfers-form .mat-form-field-wrapper {
        padding-bottom: 0 !important;
      }
    `,
  ],

  template: `
    <ng-container *ngIf="mode === 'create'; then create; else edit"></ng-container>

    <ng-template #create>
      <form [formGroup]="form" class="watt-modal-content--full-width">
        <watt-stepper (completed)="onSubmit()">
          <watt-stepper-step
            label="Recipient"
            nextButtonLabel="Agreement details"
            [stepControl]="form.controls.receiver"
          >
            <ng-container *ngTemplateOutlet="receiver"></ng-container>
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
      <style>
        .long-label {
          white-space: normal;
          overflow: visible;
        }
      </style>
      <ng-container [formGroup]="form.controls.receiver">
        <watt-form-field class="receiver">
          <watt-label>CVR NO./TIN</watt-label>
          <input
            wattInput
            required="true"
            inputmode="numeric"
            type="text"
            formControlName="tin"
            [maxlength]="8"
            (keydown)="preventNonNumericInput($event)"
            data-testid="new-agreement-receiver-input"
          />
        </watt-form-field>
        <eo-transfers-errors
          [showError]="
            form.controls.receiver.controls.tin.touched || form.controls.receiver.controls.tin.dirty
          "
        >
          <watt-error
            [style.opacity]="form.controls.receiver.controls.tin.errors?.['receiverTinEqualsSenderTin'] ? 1 : 0"
          >
            The receiver cannot be your own TIN/CVR
          </watt-error>
          <watt-error
            [style.opacity]="
      form.controls.receiver.controls.tin.errors?.['receiverTinEqualsSenderTin'] ? 0 : form.controls.receiver.controls.tin.errors ? 1 : 0
    "
          >
            An 8-digit TIN/CVR number is required
          </watt-error>
        </eo-transfers-errors>
        <watt-form-field class="receiver">
          <watt-label class="long-label">ONE-TIME KEY GENERATED BY RECIPIENT</watt-label>
          <input
            wattInput
            required="true"
            type="text"
            formControlName="base64EncodedWalletDepositEndpoint"
            data-testid="new-agreement-base64-input"
          />
        </watt-form-field>
        <eo-transfers-errors
          [showError]="
            form.controls.receiver.controls.base64EncodedWalletDepositEndpoint.touched ||
            form.controls.receiver.controls.base64EncodedWalletDepositEndpoint.dirty
          "
        >
          <watt-error
            [style.opacity]="form.controls.receiver.controls.base64EncodedWalletDepositEndpoint.errors?.['required'] ? 1 : 0"
          >
            A Wallet Deposit Endpoint is required
          </watt-error>
          <watt-error
            [style.opacity]="form.controls.receiver.controls.base64EncodedWalletDepositEndpoint.errors?.['pattern'] ? 1 : 0"
          >
            Not a valid Wallet Deposit Endpoint
          </watt-error>
        </eo-transfers-errors>
      </ng-container>
    </ng-template>
  `,
})
export class EoTransfersFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() senderTin?: string;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() submitButtonText = 'Create transfer agreement';
  @Input() initialValues: EoTransfersFormInitialValues = {
    receiverTin: '',
    base64EncodedWalletDepositEndpoint: '',
    startDate: new Date().setHours(new Date().getHours() + 1, 0, 0, 0),
    endDate: null,
  };
  @Input() editableFields: FormField[] = [
    'receiverTin',
    'base64EncodedWalletDepositEndpoint',
    'startDate',
    'endDate',
  ];
  @Input() existingTransferAgreements: EoExistingTransferAgreement[] = [];

  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();
  @Output() receiverTinChanged = new EventEmitter<string | null>();

  protected form!: FormGroup<EoTransfersForm>;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();

    const tin = this.form.controls.receiver.controls['tin'];
    tin.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          return of(tin.valid);
        }),
        distinctUntilChanged()
      )
      .subscribe((receiverTinValidity) => {
        const receiverTin = receiverTinValidity ? tin.value : null;
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
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'Alt'];
    const selectAll = event.key === 'a' && (event.metaKey || event.ctrlKey);
    const isNumericInput = /^[0-9]+$/.test(event.key);
    const isSpecialKey = allowedKeys.includes(event.key);

    if (!isNumericInput && !isSpecialKey && !selectAll) {
      event.preventDefault();
    }
  }

  private initForm() {
    const { receiverTin, base64EncodedWalletDepositEndpoint, startDate, endDate } =
      this.initialValues;

    this.form = new FormGroup<EoTransfersForm>({
      receiver: new FormGroup({
        tin: new FormControl(
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
        base64EncodedWalletDepositEndpoint: new FormControl(
          {
            value: base64EncodedWalletDepositEndpoint || '',
            disabled: !this.editableFields.includes('base64EncodedWalletDepositEndpoint'),
          },
          {
            validators: [
              Validators.required,
              Validators.pattern(
                /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
              ),
            ],
          }
        ),
      }),
      period: new FormGroup(
        {
          startDate: new FormControl(
            {
              value: startDate,
              disabled: !this.editableFields.includes('startDate'),
            },
            {
              validators: [Validators.required, nextHourOrLaterValidator()],
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
