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
import {
  Component,
  forwardRef,
  ViewEncapsulation,
  input,
  linkedSignal,
  model,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattRadioComponent),
      multi: true,
    },
  ],
  selector: 'watt-radio',
  styleUrls: ['./watt-radio.component.scss'],
  template: `
    <label class="watt-text-s">
      <input
        type="radio"
        [name]="name()"
        [value]="value()"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="isChecked.emit()"
        (blur)="touched.emit()"
      />
      <ng-content />
    </label>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.disabled]': 'disabled()',
  },
})
export class WattRadioComponent<T> implements ControlValueAccessor {
  /** The name of the radio button. Prefer using `<watt-radio-group>` over this. */
  group = input<string>();
  name = linkedSignal(this.group); // allows inheriting from `watt-radio-group`

  /** Value of the radio button. */
  value = input.required<T>();

  /** Whether the radio is disabled. */
  disabled = model(false);

  /** Whether the radio is checked. */
  checked = model(false);

  /** Emits only when the radio is checked. Never emits when unchecked. */
  isChecked = output();

  /** Emits when the radio is touched. */
  touched = output();

  // Implementation for ControlValueAccessor
  writeValue = (value: T | null | undefined) => this.checked.set(value === this.value());
  setDisabledState = (isDisabled: boolean) => this.disabled.set(isDisabled);
  registerOnTouched = (fn: () => void) => this.touched.subscribe(fn);
  registerOnChange = (fn: (value: T | null | undefined) => void) =>
    this.isChecked.subscribe(() => fn(this.value()));
}
