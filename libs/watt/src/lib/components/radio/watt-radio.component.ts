import { Component, forwardRef, ViewEncapsulation, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
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
    <label class="watt-text-m">
      <input
        type="radio"
        [name]="group()"
        [value]="value()"
        [(ngModel)]="model"
        [disabled]="isDisabled"
        (ngModelChange)="onChange($event)"
      />
      <ng-content />
    </label>
  `,
  encapsulation: ViewEncapsulation.None,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.disabled]': 'isDisabled',
  },
})
export class WattRadioComponent implements ControlValueAccessor {
  group = input.required<string>();
  value = input.required<string | boolean>();

  /** @ignore */
  model!: string;

  /** @ignore */
  isDisabled = false;

  /** @ignore */
  onChange: (value: string) => void = () => {
    /* left blank intentionally */
  };

  /** @ignore */
  onTouched: () => void = () => {
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
    this.onTouched = fn;
  }

  /** @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
