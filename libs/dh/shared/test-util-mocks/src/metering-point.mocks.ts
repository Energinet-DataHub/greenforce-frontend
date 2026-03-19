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
import { delay, http, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/msw/test-util-msw-setup';

import {
  mockChangeProductionObligationMutation,
  mockCloseConversationMutation,
  mockDoesInternalMeteringPointIdExistQuery,
  mockGetAggregatedMeasurementsForAllYearsQuery,
  mockGetAggregatedMeasurementsForMonthQuery,
  mockGetAggregatedMeasurementsForYearQuery,
  mockGetContactCprQuery,
  mockGetConversationQuery,
  mockGetConversationsQuery,
  mockGetElectricalHeatingQuery,
  mockGetMeasurementPointsQuery,
  mockGetMeasurementsQuery,
  mockGetMeteringPointByIdQuery,
  mockGetMeteringPointConversationInfoQuery,
  mockGetMeteringPointNewConversationInfoQuery,
  mockGetMeteringPointsByGridAreaQuery,
  mockGetOperationToolsMeteringPointQuery,
  mockGetRelatedMeteringPointsByIdQuery,
  mockMarkConversationReadMutation,
  mockMarkConversationUnReadMutation,
  mockRequestConnectionStateChangeMutation,
  mockCancelEndOfSupplyMutation,
  mockRequestEndOfSupplyMutation,
  mockSendActorConversationMessageMutation,
  mockStartConversationMutation,
  mockUpdateInternalConversationNoteMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import {
  ElectricityMarketConnectionStateType,
  ElectricityMarketMeteringPointType,
  ElectricityMarketViewMeteringPointSubType,
  Quality,
  Resolution,
  Unit,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { parentMeteringPoint } from './data/metering-point/parent-metering-point';
import { measurementPoints } from './data/metering-point/measurements-points';
import { meteringPointsByGridAreaCode } from './data/metering-point/metering-points-by-grid-area-code';
import { childMeteringPoint } from './data/metering-point/child-metering-point';
import { operationToolsMeteringPoint } from './data/metering-point/operation-tools-metering-point';
import { conversations } from './data/metering-point/conversations';

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
    getOperationToolsMeteringPoint(),
    requestConnectionStateChange(),
    changeProductionObligation(),
    requestEndOfSupply(),
    cancelEndOfSupply(),
    createConversation(),
    getConversations(),
    getConversation(),
    getMeteringPointConversationInformation(),
    getMeteringPointNewConversationInformation(),
    getElectricalHeatingInformation(),
    sendMessage(),
    closeConversation(),
    markConversationRead(),
    markConversationUnRead(),
    updateInternalConversationNoteMutation(),
    uploadMessageDocument(apiBase),
    downloadMessageDocument(apiBase),
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
            meteringPointIdentification: '444444444444444444',
            id: '4444444',
            connectionState: ElectricityMarketConnectionStateType.Connected,
            type: ElectricityMarketMeteringPointType.ElectricalHeating,
            createdDate: new Date('2021-01-01'),
            connectionDate: new Date('2021-01-01'),
            disconnectionDate: null,
            closedDownDate: null,
          },
          parent: {
            __typename: 'RelatedMeteringPointDto',
            meteringPointIdentification: '222222222222222222',
            id: '2222222',
            connectionState: ElectricityMarketConnectionStateType.Connected,
            type: ElectricityMarketMeteringPointType.Consumption,
            createdDate: new Date('2021-01-01'),
            connectionDate: new Date('2021-01-01'),
            disconnectionDate: null,
            closedDownDate: null,
          },
          relatedMeteringPoints: [
            {
              __typename: 'RelatedMeteringPointDto',
              meteringPointIdentification: '333333333333333333',
              id: '3333333',
              connectionState: ElectricityMarketConnectionStateType.Connected,
              type: ElectricityMarketMeteringPointType.Exchange,
              createdDate: new Date('2022-01-01'),
              connectionDate: new Date('2024-01-01'),
              disconnectionDate: null,
              closedDownDate: null,
            },
          ],
          relatedByGsrn: [
            {
              __typename: 'RelatedMeteringPointDto',
              meteringPointIdentification: '444444444444441111',
              id: '4444441',
              connectionState: ElectricityMarketConnectionStateType.New,
              type: ElectricityMarketMeteringPointType.ElectricalHeating,
              createdDate: new Date('2022-01-01'),
              connectionDate: new Date('2024-01-01'),
              disconnectionDate: null,
              closedDownDate: null,
            },
          ],
          historicalMeteringPoints: [
            {
              __typename: 'RelatedMeteringPointDto',
              meteringPointIdentification: '555555555555555555',
              id: '5555555',
              connectionState: ElectricityMarketConnectionStateType.ClosedDown,
              type: ElectricityMarketMeteringPointType.ElectricalHeating,
              createdDate: new Date('2021-01-01'),
              connectionDate: new Date('2021-01-01'),
              disconnectionDate: null,
              closedDownDate: new Date('2021-11-01'),
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
          __typename: 'ElectricityMarketViewMeteringPointDto',
          id: mockMPs[meteringPointId].id,
          metadata: {
            __typename: 'ElectricityMarketViewMeteringPointMetadataDto',
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
    subType: ElectricityMarketViewMeteringPointSubType | undefined | null;
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
              __typename: 'ElectricityMarketViewMeteringPointDto',
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
        meteringPointContactCpr: { __typename: 'ContactCprResponse', result: '1111110000' },
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

function getOperationToolsMeteringPoint() {
  return mockGetOperationToolsMeteringPointQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        operationToolsMeteringPoint: operationToolsMeteringPoint,
      },
    });
  });
}

