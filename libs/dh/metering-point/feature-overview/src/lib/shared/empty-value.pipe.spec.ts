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
