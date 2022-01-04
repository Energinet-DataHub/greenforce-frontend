import { render, screen } from '@testing-library/angular';

import { DhChargesComponent, DhChargesScam } from './dh-charges.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

describe(DhChargesComponent.name, () => {
  async function setup() {
    const { fixture } = await render(DhChargesComponent, {
      componentProperties: {},
      imports: [getTranslocoTestingModule(), DhChargesScam],
    });

    runOnPushChangeDetection(fixture);
  }

  it(`dummy test`, () => {
    expect(true).toBe(true);
  });
});
