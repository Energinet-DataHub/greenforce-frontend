import {
  ConnectionState,
  MeteringMethod,
  MeteringPointCimDto,
  MeteringPointType,
  ReadingOccurrence,
  SettlementMethod,
} from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { render, screen } from '@testing-library/angular';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

import {
  DhMeteringPointIdentityComponent,
  DhMeteringPointIdentityScam,
} from './dh-metering-point-identity.component';
import { emDash } from './em-dash';

describe(DhMeteringPointIdentityComponent.name, () => {
  async function setup(meteringPoint: MeteringPointCimDto) {
    await render(DhMeteringPointIdentityComponent, {
      componentProperties: {
        meteringPoint,
      },
      imports: [DhMeteringPointIdentityScam, getTranslocoTestingModule()],
    });
  }

  const meteringPointId = '575391908025497398';

  describe('metering point type', () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('is displayed when it has a valid value', async () => {
      const meteringPointType: MeteringPointType = 'E17';

      const meteringPoint: Partial<MeteringPointCimDto> = {
        meteringPointType,
      };

      await setup(meteringPoint);

      const actualMeteringPointType = screen.getByTitle(
        enTranslations.meteringPoint.overview.meteringPointType
      );

      const expectedMeteringPointType =
        enTranslations.meteringPoint.meteringPointTypeCode[meteringPointType];

      expect(actualMeteringPointType.textContent).toContain(
        expectedMeteringPointType
      );
    });

    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('displays a fallback when the value is missing', async () => {
      const meteringPoint: Partial<MeteringPointCimDto> = {
        meteringPointType: undefined,
      };

      await setup(meteringPoint);

      const actualMeteringPointType = screen.getByTitle(
        enTranslations.meteringPoint.overview.meteringPointType
      );

      expect(actualMeteringPointType.textContent).toBe(emDash);
    });
  });

  describe('metering method', () => {
    it('is displayed when it has a valid value', async () => {
      const meteringMethod: MeteringMethod = 'D01';

      const meteringPoint: Partial<MeteringPointCimDto> = {
        meteringMethod,
      };

      await setup(meteringPoint);

      const actualMeteringMethod = screen.getByTitle(
        enTranslations.meteringPoint.overview.meteringMethod
      );

      const expectedMeteringMethod =
        enTranslations.meteringPoint.meteringPointSubTypeCode[meteringMethod];

      expect(actualMeteringMethod.textContent).toContain(
        expectedMeteringMethod
      );
    });

    it('displays a fallback when the value is missing', async () => {
      const meteringPoint: Partial<MeteringPointCimDto> = {
        meteringMethod: undefined,
      };

      await setup(meteringPoint);

      const actualMeteringMethod = screen.getByTitle(
        enTranslations.meteringPoint.overview.meteringMethod
      );

      expect(actualMeteringMethod.textContent).toBe(emDash);
    });
  });

  describe('metering point id', () => {
    it('is displayed when it has a value', async () => {
      const meteringPoint: Partial<MeteringPointCimDto> = {
        gsrnNumber: meteringPointId,
      };

      await setup(meteringPoint);

      const heading = screen.getByRole('heading', { level: 1 });

      expect(heading.textContent).toContain(meteringPointId);
    });
  });

  describe('metering point status', () => {
    it('is displayed when it has a valid value', async () => {
      const connectionState: ConnectionState = 'D03';

      const meteringPoint: Partial<MeteringPointCimDto> = {
        connectionState,
      };

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

    it('displays a fallback when the value is missing', async () => {
      const meteringPoint: Partial<MeteringPointCimDto> = {
        connectionState: undefined,
      };

      await setup(meteringPoint);

      const actualConnectionState = screen.getByTitle(
        enTranslations.meteringPoint.overview.connectionState
      );

      expect(actualConnectionState.textContent).toBe(emDash);
    });
  });

  describe('settlement method', () => {
    it('is displayed when it has a valid value', async () => {
      const settlementMethod: SettlementMethod = 'D01';

      const meteringPoint: Partial<MeteringPointCimDto> = {
        settlementMethod,
      };

      await setup(meteringPoint);

      const actualSettlementMethod = screen.getByTitle(
        enTranslations.meteringPoint.overview.settlementMethod
      );

      const expectedSettlementMethod =
        enTranslations.meteringPoint.settlementMethodCode[settlementMethod];

      expect(actualSettlementMethod.textContent).toContain(
        expectedSettlementMethod
      );
    });

    it('is NOT displayed when the value is missing', async () => {
      const meteringPoint: Partial<MeteringPointCimDto> = {
        settlementMethod: undefined,
      };

      await setup(meteringPoint);

      expect(() =>
        screen.getByTitle(
          enTranslations.meteringPoint.overview.settlementMethod
        )
      ).toThrowError();
    });
  });

  describe('reading occurrence', () => {
    it('is displayed when it has a valid value', async () => {
      const readingOccurrence: ReadingOccurrence = 'PT1H';

      const meteringPoint: Partial<MeteringPointCimDto> = {
        readingOccurrence,
      };

      await setup(meteringPoint);

      const actualReadingOccurrence = screen.getByTitle(
        enTranslations.meteringPoint.overview.readingOccurrence
      );

      const expectedReadingOccurrence =
        enTranslations.meteringPoint.readingOccurrenceCode[readingOccurrence];

      expect(actualReadingOccurrence.textContent).toContain(
        expectedReadingOccurrence
      );
    });

    it('is NOT displayed when the value is missing', async () => {
      const meteringPoint: Partial<MeteringPointCimDto> = {
        readingOccurrence: undefined,
      };

      await setup(meteringPoint);

      expect(() =>
        screen.getByTitle(
          enTranslations.meteringPoint.overview.readingOccurrence
        )
      ).toThrowError();
    });
  });
});
