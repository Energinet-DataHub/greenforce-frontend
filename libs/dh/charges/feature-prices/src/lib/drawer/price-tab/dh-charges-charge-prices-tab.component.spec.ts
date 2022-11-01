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
import { HttpClientModule } from '@angular/common/http';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { DhChargesChargePricesTabComponent } from './dh-charges-charge-prices-tab.component';
import { render, screen } from '@testing-library/angular';
import {
  ChargeType,
  Resolution,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

const charge = {
  id: '6AA831CF-14F8-41D5-8E08-26939172DFAA',
  chargeType: ChargeType.D02,
  resolution: Resolution.P1D,
  taxIndicator: false,
  transparentInvoicing: true,
  vatClassification: VatClassification.NoVat,
  validFromDateTime: '2021-09-29T22:00:00',
  validToDateTime: '2021-10-29T22:00:00',
  chargeId: 'chargeid01',
  chargeName: 'Net abo A høj Forbrug 3',
  chargeDescription: 'Net abo A høj Forbrug 2 beskrivelse',
  chargeOwner: '5790000681074',
  chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
  hasAnyPrices: false,
};

describe('DhChargesChargePricesTabComponent', () => {
  async function setup() {
    const { fixture } = await render(DhChargesChargePricesTabComponent, {
      imports: [
        getTranslocoTestingModule(),
        DhApiModule.forRoot(),
        HttpClientModule,
      ],
    });

    fixture.componentInstance.charge = charge;

    return {
      fixture,
    };
  }

  it('should create', async () => {
    const fixture = await setup();
    expect(fixture.fixture.componentInstance).toBeTruthy();
  });

  it('show messagen when charge has no prics at all', async () => {
    await setup();

    const titleMessage = screen.getByRole('heading', {
      name: new RegExp(enTranslations.charges.prices.noPricesForCharge),
    });

    const message = screen.getByText(
      enTranslations.charges.prices.noPricesForChargeText
    );

    expect(titleMessage).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
