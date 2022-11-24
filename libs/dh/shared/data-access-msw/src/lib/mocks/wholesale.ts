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
import { BatchDtoV2, BatchState } from '@energinet-datahub/dh/shared/domain';
import { rest } from 'msw';

export function wholesaleMocks(apiBase: string) {
  return [
    postWholesaleBatch(apiBase),
    getWholesaleSearchBatch(apiBase),
    downloadBasisData(apiBase),
  ];
}

function postWholesaleBatch(apiBase: string) {
  return rest.post(`${apiBase}/v1/WholesaleBatch`, (req, res, ctx) => {
    return res(ctx.status(200));
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

function getWholesaleSearchBatch(apiBase: string) {
  const periodStart = '2021-12-01T23:00:00Z';
  const periodEnd = '2021-12-02T23:00:00Z';
  const executionTimeStart = '2021-12-01T23:00:00Z';
  const executionTimeEnd = '2021-12-02T23:00:00Z';

  return rest.post(`${apiBase}/v1/WholesaleBatch/search`, (req, res, ctx) => {
    const mockData: BatchDtoV2[] = [
      {
        batchNumber: '123',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Pending,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [
           '805',
          '806'
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
        gridAreaCodes: [],
      },
      {
        batchNumber: '345',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Completed,
        isBasisDataDownloadAvailable: true,
        gridAreaCodes: [],
      },
      {
        batchNumber: '567',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Failed,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
      {
        batchNumber: '123',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Pending,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
      {
        batchNumber: '234',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Executing,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
      {
        batchNumber: '345',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Completed,
        isBasisDataDownloadAvailable: true,
        gridAreaCodes: [],
      },
      {
        batchNumber: '567',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Failed,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
      {
        batchNumber: '123',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Pending,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
      {
        batchNumber: '234',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd: null,
        executionState: BatchState.Executing,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
      {
        batchNumber: '345',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Completed,
        isBasisDataDownloadAvailable: true,
        gridAreaCodes: [],
      },
      {
        batchNumber: '567',
        periodStart,
        periodEnd,
        executionTimeStart,
        executionTimeEnd,
        executionState: BatchState.Failed,
        isBasisDataDownloadAvailable: false,
        gridAreaCodes: [],
      },
    ];

    return res(ctx.delay(300), ctx.status(200), ctx.json(mockData));
    //return res(ctx.delay(300), ctx.status(200), ctx.json([]));
    //return res(ctx.delay(2000), ctx.status(500));
  });
}
