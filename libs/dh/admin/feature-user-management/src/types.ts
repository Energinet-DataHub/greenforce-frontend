import {
  GetActorsAndUserRolesDocument,
  GetUserDetailsDocument,
  GetUserRolesByActorIdDocument,
  GetUsersDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type DhUsers = NonNullable<ResultOf<typeof GetUsersDocument>['users']>['items'];
export type DhUser = NonNullable<DhUsers>[0];

export type DhUserDetails = ResultOf<typeof GetUserDetailsDocument>['userById'];

export type UserRoleItem = ResultOf<typeof GetUserRolesByActorIdDocument>['userRolesByActorId'][0];
