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
import { isToday } from 'date-fns';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';

@Component({
  selector: 'eo-transfers-timepicker',
  standalone: true,
  imports: [WATT_FORM_FIELD, ReactiveFormsModule, WattDropdownComponent],
  styles: [`
    :host {
      max-width: 104px;
    }

    watt-form-field {
      margin-top: 0;
    }
  `],
  template: `
    <watt-form-field>
      <watt-dropdown
        #dropdown
        [formControl]="control"
        [options]="options"
        [showResetOption]="false"
        placeholder="HH:MM"
      ></watt-dropdown>
    </watt-form-field>
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
      useExisting: EoTransfersTimepickerComponent
    },
  ],
})
export class EoTransfersTimepickerComponent implements ControlValueAccessor, Validator, OnChanges {
  @Input() selectedDate: string | null = null;
  @Input() disabledHours: string[] = [];
  @Output() invalidOptionReset = new EventEmitter<void>();

  @ViewChild('dropdown') dropdown: WattDropdownComponent | undefined;

  isDisabled!: boolean;
  options: WattDropdownOption[] = this.generateOptions();
  control = new FormControl();

  ngOnChanges(changes: SimpleChanges): void {
    this.options = this.generateOptions();
    if(this.options.length === 0 && this.setDisabledState) {
      this.setDisabledState(true);
    } else if(this.setDisabledState) {
      this.setDisabledState(false);
    }

    if (changes['selectedDate']) {
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
      this.control.setValue(this.options.length > 0 ? this.options[0].value : null);
      this.invalidOptionReset.emit();
    }
  }

  private generateOptions(): WattDropdownOption[] {
    const disabledHours = this.getDisabledHours();

    return Array.from({ length: 25 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return {
        displayValue: `${hour}:00`,
        value: `${hour}`,
        disabled: disabledHours.includes(`${hour}:00`),
      };
    }).filter((option) => !option.disabled);
  }

  private getDisabledHours(): string[] {
    const isTodaySelected = this.selectedDate && isToday(new Date(this.selectedDate));
    if (!isTodaySelected) return this.disabledHours;

    const hours = new Date().getHours();
    const disabledHours = Array.from({ length: hours + 1 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });
    return [...disabledHours, ...this.disabledHours];
  }
}
