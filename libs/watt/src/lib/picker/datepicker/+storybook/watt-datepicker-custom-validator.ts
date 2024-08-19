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
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { dayjs } from '@energinet-datahub/watt/utils/date';

export const startDateCannotBeOlderThan3DaysValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const startDate = dayjs(value).toDate();

    if (startDate < dayjs().subtract(3, 'days').toDate()) {
      return { startDateCannotBeOlderThan3Days: true };
    }

    return null;
  };
