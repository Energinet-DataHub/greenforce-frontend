// External dependencies
import { ValidationErrors } from '@angular/forms';
import { dayjs } from '@energinet-datahub/watt/date';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';
import { CsvError, MeasurementsCSV } from './types';

// =========================
// Numeric Validation
// =========================

/**
 * Checks if a value is numeric (accepts comma or dot as decimal separator).
 */
export const isNumeric = (value: string): ValidationErrors | null => {
  return /^[0-9.,]+$/.test(value) ? null : { numeric: true };
};

// =========================
// Required Columns
// =========================

/**
 * Key for Kvantum status field (used for consistency).
 */
export const KVANTUM_STATUS = 'Kvantum status';

/**
 * List of required columns for the CSV file.
 */
export const REQUIRED_COLUMNS = ['Position', 'Periode', 'Værdi', KVANTUM_STATUS] as const;

/**
 * Returns a list of missing required columns from the provided headers.
 */
export const validateRequiredColumns = (headers: string[]): string[] => {
  return REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
};

/**
 * Type guard for MeasurementsCSV rows. Checks that all required columns are present.
 * Assumes CSV structure is trusted after header validation.
 */
export const isMeasurementsCSV = (row: Record<string, string>): row is MeasurementsCSV => {
  return REQUIRED_COLUMNS.every((column) => column in row);
};

// =========================
// Kvantum Status Validation
// =========================

/**
 * Valid Kvantum status values.
 */
export const VALID_KVANTUM_STATUS = ['Målt', 'Estimeret', 'A04', 'A03'] as const;

/**
 * Checks if a status is a valid Kvantum status.
 */
export const validateKvantumStatus = (status: string): boolean => {
  return VALID_KVANTUM_STATUS.includes(status as (typeof VALID_KVANTUM_STATUS)[number]);
};

// ===================================
// Completeness Validation (DST-aware)
// ===================================

/**
 * Returns the expected number of intervals for a given day and interval size, considering DST in Europe/Copenhagen.
 */
export function getExpectedCountForInterval(day: string, intervalMinutes: number | undefined): number | undefined {
  if (!intervalMinutes) return undefined;
  // Parse the day string as local time in Europe/Copenhagen
  const start = dayjs.tz(day + 'T00:00:00', danishTimeZoneIdentifier);
  const end = start.add(1, 'day');
  const diffMinutes = end.diff(start, 'minute');
  return diffMinutes / intervalMinutes;
}

/**
 * Validates completeness for each day in the map, using getExpectedCountForInterval.
 */
export function validateDayCompleteness(
  dayMap: Record<string, Date[]>,
  intervalMinutes: number | undefined,
): CsvError | undefined {
  const incompleteDays = [];
  const dayCompleteness: Record<string, boolean> = {};
  for (const [day, dates] of Object.entries(dayMap)) {
    const expected = getExpectedCountForInterval(day, intervalMinutes);
    if (expected) {
      dayCompleteness[day] = dates.length >= expected;
      if (!dayCompleteness[day]) {
        incompleteDays.push({ row: 0, message: `Incomplete data for ${day}: only ${dates.length} intervals, expected at least ${expected}` });
      }
    }
  }
  return incompleteDays.length > 0 ? { key: 'CSV_ERROR_INCOMPLETE_DAY'} : undefined;
}
