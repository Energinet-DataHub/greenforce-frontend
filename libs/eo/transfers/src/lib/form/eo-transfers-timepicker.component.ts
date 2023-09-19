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
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
  AbstractControl,
  NG_VALIDATORS,
  Validator,
} from '@angular/forms';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';

@Component({
  selector: 'eo-transfers-timepicker',
  standalone: true,
  imports: [ReactiveFormsModule, WattDropdownComponent],
  styles: [
    `
      :host {
        max-width: 112px;
      }

      watt-form-field {
        margin-top: 0;
      }
    `,
  ],
  template: `
    <watt-dropdown
      #dropdown
      [formControl]="control"
      [options]="options"
      [showResetOption]="false"
      placeholder="HH:MM"
    ></watt-dropdown>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EoTransfersTimepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: EoTransfersTimepickerComponent,
    },
  ],
})
export class EoTransfersTimepickerComponent implements ControlValueAccessor, Validator, OnChanges {
  @Input() disabledHours: string[] = [];
  @Output() invalidOptionReset = new EventEmitter<void>();

  @ViewChild('dropdown') dropdown: WattDropdownComponent | undefined;

  isDisabled!: boolean;
  options: WattDropdownOption[] = this.generateOptions();
  control = new FormControl();

  ngOnChanges(changes: SimpleChanges): void {
    this.options = this.generateOptions();

    if (changes['disabledHours']) {
      this.setValidOption();
    }
  }

  writeValue(value: never): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: never): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe((val) => this.onChange(val));
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTouched: any = () => {
    // Intentionally left empty
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any = () => {
    // Intentionally left empty
  };

  validate(control: AbstractControl) {
    this.control.setErrors(control.errors);
    // We need to mark the control as touched to show the error
    this.dropdown?.matSelect?.ngControl?.control?.markAsDirty();

    return control.errors;
  }

  private setValidOption() {
    const isValidOption = this.options.find((option) => option.value === this.control.value);
    if (!isValidOption) {
      this.control.setValue(this.options.length > 0 ? this.options[0].value : null, {
        emitEvent: false,
      });
      this.invalidOptionReset.emit();
    }
  }

  private generateOptions(): WattDropdownOption[] {
    return Array.from({ length: 25 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return {
        displayValue: `${hour}:00`,
        value: `${hour}`,
        disabled: this.disabledHours.includes(`${hour}:00`),
      };
    }).filter((option) => !option.disabled);
  }
}
