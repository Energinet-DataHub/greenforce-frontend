//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, skip } from 'rxjs';
import { dayjs } from '@energinet-datahub/watt/date';
import { WattDateTimeField } from '@energinet-datahub/watt/datetime-field';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

export type DateTimeRange = {
  start: Date;
  end: Date;
};

@Component({
  selector: 'dh-datetime-range-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, WattDateTimeField],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhDateTimeRangeField),
      multi: true,
    },
  ],
  template: `
    <watt-datetime-field [label]="labelStart()" [formControl]="form.controls.start" />
    <watt-datetime-field
      [label]="labelEnd()"
      [formControl]="form.controls.end"
      [inclusive]="true"
    />
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhDateTimeRangeField implements ControlValueAccessor {
  labelStart = input('');
  labelEnd = input('');

  form = new FormGroup({
    start: dhMakeFormControl<Date>(dayjs().startOf('day').toDate()),
    end: dhMakeFormControl<Date>(dayjs().endOf('day').toDate()),
  });

  valueChange = this.form.valueChanges.pipe(map(() => this.form.getRawValue()));

  // Implementation for ControlValueAccessor
  setDisabledState = (disabled: boolean) => (disabled ? this.form.disable() : this.form.enable());
  registerOnChange = (fn: (value: DateTimeRange | null) => void) => this.valueChange.subscribe(fn);
  registerOnTouched = (fn: () => void) => this.form.valueChanges.pipe(skip(1)).subscribe(fn);
  writeValue = (value: DateTimeRange) => this.form.setValue(value);
}