function getConversations() {
  return mockGetConversationsQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        conversationsForMeteringPoint: {
          __typename: 'Conversations',
          conversations: conversations,
        },
      },
    });
  });
}

function getConversation() {
  return mockGetConversationQuery(async ({ variables }) => {
    await delay(mswConfig.delay);

    const match = conversations.find((c) => c.id === variables.conversationId);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        conversation: {
          __typename: 'Conversation',
          displayId: match?.displayId ?? '00001',
          id: variables.conversationId,
          meteringPointIdentification: '222222222222222222',
          internalNote: 'CS00123645',
          subject: match?.subject ?? 'INTERRUPTION_RECONNECTION',
          closed: match?.closed ?? false,
          wasLatestMessageAnonymous: true,
          partOfConversations: true,
          participants: [
            {
              __typename: 'GetConversationQueryResponseParticipant',
              type: 'INITIATOR',
              role: 'ENERGY_SUPPLIER',
              actorName: 'Sort Strøm',
            },
            {
              __typename: 'GetConversationQueryResponseParticipant',
              type: 'RECEIVER',
              role: 'GRID_ACCESS_PROVIDER',
              actorName: 'Grøn Strøm',
            },
          ],
          messages: [
            {
              __typename: 'ConversationMessage',
              senderType: 'ENERGY_SUPPLIER',
              userMessage: {
                content:
                  'Vi sidder med en slutkunde i Roskilde, som undrer sig over, at deres forbrugsdata er stoppet med at tikke ind i fredags. Kan I se, om måleren er gået offline hos jer?',
                __typename: 'UserMessage',
              },
              messageType: 'USER_MESSAGE',
              createdTime: new Date(),
              actorName: 'Sort Strøm',
              userName: 'Hanne Hansen',
              isSentByCurrentActor: false,
              anonymous: false,
              attachments: [
                {
                  __typename: 'ConversationAttachment',
                  documentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  documentName: 'forbrugsdata-rapport.pdf',
                },
              ],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'GRID_ACCESS_PROVIDER',
              userMessage: {
                content:
                  'Lad mig lige slå installationsnummeret op... Ja, jeg kan se, at vi har mistet radiokontakten til den specifikke måler i fredags kl. 14.00. Der er ikke meldt strømafbrydelser i området.',
                __typename: 'UserMessage',
              },
              messageType: 'USER_MESSAGE',
              createdTime: new Date(),
              actorName: 'Grøn Strøm',
              userName: 'Niels Pedersen',
              isSentByCurrentActor: true,
              anonymous: false,
              attachments: [
                {
                  __typename: 'ConversationAttachment',
                  documentId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                  documentName: 'maaler-status.csv',
                },
                {
                  __typename: 'ConversationAttachment',
                  documentId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
                  documentName: 'radiokontakt-log.txt',
                },
              ],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'ENERGY_SUPPLIER',
              userMessage: {
                content:
                  'Okay, kunden er bange for, at de får en kæmpe efterregning baseret på et skøn. Kan I sende en tekniker ud og kigge på det?',
                __typename: 'UserMessage',
              },
              messageType: 'USER_MESSAGE',
              createdTime: new Date(),
              actorName: 'Sort Strøm',
              userName: 'Hanne Hansen',
              isSentByCurrentActor: false,
              anonymous: false,
              attachments: [],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'GRID_ACCESS_PROVIDER',
              userMessage: {
                content:
                  'Vi forsøger først at genstarte kommunikationsmodulet herfra centralt. Hvis det ikke virker inden for 24 timer, opretter vi en montøropgave. Vi giver besked via DataHub, så snart den er aktiv igen, så I kan få de rigtige data til faktureringen.',
                __typename: 'UserMessage',
              },
              messageType: 'USER_MESSAGE',
              createdTime: new Date(),
              actorName: 'Grøn Strøm',
              userName: 'Niels Pedersen',
              isSentByCurrentActor: true,
              anonymous: false,
              attachments: [],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'ENERGY_SUPPLIER',
              messageType: 'ELECTRICAL_HEATING_INFORMATION',
              createdTime: new Date(),
              actorName: 'Sort Strøm',
              userName: 'Hanne Hansen',
              isSentByCurrentActor: true,

              anonymous: false,
              electricalHeatingInformation: {
                __typename: 'ElectricalHeatingMessage',
                isElectricalHeatingActive: true,
                electricalHeatingFrom: new Date(),
                customerName: 'Test Testesen',
                supplierPeriods: [
                  {
                    __typename: 'ElectricityHeatingMessagePeriod',
                    from: new Date(),
                    to: new Date(),
                  },
                ],
              },
              attachments: [],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'ENERGY_SUPPLIER',
              messageType: 'ELECTRICAL_HEATING_USER_MESSAGE',
              createdTime: new Date(),
              actorName: 'Sort Strøm',
              userName: 'Hanne Hansen',
              isSentByCurrentActor: true,
              anonymous: false,
              electricalHeatingUserMessage: {
                __typename: 'ElectricalHeatingUserMessage',
                electricalHeatingFrom: new Date(),
                reductionPeriod: {
                  __typename: 'ElectricityHeatingMessagePeriod',
                  from: new Date(),
                  to: new Date(),
                },
                content:
                  'Forresten, kunden har også elektrisk opvarmning. Kan I se, om det er aktivt?',
              },
              attachments: [],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'GRID_ACCESS_PROVIDER',
              userMessage: {
                content: 'Gider I afslutte sagen?',
                __typename: 'UserMessage',
              },
              messageType: 'USER_MESSAGE',
              createdTime: new Date(),
              actorName: 'Sort Strøm',
              userName: 'Niels Pedersen',
              isSentByCurrentActor: true,
              anonymous: true,
              attachments: [],
            },
            {
              __typename: 'ConversationMessage',
              senderType: 'ENERGY_SUPPLIER',
              userMessage: {
                content: '',
                __typename: 'UserMessage',
              },
              messageType: 'CLOSING_MESSAGE',
              createdTime: new Date(),
              actorName: '',
              userName: '',
              isSentByCurrentActor: false,
              anonymous: false,
              attachments: [],
            },
          ],
        },
      },
    });
  });
}

