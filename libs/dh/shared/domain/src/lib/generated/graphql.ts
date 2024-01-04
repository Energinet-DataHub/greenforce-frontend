/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateRange: { input: { start: Date, end: Date }; output: { start: Date, end: Date }; }
  UUID: { input: any; output: any; }
  DateTime: { input: Date; output: Date; }
  Long: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export enum ActorStatus {
  New = 'New',
  Active = 'Active',
  Inactive = 'Inactive',
  Passive = 'Passive'
}

export type Actor = {
  __typename: 'Actor';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  glnOrEicNumber: Scalars['String']['output'];
  marketRole?: Maybe<EicFunction>;
  status: ActorStatus;
  gridAreas: Array<GridAreaDto>;
  contact?: Maybe<ActorContactDto>;
  organization: Organization;
};

export type BalanceResponsibleType = {
  __typename: 'BalanceResponsibleType';
  gridAreaWithName?: Maybe<GridAreaDto>;
  supplierWithName?: Maybe<ActorNameDto>;
  balanceResponsibleWithName?: Maybe<ActorNameDto>;
  id: Scalars['String']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  supplier: Scalars['String']['output'];
  balanceResponsible: Scalars['String']['output'];
  meteringPointType: TimeSeriesType;
  validFromDate: Scalars['DateTime']['output'];
  validToDate?: Maybe<Scalars['DateTime']['output']>;
  gridArea: Scalars['String']['output'];
};

/** An immutable calculation. */
export type Calculation = {
  __typename: 'Calculation';
  id: Scalars['UUID']['output'];
  period: Scalars['DateRange']['output'];
  createdByUserName?: Maybe<Scalars['String']['output']>;
  gridAreas: Array<GridAreaDto>;
  statusType: ProcessStatus;
  runId?: Maybe<Scalars['Long']['output']>;
  resolution?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  executionTimeStart?: Maybe<Scalars['DateTime']['output']>;
  executionTimeEnd?: Maybe<Scalars['DateTime']['output']>;
  executionState: BatchState;
  areSettlementReportsCreated: Scalars['Boolean']['output'];
  processType: ProcessType;
};

export enum EdiB2CProcessType {
  Preliminaryaggregation = 'preliminaryaggregation',
  Balancefixing = 'balancefixing',
  Wholesalefixing = 'wholesalefixing',
  Firstcorrection = 'firstcorrection',
  Secondcorrection = 'secondcorrection',
  Thirdcorrection = 'thirdcorrection'
}

export enum EicFunction {
  BalanceResponsibleParty = 'BalanceResponsibleParty',
  BillingAgent = 'BillingAgent',
  EnergySupplier = 'EnergySupplier',
  GridAccessProvider = 'GridAccessProvider',
  ImbalanceSettlementResponsible = 'ImbalanceSettlementResponsible',
  MeterOperator = 'MeterOperator',
  MeteredDataAdministrator = 'MeteredDataAdministrator',
  MeteredDataResponsible = 'MeteredDataResponsible',
  MeteringPointAdministrator = 'MeteringPointAdministrator',
  SystemOperator = 'SystemOperator',
  DanishEnergyAgency = 'DanishEnergyAgency',
  DataHubAdministrator = 'DataHubAdministrator',
  IndependentAggregator = 'IndependentAggregator',
  SerialEnergyTrader = 'SerialEnergyTrader'
}

export type EsettOutgoingMessage = {
  __typename: 'EsettOutgoingMessage';
  gridArea?: Maybe<GridAreaDto>;
  documentId: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  calculationType: ExchangeEventCalculationType;
  timeSeriesType: TimeSeriesType;
  periodFrom: Scalars['DateTime']['output'];
  periodTo: Scalars['DateTime']['output'];
  documentStatus: DocumentStatus;
};

export enum ExchangeEventCalculationType {
  BalanceFixing = 'BALANCE_FIXING',
  Aggregation = 'AGGREGATION'
}

