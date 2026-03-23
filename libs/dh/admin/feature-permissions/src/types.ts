import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  GetFilteredPermissionsDocument,
  GetPermissionDetailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type Permissions = NonNullable<
  ResultOf<typeof GetFilteredPermissionsDocument>['filteredPermissions']
>['nodes'];

export type Permission = NonNullable<Permissions>[0];

export type DhPermissionDetailsUserRole = ResultOf<
  typeof GetPermissionDetailsDocument
>['permissionById']['userRoles'][0];

export type DhPermissionDetailsMarketRole = ResultOf<
  typeof GetPermissionDetailsDocument
>['permissionById']['assignableTo'][number];
