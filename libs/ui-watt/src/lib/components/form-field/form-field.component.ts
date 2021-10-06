/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
  AfterViewInit,
  ContentChild,
  ViewChild,
  Input,
  HostBinding,
} from '@angular/core';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { WattInputDirective } from '../input/input.directive';

@Component({
  selector: 'watt-form-field',
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent implements AfterViewInit {
  @Input() size: 'normal' | 'large' = 'normal';
  @HostBinding('class')
  get _cssClass() {
    return [`watt-form-field-${this.size}`];
  }

  beforeViewInit = true; // Used to remove placeholder control

  @ContentChild(WattInputDirective)
  control!: MatFormFieldControl<unknown>;

  @ViewChild(MatFormField)
  matFormField!: MatFormField;

  ngAfterViewInit() {
    if (this.beforeViewInit) {
      // Tick is needed to make this work, otherwise matFormField will be buggy
      setTimeout(() => {
        this.matFormField._control = this.control;
        this.matFormField.ngAfterContentInit();
        this.beforeViewInit = false;
      });
    }
  }
}