function getMeteringPointConversationInformation() {
  return mockGetMeteringPointConversationInfoQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          id: '1',
          __typename: 'ElectricityMarketViewMeteringPointDto',
          meteringPointId: '222222222222222222',
          metadata: {
            __typename: 'ElectricityMarketViewMeteringPointMetadataDto',
            id: '1',
            installationAddress: {
              __typename: 'ElectricityMarketViewInstallationAddressDto',
              id: '1',
              streetName: 'Gade Vej Alle',
              buildingNumber: '4',
              municipalityCode: '5000',
              cityName: 'City',
            },
            connectionState: ElectricityMarketConnectionStateType.Connected,
            type: ElectricityMarketMeteringPointType.Consumption,
            resolution: Resolution.QuarterHourly,
          },
        },
      },
    });
  });
}

function getMeteringPointNewConversationInformation() {
  return mockGetMeteringPointNewConversationInfoQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          id: '1',
          meteringPointId: '222222222222222222',
          __typename: 'ElectricityMarketViewMeteringPointDto',
          metadata: {
            __typename: 'ElectricityMarketViewMeteringPointMetadataDto',
            id: '1',
            installationAddress: {
              __typename: 'ElectricityMarketViewInstallationAddressDto',
              id: '1',
              streetName: 'Gade Vej Alle',
              buildingNumber: '4',
              municipalityCode: '5000',
              cityName: 'City',
            },
            type: ElectricityMarketMeteringPointType.Consumption,
          },
        },
      },
    });
  });
}

