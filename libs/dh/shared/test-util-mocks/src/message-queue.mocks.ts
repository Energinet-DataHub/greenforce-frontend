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

import { mockGetActorMessageQueuesQuery } from '@energinet-datahub/dh/shared/domain/graphql/msw';

import {
  MessageCategoryV1,
  OutgoingDocumentTypeV1,
  BusinessReasonV1,
} from '@energinet-datahub/dh/shared/domain/graphql';

export function messageQueueMocks() {
  return [
    mockGetActorMessageQueuesQuery(async () => {
      await delay(mswConfig.delay);
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          actorMessageQueues: {
            __typename: 'ActorMessageQueueResult',
            queues: [
              {
                __typename: 'ActorMessageQueue',
                category: MessageCategoryV1.Processes,
                count: 3,
                messages: [
                  {
                    __typename: 'QueuedMessage',
                    messageId: 'MSG-001',
                    documentType: OutgoingDocumentTypeV1.Acknowledgement,
                    businessReason: BusinessReasonV1.CustomerMoveIn,
                    enqueuedAt: new Date('2026-04-01T08:00:00Z'),
                  },
                  {
                    __typename: 'QueuedMessage',
                    messageId: 'MSG-002',
                    documentType: OutgoingDocumentTypeV1.NotifyAggregatedMeasureData,
                    businessReason: BusinessReasonV1.BalanceFixing,
                    enqueuedAt: new Date('2026-04-02T09:30:00Z'),
                  },
                  {
                    __typename: 'QueuedMessage',
                    messageId: 'MSG-003',
                    documentType: OutgoingDocumentTypeV1.Acknowledgement,
                    businessReason: BusinessReasonV1.ChangeOfEnergySupplier,
                    enqueuedAt: new Date('2026-04-03T10:15:00Z'),
                  },
                ],
              },
              {
                __typename: 'ActorMessageQueue',
                category: MessageCategoryV1.MeasureData,
                count: 2,
                messages: [
                  {
                    __typename: 'QueuedMessage',
                    messageId: 'MSG-004',
                    documentType: OutgoingDocumentTypeV1.NotifyValidatedMeasureData,
                    businessReason: BusinessReasonV1.PeriodicMetering,
                    enqueuedAt: new Date('2026-04-01T07:00:00Z'),
                  },
                  {
                    __typename: 'QueuedMessage',
                    messageId: 'MSG-005',
                    documentType: OutgoingDocumentTypeV1.RejectRequestMeasurements,
                    businessReason: BusinessReasonV1.PeriodicFlexMetering,
                    enqueuedAt: new Date('2026-04-02T11:00:00Z'),
                  },
                ],
              },
              {
                __typename: 'ActorMessageQueue',
                category: MessageCategoryV1.Aggregations,
                count: 1,
                messages: [
                  {
                    __typename: 'QueuedMessage',
                    messageId: 'MSG-006',
                    documentType: OutgoingDocumentTypeV1.NotifyAggregatedMeasureData,
                    businessReason: BusinessReasonV1.WholesaleFixing,
                    enqueuedAt: new Date('2026-04-01T06:00:00Z'),
                  },
                ],
              },
            ],
          },
        },
      });
    }),
  ];
}
