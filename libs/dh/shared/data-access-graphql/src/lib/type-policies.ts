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
import { Calculation, scalarTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql';
import { StrictTypedTypePolicies } from '@energinet-datahub/dh/shared/domain/graphql/apollo-helpers';
import { Typename } from '@energinet-datahub/dh/shared/domain/graphql/typenames';

export const typePolicies: StrictTypedTypePolicies = {
  ...scalarTypePolicies,
  MessageDelegationType: {
    keyFields: ['id', 'periodId'],
  },
  MarketParticipantUserRole: {
    keyFields: false,
  },
  Calculation: {
    // apollo-helpers is missing function type signature for keyFields:
    // https://github.com/dotansimha/graphql-code-generator-community/issues/30
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyFields: ((obj: Calculation) => `Calculation:${obj.id}`) as any,
  },
  Query: {
    fields: {
      calculationById(_, { args, toReference }) {
        return toReference({
          __typename: 'Calculation' satisfies Typename,
          id: args?.id,
        });
      },
      chargeById(_, { args, toReference }) {
        return toReference({
          __typename: 'Charge' satisfies Typename,
          id: args?.id,
        });
      },
      meteringPointProcessById(_, { args, toReference }) {
        return toReference({
          __typename: 'MeteringPointProcess' satisfies Typename,
          id: args?.id,
        });
      },
      marketParticipantById(_, { args, toReference }) {
        return toReference({
          __typename: 'MarketParticipant' satisfies Typename,
          id: args?.id,
        });
      },
    },
  },
};
