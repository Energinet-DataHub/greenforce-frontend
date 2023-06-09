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

import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import endOfDay from 'date-fns/endOfDay';

import { WattDatePipe } from '../../../utils/date';
import { WattIconComponent } from '../../../foundations/icon/icon.component';
import { WattMenuChipComponent } from '../../chip/watt-menu-chip.component';

@Injectable()
export class EndOfDaySelectionStrategy extends DefaultMatCalendarRangeStrategy<Date> {
  override selectionFinished(date: Date, currentRange: DateRange<Date>): DateRange<Date> {
    const range = super.selectionFinished(date, currentRange);
    return range.end ? new DateRange(range.start, endOfDay(range.end)) : range;
  }
}

@Component({
  standalone: true,
  providers: [{ provide: MAT_DATE_RANGE_SELECTION_STRATEGY, useClass: EndOfDaySelectionStrategy }],
  imports: [
    CommonModule,
    MatDatepickerModule,
    WattMenuChipComponent,
    WattDatePipe,
    WattIconComponent,
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
    `,
  ],
  template: `
    <mat-date-range-picker #picker></mat-date-range-picker>
    <watt-menu-chip
      hasPopup="dialog"
      [disabled]="disabled"
      [selected]="value?.start && value?.end ? true : false"
      [opened]="picker.opened"
      (toggle)="picker.open()"
    >
      <mat-date-range-input #input class="cdk-visually-hidden" separator="―" [rangePicker]="picker">
        <input
          type="text"
          matStartDate
          tabindex="-1"
          [value]="value?.start"
          (dateChange)="value = input.value ?? undefined"
          (dateChange)="selectionChange.emit(input.value ?? undefined)"
        />
        <input
          type="text"
          matEndDate
          tabindex="-1"
          [value]="value?.end"
          (dateChange)="value = input.value ?? undefined"
          (dateChange)="selectionChange.emit(input.value ?? undefined)"
        />
      </mat-date-range-input>
      <ng-content />
      <ng-container *ngIf="value?.start && value?.end">: {{ value | wattDate }}</ng-container>
    </watt-menu-chip>
  `,
})
export class WattDateRangeChipComponent {
  @Input() disabled = false;
  @Input() label?: string;
  @Input() value?: DateRange<string>;
  @Output() selectionChange = new EventEmitter<DateRange<string>>();
}
