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
