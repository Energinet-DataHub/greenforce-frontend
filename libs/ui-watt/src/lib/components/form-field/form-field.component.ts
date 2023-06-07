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
  ViewEncapsulation,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatLegacyFormField as MatFormField,
  MatLegacyFormFieldControl as MatFormFieldControl,
  MatLegacyFormFieldModule as MatFormFieldModule,
} from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { WattDatepickerComponent } from '../input/datepicker';
import { WattDropdownComponent } from '../dropdown/watt-dropdown.component';
import { WattInputDirective } from '../input/input.directive';
import { WattTimepickerComponent } from '../input/timepicker';

import { WattErrorComponent } from './components/error.component';
import { WattHintComponent } from './components/hint.component';
import { WattLabelComponent } from './components/label.component';

@Component({
  selector: 'watt-form-field',
  styleUrls: ['form-field.component.scss'],
  templateUrl: './form-field.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
})
export class WattFormFieldComponent implements AfterViewInit {
  beforeViewInit = true; // Used to remove placeholder control
  mode: 'default' | 'chip' = 'default';

  @HostBinding('class') get hostClasses() {
    return this.mode !== 'default' ? `watt-form-field-${this.mode}` : '';
  }

  @ViewChild(MatFormField)
  matFormField!: MatFormField;

  @ContentChild(WattInputDirective)
  inputControl!: MatFormFieldControl<unknown>;

  @ContentChild(WattDropdownComponent)
  wattDropdown?: WattDropdownComponent;

  @ContentChild(WattDatepickerComponent)
  datepickerControl?: WattDatepickerComponent;

  @ContentChild(WattTimepickerComponent)
  timepickerControl?: WattTimepickerComponent;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.beforeViewInit) {
      const control =
        this.inputControl ||
        this.wattDropdown?.matSelect ||
        this.timepickerControl ||
        this.datepickerControl;

      if (this.wattDropdown) {
        this.mode = this.wattDropdown.chipMode ? 'chip' : 'default';
      }
      this.matFormField._control = control;
      this.matFormField.ngAfterContentInit();
      this.beforeViewInit = false;
      this.cd.detectChanges();
    }
  }
}

export const WATT_FORM_FIELD = [
  WattFormFieldComponent,
  WattErrorComponent,
  WattLabelComponent,
  WattHintComponent,
];
