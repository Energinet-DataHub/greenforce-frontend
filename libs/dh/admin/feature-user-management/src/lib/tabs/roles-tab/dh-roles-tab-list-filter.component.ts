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
import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule, PushModule } from '@rx-angular/template';
import { EicFunction, UserRoleStatus } from '@energinet-datahub/dh/shared/domain';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import {
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt/dropdown';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'dh-roles-tab-list-filter',
  standalone: true,
  templateUrl: './dh-roles-tab-list-filter.component.html',
  styles: [`
  :host {
    display: flex;
    width: 50%;
    background: transparent;
  }
`,],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    WattDropdownModule,
    WattFormFieldModule,
    ReactiveFormsModule
  ],
})
export class DhRolesTabListFilterComponent {
  @Output() statusChanged = new EventEmitter<string | null>();
  @Output() eicFunctionChanged = new EventEmitter<string[] | null>();

  eicFunctionList$ = EicFunction;
  statusList$ = UserRoleStatus;
  statusFormControl = new FormControl<string | null>(null);
  eicFunctionFormControl = new FormControl<string[] | null>(null);

  statusListOptions: WattDropdownOption[] = Object.keys(this.statusList$).map(
    (key) => ({
      displayValue: key,
      value: key,
    })
  );

  eicFunctionListListOptions: WattDropdownOption[] = Object.keys(this.eicFunctionList$).map(
    (key) => ({
      displayValue: key,
      value: key,
    })
  );

  constructor() {
    this.init();
  }

  init = () => {
    this.statusFormControl.valueChanges.subscribe(e => this.statusChanged.emit(e));
    this.eicFunctionFormControl.valueChanges.subscribe(e => this.eicFunctionChanged.emit(e));
    this.statusFormControl.setValue(this.statusListOptions[0].value);
  }
}
