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
import { Component, DestroyRef, inject, input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NgControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';

import { WattTimepickerComponent } from '@energinet-datahub/watt/picker/timepicker';
import { WattDatepickerComponent } from '@energinet-datahub/watt/picker/datepicker';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  standalone: true,
  selector: 'watt-datetimepicker',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    WattDatepickerComponent,
    WattTimepickerComponent,
    VaterFlexComponent,
  ],
  template: `
    <vater-flex direction="row" gap="s">
      <watt-datepicker
        [label]="label()"
        [min]="min()"
        [max]="max()"
        [formControl]="form.controls.scheduledAtDate"
        style="width: 200%"
      >
        <ng-content select="watt-field-error" ngProjectAs="watt-field-error" />
        <ng-content select="watt-field-hint" ngProjectAs="watt-field-hint" />
        <ng-content />
      </watt-datepicker>
      <watt-timepicker [formControl]="form.controls.scheduledAtTime" style="align-self: flex-end" />
    </vater-flex>
  `,
})
export class WattDatetimepickerComponent implements OnInit, ControlValueAccessor {
  formBuilder = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  ngControl = inject(NgControl, { self: true });

  label = input('');
  min = input<Date>();
  max = input<Date>();

  form = this.formBuilder.group({
    scheduledAtDate: [null as Date | null],
    scheduledAtTime: [null as string | null],
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onChange: (value: Date | null) => void = () => {};

  get onChange() {
    return this._onChange;
  }

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.ngControl.statusChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.controls.scheduledAtDate.setErrors(this.ngControl.errors);
      this.form.controls.scheduledAtTime.setErrors(this.ngControl.errors && { invalid: true });
      this.form.controls.scheduledAtDate.markAsTouched();
      this.form.controls.scheduledAtTime.markAsTouched();
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value.scheduledAtDate && value.scheduledAtTime) {
        const time = dayjs(value.scheduledAtTime, 'HH:mm');
        const date = dayjs(value.scheduledAtDate)
          .hour(time.hour())
          .minute(time.minute())
          .second(0)
          .millisecond(0);

        this.onChange(date.toDate());
      } else if (
        this.form.controls.scheduledAtDate.touched &&
        this.form.controls.scheduledAtTime.touched
      ) {
        this.onChange(null);
      }
    });
  }

  writeValue(value: Date | null) {
    this.form.setValue(
      {
        scheduledAtDate: value,
        scheduledAtTime: value ? dayjs(value).format('HH:mm') : null,
      },
      { emitEvent: false }
    );
  }

  registerOnChange(onChange: (value: Date | null) => void) {
    this._onChange = onChange;
  }

  registerOnTouched() {
    /* left blank intentionally */
  }

  setDisabledState?(isDisabled: boolean) {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