export type GridAreaDto = {
  __typename: 'GridAreaDto';
  priceAreaCode: PriceAreaCode;
  id: Scalars['UUID']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

export type OrganizationAuditLog = {
  __typename: 'OrganizationAuditLog';
  identityWithName: GetAuditIdentityResponse;
  organizationId: Scalars['UUID']['output'];
  value: Scalars['String']['output'];
  auditIdentityId: Scalars['UUID']['output'];
  timestamp: Scalars['DateTime']['output'];
  organizationChangeType: OrganizationChangeType;
};

export type Organization = {
  __typename: 'Organization';
  organizationId?: Maybe<Scalars['String']['output']>;
  actors?: Maybe<Array<Actor>>;
  name: Scalars['String']['output'];
  businessRegisterIdentifier: Scalars['String']['output'];
  domain: Scalars['String']['output'];
  status: Scalars['String']['output'];
  address: AddressDto;
};

export type Permission = {
  __typename: 'Permission';
  userRoles: Array<UserRoleDto>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  assignableTo: Array<EicFunction>;
};

export enum ProcessStatus {
  Warning = 'warning',
  Success = 'success',
  Danger = 'danger',
  Info = 'info'
}

export enum ApplyPolicy {
  BeforeResolver = 'BEFORE_RESOLVER',
  AfterResolver = 'AFTER_RESOLVER',
  Validation = 'VALIDATION'
}

export type Query = {
  __typename: 'Query';
  permissionById: Permission;
  permissions: Array<Permission>;
  permissionLogs: Array<PermissionLog>;
  userRoleAuditLogs: Array<UserRoleAuditLog>;
  userRoleById: UserRoleWithPermissionsDto;
  userRolesByEicFunction: Array<UserRoleDto>;
  organizationById: Organization;
  organizations: Array<Organization>;
  gridAreas: Array<GridAreaDto>;
  calculationById: Calculation;
  calculations: Array<Calculation>;
  settlementReports: Array<SettlementReport>;
  selectedActor: Actor;
  actorById: Actor;
  actors: Array<Actor>;
  actorsForEicFunction: Array<Actor>;
  esettOutgoingMessageById: EsettOutgoingMessage;
  esettExchangeEvents: ExchangeEventSearchResponse;
  meteringGridAreaImbalance: MeteringGridAreaImbalanceSearchResponse;
  balanceResponsible: BalanceResponsiblePageResult;
  actorsByOrganizationId: Array<Actor>;
  organizationAuditLog: Array<OrganizationAuditLog>;
  emailExists: Scalars['Boolean']['output'];
  actorAuditLogs: Array<ActorAuditLog>;
  knownEmails: Array<Scalars['String']['output']>;
  associatedActors: AssociatedActors;
  gridAreaOverview: Array<GridAreaOverviewItemDto>;
};


export type QueryPermissionByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPermissionsArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryPermissionLogsArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserRoleAuditLogsArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserRoleByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserRolesByEicFunctionArgs = {
  eicFunction: EicFunction;
};


export type QueryOrganizationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCalculationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCalculationsArgs = {
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  executionStates?: InputMaybe<Array<BatchState>>;
  processTypes?: InputMaybe<Array<ProcessType>>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySettlementReportsArgs = {
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
};


export type QueryActorByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryActorsForEicFunctionArgs = {
  eicFunctions?: InputMaybe<Array<EicFunction>>;
};


export type QueryEsettOutgoingMessageByIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryEsettExchangeEventsArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodFrom?: InputMaybe<Scalars['DateTime']['input']>;
  periodTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
  documentId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeteringGridAreaImbalanceArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  createdFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBalanceResponsibleArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
};


export type QueryActorsByOrganizationIdArgs = {
  organizationId: Scalars['UUID']['input'];
};


export type QueryOrganizationAuditLogArgs = {
  organizationId: Scalars['UUID']['input'];
};


export type QueryEmailExistsArgs = {
  emailAddress: Scalars['String']['input'];
};


export type QueryActorAuditLogsArgs = {
  actorId: Scalars['UUID']['input'];
};


export type QueryAssociatedActorsArgs = {
  email: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  updatePermission: Permission;
  updateActor: UpdateActorPayload;
  createCalculation: CreateCalculationPayload;
  createAggregatedMeasureDataRequest: CreateAggregatedMeasureDataRequestPayload;
  updateOrganization: UpdateOrganizationPayload;
  createMarketParticipant: CreateMarketParticipantPayload;
};


export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionDtoInput;
};


export type MutationUpdateActorArgs = {
  input: UpdateActorInput;
};


export type MutationCreateCalculationArgs = {
  input: CreateCalculationInput;
};


export type MutationCreateAggregatedMeasureDataRequestArgs = {
  input: CreateAggregatedMeasureDataRequestInput;
};


export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput;
};


export type MutationCreateMarketParticipantArgs = {
  input: CreateMarketParticipantInput;
};

