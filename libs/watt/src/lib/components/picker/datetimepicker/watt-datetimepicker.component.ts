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
import { Component, DestroyRef, forwardRef, inject, ViewEncapsulation } from '@angular/core';
import { WattTimepickerComponent } from '../timepicker';
import { WattDatepickerComponent } from '../datepicker';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';

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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattDatetimepickerComponent),
      multi: true,
    },
  ],
  template: `
    <vater-flex direction="row" gap="s">
      <watt-datepicker [formControl]="form.controls.scheduledAtDate" style="width: 200%" />
      <watt-timepicker [formControl]="form.controls.scheduledAtTime" />
    </vater-flex>
  `,
})
export class WattDatetimepickerComponent implements ControlValueAccessor {
  formBuilder = inject(FormBuilder);
  destroyRef = inject(DestroyRef);

  form = this.formBuilder.group({
    scheduledAtDate: [null as Date | null],
    scheduledAtTime: [null as string | null],
  });

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
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value.scheduledAtDate && value.scheduledAtTime) {
        const time = dayjs(value.scheduledAtTime, 'HH:mm');
        const date = dayjs(value.scheduledAtDate)
          .hour(time.hour())
          .minute(time.minute())
          .second(0)
          .millisecond(0);

        onChange(date.toDate());
      } else {
        onChange(null);
      }
    });
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
