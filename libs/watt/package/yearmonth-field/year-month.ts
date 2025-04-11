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
import { dayjs } from '@energinet/watt/core/date';

/** Represents a year and month.  */
export class YearMonth {
  static readonly VIEW_FORMAT = 'MMMM YYYY';
  static readonly MODEL_FORMAT = 'YYYY-MM';

  private constructor(private date: dayjs.Dayjs | null) {}

  // Certain locales may render months in all lowercase
  private capitalizeMonth = ([first = '', ...rest]: string) =>
    [first.toUpperCase(), ...rest].join('');

  /** Creates a `YearMonth` instance from a `Date` object. */
  static fromDate = (value: Date) => new YearMonth(dayjs(value));

  /** Creates a `YearMonth` instance from a `string` in the view format. */
  static fromView = (value: string) =>
    new YearMonth(value ? dayjs(value, YearMonth.VIEW_FORMAT, true) : null);

  /** Creates a `YearMonth` instance from a `string` in the model format. */
  static fromModel = (value: string | null | undefined) =>
    new YearMonth(value ? dayjs(value, YearMonth.MODEL_FORMAT, true) : null);

  /** Converts the `YearMonth` instance to a `Date` object. */
  toDate = () => this.date?.toDate() ?? null;

  /** Converts the `YearMonth` instance to a `string` in the view format. */
  toView = () => this.capitalizeMonth(this.date?.format(YearMonth.VIEW_FORMAT) ?? '');

  /** Converts the `YearMonth` instance to a `string` in the model format. */
  toModel = () => this.date?.format(YearMonth.MODEL_FORMAT) ?? null;
}
