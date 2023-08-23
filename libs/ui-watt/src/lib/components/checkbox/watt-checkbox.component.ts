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
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'watt-checkbox',
  styleUrls: ['./watt-checkbox.component.scss'],
  template: `<label>
    <input
      [(ngModel)]="model"
      [disabled]="isDisabled"
      (ngModelChange)="onChange($event)"
      [required]="required"
      type="checkbox"
    />
    <ng-content />
  </label>`,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattCheckboxComponent),
      multi: true,
    },
  ],
  imports: [FormsModule],
})
export class WattCheckboxComponent implements ControlValueAccessor, OnInit {
  model!: string;
  private element = inject(ElementRef);

  @Input() indeterminate = false;
  @Input() required = false;

  @HostBinding('attr.disabled')
  isDisabled = false;

  ngOnInit(): void {
    if (this.indeterminate) {
      this.element.nativeElement.indeterminate = true;
    }
  }

  /* @ignore */
  onChange: (value: string) => void = () => {
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
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  /* @ignore */
  setDisabledState(isDisabled: boolean): void {
    console.log('setDisabledState', isDisabled);
    this.isDisabled = isDisabled;
  }
}