export type ActorContactDto = {
  __typename: 'ActorContactDto';
  contactId: Scalars['UUID']['output'];
  category: ContactCategory;
  name: Scalars['String']['output'];
  email: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type ActorNameDto = {
  __typename: 'ActorNameDto';
  value: Scalars['String']['output'];
};

export enum TimeSeriesType {
  MgaExchange = 'MGA_EXCHANGE',
  Production = 'PRODUCTION',
  Consumption = 'CONSUMPTION'
}

export enum BatchState {
  Pending = 'PENDING',
  Executing = 'EXECUTING',
  Completed = 'COMPLETED',
  Failed = 'FAILED'
}

/** Defines the wholesale process type */
export enum ProcessType {
  BalanceFixing = 'BALANCE_FIXING',
  Aggregation = 'AGGREGATION',
  WholesaleFixing = 'WHOLESALE_FIXING',
  FirstCorrectionSettlement = 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement = 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement = 'THIRD_CORRECTION_SETTLEMENT'
}

export enum DocumentStatus {
  Received = 'RECEIVED',
  AwaitingDispatch = 'AWAITING_DISPATCH',
  AwaitingReply = 'AWAITING_REPLY',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED'
}

export enum PriceAreaCode {
  Dk1 = 'DK1',
  Dk2 = 'DK2'
}

export type GetAuditIdentityResponse = {
  __typename: 'GetAuditIdentityResponse';
  displayName: Scalars['String']['output'];
};

export enum OrganizationChangeType {
  DomainChange = 'DOMAIN_CHANGE',
  Name = 'NAME'
}

export type AddressDto = {
  __typename: 'AddressDto';
  streetName?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
};

export type UserRoleDto = {
  __typename: 'UserRoleDto';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
};

export type ApiError = Error & {
  __typename: 'ApiError';
  message: Scalars['String']['output'];
  apiErrors: Array<ApiErrorDescriptor>;
  statusCode: Scalars['Int']['output'];
  response?: Maybe<Scalars['String']['output']>;
  headers: Array<KeyValuePairOfStringAndIEnumerableOfString>;
};

export type Error = {
  message: Scalars['String']['output'];
};

export enum UserRoleStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum ContactCategory {
  Default = 'DEFAULT',
  Charges = 'CHARGES',
  ChargeLinks = 'CHARGE_LINKS',
  ElectricalHeating = 'ELECTRICAL_HEATING',
  EndOfSupply = 'END_OF_SUPPLY',
  EnerginetInquiry = 'ENERGINET_INQUIRY',
  ErrorReport = 'ERROR_REPORT',
  IncorrectMove = 'INCORRECT_MOVE',
  IncorrectSwitch = 'INCORRECT_SWITCH',
  MeasurementData = 'MEASUREMENT_DATA',
  MeteringPoint = 'METERING_POINT',
  NetSettlement = 'NET_SETTLEMENT',
  Notification = 'NOTIFICATION',
  Recon = 'RECON',
  Reminder = 'REMINDER'
}

export type CreateMarketParticipantInput = {
  organizationId?: InputMaybe<Scalars['UUID']['input']>;
  organization?: InputMaybe<CreateOrganizationDtoInput>;
  actor: CreateActorDtoInput;
  actorContact: CreateActorContactDtoInput;
};

export enum MeteringPointType {
  Production = 'PRODUCTION',
  FlexConsumption = 'FLEX_CONSUMPTION',
  TotalConsumption = 'TOTAL_CONSUMPTION',
  NonProfiledConsumption = 'NON_PROFILED_CONSUMPTION',
  Exchange = 'EXCHANGE'
}

export type UpdatePermissionDtoInput = {
  id: Scalars['Int']['input'];
  description: Scalars['String']['input'];
};

export type GridAreaOverviewItemDto = {
  __typename: 'GridAreaOverviewItemDto';
  id: Scalars['UUID']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceAreaCode: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
  actorNumber?: Maybe<Scalars['String']['output']>;
  actorName?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  fullFlexDate?: Maybe<Scalars['DateTime']['output']>;
};

export type AssociatedActors = {
  __typename: 'AssociatedActors';
  email: Scalars['String']['output'];
  actors: Array<Scalars['UUID']['output']>;
};

export type ActorAuditLog = {
  __typename: 'ActorAuditLog';
  changedByUserName: Scalars['String']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  type: ActorAuditLogType;
  contactCategory: ContactCategory;
};

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export enum BalanceResponsibleSortProperty {
  ValidFrom = 'VALID_FROM',
  ValidTo = 'VALID_TO',
  ReceivedDate = 'RECEIVED_DATE'
}

export type BalanceResponsiblePageResult = {
  __typename: 'BalanceResponsiblePageResult';
  page: Array<BalanceResponsibleType>;
  totalCount: Scalars['Int']['output'];
};

export type MeteringGridAreaImbalanceSearchResponse = {
  __typename: 'MeteringGridAreaImbalanceSearchResponse';
  items: Array<MeteringGridAreaImbalanceSearchResult>;
  totalCount: Scalars['Int']['output'];
};

export type ExchangeEventSearchResponse = {
  __typename: 'ExchangeEventSearchResponse';
  items: Array<ExchangeEventSearchResult>;
  totalCount: Scalars['Int']['output'];
};

export type SettlementReport = {
  __typename: 'SettlementReport';
  batchNumber: Scalars['UUID']['output'];
  processType: ProcessType;
  gridArea: GridAreaDto;
  period: Scalars['DateRange']['output'];
  executionTime?: Maybe<Scalars['DateTime']['output']>;
};

export type UserRoleWithPermissionsDto = {
  __typename: 'UserRoleWithPermissionsDto';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
  permissions: Array<PermissionDetailsDto>;
};

export type UserRoleAuditLog = {
  __typename: 'UserRoleAuditLog';
  changedByUserName: Scalars['String']['output'];
  userRoleId: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  permissions: Array<Scalars['String']['output']>;
  eicFunction?: Maybe<EicFunction>;
  status: UserRoleStatus;
  changeType: UserRoleChangeType;
  timestamp: Scalars['DateTime']['output'];
};

export type PermissionLog = {
  __typename: 'PermissionLog';
  changedByUserName: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
  type: PermissionAuditLogType;
};

export type ApiErrorDescriptor = {
  __typename: 'ApiErrorDescriptor';
  message: Scalars['String']['output'];
  code: Scalars['String']['output'];
  args: Scalars['JSON']['output'];
};

export type KeyValuePairOfStringAndIEnumerableOfString = {
  __typename: 'KeyValuePairOfStringAndIEnumerableOfString';
  key: Scalars['String']['output'];
  value: Array<Scalars['String']['output']>;
};

export enum PermissionAuditLogType {
  Unknown = 'UNKNOWN',
  DescriptionChange = 'DESCRIPTION_CHANGE',
  Created = 'CREATED'
}

export enum UserRoleChangeType {
  Created = 'CREATED',
  NameChange = 'NAME_CHANGE',
  DescriptionChange = 'DESCRIPTION_CHANGE',
  StatusChange = 'STATUS_CHANGE',
  PermissionAdded = 'PERMISSION_ADDED',
  PermissionRemoved = 'PERMISSION_REMOVED'
}

export type PermissionDetailsDto = {
  __typename: 'PermissionDetailsDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
};

export type ExchangeEventSearchResult = {
  __typename: 'ExchangeEventSearchResult';
  documentId: Scalars['String']['output'];
  gridAreaCode: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  calculationType: ExchangeEventCalculationType;
  timeSeriesType: TimeSeriesType;
  documentStatus: DocumentStatus;
};

export type MeteringGridAreaImbalanceSearchResult = {
  __typename: 'MeteringGridAreaImbalanceSearchResult';
  id: Scalars['String']['output'];
  gridAreaCode: Scalars['String']['output'];
  documentDateTime: Scalars['DateTime']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  periodStart: Scalars['DateTime']['output'];
  periodEnd: Scalars['DateTime']['output'];
  imbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
  storageId: Scalars['String']['output'];
};

export enum ActorAuditLogType {
  Name = 'NAME',
  Created = 'CREATED',
  Status = 'STATUS',
  ContactName = 'CONTACT_NAME',
  ContactEmail = 'CONTACT_EMAIL',
  ContactPhone = 'CONTACT_PHONE',
  ContactCreated = 'CONTACT_CREATED',
  ContactDeleted = 'CONTACT_DELETED',
  CertificateCredentials = 'CERTIFICATE_CREDENTIALS',
  ClientSecretCredentials = 'CLIENT_SECRET_CREDENTIALS'
}

export type CreateActorContactDtoInput = {
  name: Scalars['String']['input'];
  category: ContactCategory;
  email: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateActorDtoInput = {
  organizationId: Scalars['UUID']['input'];
  name: ActorNameDtoInput;
  actorNumber: ActorNumberDtoInput;
  marketRoles: Array<ActorMarketRoleDtoInput>;
};

export type CreateOrganizationDtoInput = {
  name: Scalars['String']['input'];
  businessRegisterIdentifier: Scalars['String']['input'];
  address: AddressDtoInput;
  domain: Scalars['String']['input'];
};

export type AddressDtoInput = {
  streetName?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
};

export type ActorMarketRoleDtoInput = {
  eicFunction: EicFunction;
  gridAreas: Array<ActorGridAreaDtoInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
};

export type ActorNumberDtoInput = {
  value: Scalars['String']['input'];
};

export type ActorNameDtoInput = {
  value: Scalars['String']['input'];
};

export type MeteringGridAreaImbalancePerDayDto = {
  __typename: 'MeteringGridAreaImbalancePerDayDto';
  imbalanceDay: Scalars['DateTime']['output'];
  incomingQuantity?: Maybe<Scalars['Float']['output']>;
  outgoingQuantity?: Maybe<Scalars['Float']['output']>;
};

export type ActorGridAreaDtoInput = {
  id: Scalars['UUID']['input'];
  meteringPointTypes: Array<Scalars['String']['input']>;
};

export type UpdateActorInput = {
  actorId: Scalars['UUID']['input'];
  actorName: Scalars['String']['input'];
  departmentName: Scalars['String']['input'];
  departmentEmail: Scalars['String']['input'];
  departmentPhone: Scalars['String']['input'];
};

export type UpdateActorError = ApiError;

export type UpdateActorPayload = {
  __typename: 'UpdateActorPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateActorError>>;
};

export type CreateCalculationInput = {
  period: Scalars['DateRange']['input'];
  gridAreaCodes: Array<Scalars['String']['input']>;
  processType: ProcessType;
};

export type CreateCalculationPayload = {
  __typename: 'CreateCalculationPayload';
  calculation?: Maybe<Calculation>;
};

export type CreateAggregatedMeasureDataRequestInput = {
  processType: EdiB2CProcessType;
  meteringPointType?: InputMaybe<MeteringPointType>;
  startDate: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  gridArea?: InputMaybe<Scalars['String']['input']>;
  energySupplierId?: InputMaybe<Scalars['String']['input']>;
  balanceResponsibleId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAggregatedMeasureDataRequestPayload = {
  __typename: 'CreateAggregatedMeasureDataRequestPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateOrganizationInput = {
  orgId: Scalars['UUID']['input'];
  domain: Scalars['String']['input'];
};

export type UpdateOrganizationError = ApiError;

export type UpdateOrganizationPayload = {
  __typename: 'UpdateOrganizationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateOrganizationError>>;
};

export type CreateMarketParticipantError = ApiError;

export type CreateMarketParticipantPayload = {
  __typename: 'CreateMarketParticipantPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<CreateMarketParticipantError>>;
};

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionDetailsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string, created: Date, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename: 'UserRoleDto', id: any, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type GetKnownEmailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetKnownEmailsQuery = { __typename: 'Query', knownEmails: Array<string> };

export type GetAssociatedActorsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetAssociatedActorsQuery = { __typename: 'Query', associatedActors: { __typename: 'AssociatedActors', email: string, actors: Array<any> } };

export type GetUserRoleAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleAuditLogsQuery = { __typename: 'Query', userRoleAuditLogs: Array<{ __typename: 'UserRoleAuditLog', changedByUserName: string, name: string, description?: string | null, permissions: Array<string>, eicFunction?: EicFunction | null, status: UserRoleStatus, changeType: UserRoleChangeType, timestamp: Date }> };

export type GetPermissionLogsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionLogsQuery = { __typename: 'Query', permissionLogs: Array<{ __typename: 'PermissionLog', changedByUserName: string, type: PermissionAuditLogType, timestamp: Date, value?: string | null }> };

export type GetPermissionsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GetPermissionsQuery = { __typename: 'Query', permissions: Array<{ __typename: 'Permission', id: number, name: string, description: string, created: Date }> };

export type GetBalanceResponsibleMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
}>;


export type GetBalanceResponsibleMessagesQuery = { __typename: 'Query', balanceResponsible: { __typename: 'BalanceResponsiblePageResult', totalCount: number, page: Array<{ __typename: 'BalanceResponsibleType', id: string, receivedDateTime: Date, supplier: string, balanceResponsible: string, meteringPointType: TimeSeriesType, validFromDate: Date, validToDate?: Date | null, gridArea: string, supplierWithName?: { __typename: 'ActorNameDto', value: string } | null, balanceResponsibleWithName?: { __typename: 'ActorNameDto', value: string } | null, gridAreaWithName?: { __typename: 'GridAreaDto', code: string, name: string } | null }> } };

export type GetOutgoingMessageByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetOutgoingMessageByIdQuery = { __typename: 'Query', esettOutgoingMessageById: { __typename: 'EsettOutgoingMessage', documentId: string, calculationType: ExchangeEventCalculationType, created: Date, periodFrom: Date, periodTo: Date, documentStatus: DocumentStatus, timeSeriesType: TimeSeriesType, gridArea?: { __typename: 'GridAreaDto', code: string, name: string } | null } };

export type GetMeteringGridAreaImbalanceQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodFrom?: InputMaybe<Scalars['DateTime']['input']>;
  periodTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMeteringGridAreaImbalanceQuery = { __typename: 'Query', meteringGridAreaImbalance: { __typename: 'MeteringGridAreaImbalanceSearchResponse', totalCount: number, items: Array<{ __typename: 'MeteringGridAreaImbalanceSearchResult', id: string, gridAreaCode: string, documentDateTime: Date, receivedDateTime: Date, periodStart: Date, periodEnd: Date, storageId: string }> } };

export type GetGridAreaOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreaOverviewQuery = { __typename: 'Query', gridAreaOverview: Array<{ __typename: 'GridAreaOverviewItemDto', id: any, code: string, name: string, priceAreaCode: string, validFrom: Date, validTo?: Date | null, actorNumber?: string | null, actorName?: string | null, organizationName?: string | null, fullFlexDate?: Date | null }> };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename: 'Mutation', createCalculation: { __typename: 'CreateCalculationPayload', calculation?: { __typename: 'Calculation', id: any } | null } };

export type GetActorsForRequestCalculationQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForRequestCalculationQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', marketRole?: EicFunction | null, value: string, displayValue: string }> };

export type GetActorsForSettlementReportQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForSettlementReportQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', value: string, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetCalculationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCalculationByIdQuery = { __typename: 'Query', calculationById: { __typename: 'Calculation', id: any, executionState: BatchState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date }, statusType: ProcessStatus, processType: ProcessType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, id: any, priceAreaCode: PriceAreaCode, validFrom: Date }> } };

export type GetCalculationsQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  processTypes?: InputMaybe<Array<ProcessType> | ProcessType>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  executionStates?: InputMaybe<Array<BatchState> | BatchState>;
}>;


