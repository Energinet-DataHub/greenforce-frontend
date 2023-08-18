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
import { Calendar, Month } from './types';
import * as dateFns from './date-fns';

export const make = (calendar: Calendar, month: Date): Month => {
  const startOfMonth = dateFns.startOfMonth(month);
  return {
    calendar,
    startOfMonth,
    start: dateFns.startOfISOWeek(startOfMonth),
    end: dateFns.endOfISOWeek(dateFns.addWeeks(startOfMonth, 5)),
  };
};

export const next = (month: Month) =>
  make(month.calendar, dateFns.addMonths(month.startOfMonth, 1));

export const previous = (month: Month) =>
  make(month.calendar, dateFns.subMonths(month.startOfMonth, 1));

export const today = (month: Month) => make(month.calendar, month.calendar.today);

export const toArray = (month: Month) =>
  dateFns
    .eachWeekOfInterval({ start: month.start, end: month.end }, { weekStartsOn: 1 })
    .map((startOfWeek) => ({
      startOfWeek,
      number: dateFns.getISOWeek(startOfWeek),
      days: dateFns
        .eachDayOfInterval({ start: startOfWeek, end: dateFns.endOfISOWeek(startOfWeek) })
        .map((startOfDay) => ({
          startOfDay,
          date: dateFns.getDate(startOfDay),
          day: dateFns.getDay(startOfDay),
          isCurrentMonth: dateFns.isSameMonth(startOfDay, month.startOfMonth),
          isToday: dateFns.isSameDay(startOfDay, month.calendar.today),
          isWeekend: dateFns.isWeekend(startOfDay),
        })),
    }));
