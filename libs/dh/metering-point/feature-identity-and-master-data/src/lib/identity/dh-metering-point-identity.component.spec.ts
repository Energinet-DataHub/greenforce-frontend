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

import {
  MeteringPointCimDto,
  ReadingOccurrence,
  SettlementMethod,
} from '@energinet-datahub/dh/shared/domain';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  DhMeteringPointIdentityComponent,
  DhMeteringPointIdentityScam,
} from './dh-metering-point-identity.component';

import { getByGsrnResponse as identityData } from 'libs/dh/shared/data-access-msw/src/lib/mocks/metering-point';

const {
  meteringPointTypeCode,
  meteringPointSubTypeCode,
  physicalStatusCode,
  settlementMethodCode,
  readingOccurrenceCode,
} = enTranslations.meteringPoint;

const testId = {
  supplyStart: 'dh-metering-point-identity-text-field-supply-start',
  actualAddress: 'dh-metering-point-identity-text-field-isActualAddress',
};

describe(DhMeteringPointIdentityComponent.name, () => {
  async function setup(testData?: MeteringPointCimDto) {
    const { fixture } = await render(DhMeteringPointIdentityComponent, {
      componentProperties: {
        identityData,
        ...testData,
      },
      imports: [DhMeteringPointIdentityScam, getTranslocoTestingModule()],
    });

    runOnPushChangeDetection(fixture);
  }

  describe('metering point connectionstate', () => {
    test('connectionstate is displayed when it has a valid value', async () => {
      await setup({ connectionState: 'D02' } as MeteringPointCimDto);

      const connectionState = physicalStatusCode[identityData.connectionState];

      expect(connectionState).toBeVisible;
    });
  });

  describe('metering method', () => {
    test('metering method is displayed when it has a valid value', async () => {
      await setup({ meteringMethod: 'D02' } as MeteringPointCimDto);

      const meteringMethod =
        meteringPointSubTypeCode[identityData.meteringMethod];

      expect(meteringMethod).toBeVisible;
    });
  });

  describe('metering point type', () => {
    test('metering point type is displayed when it has a valid value', async () => {
      await setup({ meteringPointType: 'D02' } as MeteringPointCimDto);

      const meteringPointType =
        meteringPointTypeCode[identityData.meteringPointType];

      expect(meteringPointType).toBeVisible;
    });
  });

  describe('settlement method', () => {
    test('settlement method is displayed when it has a valid value', async () => {
      await setup({ settlementMethod: 'D01' } as MeteringPointCimDto);

      const settlementMethod =
        settlementMethodCode[identityData.settlementMethod as SettlementMethod];

      expect(settlementMethod).toBeVisible;
    });

    test('settlement method is not displayed when the value is null', async () => {
      await setup({ settlementMethod: null } as MeteringPointCimDto);

      const settlementMethod =
        settlementMethodCode[identityData.settlementMethod as SettlementMethod];

      expect(settlementMethod).toNotBeVisible;
    });
  });

  describe('reading occurrence', () => {
    test('reading occurrence is displayed when it has a valid value', async () => {
      await setup();

      const readingOccurrence =
        readingOccurrenceCode[
          identityData.readingOccurrence as ReadingOccurrence
        ];

      expect(readingOccurrence).toBeVisible;
    });
  });

  describe('supply start', () => {
    test('supply start is displayed when it has a valid value', async () => {
      await setup({
        supplyStart: '2021-09-25T22:00:00Z',
      } as MeteringPointCimDto);

      const supplyStart = screen.getByTestId(testId.supplyStart);

      expect(supplyStart).toBeVisible;
    });

    test('supply start is not displayed when the value is null', async () => {
      await setup({ supplyStart: null } as MeteringPointCimDto);

      const supplyStart = screen.getByTestId(testId.supplyStart);

      expect(supplyStart).toNotBeVisible;
    });
  });

  describe('is actual address', () => {
    test('actual address is displayed when it vaule is false', async () => {
      await setup({ isActualAddress: false } as MeteringPointCimDto);

      const actualAddress = screen.getByTestId(testId.actualAddress);

      expect(actualAddress).toBeVisible;
    });

    test('supply start is not displayed when the value is null', async () => {
      await setup({ supplyStart: null } as MeteringPointCimDto);

      const actualAddress = screen.getByTestId(testId.actualAddress);

      expect(actualAddress).toNotBeVisible;
    });
  });
});
