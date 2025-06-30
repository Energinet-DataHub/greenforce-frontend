//#region License
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
//#endregion
/* eslint-disable sonarjs/no-duplicate-string */
import { render } from '@testing-library/angular';

import {
  EicFunction,
  ElectricityMarketMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhCanSeeDirective, PropertyName } from './dh-can-see.directive';
import { MeteringPointDetails } from '../../types';

function getPropertyName(propertyName: PropertyName) {
  return propertyName;
}

type Params = {
  canSeeProperty: PropertyName;
  mpType?: ElectricityMarketMeteringPointType;
};

describe(DhCanSeeDirective, () => {
  const setup = async ({
    canSeeProperty,
    mpType = ElectricityMarketMeteringPointType.Consumption,
  }: Params) => {
    const mpDetails = {
      isEnergySupplier: true,
      metadata: {
        type: mpType,
      },
    } as MeteringPointDetails;

    return await render(
      `<div *dhCanSee="'${canSeeProperty}'; meteringPoint: mpDetails">SOME CONTENT</div>`,
      {
        imports: [DhCanSeeDirective],
        componentProperties: {
          mpDetails,
        },
        providers: [
          {
            provide: DhActorStorage,
            useValue: {
              getSelectedActor: () => ({
                marketRole: EicFunction.DataHubAdministrator,
              }),
            },
          },
        ],
      }
    );
  };

  describe(getPropertyName('energy-supplier-card'), () => {
    const visibleTo: ElectricityMarketMeteringPointType[] = [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ];
    const notVisibleTo = Object.values(ElectricityMarketMeteringPointType).filter(
      (mpType) => !visibleTo.includes(mpType)
    );

    visibleTo.forEach((mpType) => {
      it(`visible to ${mpType} metering point`, async () => {
        const { queryByText } = await setup({
          canSeeProperty: 'energy-supplier-card',
          mpType,
        });

        expect(queryByText(/SOME CONTENT/i)).toBeInTheDocument();
      });
    });

    notVisibleTo.forEach((mpType) => {
      it(`NOT visible to ${mpType} metering point`, async () => {
        const { queryByText } = await setup({
          canSeeProperty: 'energy-supplier-card',
          mpType,
        });

        expect(queryByText(/SOME CONTENT/i)).not.toBeInTheDocument();
      });
    });
  });

  describe(getPropertyName('customer-overview-card'), () => {
    const visibleTo: ElectricityMarketMeteringPointType[] = [
      ElectricityMarketMeteringPointType.Consumption,
      ElectricityMarketMeteringPointType.Production,
    ];
    const notVisibleTo = Object.values(ElectricityMarketMeteringPointType).filter(
      (mpType) => !visibleTo.includes(mpType)
    );

    visibleTo.forEach((mpType) => {
      it(`visible to ${mpType} metering point`, async () => {
        const { queryByText } = await setup({
          canSeeProperty: 'customer-overview-card',
          mpType,
        });

        expect(queryByText(/SOME CONTENT/i)).toBeInTheDocument();
      });
    });

    notVisibleTo.forEach((mpType) => {
      it(`NOT visible to ${mpType} metering point`, async () => {
        const { queryByText } = await setup({
          canSeeProperty: 'customer-overview-card',
          mpType,
        });

        expect(queryByText(/SOME CONTENT/i)).not.toBeInTheDocument();
      });
    });
  });

  it(`display content only once when inputs change`, async () => {
    const { queryByText, rerender, fixture } = await setup({
      canSeeProperty: 'customer-overview-card',
    });

    expect(queryByText(/SOME CONTENT/i)).toBeInTheDocument();

    await rerender({
      componentProperties: {
        mpDetails: {
          isEnergySupplier: true,
          metadata: {
            type: ElectricityMarketMeteringPointType.Production,
          },
        },
      },
    });

    fixture.detectChanges();

    expect(queryByText(/SOME CONTENT/i)).toBeInTheDocument();
  });

  it(`hide content when metering point changes to type that is NOT allowed to see a property`, async () => {
    const { queryByText, rerender, fixture } = await setup({
      canSeeProperty: 'customer-overview-card',
    });

    expect(queryByText(/SOME CONTENT/i)).toBeInTheDocument();

    await rerender({
      componentProperties: {
        mpDetails: {
          isEnergySupplier: true,
          metadata: {
            type: ElectricityMarketMeteringPointType.Exchange,
          },
        },
      },
    });

    fixture.detectChanges();

    expect(queryByText(/SOME CONTENT/i)).not.toBeInTheDocument();
  });
});
