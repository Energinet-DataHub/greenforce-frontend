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
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateRange: any;
  DateTimeOffset: any;
};

export type Actor = {
  __typename?: 'Actor';
  /** The id of the actor. */
  actorId: Scalars['ID'];
  /** The number of the actor. */
  actorNumber: ActorNumberDtoType;
  /** The external id of the actor. */
  externalActorId?: Maybe<Scalars['ID']>;
  /** The market roles of the actor. */
  marketRoles: Array<Maybe<ActorMarketRoleDtoType>>;
  /** The name of the actor. */
  name: ActorNameDtoType;
  /** The status of the actor. */
  status: ActorStatus;
};

export type ActorGridAreaDtoType = {
  __typename?: 'ActorGridAreaDtoType';
  /** The grid area id. */
  id: Scalars['ID'];
  /** The metering point types. */
  meteringPointTypes: Array<MarketParticipantMeteringPointType>;
};

export type ActorMarketRoleDtoType = {
  __typename?: 'ActorMarketRoleDtoType';
  /** The comment of the market role. */
  comment: Scalars['String'];
  /** The EIC function of the market role. */
  eicFunction: EicFunction;
  /** The grid areas of the market role. */
  gridAreas: Array<Maybe<ActorGridAreaDtoType>>;
};

export type ActorNameDtoType = {
  __typename?: 'ActorNameDtoType';
  /** The actor name. */
  value: Scalars['String'];
};

export type ActorNumberDtoType = {
  __typename?: 'ActorNumberDtoType';
  /** The actor number. */
  value: Scalars['String'];
};

export enum ActorStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  New = 'NEW',
  Passive = 'PASSIVE'
}

export type Address = {
  __typename?: 'Address';
  /** The city of the address. */
  city?: Maybe<Scalars['String']>;
  /** The country of the address. */
  country: Scalars['String'];
  /** The number of the address. */
  number?: Maybe<Scalars['String']>;
  /** The street name of the address. */
  streetName?: Maybe<Scalars['String']>;
  /** The zip code of the address. */
  zipCode?: Maybe<Scalars['String']>;
};

export type Batch = {
  __typename?: 'Batch';
  /** The execution state. */
  executionState: BatchState;
  /** The execution end time. */
  executionTimeEnd?: Maybe<Scalars['DateTimeOffset']>;
  /** The execution start time. */
  executionTimeStart?: Maybe<Scalars['DateTimeOffset']>;
  gridAreas: Array<GridArea>;
  /** The id of the batch. */
  id: Scalars['ID'];
  /** Whether basis data is downloadable. */
  isBasisDataDownloadAvailable: Scalars['Boolean'];
  period?: Maybe<Scalars['DateRange']>;
  statusType: StatusType;
};

