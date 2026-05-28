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
import { dayjs } from './dayjs';

/**
 * Re-anchors a local-time Date at UTC midnight of the same calendar day.
 *
 * Material's datepicker emits a Date constructed in the user's local timezone
 * (e.g. Jan 15 00:00 +03:00 for an Istanbul user). When that Date is later
 * formatted through wattDate (which uses Europe/Copenhagen), it shifts to the
 * previous calendar day in timezones east of UTC. Returning a UTC-midnight
 * Date for the same year/month/day keeps the calendar date stable across
 * timezones, matching the strategy used by WattDatepickerComponent.
 */
export function toUtcMidnight(value: Date): Date;
export function toUtcMidnight(value: Date | null | undefined): Date | null;
export function toUtcMidnight(value: Date | null | undefined): Date | null {
  if (!value || !dayjs(value).isValid()) return null;
  return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
}

/**
 * Re-anchors a local-time Date at UTC end-of-day. Used for range end dates so
 * the entire selected day is included in inclusive range queries.
 */
export function toUtcEndOfDay(value: Date): Date;
export function toUtcEndOfDay(value: Date | null | undefined): Date | null;
export function toUtcEndOfDay(value: Date | null | undefined): Date | null {
  if (!value || !dayjs(value).isValid()) return null;
  return new Date(
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999)
  );
}

/**
 * Reads the UTC calendar day from a Date (or ISO string) and returns a Date
 * with the same calendar day in local time. Used to feed Material's datepicker
 * input so the calendar displays the day that was actually selected, regardless
 * of the user's timezone offset.
 */
export function toLocalCalendarDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const d = dayjs.utc(value);
  if (!d.isValid()) return null;
  return new Date(d.year(), d.month(), d.date());
}

/**
 * Re-anchors any UTC date at UTC midnight of the same UTC calendar day. Used
 * to project a range-end value (stored as 23:59:59.999Z so inclusive queries
 * cover the full day) back to midnight for display only, so `wattDate` in
 * Europe/Copenhagen does not roll over to the next day.
 */
export function toUtcCalendarMidnight(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  const d = dayjs.utc(value);
  if (!d.isValid()) return null;
  return new Date(Date.UTC(d.year(), d.month(), d.date()));
}
