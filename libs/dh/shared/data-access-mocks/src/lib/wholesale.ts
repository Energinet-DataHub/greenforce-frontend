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
import { delay, http, HttpResponse } from 'msw';
import { dayjs } from '@energinet-datahub/watt/utils/date';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  Calculation,
  EicFunction,
  GridAreaDto,
  PriceAreaCode,
  ProcessStatus,
  CalculationType,
  mockCreateCalculationMutation,
  mockGetActorsForRequestCalculationQuery,
  mockGetCalculationByIdQuery,
  mockGetCalculationsQuery,
  mockGetGridAreasQuery,
  mockGetLatestBalanceFixingQuery,
  mockGetSelectedActorQuery,
  mockGetSettlementReportsQuery,
  mockGetSettlementReportCalculationsByGridAreasQuery,
  mockRequestSettlementReportMutation,
  CalculationOrchestrationState,
  CalculationProgressStep,
  ProgressStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mockRequestCalculationMutation } from '@energinet-datahub/dh/shared/domain/graphql';

import { getActorsForRequestCalculation } from './data/wholesale-get-actors-for-request-calculation';
import { wholesaleSettlementReportsQueryMock } from './data/wholesale-settlement-reports';
import { mockSettlementReportCalculationsByGridAreas } from './data/get-settlement-report-calculations-by-grid-areas';

export function wholesaleMocks(apiBase: string) {
  return [
    createCalculation(),
    getCalculation(),
    getCalculations(),
    downloadSettlementReportData(apiBase),
    downloadSettlementReportDataV2(apiBase),
    getGridAreasQuery(),
    getLatestBalanceFixing(),
    getActorsForRequestCalculationQuery(),
    getSelectedActorQuery(),
    requestCalculationMutation(),
    getSettlementReports(),
    getSettlementReportCalculationsByGridAreas(),
    requestSettlementReportMutation(),
  ];
}

function createCalculation() {
  return mockCreateCalculationMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createCalculation: {
          __typename: 'CreateCalculationPayload',
          uuid: '779195a4-2505-4290-97a6-f3eba2b7d179',
        },
      },
    });
  });
}

const periodStart = dayjs('2021-12-01T23:00:00Z').toDate();
const periodEnd = dayjs('2021-12-02T23:00:00Z').toDate();
const executionTimeStart = dayjs('2021-12-01T23:00:00Z').toDate();
const executionTimeEnd = dayjs('2021-12-02T23:00:00Z').toDate();
const validFrom = dayjs('0001-01-01T00:00:00+00:00').toDate();
const fakeUserEmail = 'email@example.com';

export const mockedGridAreas: GridAreaDto[] = [
  {
    __typename: 'GridAreaDto',
    id: '1',
    code: '001',
    name: 'hello',
    displayName: '001 • hello',
    priceAreaCode: PriceAreaCode.Dk1,
    validFrom,
    validTo: null,
  },
  {
    __typename: 'GridAreaDto',
    id: '2',
    code: '002',
    name: 'hello again',
    displayName: '002 • hello again',
    priceAreaCode: PriceAreaCode.Dk1,
    validFrom,
    validTo: null,
  },
];

const mockedCalculations: Calculation[] = [
  {
    __typename: 'Calculation',
    id: '8ff516a1-95b0-4f07-9b58-3fb94791c63b',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    statusType: ProcessStatus.Neutral,
    gridAreas: mockedGridAreas,
    calculationType: CalculationType.Aggregation,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.Scheduled,
    currentStep: CalculationProgressStep.Schedule,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Pending,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Pending,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    statusType: ProcessStatus.Info,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: '',
    state: CalculationOrchestrationState.Calculating,
    currentStep: CalculationProgressStep.Calculate,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Executing,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Pending,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '44447c27-6359-4f34-beed-7b51eccdda4e',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    statusType: ProcessStatus.Success,
    gridAreas: mockedGridAreas,
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.Completed,
    currentStep: CalculationProgressStep.ActorMessageEnqueue,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Completed,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '59e65aec-df77-4f6f-b6d2-aa0fd4b4bc86',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    statusType: ProcessStatus.Danger,
    gridAreas: mockedGridAreas,
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.CalculationFailed,
    currentStep: CalculationProgressStep.Calculate,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Failed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Pending,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '78a9f690-6b8d-4708-92e9-dce64a31b1f7',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    statusType: ProcessStatus.Neutral,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.Scheduled,
    currentStep: CalculationProgressStep.Schedule,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Pending,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Pending,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '8d631523-e6da-4883-ba6c-04bfd1c30d71',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    statusType: ProcessStatus.Info,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.Calculating,
    currentStep: CalculationProgressStep.Calculate,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Executing,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Pending,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: 'ac84205b-6b9c-4f5c-8c6c-2ab81cc870b8',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    statusType: ProcessStatus.Success,
    gridAreas: mockedGridAreas,
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.Completed,
    currentStep: CalculationProgressStep.ActorMessageEnqueue,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Completed,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '376e3cb8-16d7-4fb7-9cdf-1b55cc6af76f',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    statusType: ProcessStatus.Danger,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.ActorMessagesEnqueuingFailed,
    currentStep: CalculationProgressStep.ActorMessageEnqueue,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Failed,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '3dad0a65-4094-44f8-80f1-7543622dcdf1',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    statusType: ProcessStatus.Neutral,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.Scheduled,
    currentStep: CalculationProgressStep.Schedule,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Pending,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Pending,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: 'd0071d78-208c-4d69-8dd8-5538ed93b4da',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    statusType: ProcessStatus.Info,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.ActorMessagesEnqueuing,
    currentStep: CalculationProgressStep.ActorMessageEnqueue,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Executing,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '1d109536-c2c6-4e3f-b3ab-85e73083e876',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    statusType: ProcessStatus.Success,
    gridAreas: mockedGridAreas,
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.ActorMessagesEnqueued,
    currentStep: CalculationProgressStep.ActorMessageEnqueue,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Completed,
      },
    ],
  },
  {
    __typename: 'Calculation',
    id: '19e3d848-e82f-4752-a68f-9befc755864c',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    statusType: ProcessStatus.Danger,
    gridAreas: [],
    calculationType: CalculationType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    state: CalculationOrchestrationState.ActorMessagesEnqueuingFailed,
    currentStep: CalculationProgressStep.ActorMessageEnqueue,
    progress: [
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Schedule,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.Calculate,
        status: ProgressStatus.Completed,
      },
      {
        __typename: 'CalculationProgress',
        step: CalculationProgressStep.ActorMessageEnqueue,
        status: ProgressStatus.Failed,
      },
    ],
  },
];

