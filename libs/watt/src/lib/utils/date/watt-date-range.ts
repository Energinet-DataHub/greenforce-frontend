export interface WattRange<T> {
  start: T;
  end: T | null;
}

/**
 * This is included for legacy reasons, components should return Date objects instead of strings.
 * @deprecated Avoid using strings as dates, use Date objects instead.
 */
export type WattDateRange = WattRange<string>;
