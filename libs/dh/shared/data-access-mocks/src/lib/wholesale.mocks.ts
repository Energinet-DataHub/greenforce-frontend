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
import { dayjs } from '@energinet-datahub/watt/date';
import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  EicFunction,
  GridAreaDto,
  PriceAreaCode,
  CalculationTypeQueryParameterV1,
  CalculationExecutionType,
  GridAreaStatus,
  GridAreaType,
  ProcessState,
  ProcessStepState,
  WholesaleAndEnergyCalculation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  mockCreateCalculationMutation,
  mockCancelScheduledCalculationMutation,
  mockGetActorsForRequestCalculationQuery,
  mockGetCalculationByIdQuery,
  mockGetCalculationsQuery,
  mockGetLatestCalculationQuery,
  mockGetSelectedActorQuery,
  mockGetSettlementReportsQuery,
  mockGetSettlementReportCalculationsByGridAreasQuery,
  mockRequestSettlementReportMutation,
  mockGetSettlementReportQuery,
  mockCancelSettlementReportMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { getActorsForRequestCalculation } from './data/wholesale-get-actors-for-request-calculation';
import { wholesaleSettlementReportsQueryMock } from './data/wholesale-settlement-reports';
import { mockSettlementReportCalculationsByGridAreas } from './data/get-settlement-report-calculations-by-grid-areas';

export function wholesaleMocks(apiBase: string) {
  return [
    createCalculation(),
    getCalculation(),
    getCalculations(apiBase),
    downloadSettlementReportData(apiBase),
    downloadSettlementReportDataV2(apiBase),
    getLatestCalculation(),
    getActorsForRequestCalculationQuery(),
    getSelectedActorQuery(),
    getSettlementReports(apiBase),
    getSettlementReport(apiBase),
    getSettlementReportCalculationsByGridAreas(),
    requestSettlementReportMutation(),
    cancelScheduledCalculation(),
    cancelSettlementReportMutation(),
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

function cancelScheduledCalculation() {
  return mockCancelScheduledCalculationMutation(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        cancelScheduledCalculation: {
          __typename: 'CancelScheduledCalculationPayload',
          boolean: true,
        },
      },
    });
  });
}

const periodStart = dayjs('2021-12-01T23:00:00Z').toDate();
const periodEnd = dayjs('2021-12-02T23:00:00Z').toDate();
const createdAt = dayjs('2021-12-01T23:00:00Z').toDate();
const startedAt = dayjs('2021-12-01T23:00:00Z').toDate();
const terminatedAt = dayjs('2021-12-02T23:00:00Z').toDate();
const validFrom = dayjs('0001-01-01T00:00:00+00:00').toDate();
const auditIdentityId = '00000000-0000-0000-0000-000000000001';
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
    status: GridAreaStatus.Active,
    type: GridAreaType.Distribution,
    includedInCalculation: true,
  },
  {
    __typename: 'GridAreaDto',
    id: '2',
    code: '002',
    name: 'hello again',
    displayName: '002 • hello again',
    priceAreaCode: PriceAreaCode.Dk1,
    status: GridAreaStatus.Created,
    type: GridAreaType.GridLossDk,
    validFrom,
    validTo: null,
    includedInCalculation: false,
  },
];

const mockedCalculations: WholesaleAndEnergyCalculation[] = [
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '8ff516a1-95b0-4f07-9b58-3fb94791c63b',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt: null,
    gridAreas: mockedGridAreas,
    calculationType: CalculationTypeQueryParameterV1.Aggregation,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Pending,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt: null,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: '',
    },
    state: ProcessState.Running,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Running,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '44447c27-6359-4f34-beed-7b51eccdda4e',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt,
    gridAreas: mockedGridAreas,
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Succeeded,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '59e65aec-df77-4f6f-b6d2-aa0fd4b4bc86',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt,
    gridAreas: mockedGridAreas,
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Failed,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Failed,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '78a9f690-6b8d-4708-92e9-dce64a31b1f7',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt: null,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Pending,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '8d631523-e6da-4883-ba6c-04bfd1c30d71',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt: null,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Running,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Running,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: 'ac84205b-6b9c-4f5c-8c6c-2ab81cc870b8',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.Internal,
    startedAt,
    createdAt,
    terminatedAt,
    gridAreas: mockedGridAreas,
    calculationType: CalculationTypeQueryParameterV1.Aggregation,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Succeeded,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '376e3cb8-16d7-4fb7-9cdf-1b55cc6af76f',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Failed,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Failed,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '3dad0a65-4094-44f8-80f1-7543622dcdf1',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt: null,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Pending,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Pending,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: 'd0071d78-208c-4d69-8dd8-5538ed93b4da',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt: null,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Running,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Running,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '1d109536-c2c6-4e3f-b3ab-85e73083e876',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt,
    gridAreas: mockedGridAreas,
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Succeeded,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
    ],
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '19e3d848-e82f-4752-a68f-9befc755864c',
    period: { start: periodStart, end: periodEnd },
    executionType: CalculationExecutionType.External,
    startedAt,
    createdAt,
    terminatedAt,
    gridAreas: [],
    calculationType: CalculationTypeQueryParameterV1.BalanceFixing,
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId,
      displayName: fakeUserEmail,
    },
    state: ProcessState.Failed,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Succeeded,
        isCurrent: false,
      },
      {
        __typename: 'OrchestrationInstanceStep',
        state: ProcessStepState.Failed,
        isCurrent: false,
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
          id: '00000000-0000-0000-0000-000000000001',
          glnOrEicNumber: '123',
          gridAreas: [
            {
              __typename: 'GridAreaDto',
              id: '00000000-0000-0000-0000-000000000002',
              code: '805',
              name: 'hello',
            },
          ],
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
function getCalculations(apiBase: string) {
  return mockGetCalculationsQuery(async ({ variables }) => {
    if (!variables.input.executionType) {
      return HttpResponse.json({ data: null }, { status: 500 });
    } else {
      await delay(mswConfig.delay);
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          calculations: {
            __typename: 'CalculationsConnection',
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: 'startCursor',
              endCursor: 'endCursor',
            },
            capacitySettlementsUploadUrl: `${apiBase}/v1/Dh2Bridge/ImportCapacitySettlements`,
            totalCount: mockedCalculations.length,
            nodes: mockedCalculations,
          },
        },
      });
      //return res(ctx.status(404), ctx.delay(300));
    }
  });
}

function getLatestCalculation() {
  return mockGetLatestCalculationQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        latestCalculation: {
          __typename: 'WholesaleAndEnergyCalculation',
          id: '00000000-0000-0000-0000-000000000001',
          period: { start: periodStart, end: periodEnd },
        },
      },
    });
  });
}

function getSettlementReports(apiBase: string) {
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
      data: wholesaleSettlementReportsQueryMock(apiBase),
    });
  });
}

function getSettlementReport(apiBase: string) {
  return mockGetSettlementReportQuery(async () => {
    await delay(mswConfig.delay);

    const [settlementReportById] = wholesaleSettlementReportsQueryMock(apiBase).settlementReports;

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        settlementReportById,
      },
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

function cancelSettlementReportMutation() {
  return mockCancelSettlementReportMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        cancelSettlementReport: {
          __typename: 'CancelSettlementReportPayload',
          boolean: true,
        },
      },
    });
  });
}
