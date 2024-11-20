import { GetUsersDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type DhUsers = NonNullable<ResultOf<typeof GetUsersDocument>['users']>['nodes'];
export type DhUser = NonNullable<DhUsers>[0];
