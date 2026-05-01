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
import { Injectable, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';

import { dayjs } from '@energinet/watt/core/date';

@Injectable()
export class WattOneWeekRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter<D>);

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFullWeekRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFullWeekRange(activeDate);
  }

  private _createFullWeekRange(date: D | null): DateRange<D> {
    if (date && date instanceof Date) {
      const dayjsDate: dayjs.Dayjs = dayjs(date);

      const startOfWeek = dayjsDate.startOf('week');
      const endOfWeek = dayjsDate.endOf('week');

      const daysToStartOfWeek = startOfWeek.diff(dayjsDate, 'day');
      const daysToEndOfWeek = endOfWeek.diff(dayjsDate, 'day');

      const start = this._dateAdapter.addCalendarDays(date, daysToStartOfWeek);
      const end = this._dateAdapter.addCalendarDays(date, daysToEndOfWeek);

      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

export function wattProvideOneWeekRangeSelectionStrategy() {
  return {
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: WattOneWeekRangeSelectionStrategy,
  };
}
