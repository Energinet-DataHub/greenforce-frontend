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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render, within } from '@testing-library/angular';

import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import {
  getByTerm,
  getDefinitonByTerm,
  queryByTerm,
  runOnPushChangeDetection,
} from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  DhMeteringPointPrimaryMasterDataComponent,
  DhMeteringPointPrimaryMasterDataScam,
  PrimaryMasterData,
} from './dh-metering-point-primary-master-data.component';
import { emDash } from '../identity/em-dash';

describe(DhMeteringPointPrimaryMasterDataComponent.name, () => {
  const fallbackValue = emDash;
  const testData: PrimaryMasterData = {
    meterId: '000',
    supplyStart: '2021-12-17T12:38:16.428Z',
    isActualAddress: true,
    locationDescription: 'some description',
    darReference: '8e58b34d-efe2-43aa-8143-80a7b2b0ef73',
    streetName: '[streetName]',
    buildingNumber: '[buildingNumber]',
    floorIdentification: '[floorIdentification]',
    suiteNumber: '[suiteNumber]',
    citySubDivisionName: '[citySubDivisionName]',
    postalCode: '[postalCode]',
    cityName: '[cityName]',
  };

  async function setup(primaryMasterData: PrimaryMasterData = { ...testData }) {
    const { fixture } = await render(
      DhMeteringPointPrimaryMasterDataComponent,
      {
        componentProperties: {
          primaryMasterData,
        },
        imports: [
          NoopAnimationsModule,
          getTranslocoTestingModule(),
          DhMeteringPointPrimaryMasterDataScam,
        ],
      }
    );

    await runOnPushChangeDetection(fixture);
  }

  describe('Address', () => {
    it('should render address term', async () => {
      await setup();
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.address
      );
      expect(term).toBeInTheDocument();
    });

    it('should show address with floor and suite number correctly', async () => {
      await setup();

      const term = queryByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.address
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition?.innerHTML).toEqual(
        '[streetName] [buildingNumber], [floorIdentification]. [suiteNumber]<br>[citySubDivisionName]<br>[postalCode] [cityName]'
      );
    });

    it('should show address without floor and suite number correctly', async () => {
      await setup({
        ...testData,
        floorIdentification: undefined,
        suiteNumber: undefined,
      });

      const term = queryByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.address
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition?.innerHTML).toEqual(
        '[streetName] [buildingNumber]<br>[citySubDivisionName]<br>[postalCode] [cityName]'
      );
    });

    it('should show fallback if streetname, buildingNumber, citySubDivisionName, postalCode and cityName are not provided', async () => {
      await setup({
        ...testData,
        streetName: undefined,
        buildingNumber: undefined,
        citySubDivisionName: undefined,
        postalCode: undefined,
        cityName: undefined,
      });

      const term = queryByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.address
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });
  });

  describe('Is actual address', () => {
    it('should render success icon, when actual address', async () => {
      await setup();
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.actualAddress
      );
      expect(term).toBeInTheDocument();
      within(term).getByRole('img', { name: 'success' });
    });

    it('should render actual address definition', async () => {
      await setup();

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.actualAddress
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        enTranslations.meteringPoint.overview.primaryMasterData.actualAddress
      );
    });

    it('should render warning icon, when not actual address', async () => {
      await setup({ ...testData, isActualAddress: false });
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.notActualAddress
      );
      expect(term).toBeInTheDocument();
      within(term).getByRole('img', { name: 'warning' });
    });

    it('should render not actual address', async () => {
      await setup({ ...testData, isActualAddress: false });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.notActualAddress
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        enTranslations.meteringPoint.overview.primaryMasterData.notActualAddress
      );
    });
  });

  describe('Location description', () => {
    it('should render location description term', async () => {
      await setup();
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .locationDescription
      );
      expect(term).toBeInTheDocument();
    });

    it('should render location description definition', async () => {
      await setup();

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .locationDescription
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        testData.locationDescription as string
      );
    });

    it('should render fallback definition, if location description is undefined', async () => {
      await setup({ ...testData, locationDescription: undefined });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .locationDescription
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });

    it('should render fallback definition, if location description is empty string', async () => {
      await setup({ ...testData, locationDescription: ' ' });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .locationDescription
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });
  });

  describe('Geo Info Reference', () => {
    it('should render geo info reference term', async () => {
      await setup();
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      expect(term).toBeInTheDocument();
    });

    it('should render geo info reference definition', async () => {
      await setup();

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(testData.darReference as string);
    });

    it('should render fallback definition, if geo info reference is undefined', async () => {
      await setup({ ...testData, darReference: undefined });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });

    it('should render fallback definition, if geo info reference is null', async () => {
      await setup({ ...testData, darReference: null });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });

    it('should render fallback definition, if geo info reference is empty string', async () => {
      await setup({ ...testData, darReference: ' ' });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });
  });

  describe('Has electricity supplier', () => {
    it('should render term', async () => {
      await setup();
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .hasElectricitySupplier
      );
      expect(term).toBeInTheDocument();
    });

    it('should render definition', async () => {
      await setup();

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .hasElectricitySupplier
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        enTranslations.meteringPoint.overview.primaryMasterData.yes
      );

      const since = definition?.nextElementSibling;
      expect(since).toHaveTextContent(
        `${enTranslations.meteringPoint.overview.primaryMasterData.since.replace(
          '{{date}}',
          testData.supplyStart as string
        )}`
      );
    });

    it('should render fallback definition, if supply start is undefined', async () => {
      await setup({ ...testData, supplyStart: undefined });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .hasElectricitySupplier
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        enTranslations.meteringPoint.overview.primaryMasterData.no
      );

      const since = definition?.nextElementSibling;
      expect(since).toHaveTextContent(fallbackValue);
    });

    it('should render fallback definition, if supply start is null', async () => {
      await setup({ ...testData, supplyStart: null });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .hasElectricitySupplier
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        enTranslations.meteringPoint.overview.primaryMasterData.no
      );

      const since = definition?.nextElementSibling;
      expect(since).toHaveTextContent(fallbackValue);
    });

    it('should render fallback definition, if supply start is empty string', async () => {
      await setup({ ...testData, supplyStart: ' ' });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .hasElectricitySupplier
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(
        enTranslations.meteringPoint.overview.primaryMasterData.no
      );

      const since = definition?.nextElementSibling;
      expect(since).toHaveTextContent(fallbackValue);
    });
  });

  describe('Meter ID', () => {
    it('should render term', async () => {
      await setup();
      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.meterNumber
      );
      expect(term).toBeInTheDocument();
    });

    it('should render definition', async () => {
      await setup();

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.meterNumber
      );
      const definition = getDefinitonByTerm(term);

      expect(term).toBeInTheDocument();
      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(testData.meterId as string);
    });

    it('should render fallback definition, if meter ID is undefined', async () => {
      await setup({ ...testData, meterId: undefined });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.meterNumber
      );
      const definition = getDefinitonByTerm(term);

      expect(term).toBeInTheDocument();
      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });

    it('should render fallback definition, if meter ID is empty string', async () => {
      await setup({ ...testData, meterId: ' ' });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.meterNumber
      );
      const definition = getDefinitonByTerm(term);

      expect(term).toBeInTheDocument();
      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(fallbackValue);
    });
  });
});
