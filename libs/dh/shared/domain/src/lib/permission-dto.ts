import type { ResultOf } from '@graphql-typed-document-node/core';

import { GetPermissionDetailsDocument, GetPermissionsDocument } from './generated/graphql/types';

export type PermissionDetailDto = ResultOf<typeof GetPermissionDetailsDocument>['permissionById'];

export type PermissionDto = ResultOf<
  typeof GetPermissionsDocument
>['permissions']['permissions'][0];
