import { graphql } from '@energinet-datahub/dh/shared/domain';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type Permission = ResultOf<typeof graphql.GetPermissionsDocument>['permissions'][0];
