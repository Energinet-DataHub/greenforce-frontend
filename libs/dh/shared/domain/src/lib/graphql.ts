import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** The grid area codes. */
  gridAreaCodes: Array<Maybe<Scalars['String']>>;
  /** The id of the batch. */
  id: Scalars['ID'];
  /** Whether basis data is downloadable. */
  isBasisDataDownloadAvailable: Scalars['Boolean'];
  period?: Maybe<Scalars['DateRange']>;
};

export enum BatchState {
  Completed = 'COMPLETED',
  Executing = 'EXECUTING',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

export enum EicFunction {
  Agent = 'AGENT',
  BalanceResponsibleParty = 'BALANCE_RESPONSIBLE_PARTY',
  BalancingServiceProvider = 'BALANCING_SERVICE_PROVIDER',
  BillingAgent = 'BILLING_AGENT',
  CapacityTrader = 'CAPACITY_TRADER',
  ConsentAdministrator = 'CONSENT_ADMINISTRATOR',
  Consumer = 'CONSUMER',
  ConsumptionResponsibleParty = 'CONSUMPTION_RESPONSIBLE_PARTY',
  CoordinatedCapacityCalculator = 'COORDINATED_CAPACITY_CALCULATOR',
  CoordinationCentreOperator = 'COORDINATION_CENTRE_OPERATOR',
  DanishEnergyAgency = 'DANISH_ENERGY_AGENCY',
  DataHubAdministrator = 'DATA_HUB_ADMINISTRATOR',
  DataProvider = 'DATA_PROVIDER',
  ElOverblik = 'EL_OVERBLIK',
  EnergyServiceCompany = 'ENERGY_SERVICE_COMPANY',
  EnergySupplier = 'ENERGY_SUPPLIER',
  EnergyTrader = 'ENERGY_TRADER',
  GridAccessProvider = 'GRID_ACCESS_PROVIDER',
  ImbalanceSettlementResponsible = 'IMBALANCE_SETTLEMENT_RESPONSIBLE',
  IndependentAggregator = 'INDEPENDENT_AGGREGATOR',
  InterconnectionTradeResponsible = 'INTERCONNECTION_TRADE_RESPONSIBLE',
  LfcOperator = 'LFC_OPERATOR',
  MarketInformationAggregator = 'MARKET_INFORMATION_AGGREGATOR',
  MarketOperator = 'MARKET_OPERATOR',
  MeritOrderListResponsible = 'MERIT_ORDER_LIST_RESPONSIBLE',
  MeteredDataAdministrator = 'METERED_DATA_ADMINISTRATOR',
  MeteredDataAggregator = 'METERED_DATA_AGGREGATOR',
  MeteredDataCollector = 'METERED_DATA_COLLECTOR',
  MeteredDataResponsible = 'METERED_DATA_RESPONSIBLE',
  MeteringPointAdministrator = 'METERING_POINT_ADMINISTRATOR',
  MeterAdministrator = 'METER_ADMINISTRATOR',
  MeterOperator = 'METER_OPERATOR',
  ModellingAuthority = 'MODELLING_AUTHORITY',
  ModelMergingAgent = 'MODEL_MERGING_AGENT',
  NominatedElectricityMarketOperator = 'NOMINATED_ELECTRICITY_MARKET_OPERATOR',
  NominationValidator = 'NOMINATION_VALIDATOR',
  PartyAdministrator = 'PARTY_ADMINISTRATOR',
  PartyConnectedToTheGrid = 'PARTY_CONNECTED_TO_THE_GRID',
  Producer = 'PRODUCER',
  ProductionResponsibleParty = 'PRODUCTION_RESPONSIBLE_PARTY',
  ReconciliationAccountable = 'RECONCILIATION_ACCOUNTABLE',
  ReconciliationResponsible = 'RECONCILIATION_RESPONSIBLE',
  ReserveAllocator = 'RESERVE_ALLOCATOR',
  ResourceAggregator = 'RESOURCE_AGGREGATOR',
  ResourceCapacityMechanismOperator = 'RESOURCE_CAPACITY_MECHANISM_OPERATOR',
  ResourceProvider = 'RESOURCE_PROVIDER',
  Scheduling = 'SCHEDULING',
  SchedulingAreaResponsible = 'SCHEDULING_AREA_RESPONSIBLE',
  SerialEnergyTrader = 'SERIAL_ENERGY_TRADER',
  SystemOperator = 'SYSTEM_OPERATOR',
  TradeResponsibleParty = 'TRADE_RESPONSIBLE_PARTY',
  TransmissionCapacityAllocator = 'TRANSMISSION_CAPACITY_ALLOCATOR'
}

export type GraphQlQuery = {
  __typename?: 'GraphQLQuery';
  batch?: Maybe<Batch>;
  batches?: Maybe<Array<Maybe<Batch>>>;
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

export type GetBatchesQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']>;
}>;


export type GetBatchesQuery = { __typename?: 'GraphQLQuery', batches?: Array<{ __typename?: 'Batch', id: string, executionState: BatchState, executionTimeStart?: any | null, executionTimeEnd?: any | null, gridAreaCodes: Array<string | null>, isBasisDataDownloadAvailable: boolean, period?: any | null } | null> | null };


export const GetBatchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBatches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCodes"}},{"kind":"Field","name":{"kind":"Name","value":"isBasisDataDownloadAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetBatchesQuery, GetBatchesQueryVariables>;