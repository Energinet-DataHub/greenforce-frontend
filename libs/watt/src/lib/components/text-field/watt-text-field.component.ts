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
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  Input,
  ViewEncapsulation,
  HostBinding,
  inject,
  ElementRef,
  ViewChild,
  Self,
  Optional,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { WattFieldComponent } from '../field/watt-field.component';
import { WattIconComponent, WattIcon } from '../../foundations/icon';

export type WattInputTypes = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

@Component({
  standalone: true,
  imports: [NgClass, FormsModule, WattFieldComponent, WattIconComponent, NgIf],
  selector: 'watt-text-field',
  styleUrls: ['./watt-text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `<watt-field [label]="label">
    <watt-icon *ngIf="prefix" [name]="prefix" />
    <input
      [attr.aria-label]="label"
      [attr.type]="type"
      [attr.placeholder]="placeholder"
      [attr.maxlength]="maxLength ? maxLength : null"
      [disabled]="isDisabled"
      [(ngModel)]="model"
      (ngModelChange)="onChanged($event)"
      [required]="required"
      #inputField
    />
    <ng-content />
    <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
    <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
  </watt-field> `,
})
export class WattTextFieldComponent implements ControlValueAccessor {
  @Input() value!: string;
  @Input() type: WattInputTypes = 'text';
  @Input() placeholder?: string;
  @Input() required = false;
  @Input() label = '';
  @Input() prefix?: WattIcon;
  @Input() maxLength: string | number | null = null;
  @HostBinding('attr.aria-invalid')
  invalid = false;

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  model!: string;

  private element = inject(ElementRef);

  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;

  constructor(@Self() @Optional() private control: NgControl) {
    this.control.valueAccessor = this;
  }

  onChanged(value: string): void {
    this.onChange(value);
    this.updateInvalid();
  }

  /* @ignore */
  onChange: (value: string) => void = () => {
    /* left blank intentionally */
  };

  /* @ignore */
  writeValue(value: string): void {
    this.model = value;
    this.updateInvalid();
  }

  /* @ignore */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /* @ignore */
  registerOnTouched(fn: () => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  /* @ignore */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setFocus(): void {
    this.inputField.nativeElement.focus();
  }

  updateInvalid(): void {
    this.invalid = this.control.invalid ?? false;
  }
}
