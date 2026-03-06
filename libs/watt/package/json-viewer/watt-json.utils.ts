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
