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

export type CalendarDateRange = {
  start: number;
  end: number;
};

interface AppSettingsState {
  calendarDateRange: CalendarDateRange;
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
    });
  }

  readonly calendarDateRange$ = this.select((state) => state.calendarDateRange);
  readonly calendarDateRangeInSeconds$ = this.select((state) => ({
    start: state.calendarDateRange.start / 1000,
    end: state.calendarDateRange.end / 1000,
  }));

  readonly setCalendarDateRange = this.updater(
    (state, calendarDateRange: CalendarDateRange): AppSettingsState => ({
      ...state,
      calendarDateRange,
    })
  );
}