export type GetCalculationsQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', id: any, executionState: BatchState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date }, statusType: ProcessStatus, processType: ProcessType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> }> };

export type GetActorFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorFilterQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', value: any, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, validTo?: Date | null, validFrom: Date }> };

export type GetSelectedActorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectedActorQuery = { __typename: 'Query', selectedActor: { __typename: 'Actor', glnOrEicNumber: string, marketRole?: EicFunction | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> } };

export type GetOutgoingMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodFrom?: InputMaybe<Scalars['DateTime']['input']>;
  periodTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
  documentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOutgoingMessagesQuery = { __typename: 'Query', esettExchangeEvents: { __typename: 'ExchangeEventSearchResponse', totalCount: number, items: Array<{ __typename: 'ExchangeEventSearchResult', created: Date, documentId: string, gridAreaCode: string, calculationType: ExchangeEventCalculationType, documentStatus: DocumentStatus, timeSeriesType: TimeSeriesType }> } };

export type GetSettlementReportsQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']['input']>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
}>;


export type GetSettlementReportsQuery = { __typename: 'Query', settlementReports: Array<{ __typename: 'SettlementReport', batchNumber: any, processType: ProcessType, period: { start: Date, end: Date }, executionTime?: Date | null, gridArea: { __typename: 'GridAreaDto', code: string, name: string } }> };

