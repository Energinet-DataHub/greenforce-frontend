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
export enum DisplayLanguage {
  Danish = 'da',
  English = 'en',
}

export function assertDisplayLanguage(language: string): asserts language is DisplayLanguage {
  if (!displayLanguages.includes(language as DisplayLanguage)) {
    throw new Error(`Unknown display language: ${language}`);
  }
}

/**
 *
 * @throws {Error} if the specified language is an unknown display language.
 */
export function toDisplayLanguage(language: string): DisplayLanguage {
  assertDisplayLanguage(language);

  return language;
}

export const displayLanguages: readonly DisplayLanguage[] = Object.values(DisplayLanguage);
