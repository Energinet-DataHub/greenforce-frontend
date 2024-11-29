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
