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

import { mswConfig } from '@energinet-datahub/gf/msw/test-util-msw-setup';
import {
  mockGetProcessTransactionIdQuery,
  mockGetTemporaryStorageDataQuery,
  mockInitiateMoveInMutation,
  mockRequestChangeCustomerCharacteristicsMutation,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

export function moveInMocks() {
  return [
    initiateMoveInMutation(),
    changeCustomerCharacteristics(),
    getProcessTransactionId(),
    getTemporaryStorageData(),
  ];
}

function initiateMoveInMutation() {
  return mockInitiateMoveInMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        initiateMoveIn: {
          __typename: 'InitiateMoveInPayload',
          success: true,
        },
      },
    });
  });
}

function changeCustomerCharacteristics() {
  return mockRequestChangeCustomerCharacteristicsMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        changeCustomerCharacteristics: {
          __typename: 'ChangeCustomerCharacteristicsPayload',
          success: true,
        },
      },
    });
  });
}

function getProcessTransactionId() {
  return mockGetProcessTransactionIdQuery(async (args) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessById: {
          __typename: 'MeteringPointProcess' as const,
          transactionId: `txn-${args.variables.id}`,
        },
      },
    });
  });
}

function getTemporaryStorageData() {
  return mockGetTemporaryStorageDataQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        temporaryStorageData: {
          __typename: 'RequestTemporaryStorageResult',
          firstCustomerName: 'John Doe',
          isBusinessCustomer: false,
        },
      },
    });
  });
}
