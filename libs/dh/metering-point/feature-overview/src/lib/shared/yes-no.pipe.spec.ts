import {
  createPipeHarness,
  SpectacularPipeHarness,
} from '@ngworker/spectacular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import { pipeName, YesNoPipe, TValue } from './yes-no.pipe';

describe(YesNoPipe.name, () => {
  beforeEach(() => {
    harness = createPipeHarness({
      pipe: YesNoPipe,
      pipeName,
      value: undefined,
      imports: [getTranslocoTestingModule()],
    });
  });

  let harness: SpectacularPipeHarness<TValue>;

  it('returns "No" when value is `undefined`', () => {
    harness.value = undefined;

    expect(harness.text).toBe(enTranslations.no);
  });

  it('returns "No" when value is `null`', () => {
    harness.value = null;

    expect(harness.text).toBe(enTranslations.no);
  });

  it('returns "No" when value is `false`', () => {
    harness.value = false;

    expect(harness.text).toBe(enTranslations.no);
  });

  it('returns "No" when value is empty string', () => {
    harness.value = '';

    expect(harness.text).toBe(enTranslations.no);
  });

  it('returns "Yes" when value is `true`', () => {
    harness.value = true;

    expect(harness.text).toBe(enTranslations.yes);
  });
});
