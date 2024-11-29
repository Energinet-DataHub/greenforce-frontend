import { GetNotificationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type DhNotifications = ResultOf<typeof GetNotificationsDocument>['notifications'];
export type DhNotification = DhNotifications[0];
