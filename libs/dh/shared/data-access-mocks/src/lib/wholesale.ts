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
import parseISO from 'date-fns/parseISO';

import {
  BatchState,
  Calculation,
  EicFunction,
  GridAreaDto,
  PriceAreaCode,
  ProcessStatus,
  ProcessType,
  SettlementReport,
  mockCreateCalculationMutation,
  mockGetActorFilterQuery,
  mockGetActorsForRequestCalculationQuery,
  mockGetActorsForSettlementReportQuery,
  mockGetCalculationByIdQuery,
  mockGetCalculationsQuery,
  mockGetGridAreasQuery,
  mockGetLatestBalanceFixingQuery,
  mockGetSelectedActorQuery,
  mockGetSettlementReportsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { ActorFilter } from '@energinet-datahub/dh/wholesale/domain';

import { GetActorsForRequestCalculation } from './data/wholesale-get-actorsForRequestCalculation';
import { mockRequestCalculationMutation } from '@energinet-datahub/dh/shared/domain/graphql';

export function wholesaleMocks(apiBase: string) {
  return [
    createCalculation(),
    getCalculation(),
    getCalculations(),
    downloadSettlementReportData(apiBase),
    getSettlementReports(),
    getFilteredActors(),
    getGridAreas(),
    getLatestBalanceFixing(),
    getActorsForSettlementReportQuery(),
    getActorsForRequestCalculationQuery(),
    getSelectedActorQuery(),
    requestCalculationMutation(),
  ];
}

function createCalculation() {
  return mockCreateCalculationMutation(async () => {
    await delay(300);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createCalculation: {
          __typename: 'CreateCalculationPayload',
          calculation: {
            __typename: 'Calculation',
            id: '779195a4-2505-4290-97a6-f3eba2b7d179',
          },
        },
      },
    });
  });
}

const periodStart = parseISO('2021-12-01T23:00:00Z');
const periodEnd = parseISO('2021-12-02T23:00:00Z');
const executionTimeStart = parseISO('2021-12-01T23:00:00Z');
const executionTimeEnd = parseISO('2021-12-02T23:00:00Z');
const validFrom = parseISO('0001-01-01T00:00:00+00:00');
const fakeUserEmail = 'email@example.com';

