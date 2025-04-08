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
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  mockDoesMeteringPointExistQuery,
  mockGetContactCprQuery,
  mockGetMeasurementsByIdQuery,
  mockGetMeteringPointByIdQuery,
  mockGetMeteringPointsByGridAreaQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { parentMeteringPoint } from './data/metering-point/parent-metering-point';
import { measurementPoints } from './data/metering-point/measurements-points';
import { meteringPointsByGridAreaCode } from './data/metering-point/metering-points-by-grid-area-code';
import { childMeteringPoint } from './data/metering-point/child-metering-point';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [
    doesMeteringPointExists(),
    getContactCPR(),
    getMeteringPoint(),
    getMeteringPointsByGridArea(),
    getMeasurementPoints(),
  ];
}

function getMeasurementPoints() {
  return mockGetMeasurementsByIdQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        measurements: measurementPoints,
      },
    });
  });
}

const mockMPs: {
  [key: string]: {
    id: number;
    meteringPointId: string;
  };
} = {
  [parentMeteringPoint.meteringPointId]: {
    id: parentMeteringPoint.id,
    meteringPointId: parentMeteringPoint.meteringPointId,
  },
  [childMeteringPoint.meteringPointId]: {
    id: childMeteringPoint.id,
    meteringPointId: childMeteringPoint.meteringPointId,
  },
};

function doesMeteringPointExists() {
  return mockDoesMeteringPointExistQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    if (
      [parentMeteringPoint.meteringPointId, childMeteringPoint.meteringPointId].includes(
        meteringPointId
      )
    ) {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          meteringPoint: {
            __typename: 'MeteringPointDto',
            id: mockMPs[meteringPointId].id,
            meteringPointId: mockMPs[meteringPointId].meteringPointId,
          },
        },
      });
    }

    return HttpResponse.json({
      data: null,
      errors: [
        {
          message: 'Metering point not found',
          path: ['meteringPoint'],
        },
      ],
    });
  });
}

function getContactCPR() {
  return mockGetContactCprQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointContactCpr: { __typename: 'CPRResponse', result: '1234567890' },
      },
    });
  });
}

function getMeteringPoint() {
  return mockGetMeteringPointByIdQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint:
          meteringPointId === parentMeteringPoint.meteringPointId
            ? parentMeteringPoint
            : childMeteringPoint,
      },
    });
  });
}

function getMeteringPointsByGridArea() {
  return mockGetMeteringPointsByGridAreaQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointsByGridAreaCode,
      },
    });
  });
}
