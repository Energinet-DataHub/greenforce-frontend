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
import { input, model, output, computed, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { toLocalCalendarDate, toUtcMidnight, WattDatePipe } from '@energinet/watt/core/date';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattMenuChipComponent } from './watt-menu-chip.component';

@Component({
  imports: [MatDatepickerModule, WattMenuChipComponent, WattFieldComponent, WattDatePipe],
  selector: 'watt-date-chip',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-date-chip {
        input.cdk-visually-hidden {
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
    <mat-datepicker #picker panelClass="watt-date-chip__panel" />
    <watt-field [control]="formControl()" [chipMode]="true">
      <watt-menu-chip
        hasPopup="dialog"
        [disabled]="disabled()"
        [selected]="!!value()"
        [opened]="picker.opened"
        (toggleChange)="picker.open()"
      >
        <input
          tabindex="-1"
          class="cdk-visually-hidden"
          type="text"
          [value]="materialValue()"
          [matDatepicker]="picker"
          [min]="min()"
          [max]="max()"
          (dateChange)="onDateChange($event.value)"
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
  value = model<Date | null>(null);
  selectionChange = output<Date | null>();
  min = input<Date | null>();
  max = input<Date | null>();

  /** Local-time Date for Material's calendar, derived from the UTC-midnight model value. */
  protected materialValue = computed(() => toLocalCalendarDate(this.value()));

  protected onDateChange(date: Date | null): void {
    const normalized = toUtcMidnight(date);
    this.value.set(normalized);
    this.selectionChange.emit(normalized);
  }
}
