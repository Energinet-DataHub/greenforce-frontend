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
import { WattDescriptionListGroups } from '@energinet-datahub/watt/description-list';
import { DhDatePipe } from '@energinet-datahub/dh/shared/ui-date-time';
import { combineLatest, map, Observable } from 'rxjs';
import { Translation } from '@ngneat/transloco';
import { BatchDto, ProcessStepResultDto } from '@energinet-datahub/dh/shared/domain';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

export function mapMetaData(
  translations$: Observable<Translation>,
  processStepResults$: Observable<ProcessStepResultDto | undefined>,
  batch$: Observable<BatchDto | undefined>
): Observable<WattDescriptionListGroups> {
  return combineLatest([
    translations$,
    processStepResults$.pipe(exists()),
    batch$.pipe(exists()),
  ]).pipe(
    map(([translations, processStepResults, batch]) => {
      const datePipe = new DhDatePipe();

      return [
        {
          term: translations['wholesale.processStepResults.meteringPointType'],
          description:
            translations[
              'wholesale.processStepResults.processStepMeteringPointType.' +
                processStepResults.timeSeriesType
            ],
        },
        {
          term: translations['wholesale.processStepResults.calculationPeriod'],
          description: `${datePipe.transform(batch.periodStart)} - ${datePipe.transform(
            batch.periodEnd
          )}`,
        },
        {
          term: translations['wholesale.processStepResults.sum'],
          description: `${processStepResults.sum} kWh`,
          forceNewRow: true,
        },
        {
          term: translations['wholesale.processStepResults.min'],
          description: `${processStepResults.min} kWh`,
        },
        {
          term: translations['wholesale.processStepResults.max'],
          description: `${processStepResults.max} kWh`,
        },
      ];
    })
  );
}
