//#region License
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
//#endregion
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import {
  inject,
  input,
  model,
  signal,
  Component,
  forwardRef,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * Slide toggle
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatSlideToggleModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattSlideToggleComponent),
      multi: true,
    },
  ],
  selector: 'watt-slide-toggle',
  styleUrls: ['./watt-slide-toggle.component.scss'],
  template: `<mat-slide-toggle
    [disabled]="isDisabled()"
    [required]="required()"
    [(ngModel)]="checked"
    [disableRipple]="true"
    [hideIcon]="true"
    ><ng-content
  /></mat-slide-toggle>`,
})
export class WattSlideToggleComponent implements ControlValueAccessor {
  private element = inject(ElementRef);

  checked = model(false);
  isDisabled = signal(false);
  required = input(false);

  writeValue(checked: boolean): void {
    this.checked.set(checked);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.checked.subscribe(fn);
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
