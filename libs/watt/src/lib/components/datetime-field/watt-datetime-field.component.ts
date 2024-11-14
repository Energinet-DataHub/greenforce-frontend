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
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoDateTimeOptionsGenerator } from '@maskito/kit';
import { map } from 'rxjs';
import { dayjs } from '@energinet-datahub/watt/date';
import { WattFieldComponent } from '../field';
import { WattButtonComponent } from '../button/watt-button.component';

const DATE_SHORT_FORMAT = 'DD-MM-YYYY, HH:mm';
const DANISH_TIME_ZONE_IDENTIFIER = 'Europe/Copenhagen';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  standalone: true,
  selector: 'watt-datetime-field',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MaskitoDirective,
    MatCalendar,
    WattButtonComponent,
    WattFieldComponent,
  ],
  styles: [
    `
      watt-datetime-field {
        display: block;
        width: 100%;
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
    <watt-field label="Test" [control]="control" [placeholder]="placeholder">
      <input
        #field
        [formControl]="control"
        [maskito]="mask"
        (focus)="picker.showPopover()"
        (blur)="handleBlur(picker, $event)"
      />
      <watt-button icon="date" variant="icon" />
    </watt-field>
    <div #picker class="watt-elevation watt-datetime-field-picker" popover="manual" tabindex="0">
      <mat-calendar
        tabindex="-1"
        [selected]="ngControl.value"
        (selectedChange)="handleSelectedChange(field, $event)"
      />
    </div>
  `,
})
export class WattDateTimeField implements ControlValueAccessor {
  protected ngControl = inject(NgControl, { self: true });
  protected control = new FormControl('', { nonNullable: true });
  inclusive = input(false);
  placeholder = 'dd-mm-yyyy, hh:mm'; // TODO: i18n
  mask = maskitoDateTimeOptionsGenerator({
    dateMode: 'dd/mm/yyyy',
    timeMode: 'HH:MM',
    dateSeparator: '-',
  });

  modelToView = (value: Date | null) =>
    value ? dayjs(value).tz(DANISH_TIME_ZONE_IDENTIFIER).format(DATE_SHORT_FORMAT) : '';

  viewToModel = (value: string) => {
    const date = dayjs(value, DATE_SHORT_FORMAT, true);
    if (!date.isValid()) return null;
    return this.inclusive() ? date.endOf('minute').toDate() : date.toDate();
  };

  handleBlur = (picker: HTMLElement, event: FocusEvent) => {
    console.log(event);
    if (event.relatedTarget instanceof HTMLElement && picker.contains(event.relatedTarget)) {
      const target = event.target as HTMLInputElement; // safe type assertion
      setTimeout(() => target.focus());
    } else {
      picker.hidePopover();
    }
  };

  // Consider not filling out time portion?
  handleSelectedChange = (field: HTMLInputElement, date: Date) => {
    field.value = this.modelToView(date);
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.blur();
  };

  // Implementation for ControlValueAccessor
  writeValue = (value: Date | null) => this.control.setValue(this.modelToView(value));
  registerOnChange = (fn: (value: Date | null) => void) =>
    this.control.valueChanges.pipe(map(this.viewToModel)).subscribe(fn);

  // hmm
  setDisabledState = (d: boolean) => (d ? this.control.disable() : this.control.enable());
  registerOnTouched(fn: (_: unknown) => void) {
    this.control.statusChanges.subscribe(fn);
  }

  constructor() {
    this.ngControl.valueAccessor = this;
  }
}
