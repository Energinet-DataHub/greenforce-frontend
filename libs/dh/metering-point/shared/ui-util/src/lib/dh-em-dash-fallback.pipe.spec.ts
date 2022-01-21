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
import {
  createPipeHarness,
  SpectacularPipeHarness,
} from '@ngworker/spectacular';

import {
  DhEmDashFallbackPipe,
  pipeName,
  TValue,
} from './dh-em-dash-fallback.pipe';
import { emDash } from './em-dash';

describe(DhEmDashFallbackPipe.name, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: DhEmDashFallbackPipe,
      pipeName,
      value: undefined,
    });
  });

  let harness: SpectacularPipeHarness<TValue>;

  it(`displays ${emDash} when value is \`undefined\``, () => {
    harness.value = undefined;

    expect(harness.text).toBe(emDash);
  });

  it(`displays ${emDash} when value is \`null\``, () => {
    harness.value = null;

    expect(harness.text).toBe(emDash);
  });

  it(`displays ${emDash} when value is an empty string`, () => {
    harness.value = '';

    expect(harness.text).toBe(emDash);
  });

  it(`displays value when value is a string`, () => {
    harness.value = 'TEST';

    expect(harness.text).toBe('TEST');
  });

  it(`displays value when value is a number`, () => {
    harness.value = 4;

    expect(harness.text).toBe('4');
  });
});
