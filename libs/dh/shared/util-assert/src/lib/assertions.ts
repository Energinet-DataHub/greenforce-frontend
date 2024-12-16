/** Asserts that the given condition is true */
export function assert(condition: unknown): asserts condition {
  if (condition === false) throw new Error('Assertion failed');
}

/** Asserts that the given value is defined (not null or undefined) */
export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`Expected 'value' to be defined, but received ${value}`);
  }
}
