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
import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import {
  GetLatestCalculationDocument,
  PeriodInput,
  StartCalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { dayjs } from '@energinet-datahub/watt/date';

export type ResolutionTransitionError = { resolutionTransition: string };
export type ExistingCalculationError = {
  existingCalculation: { period: Date | string; warning: boolean };
};

export const injectResolutionTransitionValidator = (): ValidatorFn => {
  const featureFlagService = inject(DhFeatureFlagsService);
  const flag = 'quarterly-resolution-transition-datetime-override';
  const resolutionTransition = featureFlagService.isEnabled(flag)
    ? '2023-01-31T23:00:00Z'
    : '2023-04-30T22:00:00Z';

  return (control: AbstractControl<PeriodInput | null>): ResolutionTransitionError | null => {
    const interval = control.value?.interval;
    if (!interval) return null; // yearMonth cannot span resolution transition date
    const start = dayjs.utc(interval.start);
    const end = dayjs.utc(interval.end);
    const transitionDate = dayjs.utc(resolutionTransition);
    return start.isBefore(transitionDate) && end.isAfter(transitionDate)
      ? { resolutionTransition }
      : null;
  };
};

export const injectExistingCalculationValidator = (): AsyncValidatorFn => {
  const query = lazyQuery(GetLatestCalculationDocument);
  return async (
    control: AbstractControl<PeriodInput | null>
  ): Promise<ExistingCalculationError | null> => {
    const period = control.value;
    const calculationType = control.parent?.get('calculationType')?.value;

    // Skip validation if calculation type is aggregation
    if (calculationType === StartCalculationType.Aggregation) return null;

    // Skip validation if period is empty
    if (!period) return null;

    return query.refetch({ calculationType, period }).then((result) => {
      const calculation = result.data.latestCalculation;
      switch (calculation?.__typename) {
        case 'WholesaleAndEnergyCalculation':
          if (!calculation.period.end) return null; // Cannot actually be an open interval
          return { existingCalculation: { period: calculation.period.end, warning: true } };
        case 'CapacitySettlementCalculation':
          return { existingCalculation: { period: calculation.yearMonth, warning: true } };
        case 'NetConsumptionCalculation':
        case 'ElectricalHeatingCalculation':
        case undefined:
          return null;
      }
    });
  };
};
