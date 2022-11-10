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

import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/domain';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import {
  DhMeteringPointIdentityComponent,
  DhMeteringPointIdentityScam,
} from './dh-metering-point-identity.component';

import { getByGsrnResponse as identityData } from 'libs/dh/shared/data-access-msw/src/lib/mocks/metering-point';
import { getByTitle } from '@energinet-datahub/dh/shared/test-util-metering-point';

const {
  overview: {
    settlementMethod,
    readingOccurrence,
    meteringMethod,
    primaryMasterData: {
      meterNumber,
      address,
      hasElectricitySupplier,
      actualAddress,
      notActualAddress,
    },
  },
  settlementMethodCode,
  meteringPointSubTypeCode,
  physicalStatusCode,
  readingOccurrenceCode,
} = enTranslations.meteringPoint;

describe(DhMeteringPointIdentityComponent.name, () => {
  async function setup(testData?: MeteringPointCimDto) {
    const { fixture } = await render(DhMeteringPointIdentityComponent, {
      componentProperties: {
        identityData: {
          ...identityData,
          ...testData,
        } as MeteringPointCimDto,
      },

      imports: [DhMeteringPointIdentityScam, getTranslocoTestingModule()],
    });

    return fixture.componentInstance.identityDetails;
  }

  describe('connectionstate test', () => {
    test('connectionstate is displayed when it has a valid value', async () => {
      await setup({ connectionState: 'D02' } as MeteringPointCimDto);

      expect(screen.queryByText(physicalStatusCode['D02'])).toBeInTheDocument();
    });
  });

  describe('metering method test', () => {
    test('metering method text is displayed when it has a valid value', async () => {
      await setup({ meteringMethod: 'D02' } as MeteringPointCimDto);

      expect(getByTitle(meteringMethod)).toHaveTextContent(
        meteringPointSubTypeCode['D02']
      );
    });
  });

  describe('settlement method test', () => {
    test('settlement method is displayed when it has a valid value', async () => {
      await setup({ settlementMethod: 'D01' } as MeteringPointCimDto);

      expect(getByTitle(settlementMethod)).toHaveTextContent(
        settlementMethodCode['D01']
      );
    });

    test('settlement method is not displayed when it has value null', async () => {
      await setup({ settlementMethod: null } as MeteringPointCimDto);

      expect(getByTitle(settlementMethod)).not.toBeInTheDocument();
    });
  });

  describe('reading occurrence test', () => {
    test('reading occurrence is displayed when it has a valid value', async () => {
      await setup({ readingOccurrence: 'P1Y' } as MeteringPointCimDto);

      expect(getByTitle(readingOccurrence)).toHaveTextContent(
        readingOccurrenceCode['P1Y']
      );
    });
  });

  describe('meter id test', () => {
    test('meter id is displayed when it has a valid value', async () => {
      await setup({ meterId: '123456' } as MeteringPointCimDto);

      expect(getByTitle(meterNumber)).toHaveTextContent('123456');
    });

    test('meter id is not displayed when it has value null', async () => {
      await setup({ meterId: null } as MeteringPointCimDto);

      expect(getByTitle(meterNumber)).not.toBeInTheDocument();
    });
  });

  describe('address test', () => {
    test('address is displayed when it has vaild values', async () => {
      await setup({
        streetName: 'Nørre Lysgade',
        postalCode: '4545',
        cityName: 'Fiktivby',
      } as MeteringPointCimDto);

      expect(getByTitle(address)).toBeInTheDocument();
    });
  });

  describe('supply start test', () => {
    test('supply start is displayed when it has a valid value', async () => {
      await setup({
        supplyStart: '2021-09-25T22:00:00Z',
      } as MeteringPointCimDto);

      expect(getByTitle(hasElectricitySupplier)).toHaveTextContent(
        'Since 26-09-2021'
      );
    });

    test('supply start is not displayed when the value is null', async () => {
      await setup({ supplyStart: null } as MeteringPointCimDto);

      expect(getByTitle(hasElectricitySupplier)).not.toBeInTheDocument();
    });
  });

  describe('is actual address test', () => {
    test('actual address is displayed when it vaule is false', async () => {
      await setup({ isActualAddress: false } as MeteringPointCimDto);
      expect(getByTitle(actualAddress)).toHaveTextContent(notActualAddress);
    });

    test('actual address is not displayed when the value is true', async () => {
      await setup({ isActualAddress: true } as MeteringPointCimDto);
      expect(getByTitle(actualAddress)).not.toBeInTheDocument();
    });

    test('actual address is not displayed when the value is undefined', async () => {
      await setup({ isActualAddress: undefined } as MeteringPointCimDto);
      expect(getByTitle(actualAddress)).not.toBeInTheDocument();
    });
  });
});
