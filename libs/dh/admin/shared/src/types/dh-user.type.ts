import { GetUserByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type DhUser = ResultOf<typeof GetUserByIdDocument>['userById'];

export type DhActorUser = DhUser['actors'][0];

export type DhActorUserRoles = DhActorUser['userRoles'];

export type DhActorUserRole = DhActorUserRoles[0];

export type DhUsers = DhUser[];
