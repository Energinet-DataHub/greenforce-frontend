import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'watt-input',
  styleUrls: ['./input.component.scss'],
  template: `<watt-form-field [size]="size">
    <watt-label>{{ label }}</watt-label>
    <button
      *ngIf="hasPrefix"
      wattPrefix
      aria-label="some meaningful description"
    >
      icon
    </button>
    <input
      wattInput
      type="text"
      maxlength="256"
      [formControl]="exampleFormControl"
      [placeholder]="placeholder"
    />
    <button
      *ngIf="hasSuffix"
      wattSuffix
      aria-label="some meaningful description"
    >
      icon
    </button>
    <watt-error *ngIf="exampleFormControl.hasError('required')">
      This field is required
    </watt-error>
    <watt-hint *ngIf="hasHint">Some hint</watt-hint>
    <watt-hint *ngIf="hasHint" align="end"
      >{{ exampleFormControl.value.length }} / 256</watt-hint
    >
  </watt-form-field> `,
})
export class InputComponent implements OnChanges {
  @Input() label = 'label';
  @Input() placeholder!: string;
  @HostBinding('class.watt-input-focused') @Input() focused = false;
  @Input() disabled = false;
  @Input() hasPrefix = false;
  @Input() hasSuffix = false;
  @Input() hasHint = false;
  @Input() hasError = false;
  @Input() size: 'normal' | 'large' = 'normal';

  /**
   * @ignore
   */
  exampleFormControl = new FormControl({ value: '', disabled: this.disabled });

  /**
   * @ignore
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled) {
      if (changes.disabled.currentValue) {
        this.exampleFormControl.disable();
      } else {
        this.exampleFormControl.enable();
      }
    }

    if (!changes.hasError) return;
    if (changes.hasError.currentValue) {
      // Tick is needed, otherwise errors won't be applied in this context
      setTimeout(() => {
        this.exampleFormControl.setErrors({ required: true });
        this.exampleFormControl.markAsTouched();
      });
    } else {
      this.exampleFormControl.setErrors(null);
    }
  }
}
