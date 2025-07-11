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
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { WattRange, dayjs } from '@energinet-datahub/watt/date';

export function selectEntireMonthsValidator(
  control: AbstractControl<WattRange<string> | null>
): ValidationErrors | null {
  const range = control.value;

  if (range === null) {
    return null;
  }

  const isFirstDayOfMonth = dayjs(range.start).startOf('month').isSame(range.start);
  const isLastDayOfMonth = dayjs(range.end).endOf('month').isSame(range.end);

  return isFirstDayOfMonth && isLastDayOfMonth ? null : { selectEntireMonths: true };
}
