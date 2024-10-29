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
import { HttpResponse, delay } from 'msw';

import {
  mockDismissNotificationMutation,
  mockGetNotificationsQuery,
  NotificationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
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
            relatedToId: null,
            occurredAt: new Date('2024-10-20'),
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
