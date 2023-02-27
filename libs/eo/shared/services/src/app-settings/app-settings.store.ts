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
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { differenceInDays } from 'date-fns';

export type CalendarDateRange = {
  start: number;
  end: number;
};

export type Resolution = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

interface AppSettingsState {
  calendarDateRange: CalendarDateRange;
  resolution: Resolution;
}

@Injectable({
  providedIn: 'root',
})
export class AppSettingsStore extends ComponentStore<AppSettingsState> {
  constructor() {
    super({
      calendarDateRange: {
        start: new Date('2021-01-01:00:00:00').getTime(),
        end: new Date('2022-01-01:00:00:00').getTime(),
      },
      resolution: 'MONTH',
    });
  }

  readonly calendarDateRange$ = this.select((state) => state.calendarDateRange);
  readonly calenderDateRangeDates$ = this.select((state) => ({
    start: new Date(state.calendarDateRange.start),
    end: new Date(state.calendarDateRange.end),
  }));

  readonly calendarDateRangeInSeconds$ = this.select((state) => ({
    start: state.calendarDateRange.start / 1000,
    end: state.calendarDateRange.end / 1000,
  }));

  readonly setCalendarDateRange = this.updater(
    (state, calendarDateRange: CalendarDateRange): AppSettingsState => {
      return {
        ...state,
        calendarDateRange,
        resolution: this.getResolutionFromDateRange(calendarDateRange),
      };
    }
  );

  readonly resolution$ = this.select((state) => state.resolution);
  readonly setResolution = this.updater(
    (state, resolution: Resolution): AppSettingsState => ({
      ...state,
      resolution,
    })
  );

  getResolutionFromDateRange(dateRange: CalendarDateRange): Resolution {
    const difference = differenceInDays(new Date(dateRange.end), new Date(dateRange.start));

    switch (true) {
      case difference < 3:
        return 'HOUR';
      case difference < 30:
        return 'DAY';
      case difference < 180:
        return 'WEEK';
      case difference < 730:
        return 'MONTH';
      case difference > 730:
        return 'YEAR';
      default:
        return 'MONTH';
    }
  }
}
