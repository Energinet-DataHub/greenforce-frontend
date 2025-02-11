import { GetMeteringPointByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type MeteringPointDetails = ResultOf<typeof GetMeteringPointByIdDocument>['meteringPoint'];
