import {
  DocumentStatus,
  ExchangeEventCalculationType,
  InputMaybe,
  Scalars,
  EsettTimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhOutgoingMessagesFilters = {
  calculationTypes?: InputMaybe<ExchangeEventCalculationType>;
  messageTypes?: InputMaybe<EsettTimeSeriesType>;
  gridAreas?: InputMaybe<[string]>;
  actorNumber?: InputMaybe<string>;
  statuses?: InputMaybe<[DocumentStatus]>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  created?: InputMaybe<Scalars['DateRange']['input']>;
  latestDispatch?: InputMaybe<Scalars['DateRange']['input']>;
};
