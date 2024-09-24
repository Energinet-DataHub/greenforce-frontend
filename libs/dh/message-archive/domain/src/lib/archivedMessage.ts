import type { ResultOf } from '@graphql-typed-document-node/core';
import type { GetArchivedMessagesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type ArchivedMessage = NonNullable<
  NonNullable<ResultOf<typeof GetArchivedMessagesDocument>['archivedMessages']>['nodes']
>[number];
