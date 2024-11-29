import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  BalanceResponsibilityAgreementStatus,
  GetBalanceResponsibleRelationDocument,
  InputMaybe,
  MarketParticipantMeteringPointType,
  Scalars,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhBalanceResponsibleRelation = NonNullable<
  ResultOf<
    typeof GetBalanceResponsibleRelationDocument
  >['actorById']['balanceResponsibleAgreements']
>[0];

export type DhBalanceResponsibleRelations = DhBalanceResponsibleRelation[];

export type DhBalanceResponsibleRelationsByType = {
  type: MarketParticipantMeteringPointType;
  relations: DhBalanceResponsibleRelations;
}[];

export type DhBalanceResponsibleRelationsGrouped = {
  type: MarketParticipantMeteringPointType;
  marketParticipants: {
    id: string;
    displayName: string;
    relations: DhBalanceResponsibleRelations;
    allRelationsHaveExpired: boolean;
  }[];
}[];

export type DhBalanceResponsibleRelationFilters = {
  status: InputMaybe<BalanceResponsibilityAgreementStatus[]>;
  energySupplierWithNameId: InputMaybe<string>;
  gridAreaCode: InputMaybe<Scalars['UUID']['input']>;
  balanceResponsibleWithNameId: InputMaybe<string>;
  search: InputMaybe<string>;
};
