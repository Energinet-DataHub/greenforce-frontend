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
  PriceAreaCode,
} from '@energinet-datahub/dh/shared/domain';
import { rest } from 'msw';

export function wholesaleMocks(apiBase: string) {
  return [
    postWholesaleBatch(apiBase),
    getWholesaleSearchBatch(apiBase),
    getWholesaleSearchBatches(apiBase),
    downloadBasisData(apiBase),
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

function getWholesaleSearchBatch(apiBase: string) {
  return rest.get(`${apiBase}/v1/WholesaleBatch/Batch`, (req, res, ctx) => {
    const batchId = req.url.searchParams.get('batchId') || '';
    const batch: BatchDto = {
      batchNumber: batchId,
      periodStart,
      periodEnd,
      executionTimeStart,
      executionTimeEnd: null,
      executionState: BatchState.Pending,
      isBasisDataDownloadAvailable: false,
      gridAreas: [
        {
          id: '1',
          code: '805',
          name: 'hello',
          priceAreaCode: PriceAreaCode.Dk1,
          validFrom: '01-11-2022',
        },
        {
          id: '2',
          code: '806',
          name: 'hello again',
          priceAreaCode: PriceAreaCode.Dk1,
          validFrom: '01-11-2022',
        },
      ],
    };
    return res(ctx.status(200), ctx.json(batch));
  });
}

function downloadBasisData(apiBase: string) {
  return rest.get(
    `${apiBase}/v1/WholesaleBatch/ZippedBasisDataStream?batchId=123`,
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
    const mockData: BatchDto[] = [
      {
        batchNumber: '123',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Pending,
        isBasisDataDownloadAvailable: false,
        gridAreas: [
          {
            id: '1',
            code: '805',
            name: 'hello',
            priceAreaCode: PriceAreaCode.Dk1,
            validFrom: '11-11-2022',
          },
          {
            id: '2',
            code: '806',
            name: 'hello again',
            priceAreaCode: PriceAreaCode.Dk1,
            validFrom: '11-11-2022',
          },
        ],
      },
      {
        batchNumber: '234',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Executing,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '345',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Completed,
        isBasisDataDownloadAvailable: true,
        gridAreas: [],
      },
      {
        batchNumber: '567',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Failed,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '8910',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Pending,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '1011',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Executing,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '1112',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Completed,
        isBasisDataDownloadAvailable: true,
        gridAreas: [],
      },
      {
        batchNumber: '1314',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Failed,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '1516',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Pending,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '1718',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Executing,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
      {
        batchNumber: '1920',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Completed,
        isBasisDataDownloadAvailable: true,
        gridAreas: [],
      },
      {
        batchNumber: '2021',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Failed,
        isBasisDataDownloadAvailable: false,
        gridAreas: [],
      },
    ];

    return res(ctx.delay(300), ctx.status(200), ctx.json(mockData));
    //return res(ctx.delay(300), ctx.status(200), ctx.json([]));
    //return res(ctx.delay(2000), ctx.status(500));
  });
}
