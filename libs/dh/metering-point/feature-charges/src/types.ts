import { GetChargesByMeteringPointIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

export type Charge = ResultOf<
  typeof GetChargesByMeteringPointIdDocument
>['chargesByMeteringPointId'][0];
