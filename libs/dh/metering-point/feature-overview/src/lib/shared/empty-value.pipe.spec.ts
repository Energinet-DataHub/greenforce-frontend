/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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

import { EmptyValuePipe, pipeName, TValue } from './empty-value.pipe';
import { emDash } from './em-dash';

describe(EmptyValuePipe.name, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: EmptyValuePipe,
      pipeName,
      value: undefined,
    });
  });

  let harness: SpectacularPipeHarness<TValue>;

  it(`returns ${emDash} when value is \`undefined\``, () => {
    harness.value = undefined;

    expect(harness.text).toBe(emDash);
  });

  it(`returns ${emDash} when value is \`null\``, () => {
    harness.value = null;

    expect(harness.text).toBe(emDash);
  });

  it(`returns ${emDash} when value is an empty string`, () => {
    harness.value = '';

    expect(harness.text).toBe(emDash);
  });

  it(`returns the same value when value is defined`, () => {
    harness.value = 'TEST';

    expect(harness.text).toBe('TEST');
  });

  it(`returns a fallback value when fallback is defined`, () => {
    harness.value = 'TEST';
    const fallback = 'FALLBACK';

    harness.template = `{{ value | ${pipeName}: '${fallback}' }}`;

    expect(harness.text).toBe(fallback);
  });
});
