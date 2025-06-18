import { dayjs } from '@energinet-datahub/watt/date';
import { MeasurementsCSV } from './types';

/**
 * Parses date strings in multiple formats and returns a local ISO string (not UTC).
 */
export function parseFlexibleDate(dateString?: string): string | undefined {
  if (!dateString) return undefined;

  const formats = [
    'D.M.YYYY H.mm', // 28.4.2025 0.00
    'DD.MM.YYYY H.mm', // 28.04.2025 0.00
    'YYYY-MM-DD H.mm', // 2025-04-28 0.15
    'YYYY-M-D H.mm', // 2025-4-28 0.15
    'D.M.YYYY HH.mm', // 28.4.2025 00.00
    'DD.MM.YYYY HH.mm', // 28.04.2025 00.00
    'YYYY-MM-DD HH.mm', // 2025-04-28 00.15
  ];

  const parsed = dayjs(dateString, formats);
  if (parsed.isValid()) {
    return parsed.format('YYYY-MM-DDTHH:mm:ss.SSS');
  }

  console.warn('Could not parse date format:', dateString);
  return undefined;
}

/**
 * Parses a date string and returns the day (YYYY-MM-DD) and a Date object.
 */
export function parseDayAndMinute(dateString: string): { day: string; date: Date } | null {
  const iso = parseFlexibleDate(dateString);
  if (!iso) return null;
  const date = new Date(iso);
  // Day as YYYY-MM-DD in local time
  const day = date.getFullYear().toString().padStart(4, '0') + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
  return { day, date };
}

/**
 * Detects the minimum positive interval in minutes between sorted date objects.
 */
export function detectInterval(dates: Date[]): number | undefined {
  if (dates.length < 2) return undefined;
  let minDiff: number | undefined;
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i].getTime() - dates[i - 1].getTime()) / 60000;
    if (diff > 0 && (!minDiff || diff < minDiff)) minDiff = diff;
  }
  return minDiff;
}

/**
 * Convenience function for grouped date arrays (e.g., day maps).
 * Finds the interval in minutes for the first day with more than one date.
 */
export function findIntervalMinutes(dayMap: Record<string, Date[]>): number | undefined {
  for (const dates of Object.values(dayMap)) {
    if (dates.length > 1) {
      // Assume dates are already in order for performance
      const interval = detectInterval(dates);
      if (interval) return interval;
    }
  }
  return undefined;
}

/**
 * Groups an array of MeasurementsCSV rows by their day (YYYY-MM-DD), returning a map from day to array of Date objects.
 */
export function groupRowsByDay(validRows: MeasurementsCSV[]): Record<string, Date[]> {
  const dayMap: Record<string, Date[]> = {};
  validRows.forEach((row) => {
    const parsed = parseDayAndMinute(row.Periode);
    if (parsed) {
      if (!dayMap[parsed.day]) dayMap[parsed.day] = [];
      dayMap[parsed.day].push(parsed.date);
    }
  });
  return dayMap;
}
