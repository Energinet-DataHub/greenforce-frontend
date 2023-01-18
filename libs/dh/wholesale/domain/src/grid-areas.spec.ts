import { GridAreaDto } from '@energinet-datahub/dh/shared/domain';
import { add, sub } from 'date-fns';
import { filterValidGridAreas } from './grid-areas';

describe(filterValidGridAreas.name, () => {
  const initialDateOffset = '0001-01-01T00:00:00+00:00';
  const gridAreas = [
    { validFrom: initialDateOffset },
    { validFrom: '1970-01-02T00:00:00+00:00' },
    { validFrom: '1970-01-03T00:00:00+00:00' },
  ] as GridAreaDto[];

  it('should return all grid areas when date range is null', () => {
    const dateRange = null;
    const result = filterValidGridAreas(gridAreas, dateRange);
    expect(result).toEqual(gridAreas);
  });

  it('validFrom should be before or equal selected end date', () => {
    const selectedDateRange = { start: '1970/01/01', end: '1970/01/03' };
    const expectedGridAreas = [initialDateOffset, '1970-01-02T00:00:00+00:00'];
    const result = filterValidGridAreas(gridAreas, selectedDateRange);
    expect(result).toEqual(expectedGridAreas.map((x) => ({ validFrom: x })));
  });

  it('validTo should be after or equal selected start date', () => {
    /**
     * Arrange
     */
    const selectedDateRange = { start: '1970-01-02', end: '1970-01-4' };
    const gridAreas = [
      {
        validTo: sub(new Date(selectedDateRange.start), {
          days: 1,
        }).toISOString(), // INVALID
      },
      {
        validTo: selectedDateRange.start, // VALID
      },
      {
        validTo: add(new Date(selectedDateRange.start), {
          days: 1,
        }).toISOString(), // VALID
      },
      {
        validTo: sub(new Date(selectedDateRange.start), {
          days: 3,
        }).toISOString(), // INVALID
      },
    ]
      // We map the validFrom property since it is required by the filterValidGridAreas function and we don't care about it in this test
      .map((x) => {
        return { ...x, validFrom: initialDateOffset } as GridAreaDto;
      });
    const expectedGridAreas = [gridAreas[1], gridAreas[2]];

    /**
     * Act
     */
    const result = filterValidGridAreas(gridAreas, selectedDateRange);

    /**
     * Assert
     */
    expect(result).toEqual(expectedGridAreas);
  });
});
