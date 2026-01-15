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
import dayjs from 'dayjs'; // eslint-disable-line no-restricted-imports
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

declare module 'dayjs' {
  interface Dayjs {
    tz(timezone?: string, keepLocalTime?: boolean): dayjs.Dayjs;
    offsetName(type?: 'short' | 'long'): string | undefined;
  }
  interface DayjsTimezone {
    (date?: dayjs.ConfigType, timezone?: string): dayjs.Dayjs;
    (date: dayjs.ConfigType, format: string, timezone?: string): dayjs.Dayjs;
    guess(): string;
    setDefault(timezone?: string): void;
  }
}

declare module 'dayjs' {
  interface Dayjs {
    utc(keepLocalTime?: boolean): dayjs.Dayjs;
    local(): dayjs.Dayjs;
    isUTC(): boolean;
    utcOffset(offset: number | string, keepLocalTime?: boolean): dayjs.Dayjs;
  }

  export function utc(config?: dayjs.ConfigType, format?: string, strict?: boolean): dayjs.Dayjs;
}

export { dayjs };
