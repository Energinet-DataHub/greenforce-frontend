import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ViewEncapsulation,
  HostBinding,
  inject,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { WattFieldComponent } from '../field/watt-field.component';

@Component({
  standalone: true,
  imports: [NgClass, FormsModule, WattFieldComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattTextAreaFieldComponent),
      multi: true,
    },
  ],
  selector: 'watt-textarea-field',
  styleUrls: ['./watt-textarea-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `<watt-field [label]="label" [control]="formControl">
    <textarea
      [attr.placeholder]="placeholder"
      [value]="value"
      [(ngModel)]="model"
      [disabled]="isDisabled"
      (ngModelChange)="onChange($event)"
      [required]="required"
    ></textarea>
    <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
    <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
  </watt-field>`,
})
export class WattTextAreaFieldComponent implements ControlValueAccessor {
  @Input() formControl!: FormControl;
  @Input() value!: string;
  @Input() placeholder?: string;
  @Input() required = false;
  @Input() label!: string;

  /** @ignore */
  model!: string;

  /** @ignore */
  private element = inject(ElementRef);

  /** @ignore */
  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;

  /** @ignore */
  onChange: (value: string) => void = () => {
    /* left blank intentionally */
  };

  /** @ignore */
  writeValue(value: string): void {
    this.model = value;
  }

  /** @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /** @ignore */
  registerOnTouched(fn: () => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  /** @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
