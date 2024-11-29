import { type OperatorFunction, filter } from 'rxjs';

// Custom type to make the specified key of T non-nullable
type NonNullableProperty<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};

/**
 * Filters out values with a nullable property while modifying the downstream type.
 */
export function keyExists<T, K extends keyof T>(
  key: K
): OperatorFunction<T, NonNullableProperty<T, K>> {
  return filter(
    (value: T): value is NonNullableProperty<T, K> =>
      value[key] !== undefined && value[key] !== null
  );
}
