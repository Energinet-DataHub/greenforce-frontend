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
import { CommonModule, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { EoTransfersService } from './eo-transfers.service';
import { EoTransfersStore } from './eo-transfers.store';
import { WattTimepickerComponent } from '@energinet-datahub/watt/timepicker';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { Subject, takeUntil } from 'rxjs';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { add, getUnixTime } from 'date-fns';

function endDateMustBeLaterThanStartDate() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const startDate = formGroup.controls['startDate'];
    const startDateTime = formGroup.controls['startDateTime'];
    const endDate = formGroup.controls['endDate'];
    const endDateTime = formGroup.controls['endDateTime'];

    if (!startDate.value || !startDateTime.value || !endDate.value || !endDateTime.value) {
      endDateTime.setErrors(null);
      return null;
    }

    const startTimestamp = new Date(startDate.value).setHours(startDateTime.value, 0, 0, 0);
    const endTimestamp = new Date(endDate.value).setHours(endDateTime.value, 0, 0, 0);

    if (endTimestamp <= startTimestamp) {
      endDate.setErrors({ endDateMustBeLaterThanStartDate: true });
      endDateTime.setErrors({ endDateMustBeLaterThanStartDate: true });
    } else {
      endDate.setErrors(null);
      endDateTime.setErrors(null);
    }

    return null;
  };
}

