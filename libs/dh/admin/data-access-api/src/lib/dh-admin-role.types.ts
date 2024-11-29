import type { ResultOf } from '@graphql-typed-document-node/core';
import { GetUserRolesByActorIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type UserRoleItem = ResultOf<typeof GetUserRolesByActorIdDocument>['userRolesByActorId'][0];
