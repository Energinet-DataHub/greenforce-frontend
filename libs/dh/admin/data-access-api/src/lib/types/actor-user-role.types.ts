import { GetActorsAndUserRolesDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type ActorUserRoles = ResultOf<
  typeof GetActorsAndUserRolesDocument
>['userById']['actors'][0]['userRoles'];

export type ActorUserRole = ActorUserRoles[0];
