import { DateRange, GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { isAfter, isBefore, isEqual } from 'date-fns';

export function filterValidGridAreas(
  gridAreas: GridAreaDto[],
  dateRange: DateRange | null
): GridAreaDto[] {
  if (dateRange === null) return gridAreas;
  return gridAreas?.filter((gridArea) => {
    const { validTo, validFrom } = gridArea;
    const isValidTo =
      isBefore(new Date(validFrom), new Date(dateRange.end)) ||
      isEqual(new Date(validFrom), new Date(dateRange.end));

    const isValidFrom = !validTo
      ? true
      : isAfter(new Date(validTo), new Date(dateRange.start)) ||
        isEqual(new Date(validTo), new Date(dateRange.start));

    return isValidTo && isValidFrom;
  });
}
