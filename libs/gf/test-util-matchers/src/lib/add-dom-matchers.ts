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
 * Add DOM matchers for testing.
 * Note: For Vitest, you may need to use @testing-library/jest-dom/vitest instead.
 */
export function addDomMatchers(): void {
  beforeAll(async () => {
    // Issue: node_modules/@types/testing-library__jest-dom/index.d.ts' is not a module.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('@testing-library/jest-dom');
  });
}
