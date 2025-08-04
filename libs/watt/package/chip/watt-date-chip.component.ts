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
import { Component, EventEmitter, ViewEncapsulation, computed, input, signal } from '@angular/core';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattDatePipe, dayjs } from '@energinet/watt/core/date';
import { WattFieldComponent } from '@energinet/watt/field';
import { FormControl } from '@angular/forms';
import { WattMenuChipComponent } from './watt-menu-chip.component';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';

@Component({
  standalone: true,
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
        [disabled]="formControl().disabled"
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
          (dateChange)="handleDateChange($event)"
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
  label = input<string>();
  placeholder = input<string>();
  formControl = input.required<FormControl>();

  selectionChange = new EventEmitter<Date>();

  private readonly formControlValueAsSignal = computed(() => {
    const control = this.formControl();
    if (!control) return signal(null);
    
    return toSignal(control.valueChanges, { 
      initialValue: control.value 
    });
  });

  readonly value = computed(() => {
    const valueSignal = this.formControlValueAsSignal();
    const value = valueSignal();
    
    if (value) {
      return dayjs(value).tz(danishTimeZoneIdentifier).toDate();
    }
    return null;
  });

  updateValue(val: Date | string | null) {
    const control = this.formControl();
    if (!control) return;
    
    if (val) {
      control.setValue(dayjs(val).tz(danishTimeZoneIdentifier).toDate());
    } else {
      control.setValue(null);
    }
  }

  handleDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const dateWithTimezone = dayjs(event.value).tz(danishTimeZoneIdentifier).toDate();
      this.selectionChange.emit(dateWithTimezone);
      this.formControl().setValue(dateWithTimezone);
    } else {
      this.formControl().setValue(null);
    }
  }
}