export type RequestCalculationMutationVariables = Exact<{
  processtType: EdiB2CProcessType;
  meteringPointType?: InputMaybe<MeteringPointType>;
  startDate: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  energySupplierId?: InputMaybe<Scalars['String']['input']>;
  gridArea?: InputMaybe<Scalars['String']['input']>;
  balanceResponsibleId?: InputMaybe<Scalars['String']['input']>;
}>;


export type RequestCalculationMutation = { __typename: 'Mutation', createAggregatedMeasureDataRequest: { __typename: 'CreateAggregatedMeasureDataRequestPayload', success?: boolean | null } };

export type GetLatestBalanceFixingQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']['input']>;
}>;


export type GetLatestBalanceFixingQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', period: { start: Date, end: Date } }> };

export type GetActorEditableFieldsQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetActorEditableFieldsQuery = { __typename: 'Query', actorById: { __typename: 'Actor', name: string, organization: { __typename: 'Organization', domain: string }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type CreateMarketParticipantMutationVariables = Exact<{
  input: CreateMarketParticipantInput;
}>;


export type CreateMarketParticipantMutation = { __typename: 'Mutation', createMarketParticipant: { __typename: 'CreateMarketParticipantPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetActorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActorByIdQuery = { __typename: 'Query', actorById: { __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }>, organization: { __typename: 'Organization', name: string } } };

export type GetActorsByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetActorsByOrganizationIdQuery = { __typename: 'Query', actorsByOrganizationId: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetAuditLogByActorIdQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByActorIdQuery = { __typename: 'Query', actorAuditLogs: Array<{ __typename: 'ActorAuditLog', changedByUserName: string, currentValue?: string | null, previousValue?: string | null, timestamp: Date, type: ActorAuditLogType, contactCategory: ContactCategory }> };

export type GetAuditLogByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByOrganizationIdQuery = { __typename: 'Query', organizationAuditLog: Array<{ __typename: 'OrganizationAuditLog', organizationId: any, value: string, auditIdentityId: any, timestamp: Date, organizationChangeType: OrganizationChangeType, identityWithName: { __typename: 'GetAuditIdentityResponse', displayName: string } }> };

export type GetOrganizationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOrganizationByIdQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', organizationId?: string | null, name: string, businessRegisterIdentifier: string, domain: string } };

export type GetGridAreasForCreateActorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasForCreateActorQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', id: any, name: string }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', organizationId?: string | null, businessRegisterIdentifier: string, name: string, domain: string }> };

export type GetUserRolesByEicfunctionQueryVariables = Exact<{
  eicfunction: EicFunction;
}>;


export type GetUserRolesByEicfunctionQuery = { __typename: 'Query', userRolesByEicFunction: Array<{ __typename: 'UserRoleDto', name: string, id: any, description: string }> };

export type UpdateActorMutationVariables = Exact<{
  input: UpdateActorInput;
}>;


export type UpdateActorMutation = { __typename: 'Mutation', updateActor: { __typename: 'UpdateActorPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string }> | null } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename: 'Mutation', updateOrganization: { __typename: 'UpdateOrganizationPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string }> | null } };


export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const GetKnownEmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetKnownEmails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"knownEmails"}}]}}]} as unknown as DocumentNode<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>;
export const GetAssociatedActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssociatedActors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedActors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"actors"}}]}}]}}]} as unknown as DocumentNode<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>;
export const GetUserRoleAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changedByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"changeType"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>;
export const GetPermissionLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changedByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetPermissionLogsQuery, GetPermissionLogsQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetBalanceResponsibleMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBalanceResponsibleMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceResponsibleSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"supplierWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"validFromDate"}},{"kind":"Field","name":{"kind":"Name","value":"validToDate"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>;
export const GetOutgoingMessageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettOutgoingMessageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"periodFrom"}},{"kind":"Field","name":{"kind":"Name","value":"periodTo"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>;
export const GetMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"documentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"periodStart"}},{"kind":"Field","name":{"kind":"Name","value":"periodEnd"}},{"kind":"Field","name":{"kind":"Name","value":"storageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>;
export const GetGridAreaOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"fullFlexDate"}}]}}]}}]} as unknown as DocumentNode<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const GetActorsForRequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForRequestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>;
export const GetActorsForSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>;
export const GetCalculationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BatchState"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"processTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetActorFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorFilterQuery, GetActorFilterQueryVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const GetSelectedActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSelectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSelectedActorQuery, GetSelectedActorQueryVariables>;
export const GetOutgoingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOutgoingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>;
export const GetSettlementReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"batchNumber"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"executionTime"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;
export const RequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processtType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EdiB2CProcessType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringPointType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAggregatedMeasureDataRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"balanceResponsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"processType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processtType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"energySupplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"gridArea"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestCalculationMutation, RequestCalculationMutationVariables>;
export const GetLatestBalanceFixingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestBalanceFixing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"processTypes"},"value":{"kind":"EnumValue","value":"BALANCE_FIXING"}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"EnumValue","value":"COMPLETED"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>;
export const GetActorEditableFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorEditableFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>;
export const CreateMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>;
export const GetActorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorByIdQuery, GetActorByIdQueryVariables>;
export const GetActorsByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsByOrganizationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>;
export const GetActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsQuery, GetActorsQueryVariables>;
export const GetAuditLogByActorIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByActorId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changedByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"contactCategory"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>;
export const GetAuditLogByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"auditIdentityId"}},{"kind":"Field","name":{"kind":"Name","value":"identityWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"organizationChangeType"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>;
export const GetOrganizationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>;
export const GetGridAreasForCreateActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreasForCreateActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasForCreateActorQuery, GetGridAreasForCreateActorQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetUserRolesByEicfunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByEicfunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>;
export const UpdateActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateActorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateActorMutation, UpdateActorMutationVariables>;
export const UpdateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionDetailsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permissionById })
 *   )
 * })
 */
