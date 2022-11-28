import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DanishLocaleModule } from '@energinet-datahub/gf/configuration-danish-locale';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { render } from '@testing-library/angular';
import {
  DhChargesCreatePricesComponent,
  DhChargesCreatePricesScam,
} from './dh-charges-create-prices.component';

describe(DhChargesCreatePricesComponent.name, () => {
  async function setup() {
    const { fixture } = await render(DhChargesCreatePricesComponent, {
      imports: [
        getTranslocoTestingModule(),
        WattDanishDatetimeModule.forRoot(),
        DanishLocaleModule,
        DhChargesCreatePricesScam,
      ],
    });

    return {
      fixture,
    };
  }

  it('should work', async () => {
    await setup();
    expect(true).toBe(true);
  });
});
