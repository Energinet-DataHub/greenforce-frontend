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
  AfterViewInit,
  ContentChild,
  ViewChild,
  Input,
  HostBinding,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

import { WattDropdownComponent } from '../dropdown/watt-dropdown.component';
import { WattInputDirective } from '../input/input.directive';

@Component({
  selector: 'watt-form-field',
  styleUrls: ['form-field.component.scss'],
  templateUrl: './form-field.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent implements AfterViewInit {
  @Input() size: 'normal' | 'large' = 'normal';
  @HostBinding('class')
  get _cssClass() {
    return [`watt-form-field-${this.size}`];
  }

  beforeViewInit = true; // Used to remove placeholder control

  @ContentChild(WattInputDirective)
  inputControl!: MatFormFieldControl<unknown>;

  @ContentChild(MatSelect)
  selectControl!: MatFormFieldControl<unknown>;

  @ContentChild(WattDropdownComponent)
  wattDropdown?: WattDropdownComponent;

  @ViewChild(MatFormField)
  matFormField!: MatFormField;

  ngAfterViewInit() {
    const control =
      this.inputControl || this.selectControl || this.wattDropdown?.matSelect;

    if (this.beforeViewInit) {
      this.matFormField._control = control;
      this.matFormField.ngAfterContentInit();
      this.beforeViewInit = false;
    }
  }
}
