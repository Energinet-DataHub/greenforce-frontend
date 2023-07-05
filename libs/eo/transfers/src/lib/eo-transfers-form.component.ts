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
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';

import { endDateMustBeLaterThanStartDateValidator, nextHourOrLaterValidator } from './validations';
import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';
import { Subject, takeUntil } from 'rxjs';
import { add } from 'date-fns';
import { WattModalActionsComponent } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

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
    EoTransfersTimepickerComponent,
    WattRadioComponent,
    NgIf,
    NgClass,
  ],
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
      .start-date {
        max-width: 280px;
      }

      .start-date {
        margin-bottom: var(--watt-space-xs);
        position: relative;
        padding-bottom: var(--watt-space-s);
      }

      .start-date watt-error {
        position: absolute;
        bottom: 0;
      }

      .endDate watt-form-field .mat-placeholder-required.mat-form-field-required-marker {
        display: none;
      }

      .end-date-label {
        width: 100%;
        margin-bottom: var(--watt-space-s);
      }

      .end-date-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 26px;
        max-width: 60%;
      }

      .end-date-container watt-error {
        margin-top: -32px;
      }

      .radio-buttons-container {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);
        margin-bottom: 46px;
      }

      .datepicker {
        max-width: 160px;
        margin-right: var(--watt-space-m);
      }

      eo-transfers-timepicker:first-of-type {
        max-width: 104px;
      }

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
      <fieldset class="start-date">
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
        <watt-error *ngIf="form.controls.startDate.errors?.['nextHourOrLater']" class="watt-text-s">
          The start of the period must be at least the next hour from now
        </watt-error>
      </fieldset>
      <fieldset class="endDate">
        <p
          class="watt-label end-date-label"
          [ngClass]="{ 'has-error': form.controls.endDate.errors }"
        >
          End of period <span class="asterisk">*</span>
        </p>

        <div class="radio-buttons-container">
          <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="false"
            >No end date</watt-radio
          >
          <watt-radio group="has_enddate" formControlName="hasEndDate" [value]="true"
            >End by</watt-radio
          >
        </div>

        <div *ngIf="form.value.hasEndDate" class="end-date-container">
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
            *ngIf="form.controls.endDate.errors?.['endDateMustBeLaterThanStartDate']"
            class="watt-text-s"
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
        (click)="onCancel()"
      >
        Cancel
      </watt-button>
      <watt-button
        data-testid="create-new-agreement-button"
        [disabled]="!form.valid"
        (click)="onSubmit()"
      >
        Create
      </watt-button>
    </watt-modal-actions>
  `,
})
export class EoTransfersFormComponent implements OnInit, OnDestroy {
  @Output() submitted = new EventEmitter();
  @Output() canceled = new EventEmitter();

  protected minStartDate: Date = new Date();
  protected maxStartDate?: Date;
  protected minEndDate: Date = new Date();
  protected form = new FormGroup(
    {
      receiverTin: new FormControl('', [Validators.minLength(8), Validators.pattern('^[0-9]*$')]),
      startDate: new FormControl(new Date().toISOString()),
      startDateTime: new FormControl(this.getStartDateTimeDefaultValue()),
      hasEndDate: new FormControl(false, [Validators.required]),
      endDate: new FormControl(''),
      endDateTime: new FormControl(''),
    },
    { validators: [endDateMustBeLaterThanStartDateValidator(), nextHourOrLaterValidator()] }
  );

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form.controls.startDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((startDate) => {
        this.minEndDate = startDate ? new Date(startDate) : new Date();
      });

    this.form.controls.hasEndDate.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasEndDate) => {
        if (hasEndDate) {
          if (!this.form.controls.startDate.value) return;

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onCancel() {
    this.canceled.emit();
  }

  protected onSubmit() {
    this.submitted.emit(this.form.value);
  }

  private getStartDateTimeDefaultValue(): string {
    const nextHour = new Date().getHours() + 1;
    return nextHour.toString().padStart(2, '0');
  }
}
