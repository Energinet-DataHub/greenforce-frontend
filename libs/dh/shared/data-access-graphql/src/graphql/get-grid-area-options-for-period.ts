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
/* eslint-disable @nx/enforce-module-boundaries */
import { computed, Signal } from '@angular/core';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WattDropdownOptions } from '@energinet/watt/dropdown';
import { WattRange } from '@energinet/watt/date';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetRelevantGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';

type GridArea = ResultOf<typeof GetRelevantGridAreasDocument>['relevantGridAreas'][0];

export async function getGridAreaOptionsForPeriod(
  interval: WattRange<Date>,
  actorId: string
): Promise<WattDropdownOptions> {
  const result = await query(GetRelevantGridAreasDocument, {
    variables: {
      period: { interval },
      actorId,
    },
  }).result();

  const relevantGridAreas = result.data?.relevantGridAreas ?? [];

  return toDropdownOptions(relevantGridAreas);
}

export function getGridAreaOptionsForPeriodSignal(
  interval: Signal<WattRange<Date> | null>,
  actorId: string
): Signal<WattDropdownOptions> {
  const queryResult = query(GetRelevantGridAreasDocument, () => {
    const i = interval();

    return i ? { variables: { period: { interval: i }, actorId } } : { skip: true };
  });

  return computed(() => {
    const relevantGridAreas = queryResult.data()?.relevantGridAreas ?? [];

    return toDropdownOptions(relevantGridAreas);
  });
}

function toDropdownOptions(values: GridArea[]): WattDropdownOptions {
  return values.map((value) => ({
    value: value.code,
    displayValue: value.displayName,
  }));
}
