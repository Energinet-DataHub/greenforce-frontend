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

/** Represents a year.  */
export class Year {
  static readonly VIEW_FORMAT = 'YYYY';
  static readonly MODEL_FORMAT = 'YYYY';

  private constructor(private date: dayjs.Dayjs | null) {}

  /** Creates a `Year` instance from a `Date` object. */
  static fromDate = (value: Date) => new Year(dayjs(value));

  /** Creates a `Year` instance from a `string` in the view format. */
  static fromView = (value: string) =>
    new Year(value ? dayjs(value, Year.VIEW_FORMAT, true) : null);

  /** Creates a `Year` instance from a `string` in the model format. */
  static fromModel = (value: string | null | undefined) =>
    new Year(value ? dayjs(value, Year.MODEL_FORMAT, true) : null);

  /** Converts the `Year` instance to a `Date` object. */
  toDate = () => this.date?.toDate() ?? null;

  /** Converts the `Year` instance to a `string` in the view format. */
  toView = () => this.date?.format(Year.VIEW_FORMAT) ?? '';

  /** Converts the `Year` instance to a `string` in the model format. */
  toModel = () => this.date?.format(Year.MODEL_FORMAT) ?? null;
}

export const YEAR_FORMAT = Year.MODEL_FORMAT;