function getActorsForRequestCalculationQuery() {
  return mockGetActorsForRequestCalculationQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', actorsForEicFunction: getActorsForRequestCalculation },
    });
  });
}

function getSelectedActorQuery() {
  return mockGetSelectedActorQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        selectedActor: {
          __typename: 'Actor',
          glnOrEicNumber: '123',
          gridAreas: [{ __typename: 'GridAreaDto', code: '805', name: 'hello' }],
          marketRole: EicFunction.EnergySupplier,
        },
      },
    });
  });
}

function getCalculation() {
  return mockGetCalculationByIdQuery(async ({ variables }) => {
    const { id } = variables;
    const calculationById = mockedCalculations.find((c) => c.id === id);
    await delay(mswConfig.delay);
    return calculationById
      ? HttpResponse.json({
          data: { __typename: 'Query', calculationById },
        })
      : HttpResponse.json({ data: null }, { status: 404 });
  });
}

function downloadSettlementReportData(apiBase: string) {
  return http.get(`${apiBase}/v1/WholesaleSettlementReport/Download`, async () => {
    await delay(mswConfig.delay);
    return new HttpResponse(null, { status: 500 });

    /*
      // Convert "base64" image to "ArrayBuffer".
      const imageBuffer = await fetch('assets/logo-light.svg').then((res) =>
        res.arrayBuffer()
      );
      return res(
        ctx.set('Content-Length', imageBuffer.byteLength.toString()),
        ctx.set('Content-Type', 'image/svg+xml'),
        // Respond with the "ArrayBuffer".
        ctx.body(imageBuffer)
      );
    */
  });
}

function downloadSettlementReportDataV2(apiBase: string) {
  return http.get(`${apiBase}/v1/WholesaleSettlementReport/DownloadReport`, async () => {
    await delay(mswConfig.delay);

    const text = 'This is some text';
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        const encodedData = encoder.encode(text);
        controller.enqueue(encodedData);
        controller.close();
      },
    });

    const compressedReadableStream = readableStream.pipeThrough(new CompressionStream('gzip'));

    const response = new Response(compressedReadableStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Encoding': 'gzip',
      },
    });

    const buffer = await response.arrayBuffer();

    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Encoding': 'gzip',
      },
    });
  });
}
function getCalculations() {
  return mockGetCalculationsQuery(async ({ variables }) => {
    if (!variables.input.executionTime) {
      return HttpResponse.json({ data: null }, { status: 500 });
    } else {
      await delay(mswConfig.delay);
      return HttpResponse.json({
        data: { __typename: 'Query', calculations: mockedCalculations },
      });
      //return res(ctx.status(404), ctx.delay(300));
    }
  });
}

function getGridAreasQuery() {
  return mockGetGridAreasQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', gridAreas: mockedGridAreas },
    });
  });
}

function getLatestBalanceFixing() {
  return mockGetLatestBalanceFixingQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        latestBalanceFixing: {
          __typename: 'Calculation',
          period: { start: periodStart, end: periodEnd },
        },
      },
    });
  });
}

function requestCalculationMutation() {
  return mockRequestCalculationMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        requestCalculation: {
          __typename: 'RequestCalculationPayload',
          success: true,
        },
      },
    });
  });
}

function getSettlementReports() {
  return mockGetSettlementReportsQuery(async () => {
    await delay(mswConfig.delay);

    if (window.location.href.includes('error'))
      return HttpResponse.json({
        errors: [
          {
            message: 'Failed to fetch settlement reports',
            extensions: { code: '500', details: 'test' },
          },
        ],
        data: null,
      });

    return HttpResponse.json({
      data: wholesaleSettlementReportsQueryMock,
    });
  });
}

function getSettlementReportCalculationsByGridAreas() {
  return mockGetSettlementReportCalculationsByGridAreasQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: mockSettlementReportCalculationsByGridAreas,
    });
  });
}

function requestSettlementReportMutation() {
  return mockRequestSettlementReportMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        requestSettlementReport: {
          __typename: 'RequestSettlementReportPayload',
          boolean: true,
        },
      },
    });
  });
}
