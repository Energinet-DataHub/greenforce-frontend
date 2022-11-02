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
        start: 1609459200000, // 1/1-2021
        end: 1640995200000, // 1/1-2022
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
      const difference = differenceInDays(
        new Date(calendarDateRange.end),
        new Date(calendarDateRange.start)
      );

      return {
        ...state,
        calendarDateRange,
        resolution: this.getResolutionFromDifference(difference),
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

  getResolutionFromDifference(differenceInDays: number): Resolution {
    switch (true) {
      case differenceInDays < 3:
        return 'HOUR';
      case differenceInDays < 30:
        return 'DAY';
      case differenceInDays < 180:
        return 'WEEK';
      case differenceInDays < 730:
        return 'MONTH';
      case differenceInDays > 730:
        return 'YEAR';
      default:
        return 'MONTH';
    }
  }
}
