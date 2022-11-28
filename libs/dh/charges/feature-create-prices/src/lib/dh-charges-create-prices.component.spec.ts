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
