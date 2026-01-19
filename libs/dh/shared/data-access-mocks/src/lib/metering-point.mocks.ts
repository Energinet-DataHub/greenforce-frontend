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
  mockDoesInternalMeteringPointIdExistQuery,
  mockGetAggregatedMeasurementsForAllYearsQuery,
  mockGetAggregatedMeasurementsForMonthQuery,
  mockGetAggregatedMeasurementsForYearQuery,
  mockGetContactCprQuery,
  mockGetMeasurementPointsQuery,
  mockGetMeasurementsQuery,
  mockGetMeteringPointByIdQuery,
  mockGetMeteringPointsByGridAreaQuery,
  mockGetRelatedMeteringPointsByIdQuery,
  mockGetMeteringPointEventsDebugViewQuery,
  mockRequestConnectionStateChangeMutation, mockCreateConversationMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import {
  ConnectionState,
  ElectricityMarketMeteringPointType,
  MeteringPointSubType,
  Quality,
  Resolution,
  Unit,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { parentMeteringPoint } from './data/metering-point/parent-metering-point';
import { measurementPoints } from './data/metering-point/measurements-points';
import { meteringPointsByGridAreaCode } from './data/metering-point/metering-points-by-grid-area-code';
import { childMeteringPoint } from './data/metering-point/child-metering-point';
import { eventsDebugView } from './data/metering-point/metering-point-events-debug-view';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [
    doesInternalMeteringPointIdExist(),
    getContactCPR(),
    getMeteringPoint(),
    getMeteringPointsByGridArea(),
    getMeasurements(),
    getMeasurementPoints(),
    getAggreatedMeasurementsForMonth(),
    getAggreatedMeasurementsForYear(),
    getAggreatedMeasurementsForAllYears(),
    getRelatedMeteringPoints(),
    getMeteringPointEventsDebugView(),
    requestConnectionStateChange(),
    createConversation()
  ];
}

function getRelatedMeteringPoints() {
  return mockGetRelatedMeteringPointsByIdQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        relatedMeteringPoints: {
          __typename: 'RelatedMeteringPointsDto',
          current: {
            __typename: 'RelatedMeteringPointDto',
            id: '4444444',
            connectionState: ConnectionState.Connected,
            identification: '444444444444444444',
            type: ElectricityMarketMeteringPointType.ElectricalHeating,
            createdDate: new Date('2021-01-01'),
            connectionDate: new Date('2021-01-01'),
            closedDownDate: null,
          },
          parent: {
            __typename: 'RelatedMeteringPointDto',
            id: '2222222',
            connectionState: ConnectionState.Connected,
            identification: '222222222222222222',
            type: ElectricityMarketMeteringPointType.Consumption,
            createdDate: new Date('2021-01-01'),
            connectionDate: new Date('2021-01-01'),
            closedDownDate: null,
          },
          relatedMeteringPoints: [
            {
              __typename: 'RelatedMeteringPointDto',
              id: '3',
              connectionState: ConnectionState.Connected,
              identification: '333333333333333333',
              type: ElectricityMarketMeteringPointType.Exchange,
              createdDate: new Date('2022-01-01'),
              connectionDate: new Date('2024-01-01'),
              closedDownDate: null,
            },
          ],
          relatedByGsrn: [
            {
              __typename: 'RelatedMeteringPointDto',
              id: '4',
              connectionState: ConnectionState.New,
              identification: '444444444444441111',
              type: ElectricityMarketMeteringPointType.ElectricalHeating,
              createdDate: new Date('2022-01-01'),
              connectionDate: new Date('2024-01-01'),
              closedDownDate: null,
            },
          ],
          historicalMeteringPoints: [
            {
              __typename: 'RelatedMeteringPointDto',
              id: '5',
              connectionState: ConnectionState.ClosedDown,
              identification: '555555555555555555',
              type: ElectricityMarketMeteringPointType.ElectricalHeating,
              createdDate: new Date('2021-01-01'),
              connectionDate: new Date('2021-01-01'),
              closedDownDate: new Date('2021-11-01'),
            },
          ],
          historicalMeteringPointsByGsrn: [
            {
              __typename: 'RelatedMeteringPointDto',
              id: '6',
              connectionState: ConnectionState.Disconnected,
              identification: '666666666666666666',
              type: ElectricityMarketMeteringPointType.ElectricalHeating,
              createdDate: new Date('2022-01-01'),
              connectionDate: new Date('2022-01-01'),
              closedDownDate: null,
            },
          ],
        },
      },
    });
  });
}

function getAggreatedMeasurementsForAllYears() {
  return mockGetAggregatedMeasurementsForAllYearsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        aggregatedMeasurementsForAllYears: [
          {
            __typename: 'MeasurementAggregationByYearDto',
            year: 2023,
            quantity: 1000,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByYearDto',
            year: 2024,
            quantity: 2000,
            qualities: [Quality.Estimated],
          },
        ],
      },
    });
  });
}

function getAggreatedMeasurementsForYear() {
  return mockGetAggregatedMeasurementsForYearQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        aggregatedMeasurementsForYear: [
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 100,
            yearMonth: '2023-01',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 150,
            yearMonth: '2023-02',
            unit: Unit.KWh,
            qualities: [Quality.Estimated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 200,
            yearMonth: '2023-03',
            unit: Unit.KWh,
            qualities: [Quality.Measured],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 250,
            yearMonth: '2023-04',
            unit: Unit.KWh,
            qualities: [Quality.Missing],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 300,
            yearMonth: '2023-05',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 350,
            yearMonth: '2023-06',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 400,
            yearMonth: '2023-07',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 450,
            yearMonth: '2023-08',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 500,
            yearMonth: '2023-09',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 550,
            yearMonth: '2023-10',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 600,
            yearMonth: '2023-11',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            quantity: 650,
            yearMonth: '2023-12',
            unit: Unit.KWh,
            qualities: [Quality.Calculated],
          },
        ],
      },
    });
  });
}

