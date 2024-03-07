import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  DelegationMessageType,
  GetDelegationsForActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhDelegation = ResultOf<
  typeof GetDelegationsForActorDocument
>['getDelegationsForActor']['delegations'][0];

export type DhDelegations = DhDelegation[];

export type DhDelegationsByType = {
  type?: DelegationMessageType;
  delegations?: DhDelegations;
};

export type DhDelegationsByDirection = Record<'outgoing' | 'incoming', DhDelegations>;

export type DhDelegationsGrouped = Record<'outgoing' | 'incoming', DhDelegationsByType[]>;
