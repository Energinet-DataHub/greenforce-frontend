import type { ResultOf } from '@graphql-typed-document-node/core';
import { GetUserDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type UserDetails = ResultOf<typeof GetUserDetailsDocument>['userById'];
