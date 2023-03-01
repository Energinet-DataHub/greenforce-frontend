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
import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-input-wrapper',
  styleUrls: ['./storybook-input-wrapper.component.scss'],
  template: `<watt-form-field>
    <watt-label>{{ label }}</watt-label>
    <watt-icon
      *ngIf="hasPrefix"
      wattPrefix
      name="search"
      label="some meaningful description"
    ></watt-icon>
    <input
      *ngIf="!isTextArea"
      wattInput
      type="text"
      maxlength="256"
      [formControl]="exampleFormControl"
      [placeholder]="placeholder"
      [required]="required"
    />
    <textarea
      *ngIf="isTextArea"
      wattInput
      [formControl]="exampleFormControl"
      [placeholder]="placeholder"
      [required]="required"
    ></textarea>
    <watt-button
      variant="icon"
      *ngIf="hasSuffix"
      wattSuffix
      icon="close"
      aria-label="some meaningful description"
    >
    </watt-button>

    <watt-error *ngIf="exampleFormControl.hasError('required')">
      This field is required
    </watt-error>
    <watt-hint *ngIf="hasHint">Some hint</watt-hint>
    <watt-hint *ngIf="hasHint" align="end">{{ exampleFormControl.value.length }} / 256</watt-hint>
  </watt-form-field> `,
})
export class StorybookInputWrapperComponent implements OnChanges {
  @Input() label = 'label';
  @Input() placeholder!: string;
  @HostBinding('class.watt-input-focused') @Input() focused = false;
  @Input() disabled = false;
  @Input() hasPrefix = false;
  @Input() hasSuffix = false;
  @Input() hasHint = false;
  @Input() required = false;
  @Input() hasError = false;
  @Input() isTextArea = false;

  /**
   * @ignore
   */
  exampleFormControl = new FormControl(
    { value: '', disabled: this.disabled },
    { nonNullable: true }
  );

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
        this.exampleFormControl.markAsDirty();
      });
    } else {
      this.exampleFormControl.setErrors(null);
    }
  }
}
