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
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { ActorFilter, ProcessStepActor } from '@energinet-datahub/dh/wholesale/domain';
import { rest } from 'msw';

export function wholesaleMocks(apiBase: string) {
  return [
    createBatch(),
    getWholesaleSearchBatch(),
    getWholesaleSearchBatches(),
    downloadBasisData(apiBase),
    downloadSettlementReportData(apiBase),
    getProcessStepResult(),
    getProcessStepActors(),
    getSettlementReports(),
    getFilteredActors(),
    getGridAreas(),
    getLatestBalanceFixing(),
    getActorsForSettlementReportQuery(),
  ];
}

function createBatch() {
  return graphql.mockCreateBatchMutation((_req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.data({ createBatch: { id: '779195a4-2505-4290-97a6-f3eba2b7d179' } })
    );
  });
}

const periodStart = '2021-12-01T23:00:00Z';
const periodEnd = '2021-12-02T23:00:00Z';
const executionTimeStart = '2021-12-01T23:00:00Z';
const executionTimeEnd = '2021-12-02T23:00:00Z';
const fakeUserEmail = 'email@example.com';

export const mockedGridAreas: graphql.GridArea[] = [
  {
    __typename: 'GridArea',
    id: '1',
    code: '805',
    name: 'hello',
    priceAreaCode: graphql.PriceAreaCode.Dk_1,
    validFrom: '0001-01-01T00:00:00+00:00',
    validTo: null,
  },
  {
    __typename: 'GridArea',
    id: '2',
    code: '806',
    name: 'hello again',
    priceAreaCode: graphql.PriceAreaCode.Dk_1,
    validFrom: '0001-01-01T00:00:00+00:00',
    validTo: null,
  },
];

const mockedBatches: graphql.Batch[] = [
  {
    __typename: 'Batch',
    id: '8ff516a1-95b0-4f07-9b58-3fb94791c63b',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: graphql.BatchState.Pending,
    statusType: graphql.StatusType.Warning,
    isBasisDataDownloadAvailable: false,
    gridAreas: mockedGridAreas,
    processType: graphql.ProcessType.Aggregation,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: graphql.BatchState.Executing,
    statusType: graphql.StatusType.Info,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: '',
  },
  {
    __typename: 'Batch',
    id: '44447c27-6359-4f34-beed-7b51eccdda4e',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: graphql.BatchState.Completed,
    statusType: graphql.StatusType.Success,
    isBasisDataDownloadAvailable: true,
    gridAreas: mockedGridAreas,
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '59e65aec-df77-4f6f-b6d2-aa0fd4b4bc86',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: graphql.BatchState.Failed,
    statusType: graphql.StatusType.Danger,
    isBasisDataDownloadAvailable: false,
    gridAreas: mockedGridAreas,
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '78a9f690-6b8d-4708-92e9-dce64a31b1f7',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: graphql.BatchState.Pending,
    statusType: graphql.StatusType.Warning,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '8d631523-e6da-4883-ba6c-04bfd1c30d71',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: graphql.BatchState.Executing,
    statusType: graphql.StatusType.Info,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: 'ac84205b-6b9c-4f5c-8c6c-2ab81cc870b8',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: graphql.BatchState.Completed,
    statusType: graphql.StatusType.Success,
    isBasisDataDownloadAvailable: true,
    gridAreas: mockedGridAreas,
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '376e3cb8-16d7-4fb7-9cdf-1b55cc6af76f',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: graphql.BatchState.Failed,
    statusType: graphql.StatusType.Danger,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '3dad0a65-4094-44f8-80f1-7543622dcdf1',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: graphql.BatchState.Pending,
    statusType: graphql.StatusType.Warning,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: 'd0071d78-208c-4d69-8dd8-5538ed93b4da',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd: null,
    executionState: graphql.BatchState.Executing,
    statusType: graphql.StatusType.Info,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '1d109536-c2c6-4e3f-b3ab-85e73083e876',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: graphql.BatchState.Completed,
    statusType: graphql.StatusType.Success,
    isBasisDataDownloadAvailable: true,
    gridAreas: mockedGridAreas,
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
  {
    __typename: 'Batch',
    id: '19e3d848-e82f-4752-a68f-9befc755864c',
    period: { start: periodStart, end: periodEnd },
    executionTimeStart,
    executionTimeEnd,
    executionState: graphql.BatchState.Failed,
    statusType: graphql.StatusType.Danger,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
    processType: graphql.ProcessType.BalanceFixing,
    createdByUserName: fakeUserEmail,
  },
];

const mockedActors: ProcessStepActor[] = [
  { __typename: 'Actor', number: '5790000000001' },
  { __typename: 'Actor', number: '5790000000002' },
  { __typename: 'Actor', number: '5790000000003' },
  { __typename: 'Actor', number: '5790000000004' },
  { __typename: 'Actor', number: '5790000000005' },
  { __typename: 'Actor', number: '5790000000006' },
];

const mockedSettlementReports: graphql.SettlementReport[] = [
  {
    batchNumber: '8ff516a1-95b0-4f07-9b58-3fb94791c63b',
    processType: graphql.ProcessType.BalanceFixing,
    period: {
      start: '2020-01-28T23:00:00.000Z',
      end: '2020-01-29T22:59:59.998Z',
    },
    executionTime: '2023-03-03T07:38:29.3776159+00:00',
    gridArea: mockedGridAreas[0],
    __typename: 'SettlementReport',
  },
  {
    batchNumber: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    processType: graphql.ProcessType.Aggregation,
    period: {
      start: '2020-01-28T23:00:00.000Z',
      end: '2020-01-29T22:59:59.998Z',
    },
    executionTime: '2023-03-03T07:38:29.3776159+00:00',
    gridArea: mockedGridAreas[1],
    __typename: 'SettlementReport',
  },
];

const mockedFilteredActors: ActorFilter = [
  {
    value: '10',
    displayValue: 'EnergySupplier (805)',
    gridAreaCodes: ['805'],
  },
  {
    value: '20',
    displayValue: 'GridAccessProvider (806)',
    gridAreaCodes: ['806'],
  },
  {
    value: '30',
    displayValue: 'EnergySupplier (805, 806)',
    gridAreaCodes: ['805', '806'],
  },
  {
    value: '40',
    displayValue: 'GridAccessProvider (805, 806)',
    gridAreaCodes: ['805', '806'],
  },
  // No grid areas found
  {
    value: '50',
    displayValue: 'GridAccessProvider (807, 808)',
    gridAreaCodes: ['807', '808'],
  },
];

const mockedActorsForSettlementReport: ActorFilter = [
  {
    value: '10',
    displayValue: 'Energy Go - EnergySupplier (805)',
    gridAreaCodes: ['805'],
  },
  {
    value: '20',
    displayValue: 'Nordlys - GridAccessProvider (806)',
    gridAreaCodes: ['806'],
  },
  {
    value: '30',
    displayValue: 'Mod Strøm - EnergySupplier (807, 808)',
    gridAreaCodes: ['805', '806'],
  },
  {
    value: '40',
    displayValue: 'Stor Strøm - GridAccessProvider (807, 808)',
    gridAreaCodes: ['805', '806'],
  },
];

function getFilteredActors() {
  return graphql.mockGetActorFilterQuery((req, res, ctx) => {
    return res(ctx.status(200), ctx.data({ actors: mockedFilteredActors }), ctx.delay(300));
  });
}

function getActorsForSettlementReportQuery() {
  return graphql.mockGetActorsForSettlementReportQuery((req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.data({ actors: mockedActorsForSettlementReport }),
      ctx.delay(300)
    );
  });
}

