/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { MatcherOptions } from '@testing-library/dom';

import {
  ConnectionState,
  MeteringMethod,
  MeteringPointCimDto,
  MeteringPointType,
  ReadingOccurrence,
  SettlementMethod,
} from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  DhMeteringPointIdentityComponent,
  DhMeteringPointIdentityScam,
} from './dh-metering-point-identity.component';
import { emDash } from './em-dash';

describe(DhMeteringPointIdentityComponent.name, () => {
  async function setup(meteringPoint: MeteringPointCimDto) {
    const { fixture } = await render(DhMeteringPointIdentityComponent, {
      componentProperties: {
        meteringPoint,
      },
      imports: [DhMeteringPointIdentityScam, getTranslocoTestingModule()],
    });

    runOnPushChangeDetection(fixture);
  }

  const meteringPointId = '575391908025497398';

  describe('metering point type', () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('is displayed when it has a valid value', async () => {
      const meteringPointType: MeteringPointType = 'E17';

      const meteringPoint: MeteringPointCimDto = {
        meteringPointType,
      } as MeteringPointCimDto;

      await setup(meteringPoint);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualMeteringPointType = screen.getByTitle(
        enTranslations.meteringPoint.overview.meteringPointType,
        disableQuerySuggestions
      );

      const expectedMeteringPointType =
        enTranslations.meteringPoint.meteringPointTypeCode[meteringPointType];

      expect(actualMeteringPointType.textContent).toContain(
        expectedMeteringPointType
      );
    });
  });

  describe('metering method', () => {
    it('is displayed when it has a valid value', async () => {
      const meteringMethod: MeteringMethod = 'D01';

      const meteringPoint: MeteringPointCimDto = {
        meteringMethod,
      } as MeteringPointCimDto;

      await setup(meteringPoint);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualMeteringMethod = screen.getByTitle(
        enTranslations.meteringPoint.overview.meteringMethod,
        disableQuerySuggestions
      );

      const expectedMeteringMethod =
        enTranslations.meteringPoint.meteringPointSubTypeCode[meteringMethod];

      expect(actualMeteringMethod.textContent).toContain(
        expectedMeteringMethod
      );
    });
  });

  describe('metering point status', () => {
    it('is displayed when it has a valid value', async () => {
      const connectionState: ConnectionState = 'D03';

      const meteringPoint: MeteringPointCimDto = {
        connectionState,
      } as MeteringPointCimDto;

      await setup(meteringPoint);

      const actualConnectionState = screen.getByTitle(
        enTranslations.meteringPoint.overview.connectionState
      );

      const expectedConnectionState =
        enTranslations.meteringPoint.physicalStatusCode[connectionState];

      expect(actualConnectionState.textContent).toContain(
        expectedConnectionState
      );
    });
  });

  describe('settlement method', () => {
    it('is displayed when it has a valid value', async () => {
      const settlementMethod: SettlementMethod = 'D01';

      const meteringPoint: MeteringPointCimDto = {
        settlementMethod,
      } as MeteringPointCimDto;

      await setup(meteringPoint);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualSettlementMethod = screen.getByTitle(
        enTranslations.meteringPoint.overview.settlementMethod,
        disableQuerySuggestions
      );

      const expectedSettlementMethod =
        enTranslations.meteringPoint.settlementMethodCode[settlementMethod];

      expect(actualSettlementMethod.textContent).toContain(
        expectedSettlementMethod
      );
    });
  });

  describe('reading occurrence', () => {
    it('is displayed when it has a valid value', async () => {
      const readingOccurrence: ReadingOccurrence = 'PT1H';

      const meteringPoint: MeteringPointCimDto = {
        readingOccurrence,
      } as MeteringPointCimDto;

      await setup(meteringPoint);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualReadingOccurrence = screen.getByTitle(
        enTranslations.meteringPoint.overview.readingOccurrence,
        disableQuerySuggestions
      );

      const expectedReadingOccurrence =
        enTranslations.meteringPoint.readingOccurrenceCode[readingOccurrence];

      expect(actualReadingOccurrence.textContent).toContain(
        expectedReadingOccurrence
      );
    });
  });
});
