import { render, screen } from '@testing-library/angular';
import { MatcherOptions } from '@testing-library/dom';
import {
  ChargeLinkDto,
  ChargeType,
} from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  DhChargeItemComponent,
  DhChargeItemScam,
} from './dh-charge-item.component';

const testData: ChargeLinkDto[] = [
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
  async function setup(charges: Array<ChargeLinkDto>) {
    const { fixture } = await render(DhChargeItemComponent, {
      componentProperties: {
        charges: charges,
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
});
