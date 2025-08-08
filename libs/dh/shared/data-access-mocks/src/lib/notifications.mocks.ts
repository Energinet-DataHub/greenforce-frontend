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
import { HttpResponse, delay } from 'msw';

import { NotificationType } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  mockDismissNotificationMutation,
  mockGetNotificationsQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import { mswConfig } from '@energinet-datahub/gf/util-msw';

export function notificationsMocks() {
  return [dismissNotification(), getNotifications()];
}

function getNotifications() {
  return mockGetNotificationsQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        notifications: [
          {
            __typename: 'NotificationDto',
            id: 1,
            notificationType: NotificationType.BalanceResponsibilityValidationFailed,
            relatedToId: '1',
            occurredAt: new Date('2024-10-01'),
          },
          {
            __typename: 'NotificationDto',
            id: 2,
            notificationType: NotificationType.BalanceResponsibilityActorUnrecognized,
            relatedToId: '6',
            occurredAt: new Date('2024-10-10'),
          },
          {
            __typename: 'NotificationDto',
            id: 3,
            notificationType: NotificationType.SettlementReportReadyForDownload,
            relatedToId: '12344321',
            occurredAt: new Date('2024-10-20'),
          },
          {
            __typename: 'NotificationDto',
            id: 4,
            notificationType: NotificationType.SettlementReportFailed,
            relatedToId: null,
            occurredAt: new Date('2024-10-20'),
          },
          {
            __typename: 'NotificationDto',
            id: 5,
            notificationType: NotificationType.NewBalanceResponsibilityReceived,
            relatedToId: '4',
            occurredAt: new Date('2024-10-30'),
          },
          {
            __typename: 'NotificationDto',
            id: 6,
            notificationType: NotificationType.MeteringGridAreaIsImbalanced,
            relatedToId: '2',
            occurredAt: new Date('2024-11-01'),
          },
          {
            __typename: 'NotificationDto',
            id: 7,
            notificationType: NotificationType.ActorConsolidationScheduled,
            relatedToId: '5',
            occurredAt: new Date('2024-11-02'),
          },
          {
            __typename: 'NotificationDto',
            id: 8,
            notificationType: NotificationType.GridLossValidationError,
            relatedToId: '123',
            occurredAt: new Date('2025-08-07'),
          },
        ],
      },
    });
  });
}

function dismissNotification() {
  return mockDismissNotificationMutation(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Mutation',
        dismissNotification: {
          __typename: 'DismissNotificationPayload',
          success: true,
        },
      },
    });
  });
}