export const mockGetPermissionDetailsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionDetailsQueryVariables>, GraphQLContext<GetPermissionDetailsQuery>, any>) =>
  graphql.query<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>(
    'GetPermissionDetails',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetKnownEmailsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ knownEmails })
 *   )
 * })
 */
export const mockGetKnownEmailsQuery = (resolver: ResponseResolver<GraphQLRequest<GetKnownEmailsQueryVariables>, GraphQLContext<GetKnownEmailsQuery>, any>) =>
  graphql.query<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>(
    'GetKnownEmails',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAssociatedActorsQuery((req, res, ctx) => {
 *   const { email } = req.variables;
 *   return res(
 *     ctx.data({ associatedActors })
 *   )
 * })
 */
export const mockGetAssociatedActorsQuery = (resolver: ResponseResolver<GraphQLRequest<GetAssociatedActorsQueryVariables>, GraphQLContext<GetAssociatedActorsQuery>, any>) =>
  graphql.query<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>(
    'GetAssociatedActors',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRoleAuditLogsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ userRoleAuditLogs })
 *   )
 * })
 */
export const mockGetUserRoleAuditLogsQuery = (resolver: ResponseResolver<GraphQLRequest<GetUserRoleAuditLogsQueryVariables>, GraphQLContext<GetUserRoleAuditLogsQuery>, any>) =>
  graphql.query<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>(
    'GetUserRoleAuditLogs',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionLogsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permissionLogs })
 *   )
 * })
 */
export const mockGetPermissionLogsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionLogsQueryVariables>, GraphQLContext<GetPermissionLogsQuery>, any>) =>
  graphql.query<GetPermissionLogsQuery, GetPermissionLogsQueryVariables>(
    'GetPermissionLogs',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionsQuery((req, res, ctx) => {
 *   const { searchTerm } = req.variables;
 *   return res(
 *     ctx.data({ permissions })
 *   )
 * })
 */
export const mockGetPermissionsQuery = (resolver: ResponseResolver<GraphQLRequest<GetPermissionsQueryVariables>, GraphQLContext<GetPermissionsQuery>, any>) =>
  graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>(
    'GetPermissions',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBalanceResponsibleMessagesQuery((req, res, ctx) => {
 *   const { pageNumber, pageSize, sortProperty, sortDirection } = req.variables;
 *   return res(
 *     ctx.data({ balanceResponsible })
 *   )
 * })
 */
export const mockGetBalanceResponsibleMessagesQuery = (resolver: ResponseResolver<GraphQLRequest<GetBalanceResponsibleMessagesQueryVariables>, GraphQLContext<GetBalanceResponsibleMessagesQuery>, any>) =>
  graphql.query<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>(
    'getBalanceResponsibleMessages',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessageByIdQuery((req, res, ctx) => {
 *   const { documentId } = req.variables;
 *   return res(
 *     ctx.data({ esettOutgoingMessageById })
 *   )
 * })
 */
export const mockGetOutgoingMessageByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetOutgoingMessageByIdQueryVariables>, GraphQLContext<GetOutgoingMessageByIdQuery>, any>) =>
  graphql.query<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>(
    'GetOutgoingMessageById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringGridAreaImbalanceQuery((req, res, ctx) => {
 *   const { pageNumber, pageSize, periodFrom, periodTo, gridAreaCode, documentId } = req.variables;
 *   return res(
 *     ctx.data({ meteringGridAreaImbalance })
 *   )
 * })
 */
export const mockGetMeteringGridAreaImbalanceQuery = (resolver: ResponseResolver<GraphQLRequest<GetMeteringGridAreaImbalanceQueryVariables>, GraphQLContext<GetMeteringGridAreaImbalanceQuery>, any>) =>
  graphql.query<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>(
    'getMeteringGridAreaImbalance',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreaOverviewQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ gridAreaOverview })
 *   )
 * })
 */
