import type { ResultOf } from '@graphql-typed-document-node/core';
import { GetUserByIdDocument } from '../../../../shared/domain/src/lib/generated/graphql';

export type DhUser = ResultOf<typeof GetUserByIdDocument>['userById'];
