import {
  InputMaybe,
  MeteringGridImbalanceValuesToInclude,
  Scalars,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhMeteringGridAreaImbalanceFilters = {
  gridAreas?: InputMaybe<[string]>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  created?: InputMaybe<Scalars['DateRange']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
};
