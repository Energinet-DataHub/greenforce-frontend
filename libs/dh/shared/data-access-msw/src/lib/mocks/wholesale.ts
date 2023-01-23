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
    batchId: '123',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    isBasisDataDownloadAvailable: false,
    gridAreas: mockedGridAreas,
  },
  {
    batchId: '234',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '345',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    isBasisDataDownloadAvailable: true,
    gridAreas: [],
  },
  {
    batchId: '567',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    isBasisDataDownloadAvailable: false,
    gridAreas: mockedGridAreas,
  },
  {
    batchId: '8910',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '1011',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '1112',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    isBasisDataDownloadAvailable: true,
    gridAreas: [],
  },
  {
    batchId: '1314',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Failed,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '1516',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Pending,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '1718',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd: null,
    executionState: BatchState.Executing,
    isBasisDataDownloadAvailable: false,
    gridAreas: [],
  },
  {
    batchId: '1920',
    periodStart,
    periodEnd,
    executionTimeStart,
    executionTimeEnd,
    executionState: BatchState.Completed,
    isBasisDataDownloadAvailable: true,
    gridAreas: [],
  },
  {
    batchId: '2021',
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
