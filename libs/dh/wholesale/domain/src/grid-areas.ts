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
import type { ResultOf } from '@graphql-typed-document-node/core';

import { Range } from '@energinet-datahub/dh/shared/domain';
import { GetGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type GridArea = ResultOf<typeof GetGridAreasDocument>['gridAreas'][0];

export function filterValidGridAreas(
  gridAreas: GridArea[],
  dateRange: Range<string> | null
): GridArea[] {
  if (dateRange === null) return gridAreas;
  return gridAreas.filter((gridArea) => {
    const { validTo, validFrom } = gridArea;

    // Is valid from before the end of the date range
    const isValidFrom = new Date(validFrom).getTime() <= new Date(dateRange.end).getTime();

    // Is valid to after the start of the date range
    const isValidTo = !validTo
      ? true
      : new Date(validTo).getTime() >= new Date(dateRange.start).getTime();

    return isValidTo && isValidFrom;
  });
}
