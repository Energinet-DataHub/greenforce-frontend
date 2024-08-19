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
import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DateRange } from '@angular/material/datepicker';
import {
  WattDateChipComponent,
  WattDateRangeChipComponent,
} from '@energinet-datahub/watt/picker/datepicker';
import { TranslocoService } from '@ngneat/transloco';

import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import {
  addDays,
  endOfDay,
  endOfToday,
  endOfWeek,
  format,
  getUnixTime,
  startOfDay,
  startOfToday,
  startOfWeek,
  subDays,
} from 'date-fns';

import { da, enGB } from 'date-fns/locale';

import { eoDashboardPeriod } from '@energinet-datahub/eo/dashboard/domain';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';

@Component({
  standalone: true,
  imports: [
    WattDropdownComponent,
    ReactiveFormsModule,
    NgIf,
    WattDateChipComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
  ],
  selector: 'eo-dashboard-choose-period',
  styles: [
    `
      :host {
        display: flex;
        gap: var(--watt-space-s);
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <ng-container [formGroup]="form">
      <watt-dropdown
        [chipMode]="true"
        [showResetOption]="false"
        [disableSelectedMode]="true"
        formControlName="period"
        [hideSearch]="true"
        panelWidth="auto"
        [options]="periods"
      />

      <!-- Day -->
      <watt-date-chip
        *ngIf="form.controls.period.value === 'day'"
        [formControl]="form.controls.day"
        [placeholder]="false"
      />

      <!-- Week -->
      <watt-date-range-chip
        *ngIf="form.controls.period.value === 'week'"
        [formControl]="form.controls.week"
        [customSelectionStrategy]="weekSelectionStrategy"
        [placeholder]="false"
      />

      <!-- Month -->
      <watt-dropdown
        *ngIf="form.controls.period.value === 'month'"
        [chipMode]="true"
        [showResetOption]="false"
        formControlName="months"
        [options]="months"
      />

      <!-- Year -->
      <watt-dropdown
        *ngIf="form.controls.period.value === 'year'"
        [chipMode]="true"
        [showResetOption]="false"
        formControlName="years"
        [options]="years"
      />
    </ng-container>
  `,
})
export class EoDashboardChoosePeriodComponent implements OnInit {
  @Output() periodChanged = new EventEmitter<eoDashboardPeriod>();

  private _dateAdapter = inject(DateAdapter);
  private transloco = inject(TranslocoService);

  private destroyRef = inject(DestroyRef);
  private startYear = 2022; // Year of when year and month selection should start

  periods: WattDropdownOption[] = [];

  months: WattDropdownOption[] = [];

  years: WattDropdownOption[] = this.generateYears();
  private currentYear = new Date().getFullYear();

  form = new FormGroup({
    period: new FormControl<EoTimeAggregate | null>(null),
    day: new FormControl(new Date().toISOString(), { nonNullable: true }),
    week: new FormControl(
      { start: addDays(startOfWeek(new Date()), 1), end: addDays(endOfWeek(new Date()), 1) },
      { nonNullable: true }
    ),
    months: new FormControl('last30days', { nonNullable: true }),
    years: new FormControl(String(this.currentYear), { nonNullable: true }),
  });

  ngOnInit(): void {
    this.transloco
      .selectTranslateObject('periodSelector')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((translations) => {
        // Set periods
        this.periods = Object.keys(translations.periods || {}).map((key) => ({
          value: key,
          displayValue: translations.periods[key],
        }));

        // Set months
        this.months = [
          { value: 'last30days', displayValue: translations['last30Days'] },
          ...this.generateMonths(),
        ];
      });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const period = value.period;

      if (period === 'day') {
        this.daySelected();
      } else if (period === 'week') {
        this.weekSelected();
      } else if (period === 'month') {
        this.monthSelected();
      } else if (period === 'year') {
        this.yearSelected();
      }
    });

    // Set default period to month, and trigger periodChanged event
    this.form.controls.period.setValue(EoTimeAggregate.Month);
  }

  protected weekSelectionStrategy(date: Date | null): DateRange<Date> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -3);
      const end = this._dateAdapter.addCalendarDays(date, 3);
      return new DateRange<Date>(start, end);
    }

    return new DateRange<Date>(null, null);
  }

  private generateMonths(): WattDropdownOption[] {
    const currentDate = new Date();
    const months: WattDropdownOption[] = [];

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    let startMonth = 1;

    for (let year = currentYear; year >= this.startYear; year--) {
      const endMonth = year === currentYear ? currentMonth : 12;
      startMonth = year === this.startYear ? startMonth : 1;

      for (let month = endMonth; month >= startMonth; month--) {
        months.push(this.getMonth(year, month));
      }
    }

    return months;
  }

  getMonth(year: number, month: number) {
    const monthValue = month.toString().padStart(2, '0');
    const locale = this.transloco.getActiveLang() === 'da' ? da : enGB;

    const monthDisplayValue = format(new Date(year, month - 1), 'MMMM yyyy', { locale });
    return { value: `${monthValue}-${year}`, displayValue: monthDisplayValue };
  }

  private generateYears(): WattDropdownOption[] {
    const currentYear = new Date().getFullYear();
    const years: WattDropdownOption[] = [];

    for (let year = currentYear; year >= this.startYear; year--) {
      years.push({ value: String(year), displayValue: String(year) });
    }

    return years;
  }

  private daySelected() {
    const day = new Date(this.form.controls.day.value);

    this.periodChanged.emit({
      timeAggregate: EoTimeAggregate.Hour,
      start: getUnixTime(startOfDay(day)),
      end: getUnixTime(endOfDay(day)),
    });
  }

  private weekSelected() {
    const week = this.form.controls.week.value;
    if (!week || !week.start || !week.end) return;

    this.periodChanged.emit({
      timeAggregate: EoTimeAggregate.Hour,
      start: getUnixTime(week.start),
      end: getUnixTime(week.end),
    });
  }

  private monthSelected() {
    const monthsControl = this.form.controls.months;
    // Last 30 days
    if (monthsControl.value === 'last30days') {
      const { start, end } = this.last30Days();
      this.periodChanged.emit({ timeAggregate: EoTimeAggregate.Day, start, end });
      // Specific month
    } else {
      const [month, year] = monthsControl.value.split('-');

      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1); // start of month at 00:00
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59); // end of month at 23:59:59

      this.periodChanged.emit({
        timeAggregate: EoTimeAggregate.Day,
        start: getUnixTime(startOfMonth),
        end: getUnixTime(endOfMonth),
      });
    }
  }

  private yearSelected() {
    const year: number = parseInt(this.form.controls.years.value) || this.currentYear;
    const startOfYear = new Date(year, 0, 1); // start of year at 00:00
    const endOfYear = new Date(year, 11, 31, 23, 59); // end of year at 23:59

    this.periodChanged.emit({
      timeAggregate: EoTimeAggregate.Month,
      start: getUnixTime(startOfYear),
      end: getUnixTime(endOfYear),
    });
  }

  private last30Days(): { start: number; end: number } {
    return {
      start: getUnixTime(subDays(startOfToday(), 30)), // 30 days ago at 00:00
      end: getUnixTime(endOfToday()), // Today at 23:59:59
    };
  }
}
