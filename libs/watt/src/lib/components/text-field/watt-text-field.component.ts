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
  ElementRef,
  ViewChild,
  forwardRef,
  AfterViewInit,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { WattFieldComponent } from '../field/watt-field.component';
import { WattIconComponent, WattIcon } from '../../foundations/icon';

export type WattInputTypes = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

@Component({
  standalone: true,
  imports: [NgIf, NgClass, ReactiveFormsModule, WattFieldComponent, WattIconComponent],
  selector: 'watt-text-field',
  styleUrls: ['./watt-text-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattTextFieldComponent),
      multi: true,
    },
  ],
  template: `<watt-field [control]="formControl" [label]="label" [tooltip]="tooltip">
    <watt-icon *ngIf="prefix" [name]="prefix" />
    <input
      [attr.aria-label]="label"
      [attr.type]="type"
      [attr.placeholder]="placeholder"
      [value]="value"
      [formControl]="formControl"
      (blur)="onTouched()"
      (input)="onChanged($event)"
      [maxlength]="maxLength"
      #inputField
    />
    <ng-content />
    <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
    <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
  </watt-field>`,
})
export class WattTextFieldComponent implements ControlValueAccessor, AfterViewInit {
  @Input() value!: string;
  @Input() type: WattInputTypes = 'text';
  @Input() placeholder?: string;
  @Input() label = '';
  @Input() tooltip?: string;
  @Input() prefix?: WattIcon;
  @Input() maxLength: string | number | null = null;
  @Input() formControl!: FormControl;

  private element = inject(ElementRef);

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  model!: string;

  @HostBinding('attr.watt-field-disabled')
  isDisabled = false;

  ngAfterViewInit(): void {
    const attrName = 'data-testid';
    const testIdAttribute = this.element.nativeElement.getAttribute(attrName);
    this.element.nativeElement.removeAttribute(attrName);
    this.inputField.nativeElement.setAttribute(attrName, testIdAttribute);
  }

  onChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  /* @ignore */
  onChange!: (value: string) => void;

  onTouched: () => void = () => { /* noop */ };

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

  setFocus(): void {
    this.inputField.nativeElement.focus();
  }
}
