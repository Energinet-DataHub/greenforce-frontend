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
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a phone number string that includes a country code prefix into a
 * human-readable format, e.g. "4522332233" → "+45 22 33 22 33".
 *
 * The input is expected to have the country code as a numeric prefix.
 * The `countryCodeLength` parameter (default: 2) determines how many leading
 * digits are treated as the country code.
 *
 * Returns null/undefined/empty strings as-is so that dhEmDashFallback can handle them.
 */
@Pipe({ name: 'dhPhoneNumber' })
export class DhPhoneNumberPipe implements PipeTransform {
  transform(value: string | null | undefined, countryCodeLength = 2): string | null | undefined {
    if (!value) return value;

    const digits = value.replace(/\D/g, '');
    if (digits.length <= countryCodeLength) return value;

    const countryCode = digits.slice(0, countryCodeLength);
    const local = digits.slice(countryCodeLength);
    const formatted = local.match(/.{1,2}/g)?.join(' ') ?? local;

    return `+${countryCode} ${formatted}`;
  }
}