function nextHourOrLaterValidator() {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const formGroup = control as FormGroup;
    const startDate = formGroup.controls['startDate'];
    const startDateTime = formGroup.controls['startDateTime'];
    const nextHour = new Date().getHours() + 1;
    const validTimestamp = new Date().setHours(nextHour, 0, 0, 0);

    if (startDate.errors) return null;
    if(!startDate.value) {
      startDate.setErrors({ nextHourOrLater: true });
      startDateTime.setErrors({ nextHourOrLater: true });
      return null;
    }

    const startTimestamp = new Date(startDate.value).setHours(startDateTime.value, 0, 0, 0);
    if (startTimestamp < validTimestamp) {
      startDate.setErrors({ nextHourOrLater: true });
      startDateTime.setErrors({ nextHourOrLater: true });
    } else {
      startDate.setErrors(null);
      startDateTime.setErrors(null);
    }

    return null;
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-transfers-create-modal',
  imports: [
    WATT_MODAL,
    WATT_FORM_FIELD,
    WattButtonComponent,
    ReactiveFormsModule,
    WattInputDirective,
    WattDatepickerComponent,
    WattTimepickerComponent,
    WattValidationMessageComponent,
    FormsModule,
    NgIf,
    EoTransfersTimepickerComponent,
    WattRadioComponent,
    CommonModule,
  ],
  standalone: true,
  styles: [
    `
      fieldset {
        display: flex;
        flex-wrap: wrap;
      }

      watt-form-field {
        margin-bottom: var(--watt-space-m);
      }

      .receiver {
        margin-top: var(--watt-space-l);
      }

      .receiver,
      .startDate {
        max-width: 280px;
      }

      .endDate watt-form-field .mat-placeholder-required.mat-form-field-required-marker {
        display: none;
      }

      .datepicker {
        max-width: 160px;
        margin-right: var(--watt-space-m);
      }

      eo-transfers-timepicker:first-of-type {
        max-width: 104px;
      }

      /** TODO: should be done in Watt */
      .datetime .mat-form-field-type-mat-date-range-input .mat-form-field-infix {
        width: auto !important;
      }

      .asterisk {
        color: var(--watt-color-primary);
      }

      .has-error,
      .has-error .asterisk {
        color: var(--watt-color-state-danger);
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      [title]="title"
      [size]="'small'"
      closeLabel="Close modal"
      [loading]="requestLoading"
      (closed)="form.reset()"
    >
      <watt-validation-message
        *ngIf="creatingTransferAgreementFailed"
        label="Oops!"
        message="Something went wrong. Please try again."
        icon="danger"
        type="danger"
        size="compact"
      ></watt-validation-message>

      <form [formGroup]="form">
        <watt-form-field class="receiver">
          <watt-label>Receiver</watt-label>
          <input
            wattInput
            required="true"
            type="text"
            formControlName="receiverTin"
            [maxlength]="8"
            data-testid="new-agreement-receiver-input"
          />
          <watt-error *ngIf="form.controls.receiverTin.errors">
            An 8-digit TIN/CVR number is required
          </watt-error>
        </watt-form-field>
        <fieldset
          class="startDate"
          style="margin-bottom: var(--watt-space-xs); position: relative; padding-bottom: var(--watt-space-s);"
        >
          <watt-form-field class="datepicker">
            <watt-label>Start of period</watt-label>
            <watt-datepicker
              formControlName="startDate"
              [min]="minStartDate"
              [max]="maxStartDate"
              data-testid="new-agreement-daterange-input"
            />
          </watt-form-field>
          <eo-transfers-timepicker
            formControlName="startDateTime"
            [selectedDate]="form.controls.startDate.value"
            [errors]="form.controls.startDateTime.errors"
            (invalidOptionReset)="form.controls.startDate.updateValueAndValidity()"
          ></eo-transfers-timepicker>
          <watt-error
            *ngIf="form.controls.startDate.errors?.['nextHourOrLater']"
            class="watt-text-s"
            style="position: absolute; bottom: 0;"
          >
            The start of the period must be at least the next hour from now
          </watt-error>
        </fieldset>
        <fieldset class="endDate">
          <p
            class="watt-label"
            style="width: 100%; margin-bottom: var(--watt-space-s);"
            [ngClass]="{ 'has-error': form.controls.endDate.errors }"
          >
            End of period <span class="asterisk">*</span>
          </p>

          <div
            style="display: flex; flex-direction: column; gap: var(--watt-space-l); margin-bottom: 46px;"
          >
            <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="false"
              >No end date</watt-radio
            >
            <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="true"
              >End by</watt-radio
            >
          </div>

          <div
            *ngIf="form.value.hasEndDate"
            style="display: flex; flex-wrap: wrap; margin-top: 26px; max-width: 60%;"
          >
            <watt-form-field class="datepicker">
              <watt-datepicker
                #endDatePicker
                formControlName="endDate"
                data-testid="new-agreement-daterange-input"
                [min]="minEndDate"
              />
            </watt-form-field>
            <eo-transfers-timepicker
              formControlName="endDateTime"
              [selectedDate]="form.controls.endDate.value"
              [errors]="form.controls.endDateTime.errors"
              [disabledHours]="
                form.controls.startDateTime.value ? [form.controls.startDateTime.value] : []
              "
              (invalidOptionReset)="form.controls.endDate.updateValueAndValidity()"
            >
            </eo-transfers-timepicker>
            <watt-error
              *ngIf="form.controls.endDate.errors?.['required']"
              class="watt-text-s"
              style="margin-top: -32px;"
            >
              An end date is required
            </watt-error>
            <watt-error
              *ngIf="form.controls.endDate.errors?.['endDateMustBeLaterThanStartDate']"
              class="watt-text-s"
              style="margin-top: -32px;"
            >
              The end of the period must be later than the start of the period
            </watt-error>
          </div>
        </fieldset>
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
          Create
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoTransfersCreateModalComponent implements OnInit, OnDestroy {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;
  @ViewChild('endDatePicker', { read: ElementRef }) endDatePicker!: ElementRef;
  @Input() title = '';

  form = new FormGroup(
    {
      receiverTin: new FormControl('', [Validators.minLength(8), Validators.pattern('^[0-9]*$')]),
      startDate: new FormControl(''),
      startDateTime: new FormControl(),
      hasEndDate: new FormControl(false, [Validators.required]),
      endDate: new FormControl(''),
      endDateTime: new FormControl(''),
    },
    { validators: [endDateMustBeLaterThanStartDate(), nextHourOrLaterValidator()] }
  );

  protected minStartDate: Date = new Date();
  protected maxStartDate?: Date;
  protected minEndDate: Date = new Date();
  protected requestLoading = false;
  protected creatingTransferAgreementFailed = false;

  private destroy$ = new Subject<void>();

  constructor(
    private service: EoTransfersService,
    private store: EoTransfersStore,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form.controls.startDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((startDate) => {
        this.minEndDate = startDate ? new Date(startDate) : new Date();
      });

    this.form.controls.hasEndDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasEndDate) => {
        if (hasEndDate) {
          this.form.controls.endDate.setValidators(Validators.required);
          this.form.controls.endDate.setValue(
            add(new Date(this.form.controls.startDate.value as string).setHours(0, 0, 0, 0), {
              days: 1,
            }).toISOString()
          );
          this.form.controls.endDateTime.setValue(this.form.controls.startDateTime.value);
        } else {
          this.form.controls.endDate.setValue(null);
          this.form.controls.endDateTime.setValue(null);
          this.form.controls.endDate.clearValidators();
          this.form.controls.endDate.updateValueAndValidity();
        }
      });

    this.form.controls.endDate.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((endDate) => {
      this.maxStartDate = endDate ? new Date(endDate) : undefined;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.creatingTransferAgreementFailed = false;
    this.requestLoading = false;

    this.form.controls.startDate.setValue(new Date().toISOString());
    this.form.controls.hasEndDate.setValue(false);

    const nextHour = new Date().getHours() + 1;
    this.form.controls.startDateTime.setValue(nextHour.toString().padStart(2, '0'));
    this.form.controls.startDate.updateValueAndValidity();

    this.modal.open();
  }

  createAgreement() {
    const { receiverTin, startDate, startDateTime, endDate, endDateTime } = this.form.value;
    if (!receiverTin || !startDate || !startDateTime) return;

    const transfer = {
      startDate: getUnixTime(new Date(startDate).setHours(parseInt(startDateTime), 0, 0, 0)),
      endDate:
        endDate && endDateTime
          ? getUnixTime(new Date(endDate).setHours(parseInt(endDateTime), 0, 0, 0))
          : null,
      receiverTin,
    };

    this.requestLoading = true;
    this.service.createAgreement(transfer).subscribe({
      next: (transfer) => {
        this.store.addTransfer(transfer);
        this.requestLoading = false;
        this.creatingTransferAgreementFailed = false;
        this.cd.detectChanges();
        this.modal.close(true);
      },
      error: () => {
        this.requestLoading = false;
        this.creatingTransferAgreementFailed = true;
        this.cd.detectChanges();
      },
    });
  }
}
