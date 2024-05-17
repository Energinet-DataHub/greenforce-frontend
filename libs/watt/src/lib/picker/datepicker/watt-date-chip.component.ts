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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattMenuChipComponent } from '@energinet-datahub/watt/chip';
import { WattFieldComponent } from '@energinet-datahub/watt/field';

@Component({
  standalone: true,
  imports: [
    MatDatepickerModule,
    WattMenuChipComponent,
    WattFieldComponent,
    WattDatePipe,
    WattIconComponent,
  ],
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
    <watt-field [control]="formControl" [chipMode]="true">
      <watt-menu-chip
        hasPopup="dialog"
        [disabled]="disabled"
        [selected]="!!value"
        [opened]="picker.opened"
        (toggle)="picker.open()"
      >
        <input
          tabindex="-1"
          class="cdk-visually-hidden"
          type="text"
          [value]="value"
          [matDatepicker]="picker"
          (dateChange)="value = $event.value"
          (dateChange)="selectionChange.emit($event.value)"
        />
        <ng-content />
        @if (value) {
          @if (placeholder) {
            :
          }
          {{ value | wattDate }}
        }
      </watt-menu-chip>
      <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
      <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    </watt-field>
  `,
})
export class WattDateChipComponent {
  @Input() disabled = false;
  @Input() label?: string;
  @Input() placeholder = true;
  @Input() value?: string;
  @Input({ required: true }) formControl!: FormControl;
  @Output() selectionChange = new EventEmitter<Date>();
}
