import { ResultOf } from 'apollo-angular';

import { GetActorsForRequestCalculationDocument } from '@energinet-datahub/dh/shared/domain/graphql';

export type ActorForRequestCalculation = ResultOf<
  typeof GetActorsForRequestCalculationDocument
>['actorsForEicFunction'][0];
