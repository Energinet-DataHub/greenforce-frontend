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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render } from '@testing-library/angular';

import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import {
  getByTerm,
  getDefinitonByTerm,
  runOnPushChangeDetection,
} from '@energinet-datahub/dh/shared/test-util-metering-point';
import { MeteringPointType } from '@energinet-datahub/dh/shared/domain';
import { emDash } from '@energinet-datahub/dh/shared/ui-util';

import {
  DhMeteringPointPrimaryMasterDataComponent,
  DhMeteringPointPrimaryMasterDataScam,
  PrimaryMasterData,
} from './dh-metering-point-primary-master-data.component';

describe(DhMeteringPointPrimaryMasterDataComponent.name, () => {
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
    meteringPointType: MeteringPointType.E17,
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
      expect(definition).toHaveTextContent(emDash);
    });

    it('should render fallback definition, if location description is empty string', async () => {
      await setup({ ...testData, locationDescription: ' ' });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData
          .locationDescription
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(emDash);
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
      expect(definition).toHaveTextContent(emDash);
    });

    it('should render fallback definition, if geo info reference is null', async () => {
      await setup({ ...testData, darReference: null });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(emDash);
    });

    it('should render fallback definition, if geo info reference is empty string', async () => {
      await setup({ ...testData, darReference: ' ' });

      const term = getByTerm(
        enTranslations.meteringPoint.overview.primaryMasterData.geoInfoReference
      );
      const definition = getDefinitonByTerm(term);

      expect(definition).toBeInTheDocument();
      expect(definition).toHaveTextContent(emDash);
    });
  });
});
