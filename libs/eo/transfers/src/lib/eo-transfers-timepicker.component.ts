import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ControlValueAccessor } from '@angular/forms';

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

  selectedTime: string | null = this.getDefaultSelectedTime();
  options: WattDropdownOption[] = this.generateOptions();
  control = new FormControl({ value: this.selectedTime, disabled: !this.selectedTime });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.control.setValue(this.getDefaultSelectedTime());
      this.options = this.generateOptions();
    }

    if (!this.selectedDate) {
      this.control.disable();
    } else {
      this.control.enable();
    }

    // If disabled hours change, generate new options
    if (changes['disabledHours']) {
      this.options = this.generateOptions();
    }
  }

  writeValue(value: never): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: never): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  onTouched: unknown = () => {
    // Intentionally left empty
  };

  private getDefaultSelectedTime(): string | null {
    if(!this.selectedDate) return null;

    const isTodaySelected = isToday(new Date(this.selectedDate));
    if(!isTodaySelected) return '00:00';

    const nextHour = new Date().getHours() + 1;
    const nextHourString = nextHour.toString().padStart(2, '0') + ':00';

    if(!this.disabledHours.includes(nextHourString)) return nextHourString;

    return '23:00';
  }

  private generateOptions(): WattDropdownOption[] {
    const disabledHours = this.getDisabledHours();

    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return {
        displayValue: `${hour}:00`,
        value: `${hour}:00`,
        disabled: disabledHours.includes(`${hour}:00`),
      };
    });
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
