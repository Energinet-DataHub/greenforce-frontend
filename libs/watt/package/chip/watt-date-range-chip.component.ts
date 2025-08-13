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
import { FormControl } from '@angular/forms';
import {
  Component,
  EventEmitter,
  HostBinding,
  Injectable,
  Input,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { dayjs, WattDatePipe, WattRange } from '@energinet/watt/core/date';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattFieldComponent } from '@energinet/watt/field';
import { WattDatepickerIntlService } from '@energinet/watt/picker/datepicker';

import { WattMenuChipComponent } from './watt-menu-chip.component';

type customSelectionStrategy = (date: Date | null) => DateRange<Date>;

@Injectable({
  providedIn: 'root',
})
export class WattDateRangeSelectionStrategy extends DefaultMatCalendarRangeStrategy<Date> {
  private customSelectionStrategy!: customSelectionStrategy;

  setCustomSelectionStrategy(strategy: customSelectionStrategy) {
    this.customSelectionStrategy = strategy;
  }

  override selectionFinished(date: Date, currentRange: DateRange<Date>): DateRange<Date> {
    let range: DateRange<Date> = super.selectionFinished(date, currentRange);

    if (this.customSelectionStrategy) {
      range = this.customSelectionStrategy(date);
    }

    return range.end ? new DateRange(range.start, dayjs(range.end).endOf('day').toDate()) : range;
  }

  override createPreview(activeDate: Date | null, currentRange: DateRange<Date>): DateRange<Date> {
    if (!this.customSelectionStrategy) {
      return super.createPreview(activeDate, currentRange);
    } else {
      return this.customSelectionStrategy(activeDate);
    }
  }
}

@Component({
  imports: [
    MatDatepickerModule,
    WattMenuChipComponent,
    WattDatePipe,
    WattFieldComponent,
    WattButtonComponent,
  ],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useFactory: (comp: WattDateRangeChipComponent) => comp.selectionStrategy(),
      deps: [WattDateRangeChipComponent],
    },
  ],
  selector: 'watt-date-range-chip',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      watt-date-range-chip {
        mat-date-range-input {
          top: 0;
          bottom: 0;
          height: auto;
          visibility: hidden;
        }

        &.has-placeholder .value::before {
          content: ':';
        }

        watt-field label .watt-field-wrapper {
          background-color: transparent;
        }
      }
    `,
  ],
  template: `
    <mat-date-range-picker #picker>
      @if (showActions) {
        <mat-date-range-picker-actions>
          <watt-button variant="text" (click)="clearInput()" icon="remove">{{
            intl.clear
          }}</watt-button>
          <watt-button variant="primary" matDateRangePickerApply>{{ intl.select }}</watt-button>
        </mat-date-range-picker-actions>
      }
    </mat-date-range-picker>

    <watt-field [control]="formControl" [chipMode]="true">
      <watt-menu-chip
        hasPopup="dialog"
        [disabled]="disabled"
        [selected]="value?.start && value?.end ? true : false"
        [opened]="picker.opened"
        (toggle)="picker.open()"
      >
        <mat-date-range-input
          #input
          class="cdk-visually-hidden"
          separator=""
          [rangePicker]="picker"
        >
          <input
            type="text"
            matStartDate
            tabindex="-1"
            role="none"
            [value]="value?.start"
            (dateChange)="value = input.value!"
            (dateChange)="showActions && onSelectionChange($event.value ? input.value! : null)"
          />
          <input
            type="text"
            matEndDate
            tabindex="-1"
            role="none"
            [value]="value?.end"
            (dateChange)="value = input.value!"
            (dateChange)="onSelectionChange($event.value ? input.value! : null)"
          />
        </mat-date-range-input>
        <ng-content />
        @if (value?.start && value?.end) {
          <span class="value">
            {{ value | wattDate }}
          </span>
        }
      </watt-menu-chip>
      <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
      <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    </watt-field>
  `,
})
export class WattDateRangeChipComponent {
  @Input() disabled = false;
  @Input() label?: string;
  @Input() value?: WattRange<Date>;
  @Input({ required: true }) formControl!: FormControl;
  @Input() placeholder = true;
  @Input() showActions = false;
  @Input() customSelectionStrategy!: (date: Date | null) => DateRange<Date>;

  @HostBinding('class.has-placeholder')
  get hasPlaceholderClass(): boolean {
    return this.placeholder;
  }

  @Output() selectionChange = new EventEmitter<WattRange<Date> | null>();

  private _dateAdapter = inject(DateAdapter);
  protected intl = inject(WattDatepickerIntlService);

  selectionStrategy() {
    const strategy = new WattDateRangeSelectionStrategy(this._dateAdapter);
    strategy.setCustomSelectionStrategy(this.customSelectionStrategy);
    return strategy;
  }

  clearInput(): void {
    this.value = undefined;
    this.selectionChange.emit(null);
  }

  onSelectionChange(value: WattRange<Date> | null): void {
    if (value === null || (value?.start && value?.end)) {
      this.selectionChange.emit(value);
    }
  }
}
