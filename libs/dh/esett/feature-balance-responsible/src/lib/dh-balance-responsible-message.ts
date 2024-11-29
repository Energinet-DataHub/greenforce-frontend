import type { ResultOf } from '@graphql-typed-document-node/core';
import { GetBalanceResponsibleMessagesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhBalanceResponsibleMessage = ResultOf<
  typeof GetBalanceResponsibleMessagesDocument
>['balanceResponsible']['page'][0];
