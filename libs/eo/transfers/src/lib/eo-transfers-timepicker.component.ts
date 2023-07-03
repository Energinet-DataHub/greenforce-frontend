import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, forwardRef, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor, ValidationErrors } from '@angular/forms';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { isToday } from 'date-fns';

@Component({
  selector: 'eo-transfers-timepicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WATT_FORM_FIELD, ReactiveFormsModule, WattDropdownComponent],
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
      multi: true
    }
  ]
})
export class EoTransfersTimepickerComponent implements ControlValueAccessor, OnChanges {
  @Input() selectedDate: string | null = null;
  @Input() disabledHours: string[] = [];
  @Input() defaultSelection = '24';
  @Input() errors: ValidationErrors | null = null;

  @ViewChild('dropdown') dropdown: WattDropdownComponent | undefined;

  options: WattDropdownOption[] = this.generateOptions();
  control = new FormControl();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.options = this.generateOptions();
    }

    // If disabled hours change, generate new options
    if (changes['disabledHours']) {
      this.options = this.generateOptions();
    }

    if(changes['errors']) {
      this.control.setErrors(this.errors);
      // We need to mark the control as touched to show the error
      this.dropdown?.matSelect?.ngControl?.control?.markAsTouched();
    }
  }

  writeValue(value: never): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: never): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(val => this.onChange(val));
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTouched: any = () => {
    // Intentionally left empty
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: any = () => {
    // Intentionally left empty
  };

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
    if(!isTodaySelected) return [];

    const hours = new Date().getHours();
    const disabledHours = Array.from({ length: hours + 1 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });
    return [...disabledHours, ...this.disabledHours];
  }
}
