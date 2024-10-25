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
