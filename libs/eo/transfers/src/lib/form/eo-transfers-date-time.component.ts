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
  forwardRef,
  Input,
  ViewEncapsulation,
  ViewChild,
  OnChanges,
  SimpleChanges,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
  FormGroup,
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  Validators,
} from '@angular/forms';
import { WattDatepickerComponent } from '@energinet-datahub/watt/picker/datepicker';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { EoTransfersTimepickerComponent } from './eo-transfers-timepicker.component';

import { isToday } from 'date-fns';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EoExistingTransferAgreement } from '../existing-transfer-agreement';

@Component({
  selector: 'eo-transfers-datetime',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EoTransfersTimepickerComponent,
    WattDatepickerComponent,
  ],
  styles: [
    `
      eo-transfers-datetime {
        display: flex;
        gap: var(--watt-space-m);
        align-items: flex-end;
      }

      eo-transfers-datetime watt-datepicker {
        max-width: 160px;

        input {
          width: 90px;
        }
      }

      eo-transfers-datetime watt-field:not(.watt-field--chip) {
        min-height: 0px;
      }

      eo-transfers-datetime watt-field.watt-field--invalid watt-field-error {
        display: none;
      }

      .mat-calendar-body-cell {
        pointer-events: none;
      }

      .mat-calendar-body-cell-content {
        pointer-events: all;
        border: none !important;
      }

      .mat-calendar-body-cell:not(.mat-calendar-body-disabled) {
        &:hover .mat-calendar-body-cell-content {
          color: var(--watt-color-neutral-black) !important;
          box-shadow: none;
        }

        &.eo-transfers-form-overlapping-date .mat-calendar-body-cell-content {
          background: linear-gradient(
            -45deg,
            var(--watt-color-state-warning-light) 50%,
            var(--watt-color-primary-light) 50%
          ) !important;

          &.mat-calendar-body-selected,
          &:hover {
            background: linear-gradient(
              -45deg,
              var(--watt-color-state-warning) 50%,
              var(--watt-color-primary) 50%
            ) !important;
            color: var(--watt-color-neutral-black) !important;
          }
        }

        &.eo-transfers-form-fully-booked {
          pointer-events: none;
          .mat-calendar-body-cell-content {
            pointer-events: none;
            background: var(--watt-color-state-danger-light);
            color: rgba(0, 0, 0, 0.38) !important;

            &.mat-calendar-body-selected,
            &:hover {
              background: var(--watt-color-state-danger) !important;
              color: var(--watt-color-neutral-white) !important;
            }
          }
        }

        .mat-calendar-body-today {
          box-shadow: none !important;
          border: none !important;
        }
      }
    `,
  ],
  template: `
    <ng-container [formGroup]="form">
      <watt-datepicker
        [label]="label"
        #endDatePicker
        formControlName="date"
        [min]="min"
        [dateClass]="dateClass"
      />
      <eo-transfers-timepicker formControlName="time" [disabledHours]="disabledHours" />
    </ng-container>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EoTransfersDateTimeComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: EoTransfersDateTimeComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EoTransfersDateTimeComponent
  implements ControlValueAccessor, Validator, OnInit, OnChanges
{
  @Input() min!: Date;
  @Input() existingTransferAgreements: EoExistingTransferAgreement[] = [];
  @Input() label = '';

  @ViewChild(EoTransfersTimepickerComponent) timepicker!: EoTransfersTimepickerComponent;

  private destroyRef = inject(DestroyRef);
  private statusChangesSubscription!: Subscription;
  protected form = new FormGroup({
    date: new FormControl('', { validators: [Validators.required] }),
    time: new FormControl(),
  });
  protected disabledHours: string[] = [];

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
      const { date, time } = values;
      let newValue = null;

      if (date && time) {
        newValue = new Date(date).setHours(time, 0, 0, 0);
      } else if (date) {
        const hours = new Date().getHours() + 1;
        newValue = new Date(date).setHours(hours, 0, 0, 0);
      }

      this.onChange(newValue);
      this.onTouched();
    });

    this.form.controls.date.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => {
        this.disabledHours = this.getDisabledHours(
          date ? new Date(date).setHours(0, 0, 0, 0) : null
        );
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['existingTransferAgreements']) {
      const date = this.form.controls.date.value;
      this.disabledHours = this.getDisabledHours(date ? new Date(date).getTime() : null);
    }
  }

  onChange: (value: number | null) => void = () => {
    // Intentionally left empty
  };

  onTouched: () => void = () => {
    // Intentionally left empty
  };

  writeValue(value: number): void {
    if (value) {
      const date = new Date(value);
      const hours = date.getHours();
      this.form.controls.time.setValue(String(hours).padStart(2, '0'), { emitEvent: false });

      const ISOString = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      this.form.controls.date.setValue(ISOString, { emitEvent: false });
    } else {
      this.form.controls.date.setValue(null, { emitEvent: false });
      this.form.controls.time.setValue(null, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(control: AbstractControl) {
    if (!this.statusChangesSubscription) {
      const { date, time } = this.form.controls;

      this.statusChangesSubscription = control.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          date.setErrors(control.errors);
          time.setErrors(control.errors);
          this.timepicker?.validate(time);
        });
    }
    return {};
  }

  protected dateClass = (cellDate: Date, view: 'month' | 'year' | 'multi-year') => {
    if (view !== 'month') return '';

    const disabledHours = this.getDisabledHours(cellDate.setHours(0, 0, 0, 0));
    if (disabledHours.length >= 24) return 'eo-transfers-form-fully-booked';
    if (disabledHours.length > 0) return 'eo-transfers-form-overlapping-date';

    return '';
  };

  protected getDisabledHours(date: number | null): string[] {
    if (!date) return [];

    // Generate an array of hours from 0 to 24
    const hours = Array.from({ length: 25 }, (_, i) => i);

    // If today, remove hours that are in the past
    let hoursInThePast: number[] = [];
    if (isToday(date)) {
      hoursInThePast = hours.filter((hour) => hour <= new Date().getHours());
    }

    // Filter out hours that are overlapping with existing transfer agreements
    return hours
      .filter((hour) => {
        if (hoursInThePast.includes(hour)) return true;

        return this.isOverlappingWithExistingTransferAgreement(
          new Date(date).setHours(hour, 0, 0, 0)
        );
      })
      .map((hour) => {
        return hour.toString().padStart(2, '0') + ':00';
      });
  }

  private isOverlappingWithExistingTransferAgreement(date: number): boolean {
    return this.existingTransferAgreements.some((agreement) => {
      const endDate = agreement.endDate || Infinity;
      return date > agreement.startDate && date <= endDate;
    });
  }
}
