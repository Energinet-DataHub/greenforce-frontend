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
import {
  BatchDto,
  BatchState,
  GridAreaDto,
  PriceAreaCode,
  ProcessStepMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { rest } from 'msw';

export function wholesaleMocks(apiBase: string) {
  return [
    postWholesaleBatch(apiBase),
    getWholesaleSearchBatch(apiBase),
    getWholesaleSearchBatches(apiBase),
    downloadBasisData(apiBase),
    postWholesaleBatchProcessStepResult(apiBase),
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

export const mockedGridAreas: GridAreaDto[] = [
  {
    id: '1',
    code: '805',
    name: 'hello',
    priceAreaCode: PriceAreaCode.Dk1,
    validFrom: '0001-01-01T00:00:00+00:00',
  },
  {
    id: '2',
    code: '806',
    name: 'hello again',
    priceAreaCode: PriceAreaCode.Dk1,
    validFrom: '0001-01-01T00:00:00+00:00',
  },
];

const mockedBatches: BatchDto[] = [
  {
    batchId: '8ff516a1-95b0-4f07-9b58-3fb94791c63b',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    isBasisDataDownloadAvailable: false,
    gridAreas: mockedGridAreas,
  },
  {
    batchId: '911d0c33-3232-49e1-a0ef-bcef313d1098',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '44447c27-6359-4f34-beed-7b51eccdda4e',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    isBasisDataDownloadAvailable: true,
    gridAreas: [],
  },
  {
    batchId: '59e65aec-df77-4f6f-b6d2-aa0fd4b4bc86',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    isBasisDataDownloadAvailable: false,
    gridAreas: mockedGridAreas,
  },
  {
    batchId: '78a9f690-6b8d-4708-92e9-dce64a31b1f7',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '8d631523-e6da-4883-ba6c-04bfd1c30d71',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: 'ac84205b-6b9c-4f5c-8c6c-2ab81cc870b8',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    isBasisDataDownloadAvailable: true,
    gridAreas: [],
  },
  {
    batchId: '376e3cb8-16d7-4fb7-9cdf-1b55cc6af76f',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '3dad0a65-4094-44f8-80f1-7543622dcdf1',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: 'd0071d78-208c-4d69-8dd8-5538ed93b4da',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '1d109536-c2c6-4e3f-b3ab-85e73083e876',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    isBasisDataDownloadAvailable: true,
    gridAreas: [],
  },
  {
    batchId: '19e3d848-e82f-4752-a68f-9befc755864c',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
];

function getWholesaleSearchBatch(apiBase: string) {
  return rest.get(`${apiBase}/v1/WholesaleBatch/Batch`, (req, res, ctx) => {
    const batchId = req.url.searchParams.get('batchId') || '';
    const batch = mockedBatches.find((b) => b.batchId === batchId);
    return res(ctx.delay(300), ctx.status(200), ctx.json(batch));
  });
}

function downloadBasisData(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/WholesaleBatch/ZippedBasisDataStream`,
    async (req, res, ctx) => {
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
    }
  );
}

function getWholesaleSearchBatches(apiBase: string) {
  return rest.post(`${apiBase}/v1/WholesaleBatch/search`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200), ctx.json(mockedBatches));
    //return res(ctx.delay(300), ctx.status(200), ctx.json([]));
    //return res(ctx.delay(2000), ctx.status(500));
  });
}

function postWholesaleBatchProcessStepResult(apiBase: string) {
  return rest.post(
    `${apiBase}/v1/WholesaleBatch/ProcessStepResult`,
    (req, res, ctx) => {
      return res(
        ctx.delay(300),
        ctx.status(200),
        ctx.json({
          processStepMeteringPointType: ProcessStepMeteringPointType.Production,
          sum: 102234.245654,
          min: 0.0,
          max: 114.415789,
          timeSeriesPoints: [
            {
              time: periodStart,
              quantity: 13.518,
            },
            {
              time: periodEnd,
              quantity: 13.518,
            },
            {
              time: periodStart,
              quantity: 13.518,
            },
            {
              time: periodEnd,
              quantity: 13.518,
            },
          ],
        })
      );
    }
  );
}
