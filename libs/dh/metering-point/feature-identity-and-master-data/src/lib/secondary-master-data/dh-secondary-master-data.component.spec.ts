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
import { MatcherOptions } from '@testing-library/dom';

import {
  MeteringPointCimDto,
  DisconnectionType,
  ConnectionType,
  AssetType,
  ProductId,
  Unit,
  MeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { emDash } from '@energinet-datahub/dh/shared/ui-util';

import { DhSecondaryMasterDataComponent } from './dh-secondary-master-data.component';

const meteringPointMock = {
  meteringPointType: MeteringPointType.E17,
  productId: ProductId.EnergyActive,
  unit: Unit.KWH,
} as MeteringPointCimDto;

describe(DhSecondaryMasterDataComponent.name, () => {
  async function setup(secondaryMasterData: MeteringPointCimDto) {
    const { fixture } = await render(DhSecondaryMasterDataComponent, {
      componentProperties: {
        secondaryMasterData,
      },
      imports: [getTranslocoTestingModule()],
    });

    runOnPushChangeDetection(fixture);
  }

  describe('test globalization', () => {
    it.each`
      incommingValueObject                            | testId                 | expectedDisplayValue
      ${{ disconnectionType: DisconnectionType.D01 }} | ${'disconnectionType'} | ${enTranslations.meteringPoint.disconnectionType.D01}
      ${{ connectionType: ConnectionType.D01 }}       | ${'connectionType'}    | ${enTranslations.meteringPoint.connectionType.D01}
      ${{ assetType: AssetType.D01 }}                 | ${'assetType'}         | ${enTranslations.meteringPoint.assetType.D01}
      ${{ productId: ProductId.EnergyActive }}        | ${'productId'}         | ${enTranslations.meteringPoint.productId.EnergyActive}
      ${{ unit: Unit.KWH }}                           | ${'unit'}              | ${enTranslations.meteringPoint.unit.KWH}
    `('displays correct value', async ({ incommingValueObject, testId, expectedDisplayValue }) => {
      const secondaryMasterData: MeteringPointCimDto = {
        ...meteringPointMock,
        ...incommingValueObject,
      };

      await setup(secondaryMasterData);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualDisplayValue = screen.getByTestId(testId, disableQuerySuggestions).textContent;

      expect(actualDisplayValue).toContain(expectedDisplayValue);
    });

    it.each`
      incommingValueObject                | testId
      ${{ disconnectionType: undefined }} | ${'disconnectionType'}
      ${{ connectionType: undefined }}    | ${'connectionType'}
      ${{ assetType: undefined }}         | ${'assetType'}
    `('displays fallback value when undefined', async ({ incommingValueObject, testId }) => {
      const secondaryMasterData: MeteringPointCimDto = {
        ...meteringPointMock,
        ...incommingValueObject,
      };

      await setup(secondaryMasterData);

      const disableQuerySuggestions: MatcherOptions = { suggest: false };
      const actualDisplayValue = screen.getByTestId(testId, disableQuerySuggestions).textContent;

      expect(actualDisplayValue?.trim()).toBe(emDash);
    });
  });
});
