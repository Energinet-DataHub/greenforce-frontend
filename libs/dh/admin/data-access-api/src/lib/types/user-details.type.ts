import type { ResultOf } from '@graphql-typed-document-node/core';
import { GetUserDetailsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhUserDetails = ResultOf<typeof GetUserDetailsDocument>['userById'];
