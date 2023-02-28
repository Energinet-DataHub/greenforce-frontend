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
import { rest } from 'msw';

export function wholesaleMocks(apiBase: string) {
  return [
    postWholesaleBatch(apiBase),
    getWholesaleSearchBatch(),
    getWholesaleSearchBatches(),
    downloadBasisData(apiBase),
    getProcessStepResult(),
    getProcessStepActors(),
  ];
}

function postWholesaleBatch(apiBase: string) {
  return rest.post(`${apiBase}/v1/WholesaleBatch`, (req, res, ctx) => {
    return res(ctx.status(200));
  });
}

const periodStart = '2021-12-01T23:00:00Z';
const periodEnd = '2021-12-02T23:00:00Z';
const executionTimeStart = '2021-12-01T23:00:00Z';
const executionTimeEnd = '2021-12-02T23:00:00Z';

export const mockedGridAreas: graphql.GridArea[] = [
  {
    __typename: 'GridArea',
    id: '1',
    code: '805',
    name: 'hello',
    priceAreaCode: graphql.PriceAreaCode.Dk_1,
    validFrom: '0001-01-01T00:00:00+00:00',
  },
  {
    __typename: 'GridArea',
    id: '2',
    code: '806',
    name: 'hello again',
    priceAreaCode: graphql.PriceAreaCode.Dk_1,
    validFrom: '0001-01-01T00:00:00+00:00',
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
  },
];

const mockedActors: graphql.Actor[] = [
  { __typename: 'Actor', number: '5790000000001' },
  { __typename: 'Actor', number: '5790000000002' },
  { __typename: 'Actor', number: '5790000000003' },
  { __typename: 'Actor', number: '5790000000004' },
  { __typename: 'Actor', number: '5790000000005' },
  { __typename: 'Actor', number: '5790000000006' },
];

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
      const imageBuffer = await fetch('FAKE_BASIS_DATA').then((res) =>
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

function getWholesaleSearchBatches() {
  return graphql.mockGetBatchesQuery((req, res, ctx) => {
    return res(ctx.delay(300), ctx.data({ batches: mockedBatches }));
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
                quantity: `${_randomIntFromInterval(0, 15)}.518`,
                quality: '',
              },
              {
                time: periodEnd,
                quantity: `${_randomIntFromInterval(0, 15)}.518`,
                quality: '',
              },
              {
                time: periodStart,
                quantity: `${_randomIntFromInterval(0, 15)}.518`,
                quality: '',
              },
              {
                time: periodEnd,
                quantity: `${_randomIntFromInterval(0, 15)}.518`,
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

function _randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
