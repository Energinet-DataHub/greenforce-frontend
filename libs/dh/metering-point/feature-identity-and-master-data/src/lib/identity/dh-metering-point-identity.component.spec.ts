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
    },
  },
  physicalStatusCode,
} = enTranslations.meteringPoint;

const getByTitle = (title: string) =>
  screen.queryByTitle(title, { suggest: false });

describe(DhMeteringPointIdentityComponent.name, () => {
  async function setup(testData: MeteringPointCimDto) {
    const { fixture } = await render(DhMeteringPointIdentityComponent, {
      componentProperties: {
        identityDetails: {
          ...identityData,
          ...testData,
        } as MeteringPointCimDto,
      },

      imports: [DhMeteringPointIdentityScam, getTranslocoTestingModule()],
    });

    return fixture.componentInstance.identityDetails;
  }

  describe('connectionstate test', () => {
    test('connectionstate is displayed when it has a valid value', () => {
      setup({ connectionState: 'D03' } as MeteringPointCimDto).then(
        ({ connectionState }) =>
          expect(
            screen.queryByText(physicalStatusCode[connectionState])
          ).toBeInTheDocument()
      );
    });
  });

  describe('metering method test', () => {
    test('metering method text is displayed when it has a valid value', () => {
      setup({ meteringMethod: 'D02' } as MeteringPointCimDto).then(() => {
        expect(getByTitle(meteringMethod)).toBeInTheDocument();
      });
    });
  });

  describe('settlement method test', () => {
    test('settlement method is displayed when it has a valid value', () => {
      setup({ settlementMethod: 'D01' } as MeteringPointCimDto).then(() =>
        expect(getByTitle(settlementMethod)).toBeInTheDocument()
      );
    });

    test('settlement method is displayed when it has a valid value', () => {
      setup({ settlementMethod: null } as MeteringPointCimDto).then(() =>
        expect(getByTitle(settlementMethod)).not.toBeInTheDocument()
      );
    });
  });

  describe('reading occurrence test', () => {
    test('reading occurrence is displayed when it has a valid value', () => {
      setup({ readingOccurrence: 'P1Y' } as MeteringPointCimDto).then(() => {
        expect(getByTitle(readingOccurrence));
      });
    });
  });

  describe('meter id test', () => {
    test('meter id is displayed when it has a valid value', () => {
      setup({ meterId: '123456' } as MeteringPointCimDto).then(
        ({ meterId }) => {
          expect(getByTitle(meterNumber)).toHaveTextContent(meterId as string);
        }
      );
    });

    test('meter id is not displayed when it has value null', () => {
      setup({ meterId: null } as MeteringPointCimDto).then(() =>
        expect(getByTitle(meterNumber)).not.toBeInTheDocument()
      );
    });
  });

  describe('address test', () => {
    test('address is displayed when it has vaild values', async () => {
      await setup({
        streetName: 'Nørre Lysgade',
        postalCode: '4545',
        cityName: 'Fiktivby',
      } as MeteringPointCimDto).then(() =>
        expect(getByTitle(address)).toBeInTheDocument()
      );
    });
  });

  describe('supply start test', () => {
    test('supply start is displayed when it has a valid value', async () => {
      await setup({
        supplyStart: '2021-09-25T22:00:00Z',
      } as MeteringPointCimDto);
      expect(getByTitle(hasElectricitySupplier)).toBeInTheDocument();
    });

    test('supply start is not displayed when the value is null', async () => {
      await setup({ supplyStart: null } as MeteringPointCimDto).then(() =>
        expect(getByTitle(hasElectricitySupplier)).not.toBeInTheDocument()
      );
    });
  });

  describe('is actual address test', () => {
    test('actual address is displayed when it vaule is false', async () => {
      await setup({ isActualAddress: false } as MeteringPointCimDto).then(() =>
        expect(getByTitle(actualAddress)).toBeInTheDocument()
      );
    });

    test('actual address is not displayed when the value is true', async () => {
      await setup({ isActualAddress: true } as MeteringPointCimDto).then(() =>
        expect(getByTitle(actualAddress)).not.toBeInTheDocument()
      );
    });

    test('actual address is not displayed when the value is undefined', async () => {
      await setup({ isActualAddress: undefined } as MeteringPointCimDto).then(
        () => expect(getByTitle(actualAddress)).not.toBeInTheDocument()
      );
    });
  });
});
