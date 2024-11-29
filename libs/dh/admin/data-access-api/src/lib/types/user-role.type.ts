import type { ResultOf } from '@graphql-typed-document-node/core';
import {
  GetUserRolesDocument,
  GetUserRoleWithPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhUserRoles = ResultOf<typeof GetUserRolesDocument>['userRoles'];

export type DhUserRole = DhUserRoles[0];

export type DhUserRoleWithPermissions = ResultOf<
  typeof GetUserRoleWithPermissionsDocument
>['userRoleById'];

export type DhUserRolePermissionDetails = DhUserRoleWithPermissions['permissions'][0];
