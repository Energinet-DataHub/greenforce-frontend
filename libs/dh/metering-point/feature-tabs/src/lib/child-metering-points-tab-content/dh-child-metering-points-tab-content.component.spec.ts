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
  ConnectionState,
  MeteringPointSimpleCimDto,
  MeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  DhChildMeteringPointsTabContentComponent,
  DhChildMeteringPointsTabContentScam,
} from './dh-child-metering-points-tab-content.component';

const testData: MeteringPointSimpleCimDto[] = [
  {
    gsrnNumber: '570263739584198159',
    effectiveDate: '2020-01-03T00:00:00Z',
    connectionState: ConnectionState.E22,
    meteringPointId: '10',
    meteringPointType: MeteringPointType.D09,
  },
  {
    gsrnNumber: '574289323666998780',
    effectiveDate: '2020-01-02T00:00:00Z',
    connectionState: ConnectionState.D03,
    meteringPointId: '20',
    meteringPointType: MeteringPointType.D01,
  },
  {
    gsrnNumber: '579702678493999563',
    effectiveDate: '2020-04-01T00:00:00Z',
    connectionState: ConnectionState.D02,
    meteringPointId: '30',
    meteringPointType: MeteringPointType.D02,
  },
];

describe(DhChildMeteringPointsTabContentComponent.name, () => {
  async function setup(childMeteringPoints?: Array<MeteringPointSimpleCimDto>) {
    const { fixture } = await render(DhChildMeteringPointsTabContentComponent, {
      componentProperties: {
        sortedData: childMeteringPoints,
        childMeteringPoints,
      },
      imports: [
        getTranslocoTestingModule(),
        DhChildMeteringPointsTabContentScam,
      ],
    });

    runOnPushChangeDetection(fixture);
  }

  it(`Given child metering points data,
      Then each child metering point is displayed in a separate table row`, async () => {
    await setup(testData);

    const disableQuerySuggestions: MatcherOptions = { suggest: false };
    const actualGsrnNumbers = screen.getAllByTestId(
      'gsrn',
      disableQuerySuggestions
    );

    expect(actualGsrnNumbers.length).toBe(testData.length);

    actualGsrnNumbers.forEach((gsrnNumber, index) => {
      expect(gsrnNumber.textContent?.trim()).toBe(testData[index].gsrnNumber);
    });
  });

  it(`Given child metering points data is empty,
    Then empty state is displayed`, async () => {
    await setup([]);

    const heading = screen.getByRole('heading', { level: 5 });

    expect(heading).toBeInTheDocument();
  });

  it(`Given child metering points data is "undefined",
    Then empty state is displayed`, async () => {
    await setup(undefined);

    const heading = screen.getByRole('heading', { level: 5 });

    expect(heading).toBeInTheDocument();
  });
});
