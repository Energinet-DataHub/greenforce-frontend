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
import { input, model, output, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { WattDatePipe } from '@energinet/watt/core/date';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattMenuChipComponent } from './watt-menu-chip.component';

@Component({
  imports: [MatDatepickerModule, WattMenuChipComponent, WattFieldComponent, WattDatePipe],
  selector: 'watt-date-chip',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-date-chip {
        input {
          top: 0;
          bottom: 0;
          height: auto;
          visibility: hidden;
        }

        watt-field label .watt-field-wrapper {
          background-color: transparent;
        }
      }
    `,
  ],
  template: `
    <mat-datepicker #picker />
    <watt-field [control]="formControl()" [chipMode]="true">
      <watt-menu-chip
        hasPopup="dialog"
        [disabled]="disabled()"
        [selected]="!!value()"
        [opened]="picker.opened"
        (toggle)="picker.open()"
      >
        <input
          tabindex="-1"
          class="cdk-visually-hidden"
          type="text"
          [value]="value()"
          [matDatepicker]="picker"
          (dateChange)="value.set($event.value)"
          (dateChange)="selectionChange.emit($event.value)"
        />
        {{ placeholder() }}
        <span>
          @if (value()) {
            @if (placeholder()) {
              :
            }
            {{ value() | wattDate }}
          }
        </span>
      </watt-menu-chip>
      <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
      <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    </watt-field>
  `,
})
export class WattDateChipComponent {
  disabled = model(false);
  label = input<string>();
  placeholder = input<string>();
  formControl = input.required<FormControl>();
  value = model<string | null>(null);
  selectionChange = output<Date>();
}
