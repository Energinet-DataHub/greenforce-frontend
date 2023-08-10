import type { ResultOf } from '@graphql-typed-document-node/core';

import { GetActorsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhActor = ResultOf<typeof GetActorsDocument>['actors'][0];
