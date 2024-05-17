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

import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

import { dayjs, WattDatePipe, WattRange } from '@energinet-datahub/watt/utils/date';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattMenuChipComponent } from '@energinet-datahub/watt/chip';
import { WattFieldComponent } from '@energinet-datahub/watt/field';

import { WattDatepickerIntlService } from './watt-datepicker-intl.service';

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
  standalone: true,
  imports: [
    MatDatepickerModule,
    WattMenuChipComponent,
    WattDatePipe,
    WattIconComponent,
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
          <input type="text" matStartDate tabindex="-1" role="none" [value]="value?.start" />
          <input
            type="text"
            matEndDate
            tabindex="-1"
            role="none"
            [value]="value?.end"
            (dateChange)="value = input.value!"
            (dateChange)="selectionChange.emit($event.value ? input.value! : null)"
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
}
