//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion

/** Compares two values. When deep is false, objects/arrays compare by type only. */
export function isEqual(a: unknown, b: unknown, { deep }: { deep: boolean }): boolean {
  try {
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return a === b;
    if (a === null || b === null) return a === b;
    const replacer = !deep ? (_: string, v: unknown) => (Array.isArray(v) ? [] : {}) : undefined;
    return JSON.stringify(a, replacer) === JSON.stringify(b, replacer);
  } catch {
    return a === b;
  }
}

/** Type guard that checks if a value is a non-empty array or object. */
export function isNonEmpty(value: unknown): value is Record<string, unknown> | unknown[] {
  return typeof value === 'object' && value !== null ? Object.keys(value).length > 0 : false;
}

/** Merges two arrays by alternating elements, preserving the order. */
export function interleave<T>(a: T[], b: T[]): T[] {
  return Array.from({ length: Math.max(a.length, b.length) })
    .flatMap((_, i) => [a[i], b[i]])
    .filter((k) => k !== undefined);
}

/** Truncates a string to maxLength, appending '…' if truncated. */
export function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, Math.max(maxLength - 1, 0)) + '…' : value;
}

/**
 * Generator that produces syntax-highlighted tokens for a JSON value.
 * Uses a character budget to limit output length, yielding tokens and
 * returning the remaining budget via the generator return value.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function* tokenize(
  value: unknown,
  budget: number
): Generator<{ kind: string; value: string }, number> {
  /** Creates a token and deducts its length from the budget. */
  const token = (kind: string, value: string) => {
    budget -= value.length;
    return { kind, value };
  };

  if (typeof value === 'string') yield token('string', JSON.stringify(truncate(value, budget)));
  else if (typeof value !== 'object') yield token(typeof value, String(value));
  else if (value === null) yield token('null', String(null));
  else {
    const [firstKey] = Object.keys(value);
    const isArray = Array.isArray(value);
    yield token('punctuation', isArray ? '[' : '{');

    for (const [key, child] of Object.entries(value)) {
      if (key !== firstKey) yield token('punctuation', ', ');
      if (budget <= 0) {
        yield token('punctuation', '…');
        break;
      }

      if (!isArray) {
        yield token('key', key);
        yield token('punctuation', ': ');
      }

      budget = yield* tokenize(child, budget);
    }

    yield token('punctuation', isArray ? ']' : '}');
  }

  return budget;
}
