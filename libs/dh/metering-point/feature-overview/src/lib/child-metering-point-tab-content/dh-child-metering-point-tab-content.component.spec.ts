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
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import {
  ConnectionState,
  MeteringPointSimpleCimDto,
  MeteringPointType,
} from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';

import {
  DhChildMeteringPointTabContentComponent,
  DhChildMeteringPointTabContentScam,
} from './dh-child-metering-point-tab-content.component';

const testData: MeteringPointSimpleCimDto[] = [
  {
    gsrnNumber: '1',
    effectiveDate: '2020-01-03T00:00:00Z',
    connectionState: ConnectionState.E22,
    meteringPointId: '10',
    meteringPointType: MeteringPointType.D09,
  },
  {
    gsrnNumber: '2',
    effectiveDate: '2020-01-02T00:00:00Z',
    connectionState: ConnectionState.D03,
    meteringPointId: '20',
    meteringPointType: MeteringPointType.D01,
  },
  {
    gsrnNumber: '3',
    effectiveDate: '2020-04-01T00:00:00Z',
    connectionState: ConnectionState.D02,
    meteringPointId: '30',
    meteringPointType: MeteringPointType.D02,
  },
];

describe(DhChildMeteringPointTabContentComponent.name, () => {
  async function setup(childMeteringPoints?: Array<MeteringPointSimpleCimDto>) {
    const { fixture } = await render(DhChildMeteringPointTabContentComponent, {
      componentProperties: {
        sortedData: childMeteringPoints,
        childMeteringPoints,
      },
      imports: [
        DhChildMeteringPointTabContentScam,
        getTranslocoTestingModule(),
        MatTableModule,
        MatSortModule,
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
