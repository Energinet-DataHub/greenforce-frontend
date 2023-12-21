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

import { NgIf } from '@angular/common';
import { FormControl } from '@angular/forms';
import {
  Component,
  EventEmitter,
  HostBinding,
  Injectable,
  Input,
  Output,
  inject,
} from '@angular/core';

import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import endOfDay from 'date-fns/endOfDay';

import { WattDatePipe, WattRange } from '../../../utils/date';
import { WattIconComponent } from '../../../foundations/icon/icon.component';
import { WattMenuChipComponent } from '../../chip/watt-menu-chip.component';
import { WattFieldComponent } from '../../field/watt-field.component';
import { DateAdapter } from '@angular/material/core';

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

    if(this.customSelectionStrategy) {
      range = this.customSelectionStrategy(date);
    }

    return range.end ? new DateRange(range.start, endOfDay(range.end)) : range;
  }

  override createPreview(activeDate: Date | null, currentRange: DateRange<Date>): DateRange<Date> {
    if(!this.customSelectionStrategy) {
      return super.createPreview(activeDate, currentRange);
    } else {
      return this.customSelectionStrategy(activeDate);
    }
  }
}

@Component({
  standalone: true,
  imports: [
    NgIf,
    MatDatepickerModule,
    WattMenuChipComponent,
    WattDatePipe,
    WattIconComponent,
    WattFieldComponent,
  ],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useFactory: (comp: WattDateRangeChipComponent) => comp.selectionStrategy(),
      deps: [WattDateRangeChipComponent],
    },
  ],
  selector: 'watt-date-range-chip',
  styles: [
    `
      mat-date-range-input {
        top: 0;
        bottom: 0;
        height: auto;
        visibility: hidden;
      }

      :host.has-placeholder .value::before {
        content: ':';
      }
    `,
  ],
  template: `
    <mat-date-range-picker #picker />
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
        <span class="value" *ngIf="value?.start && value?.end">
          {{ value | wattDate }}
        </span>
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
  @Input() customSelectionStrategy!: (date: Date | null) => DateRange<Date>;

  @HostBinding('class.has-placeholder')
  get hasPlaceholderClass(): boolean {
    return this.placeholder;
  }

  @Output() selectionChange = new EventEmitter<WattRange<Date> | null>();

  private _dateAdapter = inject(DateAdapter);

  selectionStrategy() {
    const strategy = new WattDateRangeSelectionStrategy(this._dateAdapter);
    strategy.setCustomSelectionStrategy(this.customSelectionStrategy);
    return strategy;
  }
}
