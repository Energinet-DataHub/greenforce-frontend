import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  DelegatedProcess,
  GetDelegationsForActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhDelegation = ResultOf<
  typeof GetDelegationsForActorDocument
>['delegationsForActor'][0];

export type DhDelegations = DhDelegation[];

export type DhDelegationsByType = {
  type: DelegatedProcess;
  delegations: DhDelegations;
}[];
