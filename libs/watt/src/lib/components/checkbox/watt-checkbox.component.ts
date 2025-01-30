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
  input,
  signal,
  inject,
  Component,
  ElementRef,
  forwardRef,
  ViewEncapsulation,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'watt-checkbox',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./watt-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattCheckboxComponent),
      multi: true,
    },
  ],
  host: {
    '[class.watt-checkbox--disabled]': 'isdisabled()',
    '[class.watt-checkbox--indeterminate]': 'indeterminate()',
  },
  imports: [FormsModule],
  template: `<label>
    <input
      [ngModel]="checked"
      [disabled]="isdisabled()"
      [indeterminate]="indeterminate()"
      [required]="required()"
      (ngModelChange)="onModelChange($event)"
      type="checkbox"
    />
    <ng-content />
  </label>`,
})
export class WattCheckboxComponent implements ControlValueAccessor {
  private element = inject(ElementRef);

  checked: boolean | null = null;

  isdisabled = signal(false);
  indeterminate = signal(false);
  required = input(false);

  onChange: (value: boolean) => void = () => {
    //
  };

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  writeValue(checked: boolean | null) {
    this.indeterminate.set(checked === null ? true : false);
    this.checked = checked;
  }

  onModelChange(e: boolean) {
    this.indeterminate.set(false);
    this.checked = e;
    this.onChange(e);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isdisabled.set(isDisabled);
  }
}
