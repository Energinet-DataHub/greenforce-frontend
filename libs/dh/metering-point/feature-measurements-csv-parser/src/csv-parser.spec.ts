import { CsvParseService } from './csv-parser';
import { VALID_KVANTUM_STATUS, isNumeric, KVANTUM_STATUS, validateDayCompleteness } from './validations';
import { createPapaParseConfigFactory } from './papaparse-config-factory';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';
import { dayjs } from '@energinet-datahub/watt/date';
import { parseFlexibleDate } from './date-utils';

describe('CsvParseService', () => {
  let service: CsvParseService;

  beforeEach(() => {
    service = new CsvParseService();
  });

  // Helper to generate rows for a given day and interval, simulating CSV input for a full day in Europe/Copenhagen timezone.
  function makeRowsForDay(day: string, intervalMinutes: number, count?: number) {
    const start = dayjs.tz(day + 'T00:00:00', danishTimeZoneIdentifier);
    const end = start.add(1, 'day');
    const rows = [];
    let current = start.clone();
    let i = 0;
    while (current.isBefore(end) && (!count || i < count)) {
      rows.push({
        Position: (i + 1).toString(),
        Periode: current.format('YYYY-MM-DD HH.mm'),
        Værdi: '1',
        [KVANTUM_STATUS]: 'Målt',
      });
      current = current.add(intervalMinutes, 'minute');
      i++;
    }
    return rows;
  }

  // Standard day: 24 hours, so 96 quarter-hour intervals and 24 hourly intervals
  it('validates completeness for a standard day (96/24 intervals)', () => {
    // May 1, 2025 is a normal day (no DST change)
    const day = '2025-05-01';
    const rows15 = makeRowsForDay(day, 15);
    const rows60 = makeRowsForDay(day, 60);
    // Should have 96 and 24 intervals respectively
    const result15 = validateDayCompleteness(
      { [day]: rows15.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      15,
      []
    );
    const result60 = validateDayCompleteness(
      { [day]: rows60.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      60,
      []
    );
    expect(result15[day]).toBe(true);
    expect(result60[day]).toBe(true);
  });

  // DST spring forward: 23-hour day, so 92 quarter-hour intervals and 23 hourly intervals
  it('validates completeness for DST spring forward (92/23 intervals)', () => {
    // March 30, 2025 is the DST spring forward day in Europe/Copenhagen
    // The clock jumps from 02:00 to 03:00, so there is one hour less
    const day = '2025-03-30';
    const rows15 = makeRowsForDay(day, 15);
    const rows60 = makeRowsForDay(day, 60);
    // Should have 92 and 23 intervals respectively
    expect(rows15.length).toBe(92);
    expect(rows60.length).toBe(23);
    const result15 = validateDayCompleteness(
      { [day]: rows15.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      15,
      []
    );
    const result60 = validateDayCompleteness(
      { [day]: rows60.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      60,
      []
    );
    expect(result15[day]).toBe(true);
    expect(result60[day]).toBe(true);
  });

  // DST fall back: 25-hour day, so 100 quarter-hour intervals and 25 hourly intervals
  it('validates completeness for DST fall back (100/25 intervals)', () => {
    // October 26, 2025 is the DST fall back day in Europe/Copenhagen
    // The clock repeats the hour from 02:00 to 03:00, so there is one extra hour
    const day = '2025-10-26';
    const rows15 = makeRowsForDay(day, 15);
    const rows60 = makeRowsForDay(day, 60);
    // Should have 100 and 25 intervals respectively
    expect(rows15.length).toBe(100);
    expect(rows60.length).toBe(25);
    const result15 = validateDayCompleteness(
      { [day]: rows15.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      15,
      []
    );
    const result60 = validateDayCompleteness(
      { [day]: rows60.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      60,
      []
    );
    expect(result15[day]).toBe(true);
    expect(result60[day]).toBe(true);
  });

  // Incomplete day: less than the required number of intervals
  it('detects incomplete day', () => {
    // May 1, 2025, but only 80 quarter-hour intervals (should be 96)
    const day = '2025-05-01';
    const rows = makeRowsForDay(day, 15, 80); // less than 96
    const invalidRows: any[] = [];
    const result = validateDayCompleteness(
      { [day]: rows.map(r => new Date(dayjs(r.Periode, 'YYYY-MM-DD HH.mm').toISOString())) },
      15,
      invalidRows
    );
    expect(result[day]).toBe(false);
    expect(invalidRows.length).toBeGreaterThan(0);
    expect(invalidRows[0].message).toContain('Incomplete data');
  });

  it('validates required columns', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const noop = () => {};
    const alwaysFalse = () => false;
    const config = createPapaParseConfigFactory(noop, noop, noop, alwaysFalse);
    expect(config.header).toBe(true);
  });

  it('validates Kvantum status', () => {
    expect(VALID_KVANTUM_STATUS).toBeDefined();
    expect(VALID_KVANTUM_STATUS).toContain('Målt');
    expect(VALID_KVANTUM_STATUS).not.toContain('Invalid');
  });

  it('validates numeric Værdi', () => {
    const valid = isNumeric('123,45');
    const invalid = isNumeric('abc');
    expect(valid).toBeNull();
    expect(invalid).toEqual({ numeric: true });
  });
});

describe('parseFlexibleDate', () => {
  const cases = [
    // [input, expected ISO prefix]
    ['28.4.2025 0.00', '2025-04-28T00:00'],
    ['28-04-2025 0.00', '2025-04-28T00:00'],
    ['28-04-2025 00:00', '2025-04-28T00:00'],
    ['2025-04-28 0.15', '2025-04-28T00:15'],
    ['2025-4-28 0.15', '2025-04-28T00:15'],
    ['28.4.2025 00.00', '2025-04-28T00:00'],
    ['28.04.2025 00.00', '2025-04-28T00:00'],
    ['2025-04-28 00.15', '2025-04-28T00:15'],
    ['2025-04-28 23.45', '2025-04-28T23:45'],
    ['2025-04-28 23:45', '2025-04-28T23:45'],
    ['2025-04-28 12.30', '2025-04-28T12:30'],
    ['2025-04-28 12:30', '2025-04-28T12:30'],
  ];

  it.each(cases)('parses "%s" to ISO string starting with "%s"', (input, expectedPrefix) => {
    const result = parseFlexibleDate(input);
    expect(result).toBeDefined();
    expect(result!.startsWith(expectedPrefix)).toBe(true);
  });
});
