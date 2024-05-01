/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { ResultOf } from '@graphql-typed-document-node/core';

import {
  BalanceResponsibilityAgreementStatus,
  GetBalanceResponsibleRelationDocument,
  InputMaybe,
  Scalars,
} from '@energinet-datahub/dh/shared/domain/graphql';

export type DhBalanceResponsibleRelation = NonNullable<
  ResultOf<
    typeof GetBalanceResponsibleRelationDocument
  >['actorById']['balanceResponsibleAgreements']
>[0];

export type DhBalanceResponsibleRelations = DhBalanceResponsibleRelation[];

export type DhBalanceResponsibleRelationType = 'CONSUMPTION' | 'PRODUCTION';

export type DhBalanceResponsibleRelationsByType = {
  type: DhBalanceResponsibleRelationType;
  relations: DhBalanceResponsibleRelations;
}[];

export type DhBalanceResponsibleRelationsGrouped = {
  type: DhBalanceResponsibleRelationType;
  marketParticipants: {
    id: string;
    displayName: string;
    relations: DhBalanceResponsibleRelations;
    allRelationsHaveExpired: boolean;
  }[];
}[];

export type DhBalanceResponsibleRelationFilters = {
  status?: InputMaybe<BalanceResponsibilityAgreementStatus>;
  energySupplierWithNameId?: InputMaybe<string>;
  gridAreaId?: InputMaybe<Scalars['UUID']['input']>;
  balanceResponsibleWithNameId?: InputMaybe<string>;
  search?: InputMaybe<string>;
};
