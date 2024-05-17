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

import { WattFieldComponent } from '@energinet-datahub/watt/field';

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