function getAggreatedMeasurementsForMonth() {
  return mockGetAggregatedMeasurementsForMonthQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        aggregatedMeasurementsForMonth: [
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 100,
            date: new Date('2023-01-01T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 150,
            date: new Date('2023-01-02T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 200,
            date: new Date('2023-01-03T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 250,
            date: new Date('2023-01-04T22:59:59.99999Z'),
            unit: Unit.KWh,
          },

          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 300,
            date: new Date('2023-01-05T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 350,
            date: new Date('2023-01-06T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 400,
            date: new Date('2023-01-07T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 450,
            date: new Date('2023-01-08T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 500,
            date: new Date('2023-01-09T22:59:59.99999Z'),
            unit: Unit.KWh,
          },
          {
            __typename: 'MeasurementAggregationByDateDto',
            qualities: [Quality.Calculated],
            quantity: 550,
            date: new Date('2023-01-10T22:59:59.99999Z'),
            unit: Unit.KWh,
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
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T23:59:59.99999Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 2,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: true,
              historic: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T00:00:00Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 3,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(0, 1).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T01:00:00Z'),
              current: measurementPoints.toSpliced(0, 1)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 4,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(2, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T02:00:00Z'),
              current: measurementPoints.toSpliced(2, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 5,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(1, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T03:00:00Z'),
              current: measurementPoints.toSpliced(1, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 6,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(1, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T04:00:00Z'),
              current: measurementPoints.toSpliced(1, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 7,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(2, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T05:00:00Z'),
              current: measurementPoints.toSpliced(2, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 8,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T06:00:00Z'),
              current: measurementPoints.toSpliced(0, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 9,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: true,
              historic: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T07:00:00Z'),
              current: measurementPoints[5],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 10,
              resolution: Resolution.Hourly,
              hasQuantityOrQualityChanged: false,
              historic: [],
              observationTime: new Date('2023-01-01T07:00:00Z'),
              current: measurementPoints[6],
            },
          ],
        },
      },
    });
  });
}

function getMeasurementPoints() {
  return mockGetMeasurementPointsQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDto',
          id: mockMPs[meteringPointId].id,
          metadata: {
            __typename: 'MeteringPointMetadataDto',
            id: mockMPs[meteringPointId].metadataId,
            subType: mockMPs[meteringPointId].subType,
          },
        },
        measurementPoints: [
          measurementPoints[0],
          measurementPoints.toSpliced(0, 1)[0],
          measurementPoints.toSpliced(0, 3)[0],
        ],
      },
    });
  });
}

const mockMPs: {
  [key: string]: {
    id: string;
    meteringPointId: string;
    metadataId: string;
    subType: MeteringPointSubType | undefined | null;
  };
} = {
  [parentMeteringPoint.meteringPointId]: {
    id: parentMeteringPoint.id,
    meteringPointId: parentMeteringPoint.meteringPointId,
    metadataId: parentMeteringPoint.metadata.id,
    subType: parentMeteringPoint.metadata.subType,
  },
  [childMeteringPoint.meteringPointId]: {
    id: childMeteringPoint.id,
    meteringPointId: childMeteringPoint.meteringPointId,
    metadataId: childMeteringPoint.metadata.id,
    subType: childMeteringPoint.metadata.subType,
  },
};

function doesInternalMeteringPointIdExist() {
  return mockDoesInternalMeteringPointIdExistQuery(
    async ({ variables: { internalMeteringPointId, meteringPointId } }) => {
      await delay(mswConfig.delay);

      const mpIDs = {
        [parentMeteringPoint.id]: parentMeteringPoint.meteringPointId,
        [childMeteringPoint.id]: childMeteringPoint.meteringPointId,
      };

      const params: { [key: string]: string | undefined } = {};

      if (internalMeteringPointId) {
        params['id'] = Object.keys(mpIDs).includes(internalMeteringPointId)
          ? internalMeteringPointId
          : undefined;
        params['meteringPointId'] = mpIDs[internalMeteringPointId];
      } else if (meteringPointId) {
        params['id'] = mockMPs[meteringPointId]?.id;
        params['meteringPointId'] = mockMPs[meteringPointId]?.meteringPointId;
      }

      if (params['id'] && params['meteringPointId']) {
        return HttpResponse.json({
          data: {
            __typename: 'Query',
            meteringPointExists: {
              __typename: 'MeteringPointDto',
              id: params['id'],
              meteringPointId: params['meteringPointId'],
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
    }
  );
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

function getMeteringPointEventsDebugView() {
  return mockGetMeteringPointEventsDebugViewQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        eventsDebugView: eventsDebugView,
      },
    });
  });
}

function requestConnectionStateChange() {
  return mockRequestConnectionStateChangeMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        requestConnectionStateChange: {
          __typename: 'RequestConnectionStateChangePayload',
          success: true,
        },
      },
    });
  });
}

function createConversation() {
  return mockCreateConversationMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createConversation: {
          __typename: 'CreateConversationPayload',
          string: 'success'
        }
      },
    });
  })
}