function getWholesaleSearchBatch() {
  return graphql.mockGetBatchQuery((req, res, ctx) => {
    const batchId = req.variables.id;
    const batch = mockedBatches.find((b) => b.id === batchId);
    return res(ctx.delay(300), ctx.data({ batch }));
  });
}

function downloadBasisData(apiBase: string) {
  return rest.get(`${apiBase}/v1/WholesaleBatch/ZippedBasisDataStream`, async (req, res, ctx) => {
    return res(ctx.status(500));

    /*
      // Convert "base64" image to "ArrayBuffer".
      const imageBuffer = await fetch('assets/logo-light.svg').then((res) =>
        res.arrayBuffer()
      );
      return res(
        ctx.set('Content-Length', imageBuffer.byteLength.toString()),
        ctx.set('Content-Type', 'image/png'),
        // Respond with the "ArrayBuffer".
        ctx.body(imageBuffer)
      );
    */
  });
}

function downloadSettlementReportData(apiBase: string) {
  return rest.get(`${apiBase}/v1/WholesaleSettlementReport`, async (req, res, ctx) => {
    return res(ctx.status(500));

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

function getWholesaleSearchBatches() {
  return graphql.mockGetBatchesQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ batches: mockedBatches }));
    //return res(ctx.status(404), ctx.delay(300));
    //return res(ctx.status(500), ctx.delay(300));
  });
}

function getProcessStepResult() {
  return graphql.mockGetProcessStepResultQuery((req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.data({
        processStep: {
          result: {
            timeSeriesType: graphql.TimeSeriesType.Production,
            sum: 102234.245654,
            min: 0.0,
            max: 114.415789,
            timeSeriesPoints: [
              {
                time: periodStart,
                quantity: parseFloat(`${_randomIntFromInterval(0, 15)}.518`),
                quality: '',
              },
              {
                time: periodEnd,
                quantity: parseFloat(`${_randomIntFromInterval(0, 15)}.518`),
                quality: '',
              },
              {
                time: periodStart,
                quantity: parseFloat(`${_randomIntFromInterval(0, 15)}.518`),
                quality: '',
              },
              {
                time: periodEnd,
                quantity: parseFloat(`${_randomIntFromInterval(0, 15)}.518`),
                quality: '',
              },
            ],
          },
        },
      })
    );
  });
}

function getProcessStepActors() {
  return graphql.mockGetProcessStepActorsQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ processStep: { actors: mockedActors } }));
  });
}

function getSettlementReports() {
  return graphql.mockGetSettlementReportsQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ settlementReports: mockedSettlementReports }));
  });
}

function getGridAreas() {
  return graphql.mockGetGridAreasQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ gridAreas: mockedGridAreas }));
  });
}

function getLatestBalanceFixing() {
  return graphql.mockGetLatestBalanceFixingQuery((req, res, ctx) => {
    return res(
      ctx.delay(300),
      ctx.data({ batches: [{ period: { start: periodStart, end: periodEnd } }] })
    );
  });
}

function _randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
