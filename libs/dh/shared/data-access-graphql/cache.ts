//#region License
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
//#endregion
import { InMemoryCache } from '@apollo/client/core';

import { scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';
import introspection from '@energinet-datahub/dh/shared/domain/graphql/introspection';

export const cache = new InMemoryCache({
  possibleTypes: introspection.possibleTypes,
  typePolicies: {
    ...scalarTypePolicies,
    MessageDelegationType: {
      keyFields: ['id', 'periodId'],
    },
    MarketParticipantUserRole: {
      keyFields: false,
    },
    Calculation: {
      keyFields: (obj) => `Calculation:${obj.id}`,
    },
    Query: {
      fields: {
        calculationById(_, { args, toReference }) {
          return toReference({
            __typename: 'Calculation',
            id: args?.id,
          });
        },
        chargeById(_, { args, toReference }) {
          return toReference({
            __typename: 'Charge',
            id: args?.id,
          });
        },
        meteringPointExists(_, { args, toReference }) {
          return toReference({
            __typename: 'ElectricityMarketViewMeteringPointDto',
            id: args?.internalMeteringPointId,
          });
        },
        meteringPointProcessById(_, { args, toReference }) {
          return toReference({
            __typename: 'MeteringPointProcess',
            id: args?.id,
          });
        },
        marketParticipantById(_, { args, toReference }) {
          return toReference({
            __typename: 'MarketParticipant',
            id: args?.['id'],
          });
        },
      },
    },
  },
});
