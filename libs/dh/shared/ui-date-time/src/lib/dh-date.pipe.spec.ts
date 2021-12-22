import {
  createPipeHarness,
  SpectacularPipeHarness,
} from '@ngworker/spectacular';

import { DhDatePipe, pipeName, TValue } from './dh-date.pipe';

describe(DhDatePipe, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: DhDatePipe,
      pipeName: pipeName,
      value: undefined,
    });
  });

  let harness: SpectacularPipeHarness<TValue>;

  it('displays an empty string when value is `undefined`', () => {
    harness.value = undefined;

    expect(harness.text).toBe('');
  });

  it('displays an empty string when value is `null`', () => {
    harness.value = null;

    expect(harness.text).toBe('');
  });

  describe('Summer Time', () => {
    it('displays a formatted date', () => {
      harness.value = '2021-06-30T22:00:00Z';

      expect(harness.text).toBe('01-07-2021');
    });
  });

  describe('Standard Time', () => {
    it('displays a formatted date', () => {
      harness.value = '2021-12-31T23:00:00Z';

      expect(harness.text).toBe('01-01-2022');
    });
  });
});