export const mockGetGridAreaOverviewQuery = (resolver: ResponseResolver<GraphQLRequest<GetGridAreaOverviewQueryVariables>, GraphQLContext<GetGridAreaOverviewQuery>, any>) =>
  graphql.query<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>(
    'GetGridAreaOverview',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateCalculationMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ createCalculation })
 *   )
 * })
 */
export const mockCreateCalculationMutation = (resolver: ResponseResolver<GraphQLRequest<CreateCalculationMutationVariables>, GraphQLContext<CreateCalculationMutation>, any>) =>
  graphql.mutation<CreateCalculationMutation, CreateCalculationMutationVariables>(
    'CreateCalculation',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForRequestCalculationQuery((req, res, ctx) => {
 *   const { eicFunctions } = req.variables;
 *   return res(
 *     ctx.data({ actorsForEicFunction })
 *   )
 * })
 */
export const mockGetActorsForRequestCalculationQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsForRequestCalculationQueryVariables>, GraphQLContext<GetActorsForRequestCalculationQuery>, any>) =>
  graphql.query<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>(
    'GetActorsForRequestCalculation',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForSettlementReportQuery((req, res, ctx) => {
 *   const { eicFunctions } = req.variables;
 *   return res(
 *     ctx.data({ actorsForEicFunction })
 *   )
 * })
 */
export const mockGetActorsForSettlementReportQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsForSettlementReportQueryVariables>, GraphQLContext<GetActorsForSettlementReportQuery>, any>) =>
  graphql.query<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>(
    'GetActorsForSettlementReport',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationByIdQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ calculationById })
 *   )
 * })
 */
export const mockGetCalculationByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetCalculationByIdQueryVariables>, GraphQLContext<GetCalculationByIdQuery>, any>) =>
  graphql.query<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>(
    'GetCalculationById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationsQuery((req, res, ctx) => {
 *   const { executionTime, period, processTypes, gridAreaCodes, executionStates } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetCalculationsQuery = (resolver: ResponseResolver<GraphQLRequest<GetCalculationsQueryVariables>, GraphQLContext<GetCalculationsQuery>, any>) =>
  graphql.query<GetCalculationsQuery, GetCalculationsQueryVariables>(
    'GetCalculations',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorFilterQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorFilterQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorFilterQueryVariables>, GraphQLContext<GetActorFilterQuery>, any>) =>
  graphql.query<GetActorFilterQuery, GetActorFilterQueryVariables>(
    'GetActorFilter',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreasQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ gridAreas })
 *   )
 * })
 */
export const mockGetGridAreasQuery = (resolver: ResponseResolver<GraphQLRequest<GetGridAreasQueryVariables>, GraphQLContext<GetGridAreasQuery>, any>) =>
  graphql.query<GetGridAreasQuery, GetGridAreasQueryVariables>(
    'GetGridAreas',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSelectedActorQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ selectedActor })
 *   )
 * })
 */
export const mockGetSelectedActorQuery = (resolver: ResponseResolver<GraphQLRequest<GetSelectedActorQueryVariables>, GraphQLContext<GetSelectedActorQuery>, any>) =>
  graphql.query<GetSelectedActorQuery, GetSelectedActorQueryVariables>(
    'getSelectedActor',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessagesQuery((req, res, ctx) => {
 *   const { pageNumber, pageSize, periodFrom, periodTo, gridAreaCode, calculationType, documentStatus, timeSeriesType, documentId } = req.variables;
 *   return res(
 *     ctx.data({ esettExchangeEvents })
 *   )
 * })
 */
export const mockGetOutgoingMessagesQuery = (resolver: ResponseResolver<GraphQLRequest<GetOutgoingMessagesQueryVariables>, GraphQLContext<GetOutgoingMessagesQuery>, any>) =>
  graphql.query<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>(
    'getOutgoingMessages',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportsQuery((req, res, ctx) => {
 *   const { period, executionTime } = req.variables;
 *   return res(
 *     ctx.data({ settlementReports })
 *   )
 * })
 */
export const mockGetSettlementReportsQuery = (resolver: ResponseResolver<GraphQLRequest<GetSettlementReportsQueryVariables>, GraphQLContext<GetSettlementReportsQuery>, any>) =>
  graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>(
    'GetSettlementReports',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestCalculationMutation((req, res, ctx) => {
 *   const { processtType, meteringPointType, startDate, endDate, energySupplierId, gridArea, balanceResponsibleId } = req.variables;
 *   return res(
 *     ctx.data({ createAggregatedMeasureDataRequest })
 *   )
 * })
 */
export const mockRequestCalculationMutation = (resolver: ResponseResolver<GraphQLRequest<RequestCalculationMutationVariables>, GraphQLContext<RequestCalculationMutation>, any>) =>
  graphql.mutation<RequestCalculationMutation, RequestCalculationMutationVariables>(
    'requestCalculation',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetLatestBalanceFixingQuery((req, res, ctx) => {
 *   const { period } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetLatestBalanceFixingQuery = (resolver: ResponseResolver<GraphQLRequest<GetLatestBalanceFixingQueryVariables>, GraphQLContext<GetLatestBalanceFixingQuery>, any>) =>
  graphql.query<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>(
    'GetLatestBalanceFixing',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorEditableFieldsQuery((req, res, ctx) => {
 *   const { actorId } = req.variables;
 *   return res(
 *     ctx.data({ actorById })
 *   )
 * })
 */
export const mockGetActorEditableFieldsQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorEditableFieldsQueryVariables>, GraphQLContext<GetActorEditableFieldsQuery>, any>) =>
  graphql.query<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>(
    'GetActorEditableFields',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateMarketParticipantMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ createMarketParticipant })
 *   )
 * })
 */
export const mockCreateMarketParticipantMutation = (resolver: ResponseResolver<GraphQLRequest<CreateMarketParticipantMutationVariables>, GraphQLContext<CreateMarketParticipantMutation>, any>) =>
  graphql.mutation<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>(
    'CreateMarketParticipant',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorByIdQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ actorById })
 *   )
 * })
 */