export enum BatchState {
  Completed = 'COMPLETED',
  Executing = 'EXECUTING',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum EicFunction {
  BalanceResponsibleParty = 'BALANCE_RESPONSIBLE_PARTY',
  BillingAgent = 'BILLING_AGENT',
  DanishEnergyAgency = 'DANISH_ENERGY_AGENCY',
  DataHubAdministrator = 'DATA_HUB_ADMINISTRATOR',
  ElOverblik = 'EL_OVERBLIK',
  EnergySupplier = 'ENERGY_SUPPLIER',
  GridAccessProvider = 'GRID_ACCESS_PROVIDER',
  ImbalanceSettlementResponsible = 'IMBALANCE_SETTLEMENT_RESPONSIBLE',
  IndependentAggregator = 'INDEPENDENT_AGGREGATOR',
  MeteredDataAdministrator = 'METERED_DATA_ADMINISTRATOR',
  MeteredDataResponsible = 'METERED_DATA_RESPONSIBLE',
  MeteringPointAdministrator = 'METERING_POINT_ADMINISTRATOR',
  SerialEnergyTrader = 'SERIAL_ENERGY_TRADER',
  SystemOperator = 'SYSTEM_OPERATOR'
}

export type GraphQlQuery = {
  __typename?: 'GraphQLQuery';
  batch?: Maybe<Batch>;
  batches: Array<Batch>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
};


export type GraphQlQueryBatchArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type GraphQlQueryBatchesArgs = {
  executionTime?: InputMaybe<Scalars['DateRange']>;
};


export type GraphQlQueryOrganizationArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type GridArea = {
  __typename?: 'GridArea';
  /** The grid area code. */
  code: Scalars['String'];
  /** The grid area id. */
  id: Scalars['ID'];
  /** The grid area name. */
  name: Scalars['String'];
  /** The price area code for the grid area. */
  priceAreaCode: PriceAreaCode;
  /** Date that the grid area is valid from */
  validFrom: Scalars['DateTimeOffset'];
  /** Date that the grid area is valid to */
  validTo?: Maybe<Scalars['DateTimeOffset']>;
};

export enum MarketParticipantMeteringPointType {
  D_01VeProduction = 'D_01_VE_PRODUCTION',
  D_02Analysis = 'D_02_ANALYSIS',
  D_03NotUsed = 'D_03_NOT_USED',
  D_04SurplusProductionGroup_6 = 'D_04_SURPLUS_PRODUCTION_GROUP_6',
  D_05NetProduction = 'D_05_NET_PRODUCTION',
  D_06SupplyToGrid = 'D_06_SUPPLY_TO_GRID',
  D_07ConsumptionFromGrid = 'D_07_CONSUMPTION_FROM_GRID',
  D_08WholeSaleServicesInformation = 'D_08_WHOLE_SALE_SERVICES_INFORMATION',
  D_09OwnProduction = 'D_09_OWN_PRODUCTION',
  D_10NetFromGrid = 'D_10_NET_FROM_GRID',
  D_11NetToGrid = 'D_11_NET_TO_GRID',
  D_12TotalConsumption = 'D_12_TOTAL_CONSUMPTION',
  D_13NetLossCorrection = 'D_13_NET_LOSS_CORRECTION',
  D_14ElectricalHeating = 'D_14_ELECTRICAL_HEATING',
  D_15NetConsumption = 'D_15_NET_CONSUMPTION',
  D_17OtherConsumption = 'D_17_OTHER_CONSUMPTION',
  D_18OtherProduction = 'D_18_OTHER_PRODUCTION',
  D_20ExchangeReactiveEnergy = 'D_20_EXCHANGE_REACTIVE_ENERGY',
  D_99InternalUse = 'D_99_INTERNAL_USE',
  E_17Consumption = 'E_17_CONSUMPTION',
  E_18Production = 'E_18_PRODUCTION',
  E_20Exchange = 'E_20_EXCHANGE',
  Unknown = 'UNKNOWN'
}

export type Organization = {
  __typename?: 'Organization';
  /** The actors of the organization. */
  actors: Array<Maybe<Actor>>;
  /** The address of the organization. */
  address: Address;
  /** The business register identifier of the organization. */
  businessRegisterIdentifier: Scalars['String'];
  /** The comment of the organization. */
  comment: Scalars['String'];
  /** The name of the organization. */
  name: Scalars['String'];
  /** The ID of the organization. */
  organizationId: Scalars['ID'];
  /** The status of the organization. */
  status: OrganizationStatus;
};

export enum OrganizationStatus {
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
  Deleted = 'DELETED',
  New = 'NEW'
}

export enum PriceAreaCode {
  Dk_1 = 'DK_1',
  Dk_2 = 'DK_2'
}

/** How the status should be represented visually. */
export enum StatusType {
  Danger = 'danger',
  Info = 'info',
  Success = 'success',
  Warning = 'warning'
}

export type GetBatchQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetBatchQuery = { __typename?: 'GraphQLQuery', batch?: { __typename?: 'Batch', id: string, executionState: BatchState, executionTimeEnd?: any | null, executionTimeStart?: any | null, isBasisDataDownloadAvailable: boolean, period?: any | null, statusType: StatusType, gridAreas: Array<{ __typename?: 'GridArea', code: string, name: string, id: string, priceAreaCode: PriceAreaCode, validFrom: any }> } | null };

export type GetBatchesQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']>;
}>;


export type GetBatchesQuery = { __typename?: 'GraphQLQuery', batches: Array<{ __typename?: 'Batch', id: string, executionState: BatchState, executionTimeEnd?: any | null, executionTimeStart?: any | null, isBasisDataDownloadAvailable: boolean, period?: any | null, statusType: StatusType }> };


export const GetBatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"isBasisDataDownloadAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]}}]} as unknown as DocumentNode<GetBatchQuery, GetBatchQueryVariables>;
export const GetBatchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBatches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"isBasisDataDownloadAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}}]}}]}}]} as unknown as DocumentNode<GetBatchesQuery, GetBatchesQueryVariables>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBatchQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ batch })
 *   )
 * })
 */
export const mockGetBatchQuery = (resolver: ResponseResolver<GraphQLRequest<GetBatchQueryVariables>, GraphQLContext<GetBatchQuery>, any>) =>
  graphql.query<GetBatchQuery, GetBatchQueryVariables>(
    'GetBatch',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBatchesQuery((req, res, ctx) => {
 *   const { executionTime } = req.variables;
 *   return res(
 *     ctx.data({ batches })
 *   )
 * })
 */
export const mockGetBatchesQuery = (resolver: ResponseResolver<GraphQLRequest<GetBatchesQueryVariables>, GraphQLContext<GetBatchesQuery>, any>) =>
  graphql.query<GetBatchesQuery, GetBatchesQueryVariables>(
    'GetBatches',
    resolver
  )
