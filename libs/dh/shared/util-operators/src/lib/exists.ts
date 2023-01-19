import { type OperatorFunction, filter } from 'rxjs';

/**
 * Filters out undefined and null values while modifying the downstream type.
 */
export function exists<T>(): OperatorFunction<T | undefined | null, T> {
  return filter(
    (value: T | undefined | null): value is T =>
      !value !== undefined && value !== null
  );
}