export const mockGetActorByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorByIdQueryVariables>, GraphQLContext<GetActorByIdQuery>, any>) =>
  graphql.query<GetActorByIdQuery, GetActorByIdQueryVariables>(
    'GetActorById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsByOrganizationIdQuery((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ actorsByOrganizationId })
 *   )
 * })
 */
export const mockGetActorsByOrganizationIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsByOrganizationIdQueryVariables>, GraphQLContext<GetActorsByOrganizationIdQuery>, any>) =>
  graphql.query<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>(
    'GetActorsByOrganizationId',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ actors })
 *   )
 * })
 */
export const mockGetActorsQuery = (resolver: ResponseResolver<GraphQLRequest<GetActorsQueryVariables>, GraphQLContext<GetActorsQuery>, any>) =>
  graphql.query<GetActorsQuery, GetActorsQueryVariables>(
    'GetActors',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAuditLogByActorIdQuery((req, res, ctx) => {
 *   const { actorId } = req.variables;
 *   return res(
 *     ctx.data({ actorAuditLogs })
 *   )
 * })
 */
export const mockGetAuditLogByActorIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetAuditLogByActorIdQueryVariables>, GraphQLContext<GetAuditLogByActorIdQuery>, any>) =>
  graphql.query<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>(
    'GetAuditLogByActorId',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAuditLogByOrganizationIdQuery((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ organizationAuditLog })
 *   )
 * })
 */
export const mockGetAuditLogByOrganizationIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetAuditLogByOrganizationIdQueryVariables>, GraphQLContext<GetAuditLogByOrganizationIdQuery>, any>) =>
  graphql.query<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>(
    'GetAuditLogByOrganizationId',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationByIdQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ organizationById })
 *   )
 * })
 */
export const mockGetOrganizationByIdQuery = (resolver: ResponseResolver<GraphQLRequest<GetOrganizationByIdQueryVariables>, GraphQLContext<GetOrganizationByIdQuery>, any>) =>
  graphql.query<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>(
    'GetOrganizationById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreasForCreateActorQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ gridAreas })
 *   )
 * })
 */
export const mockGetGridAreasForCreateActorQuery = (resolver: ResponseResolver<GraphQLRequest<GetGridAreasForCreateActorQueryVariables>, GraphQLContext<GetGridAreasForCreateActorQuery>, any>) =>
  graphql.query<GetGridAreasForCreateActorQuery, GetGridAreasForCreateActorQueryVariables>(
    'GetGridAreasForCreateActor',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ organizations })
 *   )
 * })
 */
export const mockGetOrganizationsQuery = (resolver: ResponseResolver<GraphQLRequest<GetOrganizationsQueryVariables>, GraphQLContext<GetOrganizationsQuery>, any>) =>
  graphql.query<GetOrganizationsQuery, GetOrganizationsQueryVariables>(
    'GetOrganizations',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesByEicfunctionQuery((req, res, ctx) => {
 *   const { eicfunction } = req.variables;
 *   return res(
 *     ctx.data({ userRolesByEicFunction })
 *   )
 * })
 */
export const mockGetUserRolesByEicfunctionQuery = (resolver: ResponseResolver<GraphQLRequest<GetUserRolesByEicfunctionQueryVariables>, GraphQLContext<GetUserRolesByEicfunctionQuery>, any>) =>
  graphql.query<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>(
    'GetUserRolesByEicfunction',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateActorMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ updateActor })
 *   )
 * })
 */
export const mockUpdateActorMutation = (resolver: ResponseResolver<GraphQLRequest<UpdateActorMutationVariables>, GraphQLContext<UpdateActorMutation>, any>) =>
  graphql.mutation<UpdateActorMutation, UpdateActorMutationVariables>(
    'UpdateActor',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateOrganizationMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ updateOrganization })
 *   )
 * })
 */
export const mockUpdateOrganizationMutation = (resolver: ResponseResolver<GraphQLRequest<UpdateOrganizationMutationVariables>, GraphQLContext<UpdateOrganizationMutation>, any>) =>
  graphql.mutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(
    'UpdateOrganization',
    resolver
  )

import { dateRangeTypePolicy, dateTypePolicy } from "libs/dh/shared/domain/src/lib/type-policies";

export const scalarTypePolicies = {
  BalanceResponsibleType: {
    fields: { receivedDateTime: dateTypePolicy, validFromDate: dateTypePolicy, validToDate: dateTypePolicy },
  },
  Calculation: {
    fields: { period: dateRangeTypePolicy, executionTimeStart: dateTypePolicy, executionTimeEnd: dateTypePolicy },
  },
  EsettOutgoingMessage: { fields: { created: dateTypePolicy, periodFrom: dateTypePolicy, periodTo: dateTypePolicy } },
  GridAreaDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  OrganizationAuditLog: { fields: { timestamp: dateTypePolicy } },
  Permission: { fields: { created: dateTypePolicy } },
  GridAreaOverviewItemDto: {
    fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy, fullFlexDate: dateTypePolicy },
  },
  ActorAuditLog: { fields: { timestamp: dateTypePolicy } },
  SettlementReport: { fields: { period: dateRangeTypePolicy, executionTime: dateTypePolicy } },
  UserRoleAuditLog: { fields: { timestamp: dateTypePolicy } },
  PermissionLog: { fields: { timestamp: dateTypePolicy } },
  PermissionDetailsDto: { fields: { created: dateTypePolicy } },
  ExchangeEventSearchResult: { fields: { created: dateTypePolicy } },
  MeteringGridAreaImbalanceSearchResult: {
    fields: {
      documentDateTime: dateTypePolicy,
      receivedDateTime: dateTypePolicy,
      periodStart: dateTypePolicy,
      periodEnd: dateTypePolicy,
    },
  },
  MeteringGridAreaImbalancePerDayDto: { fields: { imbalanceDay: dateTypePolicy } },
};
