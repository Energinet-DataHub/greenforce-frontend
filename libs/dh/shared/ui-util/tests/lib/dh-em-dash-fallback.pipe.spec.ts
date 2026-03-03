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
import { DhEmDashFallbackPipe } from './dh-em-dash-fallback.pipe';
import { emDash } from './em-dash';

describe(DhEmDashFallbackPipe, () => {
  const dashFallbackPipe = new DhEmDashFallbackPipe();

  it(`displays ${emDash} when value is \`undefined\``, () => {
    expect(dashFallbackPipe.transform(undefined)).toBe(emDash);
  });

  it(`displays ${emDash} when value is \`null\``, () => {
    expect(dashFallbackPipe.transform(null)).toBe(emDash);
  });

  it(`displays ${emDash} when value is an empty string`, () => {
    expect(dashFallbackPipe.transform('')).toBe(emDash);
  });

  it(`displays value when value is a string`, () => {
    expect(dashFallbackPipe.transform('TEST')).toBe('TEST');
  });

  it(`displays value when value is a number`, () => {
    expect(dashFallbackPipe.transform(4)).toBe(4);
  });
});
