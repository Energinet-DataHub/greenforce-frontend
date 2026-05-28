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
  input,
  model,
  output,
  inject,
  computed,
  Component,
  Injectable,
  ViewEncapsulation,
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import {
  DateRange,
  MatDatepickerModule,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  DefaultMatCalendarRangeStrategy,
} from '@angular/material/datepicker';

import { WattFieldComponent } from '@energinet/watt/field';
import { WattButtonComponent } from '@energinet/watt/button';
import { dayjs, WattDatePipe, WattRange } from '@energinet/watt/core/date';
import { WattDatepickerIntlService } from '@energinet/watt/picker/datepicker';

import { WattMenuChipComponent } from './watt-menu-chip.component';
import {
  toLocalCalendarDate,
  toUtcCalendarMidnight,
  toUtcEndOfDay,
  toUtcMidnight,
} from './watt-date-chip-tz';

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
    WattDatePipe,
    WattFieldComponent,
    WattButtonComponent,
    WattMenuChipComponent,
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
        mat-date-range-input.cdk-visually-hidden {
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
    <mat-date-range-picker #picker panelClass="watt-date-range-chip__panel">
      @if (showActions()) {
        <mat-date-range-picker-actions>
          <watt-button variant="text" (click)="clearInput()" icon="remove">{{
            intl.clear
          }}</watt-button>
          <watt-button variant="primary" matDateRangePickerApply>{{ intl.select }}</watt-button>
        </mat-date-range-picker-actions>
      }
    </mat-date-range-picker>

    <watt-field [control]="formControl()" [chipMode]="true">
      <watt-menu-chip
        hasPopup="dialog"
        [disabled]="disabled()"
        [selected]="value()?.start && value()?.end ? true : false"
        [opened]="picker.opened"
        (toggleChange)="picker.open()"
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
            [value]="materialStart()"
            (dateChange)="updateStartDate($event.value!)"
            (dateChange)="showActions() && onSelectionChange($event.value ? input.value! : null)"
          />
          <input
            type="text"
            matEndDate
            tabindex="-1"
            role="none"
            [value]="materialEnd()"
            (dateChange)="updateEndDate($event.value!)"
            (dateChange)="onSelectionChange($event.value ? input.value! : null)"
          />
        </mat-date-range-input>
        <ng-content />
        @if (value()?.start && value()?.end) {
          <span class="value">
            {{ displayValue() | wattDate }}
          </span>
        }
      </watt-menu-chip>
      <ng-content ngProjectAs="watt-field-hint" select="watt-field-hint" />
      <ng-content ngProjectAs="watt-field-error" select="watt-field-error" />
    </watt-field>
  `,
  host: {
    '[class.has-placeholder]': 'placeholder()',
  },
})
export class WattDateRangeChipComponent {
  protected intl = inject(WattDatepickerIntlService);
  private dateAdapter = inject(DateAdapter);

  disabled = model(false);
  label = input<string>();
  value = model<WattRange<Date> | null>(null);
  formControl = input.required<FormControl>();
  placeholder = input(true);
  showActions = input(false);
  customSelectionStrategy = input<(date: Date | null) => DateRange<Date>>();

  selectionChange = output<WattRange<Date> | null>();

  /** Local-time Dates for Material's range input, derived from the UTC model value. */
  protected materialStart = computed(() => toLocalCalendarDate(this.value()?.start));
  protected materialEnd = computed(() => toLocalCalendarDate(this.value()?.end));

  /**
   * Display projection for `wattDate`. The form value stores end-of-day at UTC
   * (23:59:59.999Z) so inclusive range queries cover the full day, but that
   * timestamp rolls over to the next day when formatted in Europe/Copenhagen.
   * Projecting end back to UTC midnight keeps the displayed calendar day stable.
   */
  protected displayValue = computed(() => {
    const v = this.value();
    if (!v?.start || !v?.end) return null;
    return { start: v.start, end: toUtcCalendarMidnight(v.end) };
  });

  selectionStrategy() {
    const customStrategy = this.customSelectionStrategy();
    const strategy = new WattDateRangeSelectionStrategy(this.dateAdapter);
    if (customStrategy) strategy.setCustomSelectionStrategy(customStrategy);
    return strategy;
  }

  clearInput() {
    this.value.set(null);
    this.selectionChange.emit(null);
  }

  onSelectionChange(value: WattRange<Date> | null) {
    if (value === null || (value?.start && value?.end)) {
      this.selectionChange.emit(value);
    }
  }

  updateStartDate(startDate: Date) {
    this.value.set({ start: toUtcMidnight(startDate) as Date, end: null });
  }

  updateEndDate(endDate: Date | null) {
    const dateRange = this.value();
    if (dateRange) {
      this.value.set({ start: dateRange.start, end: toUtcEndOfDay(endDate) });
    }
  }
}
