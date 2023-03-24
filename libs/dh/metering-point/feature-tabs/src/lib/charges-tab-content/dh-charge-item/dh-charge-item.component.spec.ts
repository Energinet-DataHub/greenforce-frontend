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
import { render, screen } from '@testing-library/angular';
import { ChargeLinkV1Dto, ChargeType } from '@energinet-datahub/dh/shared/domain';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import { DhChargeItemComponent, DhChargeItemScam } from './dh-charge-item.component';

const testData: ChargeLinkV1Dto[] = [
  {
    chargeType: ChargeType.D01,
    quantity: 1,
    startDate: '2020-01-01T00:00:00Z',
    endDate: '2020-03-01T00:00:00Z',
    taxIndicator: true,
    transparentInvoicing: true,
    chargeId: '123',
    chargeName: 'entotre',
    chargeOwner: 'owner',
    chargeOwnerName: 'ownerName',
  },
];

describe(DhChargeItemComponent.name, () => {
  async function setup(charges: Array<ChargeLinkV1Dto>, title?: string) {
    const { fixture } = await render(DhChargeItemComponent, {
      componentProperties: {
        charges: charges,
        title: title,
      },
      imports: [getTranslocoTestingModule(), DhChargeItemScam],
    });

    runOnPushChangeDetection(fixture);
  }

  it(`Given charges data is empty,
    Then empty state is displayed`, async () => {
    await setup([]);

    const heading = screen.getByRole('heading', { level: 5 });

    expect(heading).toBeInTheDocument();
  });

  it(`Given start and end date a date period is shown`, async () => {
    await setup(testData);

    const dateCellFrom = screen.getByTestId('date-cell-from', {
      suggest: false,
    });
    const dateCellTo = screen.getByTestId('date-cell-to', { suggest: false });

    expect(dateCellFrom.textContent?.trim()).toBe('01-01-2020');
    expect(dateCellTo.textContent?.trim()).toBe('01-03-2020');
  });

  it(`Given title is shown in UI even though no data for charges is present`, async () => {
    const expectedTitle = 'testTitle';
    await setup([], expectedTitle);

    const title = screen.getByRole('heading', { level: 4 });

    expect(title.textContent?.trim()).toBe(expectedTitle);
  });

  it(`Tax is present in table if taxIndicator is true`, async () => {
    await setup(testData);

    const actual = screen.getByTestId('tax-cell', { suggest: false });

    const expected = enTranslations.charges.taxIndicator;

    expect(actual.textContent?.trim()).toBe(expected);
  });

  it(`Tax is not present in table if taxIndicator is false`, async () => {
    const testDataClone = [...testData];

    testDataClone[0].taxIndicator = false;
    await setup(testDataClone);

    const actual = screen.queryByTestId('tax-cell', { suggest: false });

    expect(actual).toBe(null);
  });

  it(`Invoicing is present in table if transparentInvoicing is true`, async () => {
    await setup(testData);

    const actual = screen.getByTestId('invoicing-cell', { suggest: false });

    const expected = enTranslations.charges.transparentInvoicing;

    expect(actual.textContent?.trim()).toBe(expected);
  });

  it(`Invoicing is not present in table if transparentInvoicing is false`, async () => {
    const testDataClone = [...testData];

    testDataClone[0].transparentInvoicing = false;
    await setup(testDataClone);

    const actual = screen.queryByTestId('invoicing-cell', { suggest: false });

    expect(actual).toBe(null);
  });
});
