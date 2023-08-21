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
import { set } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { BehaviorSubject } from 'rxjs';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';

export interface DatePickerData {
  startDate: string;
  endDate: string;
}

@Injectable()
export class DrawerDatepickerService {
  private todayAtMidnight = this.setToStartOfDay(new Date());

  dateRangeDefault: DatePickerData = {
    startDate: this.todayAtMidnight.toISOString(),
    endDate: new Date().toISOString(),
  };

  private dataSource$ = new BehaviorSubject(this.dateRangeDefault);
  dateRange$ = this.dataSource$.asObservable();

  getData() {
    return this.dateRangeDefault;
  }

  setData(dateRange: DatePickerData) {
    this.dataSource$.next(dateRange);
  }

  private setToStartOfDay(value: Date): Date {
    const date = set(value, {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    return zonedTimeToUtc(date, danishTimeZoneIdentifier);
  }
}
