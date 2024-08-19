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
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { WattRange, dayjs } from '@energinet-datahub/watt/utils/date';

type rangeControl = AbstractControl<WattRange<string>>;

export const max31DaysDateRangeValidator: ValidatorFn = ({ value }: rangeControl) => {
  if (!value?.end || !value?.start) return null;
  // Since the date range does not include the last millisecond (ends at 23:59:59.999),
  // this condition checks for 30 days, not 31 days (as the diff is in whole days only).
  return dayjs(value.end).diff(value.start, 'days') > 30 ? { max31DaysDateRange: true } : null;
};