function getElectricalHeatingInformation() {
  return mockGetElectricalHeatingQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        electricalHeatingInformation: {
          __typename: 'ElectricalHeatingInformation',
          customerName: 'Test Testesen',
          isElectricalHeatingActive: true,
          electricalHeatingFrom: new Date(),
          supplierPeriods: [
            {
              __typename: 'ElectricalHeatingInformationPeriod',
              from: new Date(),
              to: new Date(),
            },
          ],
        },
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

function changeProductionObligation() {
  return mockChangeProductionObligationMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        changeProductionObligation: {
          __typename: 'ChangeProductionObligationPayload',
          success: true,
        },
      },
    });
  });
}

function requestEndOfSupply() {
  return mockRequestEndOfSupplyMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        requestEndOfSupply: {
          __typename: 'RequestEndOfSupplyPayload',
          success: true,
        },
      },
    });
  });
}

function cancelEndOfSupply() {
  return mockCancelEndOfSupplyMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        cancelEndOfSupply: {
          __typename: 'CancelEndOfSupplyPayload',
          boolean: true,
        },
      },
    });
  });
}

function createConversation() {
  return mockStartConversationMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        startConversation: {
          __typename: 'StartConversationPayload',
          string: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
      },
    });
  });
}

function closeConversation() {
  return mockCloseConversationMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        closeConversation: {
          __typename: 'CloseConversationPayload',
          boolean: true,
        },
      },
    });
  });
}

function markConversationRead() {
  return mockMarkConversationReadMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        markConversationRead: {
          __typename: 'MarkConversationReadPayload',
          boolean: true,
        },
      },
    });
  });
}

function markConversationUnRead() {
  return mockMarkConversationUnReadMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        markConversationUnRead: {
          __typename: 'MarkConversationUnReadPayload',
          boolean: true,
        },
      },
    });
  });
}

function updateInternalConversationNoteMutation() {
  return mockUpdateInternalConversationNoteMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        updateInternalConversationNote: {
          __typename: 'UpdateInternalConversationNotePayload',
          boolean: true,
        },
      },
    });
  });
}

function sendMessage() {
  return mockSendActorConversationMessageMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        sendActorConversationMessage: {
          __typename: 'SendActorConversationMessagePayload',
          boolean: true,
        },
      },
    });
  });
}

function uploadMessageDocument(apiBase: string) {
  return http.post(`${apiBase}/v1/ActorConversation/UploadMessageDocument`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(crypto.randomUUID());
  });
}

function downloadMessageDocument(apiBase: string) {
  return http.get(
    `${apiBase}/v1/ActorConversation/DownloadMessageDocument/:documentId`,
    async () => {
      await delay(mswConfig.delay);
      return new HttpResponse(new Blob(['mock file content'], { type: 'application/pdf' }), {
        headers: { 'Content-Type': 'application/pdf' },
      });
    }
  );
}
