import type { ResultOf } from '@graphql-typed-document-node/core';

import { GetMeteringGridAreaImbalanceDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhMeteringGridAreaImbalance = ResultOf<
  typeof GetMeteringGridAreaImbalanceDocument
>['meteringGridAreaImbalance']['items'][0];

export type MeteringGridAreaImbalancePerDayDto = ResultOf<
  typeof GetMeteringGridAreaImbalanceDocument
>['meteringGridAreaImbalance']['items'][0]['incomingImbalancePerDay'][0];
