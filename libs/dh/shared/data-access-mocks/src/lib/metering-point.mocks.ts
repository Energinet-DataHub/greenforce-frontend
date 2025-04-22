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
  mockGetAggregatedMeasurementsForMonthQuery,
  mockGetContactCprQuery,
  mockGetMeasurementsQuery,
  mockGetMeteringPointByIdQuery,
  mockGetMeteringPointsByGridAreaQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { parentMeteringPoint } from './data/metering-point/parent-metering-point';
import { measurementPoints } from './data/metering-point/measurements-points';
import { meteringPointsByGridAreaCode } from './data/metering-point/metering-points-by-grid-area-code';
import { childMeteringPoint } from './data/metering-point/child-metering-point';
import { Quality, Unit } from '@energinet-datahub/dh/shared/domain/graphql';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [
    doesMeteringPointExists(),
    getContactCPR(),
    getMeteringPoint(),
    getMeteringPointsByGridArea(),
    getMeasurements(),
    getAggreatedMeasurementsForMonth(),
  ];
}

function getAggreatedMeasurementsForMonth() {
  return mockGetAggregatedMeasurementsForMonthQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        aggregatedMeasurementsForMonth: [
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 100,
            date: new Date('2023-01-01T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 150,
            date: new Date('2023-01-02T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: true,
            quality: Quality.Calculated,
            quantity: 200,
            date: new Date('2023-01-03T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 250,
            date: new Date('2023-01-04T22:59:59.99999Z'),
          },

          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 300,
            date: new Date('2023-01-05T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 350,
            date: new Date('2023-01-06T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 400,
            date: new Date('2023-01-07T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 450,
            date: new Date('2023-01-08T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 500,
            date: new Date('2023-01-09T22:59:59.99999Z'),
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 550,
            date: new Date('2023-01-10T22:59:59.99999Z'),
          },
        ],
      },
    });
  });
}

function getMeasurements() {
  return mockGetMeasurementsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        measurements: {
          __typename: 'MeasurementDto',
          measurementPositions: [
            {
              __typename: 'MeasurementPositionDto',
              index: 1,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T23:59:59.99999Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 2,
              hasQuantityChanged: true,
              measurementPoints: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T00:00:00Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 3,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(0, 1).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T01:00:00Z'),
              current: measurementPoints.toSpliced(0, 1)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 4,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(2, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T02:00:00Z'),
              current: measurementPoints.toSpliced(2, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 5,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(1, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T03:00:00Z'),
              current: measurementPoints.toSpliced(1, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 6,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(1, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T04:00:00Z'),
              current: measurementPoints.toSpliced(1, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 7,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(2, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T05:00:00Z'),
              current: measurementPoints.toSpliced(2, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 8,
              hasQuantityChanged: false,
              measurementPoints: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T06:00:00Z'),
              current: measurementPoints.toSpliced(0, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 9,
              hasQuantityChanged: true,
              measurementPoints: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T07:00:00Z'),
              current: measurementPoints.toSpliced(0, 3)[0],
            },
          ],
        },
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
