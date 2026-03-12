import { GetMeteringPointProcessOverviewDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type MeteringPointProcess = ResultOf<
  typeof GetMeteringPointProcessOverviewDocument
>['meteringPointProcessOverview']['0'];
