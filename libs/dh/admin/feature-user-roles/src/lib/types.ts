import type { ResultOf } from '@graphql-typed-document-node/core';

import { GetActorsAndUserRolesDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhUserByIdMarketParticipant = ResultOf<
  typeof GetActorsAndUserRolesDocument
>['userById']['actors'][0];
