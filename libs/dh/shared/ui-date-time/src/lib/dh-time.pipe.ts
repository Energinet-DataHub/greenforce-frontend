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
import { Pipe, PipeTransform } from '@angular/core';
import { Resolution } from '@energinet-datahub/dh/shared/domain';
import { dhFormatDanishDatetime, TValue } from './dh-format-danish-datetime';

export const pipeName = 'dhTime';

@Pipe({
  name: pipeName,
})
export class DhTimePipe implements PipeTransform {
  private timeFormat = 'HH:mm';
  private hourFormat = 'HH';

  /**
   *
   * @param maybeIso8601DateTime Date time in ISO 8601 format (e.g. 2021-12-01T23:00:00Z)
   * @param resolution Charge resolution as enum.
   * @returns
   */
  transform(
    maybeIso8601DateTime: TValue,
    resolution?: Resolution
  ): string | null {
    switch (resolution) {
      case Resolution.PT1H: {
        return dhFormatDanishDatetime(maybeIso8601DateTime, this.hourFormat);
      }
      case Resolution.PT15M: {
        return dhFormatDanishDatetime(maybeIso8601DateTime, this.timeFormat);
      }
      default: {
        return dhFormatDanishDatetime(maybeIso8601DateTime, this.timeFormat);
      }
    }
  }
}
