import type { ResultOf } from '@graphql-typed-document-node/core';
import {
  GetOutgoingMessageByIdDocument,
  GetOutgoingMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhOutgoingMessageDetailed = ResultOf<
  typeof GetOutgoingMessageByIdDocument
>['esettOutgoingMessageById'];

export type DhOutgoingMessage = ResultOf<
  typeof GetOutgoingMessagesDocument
>['esettExchangeEvents']['items'][0];
