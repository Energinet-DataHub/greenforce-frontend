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
import { delay, HttpResponse } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';
import { mockGetFailedSendMeasurementsInstancesQuery } from '@energinet-datahub/dh/shared/domain/graphql/msw';
import { SendMeasurementsInstanceDto } from '@energinet-datahub/dh/shared/domain/graphql';

const data: SendMeasurementsInstanceDto[] = [
  {
    __typename: 'SendMeasurementsInstanceDto',
    id: '1',
    idempotencyKeyHash: '12345',
    transactionId: '12345',
    meteringPointId: '12345',
    masterData: '',
    validationErrors: '',

    createdAt: new Date('2023-10-01T12:00:00Z'),
    businessValidationSucceededAt: null,
    sentToMeasurementsAt: null,
    receivedFromMeasurementsAt: null,
    sentToEnqueueActorMessagesAt: null,
    receivedFromEnqueueActorMessagesAt: null,
    terminatedAt: null,
    failedAt: new Date('2023-10-01T12:00:00Z'),
  }
];

export function getFailedSendMeasurementsInstances() {
  return mockGetFailedSendMeasurementsInstancesQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        failedSendMeasurementsInstances: {
          __typename: 'FailedSendMeasurementsInstancesConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: null,
            endCursor: null,
          },
          totalCount: data.length,
          nodes: data,
        },
      },
    });
  });
}
