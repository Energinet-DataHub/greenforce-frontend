import { NgClass } from '@angular/common';
import { Component, Input, forwardRef, ViewEncapsulation, HostBinding } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

export type WattInputTypes = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

@Component({
  standalone: true,
  imports: [NgClass, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattTextFieldComponent),
      multi: true,
    },
  ],
  selector: 'watt-text-field',
  styleUrls: ['./watt-text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <input
      [attr.type]="type"
      [attr.placeholder]="placeholder"
      [value]="value"
      [(ngModel)]="model"
      [disabled]="isDisabled"
      (ngModelChange)="onChange($event)"
      [required]="required"
    />
  `,
})
export class WattTextFieldComponent implements ControlValueAccessor {
  @Input() value!: string;
  @Input({ required: true }) name!: string;
  @Input({ required: true }) type: WattInputTypes = 'text';
  @Input() placeholder?: string;
  @Input() required = false;

  /* @ignore */
  model!: string;

  @HostBinding('class.disabled')
  isDisabled = false;

  /* @ignore */
  onChange: (value: string) => void = () => {
    /* left blank intentionally */
  };

  /* @ignore */
  onTouched: () => void = () => {
    /* left blank intentionally */
  };

  /* @ignore */
  writeValue(value: string): void {
    this.model = value;
  }

  /* @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /* @ignore */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /* @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