export const mockedGridAreas: GridAreaDto[] = [
  {
    __typename: 'GridAreaDto',
    id: '1',
    code: '805',
    name: 'hello',
    priceAreaCode: PriceAreaCode.Dk1,
    validFrom,
    validTo: null,
  },
  {
    __typename: 'GridAreaDto',
    id: '2',
    code: '806',
    name: 'hello again',
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
    executionState: BatchState.Pending,
    statusType: ProcessStatus.Warning,
    gridAreas: mockedGridAreas,
    processType: ProcessType.Aggregation,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    statusType: ProcessStatus.Info,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: '',
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '44447c27-6359-4f34-beed-7b51eccdda4e',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    statusType: ProcessStatus.Success,
    gridAreas: mockedGridAreas,
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '59e65aec-df77-4f6f-b6d2-aa0fd4b4bc86',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    statusType: ProcessStatus.Danger,
    gridAreas: mockedGridAreas,
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '78a9f690-6b8d-4708-92e9-dce64a31b1f7',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    statusType: ProcessStatus.Warning,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '8d631523-e6da-4883-ba6c-04bfd1c30d71',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    statusType: ProcessStatus.Info,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: 'ac84205b-6b9c-4f5c-8c6c-2ab81cc870b8',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    statusType: ProcessStatus.Success,
    gridAreas: mockedGridAreas,
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '376e3cb8-16d7-4fb7-9cdf-1b55cc6af76f',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    statusType: ProcessStatus.Danger,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '3dad0a65-4094-44f8-80f1-7543622dcdf1',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    statusType: ProcessStatus.Warning,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: 'd0071d78-208c-4d69-8dd8-5538ed93b4da',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    statusType: ProcessStatus.Info,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '1d109536-c2c6-4e3f-b3ab-85e73083e876',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    statusType: ProcessStatus.Success,
    gridAreas: mockedGridAreas,
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
  {
    __typename: 'Calculation',
    id: '19e3d848-e82f-4752-a68f-9befc755864c',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    statusType: ProcessStatus.Danger,
    gridAreas: [],
    processType: ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
    areSettlementReportsCreated: false,
  },
];

const executionTime = parseISO('2023-03-03T07:38:29.3776159+00:00');
const period = {
  start: parseISO('2020-01-28T23:00:00.000Z'),
  end: parseISO('2020-01-29T22:59:59.998Z'),
};

const mockedSettlementReports: SettlementReport[] = [
  {
    batchNumber: '8ff516a1-95b0-4f07-9b58-3fb94791c63b',
    processType: ProcessType.BalanceFixing,
    period,
    executionTime,
    gridArea: mockedGridAreas[0],
    __typename: 'SettlementReport',
  },
  {
    batchNumber: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    processType: ProcessType.Aggregation,
    period,
    executionTime,
    gridArea: mockedGridAreas[1],
    __typename: 'SettlementReport',
  },
];

const mockedFilteredActors: ActorFilter = [
  {
    __typename: 'Actor',
    value: '10',
    displayValue: 'EnergySupplier (805)',
    gridAreas: [{ __typename: 'GridAreaDto', code: '805' }],
  },
  {
    __typename: 'Actor',
    value: '20',
    displayValue: 'GridAccessProvider (806)',
    gridAreas: [{ __typename: 'GridAreaDto', code: '806' }],
  },
  {
    __typename: 'Actor',
    value: '30',
    displayValue: 'EnergySupplier (805, 806)',
    gridAreas: [
      { __typename: 'GridAreaDto', code: '805' },
      { __typename: 'GridAreaDto', code: '806' },
    ],
  },
  {
    __typename: 'Actor',
    value: '40',
    displayValue: 'GridAccessProvider (805, 806)',
    gridAreas: [
      { __typename: 'GridAreaDto', code: '805' },
      { __typename: 'GridAreaDto', code: '806' },
    ],
  },
  // No grid areas found
  {
    __typename: 'Actor',
    value: '50',
    displayValue: 'GridAccessProvider (807, 808)',
    gridAreas: [
      { __typename: 'GridAreaDto', code: '807' },
      { __typename: 'GridAreaDto', code: '808' },
    ],
  },
];

const mockedActorsForSettlementReport: ActorFilter = [
  {
    __typename: 'Actor',
    value: '10',
    displayValue: 'Energy Go - EnergySupplier (805)',
    gridAreas: [{ __typename: 'GridAreaDto', code: '805' }],
  },
  {
    __typename: 'Actor',
    value: '20',
    displayValue: 'Nordlys - GridAccessProvider (806)',
    gridAreas: [{ __typename: 'GridAreaDto', code: '806' }],
  },
  {
    __typename: 'Actor',
    value: '30',
    displayValue: 'Mod Strøm - EnergySupplier (807, 808)',
    gridAreas: [
      { __typename: 'GridAreaDto', code: '805' },
      { __typename: 'GridAreaDto', code: '806' },
    ],
  },
  {
    __typename: 'Actor',
    value: '40',
    displayValue: 'Stor Strøm - GridAccessProvider (807, 808)',
    gridAreas: [
      { __typename: 'GridAreaDto', code: '807' },
      { __typename: 'GridAreaDto', code: '808' },
    ],
  },
];

function getFilteredActors() {
  return mockGetActorFilterQuery(async () => {
    await delay(300);
    return HttpResponse.json({ data: { __typename: 'Query', actors: mockedFilteredActors } });
  });
}

function getActorsForSettlementReportQuery() {
  return mockGetActorsForSettlementReportQuery(async () => {
    await delay(300);
    return HttpResponse.json({
      data: { __typename: 'Query', actorsForEicFunction: mockedActorsForSettlementReport },
    });
  });
}

function getActorsForRequestCalculationQuery() {
  return mockGetActorsForRequestCalculationQuery(async () => {
    await delay(300);
    return HttpResponse.json({
      data: { __typename: 'Query', actorsForEicFunction: GetActorsForRequestCalculation },
    });
  });
}

function getSelectedActorQuery() {
  return mockGetSelectedActorQuery(async () => {
    await delay(300);
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
    await delay(300);
    return calculationById
      ? HttpResponse.json({
          data: { __typename: 'Query', calculationById },
        })
      : HttpResponse.json({ data: null }, { status: 404 });
  });
}

function downloadSettlementReportData(apiBase: string) {
  return http.get(`${apiBase}/v1/WholesaleSettlementReport`, async () => {
    return HttpResponse.json(null, { status: 500 });

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

function getCalculations() {
  return mockGetCalculationsQuery(async ({ variables }) => {
    if (!variables.executionTime) {
      return HttpResponse.json({ data: null }, { status: 500 });
    } else {
      await delay(300);
      return HttpResponse.json({
        data: { __typename: 'Query', calculations: mockedCalculations },
      });
      //return res(ctx.status(404), ctx.delay(300));
    }
  });
}

function getSettlementReports() {
  return mockGetSettlementReportsQuery(async () => {
    await delay(300);
    return HttpResponse.json({
      data: { __typename: 'Query', settlementReports: mockedSettlementReports },
    });
  });
}

function getGridAreas() {
  return mockGetGridAreasQuery(async () => {
    await delay(300);
    return HttpResponse.json({
      data: { __typename: 'Query', gridAreas: mockedGridAreas },
    });
  });
}

function getLatestBalanceFixing() {
  return mockGetLatestBalanceFixingQuery(async () => {
    await delay(300);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        calculations: [
          { __typename: 'Calculation', period: { start: periodStart, end: periodEnd } },
        ],
      },
    });
  });
}

function requestCalculationMutation() {
  return mockRequestCalculationMutation(async () => {
    await delay(300);
    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        createAggregatedMeasureDataRequest: {
          __typename: 'CreateAggregatedMeasureDataRequestPayload',
          success: true,
        },
      },
    });
  });
}
