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
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { MaskitoDirective } from '@maskito/angular';
import { WattFieldComponent } from '../field';
import { dayjs } from '@energinet-datahub/watt/date';
import mask from './mask';

const dateShortFormat = 'DD-MM-YYYY, HH:mm';
const danishTimeZoneIdentifier = 'Europe/Copenhagen';
const modelToView = (date: Date) =>
  dayjs(date).tz(danishTimeZoneIdentifier).format(dateShortFormat);

@Component({
  standalone: true,
  selector: 'watt-datetime-field',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MaskitoDirective, MatCalendar, WattFieldComponent],
  styles: [
    `
      watt-datetime-field {
        display: block;
        width: 100%;

        input {
          border: none;
          width: 100%;
          outline: none;
          background-color: transparent;

          &::placeholder {
            color: var(--watt-on-light-low-emphasis);
          }
        }
      }

      .watt-datetime-field-picker {
        position: relative;
      }

      .watt-datetime-field-picker:popover-open {
        width: 296px;
        height: 354px;
        position: absolute;
        inset: unset;
        margin-top: -20px;
        border: 0;
      }
    `,
  ],
  template: `
    <watt-field label="Test" [control]="control()">
      <input
        #field
        [formControl]="control()"
        [maskito]="options"
        (focus)="picker.showPopover()"
        (blur)="handleBlur(picker, $event)"
      />
    </watt-field>
    <div #picker class="watt-elevation watt-datetime-field-picker" popover="manual" tabindex="-1">
      <mat-calendar (selectedChange)="handleSelectedChange(field, $event)" />
    </div>
  `,
})
export class WattDateTimeFieldComponent {
  control = input.required<FormControl<Date>>();
  filler = 'dd-mm-yyyy, hh:mm'; // TODO: i18n
  options = mask;

  handleBlur = (picker: HTMLElement, event: FocusEvent) => {
    if (event.relatedTarget instanceof HTMLElement && picker.contains(event.relatedTarget)) {
      const target = event.target as HTMLInputElement; // safe type assertion
      target.focus();
    } else {
      picker.hidePopover();
    }
  };

  handleSelectedChange = (field: HTMLInputElement, date: Date) => {
    field.value = modelToView(date);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.blur();
  };
}
