/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'
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
  /** Represents a date range */
  DateRange: { input: { start: Date, end: Date | null }; output: { start: Date, end: Date | null }; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: Date; output: Date; }
  UUID: { input: any; output: any; }
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ActorAuditedChangeAuditLogDto = {
  __typename: 'ActorAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  change: ActorAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
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

export type BalanceResponsibilityAgreement = {
  __typename: 'BalanceResponsibilityAgreement';
  meteringPointType?: Maybe<Scalars['String']['output']>;
  energySupplierId: Scalars['UUID']['output'];
  balanceResponsibleId: Scalars['UUID']['output'];
  gridAreaId: Scalars['UUID']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

export type BalanceResponsibleType = {
  __typename: 'BalanceResponsibleType';
  validPeriod: Scalars['DateRange']['output'];
  gridAreaWithName?: Maybe<GridAreaDto>;
  supplierWithName?: Maybe<ActorNameDto>;
  balanceResponsibleWithName?: Maybe<ActorNameDto>;
  id: Scalars['String']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  supplier: Scalars['String']['output'];
  balanceResponsible: Scalars['String']['output'];
  meteringPointType: TimeSeriesType;
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
  executionState: CalculationState;
  areSettlementReportsCreated: Scalars['Boolean']['output'];
  calculationType: CalculationType;
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
  SerialEnergyTrader = 'SerialEnergyTrader',
  Delegated = 'Delegated'
}

export type EsettOutgoingMessage = {
  __typename: 'EsettOutgoingMessage';
  period: Scalars['DateRange']['output'];
  gridArea?: Maybe<GridAreaDto>;
  documentId: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  calculationType: ExchangeEventCalculationType;
  timeSeriesType: TimeSeriesType;
  documentStatus: DocumentStatus;
  lastDispatched?: Maybe<Scalars['DateTime']['output']>;
};

export enum ExchangeEventCalculationType {
  BalanceFixing = 'BALANCE_FIXING',
  Aggregation = 'AGGREGATION'
}

export type ExchangeEventSearchResult = {
  __typename: 'ExchangeEventSearchResult';
  gridArea?: Maybe<GridAreaDto>;
  energySupplier?: Maybe<ActorNameDto>;
  documentId: Scalars['String']['output'];
  actorNumber?: Maybe<Scalars['String']['output']>;
  gridAreaCodeOut?: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  calculationType: ExchangeEventCalculationType;
  timeSeriesType: TimeSeriesType;
  documentStatus: DocumentStatus;
  lastDispatched?: Maybe<Scalars['DateTime']['output']>;
};

export type GridAreaDto = {
  __typename: 'GridAreaDto';
  priceAreaCode: PriceAreaCode;
  displayName: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

/** Imbalance price */
export type ImbalancePrice = {
  __typename: 'ImbalancePrice';
  priceAreaCode: PriceAreaCode;
  timestamp: Scalars['DateTime']['output'];
  price: Scalars['Float']['output'];
};

/** Imbalance price for a given date */
export type ImbalancePriceDaily = {
  __typename: 'ImbalancePriceDaily';
  status: ImbalancePriceStatus;
  timeStamp: Scalars['DateTime']['output'];
  imbalancePrices: Array<ImbalancePrice>;
  importedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MessageDelegationType = {
  __typename: 'MessageDelegationType';
  gridArea?: Maybe<GridAreaDto>;
  delegatedBy?: Maybe<Actor>;
  delegatedTo?: Maybe<Actor>;
  status: ActorDelegationStatus;
  id: Scalars['UUID']['output'];
  periodId: Scalars['UUID']['output'];
  process: DelegatedProcess;
  validPeriod: Scalars['DateRange']['output'];
};

export type MeteringGridAreaImbalanceSearchResult = {
  __typename: 'MeteringGridAreaImbalanceSearchResult';
  period: Scalars['DateRange']['output'];
  gridArea?: Maybe<GridAreaDto>;
  id: Scalars['String']['output'];
  documentDateTime: Scalars['DateTime']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  incomingImbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
  outgoingImbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
};

export type OrganizationAuditedChangeAuditLogDto = {
  __typename: 'OrganizationAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  change: OrganizationAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
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

export type PermissionAuditedChangeAuditLogDto = {
  __typename: 'PermissionAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  change: PermissionAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
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

export type UserAuditedChangeAuditLogDto = {
  __typename: 'UserAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  affectedActorName?: Maybe<Scalars['String']['output']>;
  affectedUserRoleName?: Maybe<Scalars['String']['output']>;
  change: UserAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
};

export type UserRoleAuditedChangeAuditLogDto = {
  __typename: 'UserRoleAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  affectedPermissionName?: Maybe<Scalars['String']['output']>;
  change: UserRoleAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
};

export enum ApplyPolicy {
  BeforeResolver = 'BEFORE_RESOLVER',
  AfterResolver = 'AFTER_RESOLVER',
  Validation = 'VALIDATION'
}

export type Query = {
  __typename: 'Query';
  actorAuditLogs: Array<ActorAuditedChangeAuditLogDto>;
  selectedActor: Actor;
  actorById: Actor;
  actors: Array<Actor>;
  actorsByOrganizationId: Array<Actor>;
  actorsForEicFunction: Array<Actor>;
  delegationsForActor: Array<MessageDelegationType>;
  associatedActors: AssociatedActors;
  balanceResponsibleAgreements: Array<BalanceResponsibilityAgreement>;
  calculationById: Calculation;
  calculations: Array<Calculation>;
  latestBalanceFixing?: Maybe<Calculation>;
  esettServiceStatus: Array<ReadinessStatusDto>;
  esettExchangeStatusReport: ExchangeEventStatusReportResponse;
  esettOutgoingMessageById: EsettOutgoingMessage;
  esettExchangeEvents: ExchangeEventSearchResponse;
  downloadEsettExchangeEvents: Scalars['String']['output'];
  meteringGridAreaImbalance: MeteringGridAreaImbalanceSearchResponse;
  downloadMeteringGridAreaImbalance: Scalars['String']['output'];
  balanceResponsible: BalanceResponsiblePageResult;
  downloadBalanceResponsibles: Scalars['String']['output'];
  gridAreaOverview: Array<GridAreaOverviewItemDto>;
  gridAreas: Array<GridAreaDto>;
  imbalancePricesOverview: ImbalancePricesOverview;
  imbalancePricesForMonth: Array<ImbalancePriceDaily>;
  organizationAuditLogs: Array<OrganizationAuditedChangeAuditLogDto>;
  organizationById: Organization;
  organizations: Array<Organization>;
  searchOrganizationInCVR: CvrOrganizationResult;
  permissionById: Permission;
  permissions: Array<Permission>;
  permissionAuditLogs: Array<PermissionAuditedChangeAuditLogDto>;
  userRoleAuditLogs: Array<UserRoleAuditedChangeAuditLogDto>;
  userAuditLogs: Array<UserAuditedChangeAuditLogDto>;
  userRoleById: UserRoleWithPermissionsDto;
  userRolesByEicFunction: Array<UserRoleDto>;
  userProfile: GetUserProfileResponse;
  emailExists: Scalars['Boolean']['output'];
  knownEmails: Array<Scalars['String']['output']>;
};


export type QueryActorAuditLogsArgs = {
  actorId: Scalars['UUID']['input'];
};


export type QueryActorByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryActorsByOrganizationIdArgs = {
  organizationId: Scalars['UUID']['input'];
};


export type QueryActorsForEicFunctionArgs = {
  eicFunctions?: InputMaybe<Array<EicFunction>>;
};


export type QueryDelegationsForActorArgs = {
  actorId: Scalars['UUID']['input'];
};


export type QueryAssociatedActorsArgs = {
  email: Scalars['String']['input'];
};


export type QueryBalanceResponsibleAgreementsArgs = {
  actorId: Scalars['UUID']['input'];
};


export type QueryCalculationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCalculationsArgs = {
  input: CalculationQueryInput;
};


export type QueryLatestBalanceFixingArgs = {
  period: Scalars['DateRange']['input'];
};


export type QueryEsettOutgoingMessageByIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryEsettExchangeEventsArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  sortProperty: ExchangeEventSortProperty;
  sortDirection: SortDirection;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDownloadEsettExchangeEventsArgs = {
  locale: Scalars['String']['input'];
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  sortProperty: ExchangeEventSortProperty;
  sortDirection: SortDirection;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMeteringGridAreaImbalanceArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  createdFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdTo?: InputMaybe<Scalars['DateTime']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  sortProperty: MeteringGridAreaImbalanceSortProperty;
  sortDirection: SortDirection;
};


export type QueryDownloadMeteringGridAreaImbalanceArgs = {
  locale: Scalars['String']['input'];
  createdFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdTo?: InputMaybe<Scalars['DateTime']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  sortProperty: MeteringGridAreaImbalanceSortProperty;
  sortDirection: SortDirection;
};


export type QueryBalanceResponsibleArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
};


export type QueryDownloadBalanceResponsiblesArgs = {
  locale: Scalars['String']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
};


export type QueryImbalancePricesForMonthArgs = {
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
};


export type QueryOrganizationAuditLogsArgs = {
  organizationId: Scalars['UUID']['input'];
};


export type QueryOrganizationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QuerySearchOrganizationInCvrArgs = {
  cvr: Scalars['String']['input'];
};


export type QueryPermissionByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPermissionsArgs = {
  searchTerm: Scalars['String']['input'];
};


export type QueryPermissionAuditLogsArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserRoleAuditLogsArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserAuditLogsArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserRoleByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserRolesByEicFunctionArgs = {
  eicFunction: EicFunction;
};


export type QueryEmailExistsArgs = {
  emailAddress: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
  updatePermission: Permission;
  updateActor: UpdateActorPayload;
  createCalculation: CreateCalculationPayload;
  createAggregatedMeasureDataRequest: CreateAggregatedMeasureDataRequestPayload;
  updateOrganization: UpdateOrganizationPayload;
  createMarketParticipant: CreateMarketParticipantPayload;
  updateUserProfile: UpdateUserProfilePayload;
  resendWaitingEsettExchangeMessages: ResendWaitingEsettExchangeMessagesPayload;
  createDelegationsForActor: CreateDelegationsForActorPayload;
  stopDelegation: StopDelegationPayload;
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


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};


export type MutationCreateDelegationsForActorArgs = {
  input: CreateDelegationsForActorInput;
};


export type MutationStopDelegationArgs = {
  input: StopDelegationInput;
};

export type Subscription = {
  __typename: 'Subscription';
  calculationProgress: Calculation;
};

export enum ActorAuditedChange {
  Name = 'NAME',
  Status = 'STATUS',
  ContactName = 'CONTACT_NAME',
  ContactEmail = 'CONTACT_EMAIL',
  ContactPhone = 'CONTACT_PHONE',
  ContactCategoryAdded = 'CONTACT_CATEGORY_ADDED',
  ContactCategoryRemoved = 'CONTACT_CATEGORY_REMOVED',
  CertificateCredentials = 'CERTIFICATE_CREDENTIALS',
  ClientSecretCredentials = 'CLIENT_SECRET_CREDENTIALS',
  DelegationStart = 'DELEGATION_START',
  DelegationStop = 'DELEGATION_STOP'
}

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

export enum CalculationState {
  Pending = 'PENDING',
  Executing = 'EXECUTING',
  Completed = 'COMPLETED',
  Failed = 'FAILED'
}

/** Defines the wholesale calculation type */
export enum CalculationType {
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
  Rejected = 'REJECTED',
  BizTalkAccepted = 'BIZ_TALK_ACCEPTED'
}

export enum PriceAreaCode {
  Dk1 = 'DK1',
  Dk2 = 'DK2'
}

export enum ImbalancePriceStatus {
  NoData = 'NO_DATA',
  InComplete = 'IN_COMPLETE',
  Complete = 'COMPLETE'
}

export enum ActorDelegationStatus {
  Awaiting = 'AWAITING',
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Cancelled = 'CANCELLED'
}

export enum DelegatedProcess {
  RequestEnergyResults = 'REQUEST_ENERGY_RESULTS',
  ReceiveEnergyResults = 'RECEIVE_ENERGY_RESULTS',
  RequestWholesaleResults = 'REQUEST_WHOLESALE_RESULTS',
  ReceiveWholesaleResults = 'RECEIVE_WHOLESALE_RESULTS'
}

export type MeteringGridAreaImbalancePerDayDto = {
  __typename: 'MeteringGridAreaImbalancePerDayDto';
  imbalanceDay: Scalars['DateTime']['output'];
  firstOccurrenceOfImbalance: Scalars['DateTime']['output'];
  firstPositionOfImbalance: Scalars['Int']['output'];
  quantity: Scalars['Float']['output'];
};

export enum OrganizationAuditedChange {
  Domain = 'DOMAIN',
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

export enum PermissionAuditedChange {
  Claim = 'CLAIM',
  Description = 'DESCRIPTION'
}

export type UserRoleDto = {
  __typename: 'UserRoleDto';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
};

export enum UserAuditedChange {
  FirstName = 'FIRST_NAME',
  LastName = 'LAST_NAME',
  PhoneNumber = 'PHONE_NUMBER',
  Status = 'STATUS',
  InvitedIntoActor = 'INVITED_INTO_ACTOR',
  UserRoleAssigned = 'USER_ROLE_ASSIGNED',
  UserRoleRemoved = 'USER_ROLE_REMOVED',
  UserRoleRemovedDueToDeactivation = 'USER_ROLE_REMOVED_DUE_TO_DEACTIVATION'
}

export enum UserRoleAuditedChange {
  Name = 'NAME',
  Description = 'DESCRIPTION',
  Status = 'STATUS',
  PermissionAdded = 'PERMISSION_ADDED',
  PermissionRemoved = 'PERMISSION_REMOVED'
}

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

export type KeyValuePairOfStringAndIEnumerableOfString = {
  __typename: 'KeyValuePairOfStringAndIEnumerableOfString';
  key: Scalars['String']['output'];
  value: Array<Scalars['String']['output']>;
};

export type ApiErrorDescriptor = {
  __typename: 'ApiErrorDescriptor';
  message: Scalars['String']['output'];
  code: Scalars['String']['output'];
  args: Scalars['JSON']['output'];
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

export type StopProcessDelegationDtoInput = {
  id: Scalars['UUID']['input'];
  periodId: Scalars['UUID']['input'];
  stopsAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateProcessDelegationsDtoInput = {
  delegatedFrom: Scalars['UUID']['input'];
  delegatedTo: Scalars['UUID']['input'];
  gridAreas: Array<Scalars['UUID']['input']>;
  delegatedProcesses: Array<DelegatedProcess>;
  startsAt: Scalars['DateTime']['input'];
};

export type UserProfileUpdateDtoInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

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

export type GetUserProfileResponse = {
  __typename: 'GetUserProfileResponse';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
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

export type CvrOrganizationResult = {
  __typename: 'CVROrganizationResult';
  name: Scalars['String']['output'];
  hasResult: Scalars['Boolean']['output'];
};

export type ImbalancePricesOverview = {
  __typename: 'ImbalancePricesOverview';
  pricePeriods: Array<ImbalancePricePeriod>;
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

export enum MeteringGridAreaImbalanceSortProperty {
  DocumentDateTime = 'DOCUMENT_DATE_TIME',
  GridAreaCode = 'GRID_AREA_CODE',
  DocumentId = 'DOCUMENT_ID',
  ReceivedDateTime = 'RECEIVED_DATE_TIME'
}

export enum MeteringGridImbalanceValuesToInclude {
  Imbalances = 'IMBALANCES',
  Balances = 'BALANCES',
  Both = 'BOTH'
}

export type MeteringGridAreaImbalanceSearchResponse = {
  __typename: 'MeteringGridAreaImbalanceSearchResponse';
  items: Array<MeteringGridAreaImbalanceSearchResult>;
  totalCount: Scalars['Int']['output'];
};

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export enum ExchangeEventSortProperty {
  CalculationType = 'CALCULATION_TYPE',
  Created = 'CREATED',
  DocumentId = 'DOCUMENT_ID',
  DocumentStatus = 'DOCUMENT_STATUS',
  GridAreaCode = 'GRID_AREA_CODE',
  TimeSeriesType = 'TIME_SERIES_TYPE',
  LatestDispatched = 'LATEST_DISPATCHED'
}

export type ExchangeEventSearchResponse = {
  __typename: 'ExchangeEventSearchResponse';
  items: Array<ExchangeEventSearchResult>;
  totalCount: Scalars['Int']['output'];
  gridAreaCount: Scalars['Int']['output'];
};

export type ExchangeEventStatusReportResponse = {
  __typename: 'ExchangeEventStatusReportResponse';
  waitingForExternalResponse: Scalars['Int']['output'];
};

export type ReadinessStatusDto = {
  __typename: 'ReadinessStatusDto';
  component: ESettStageComponent;
  isReady: Scalars['Boolean']['output'];
};

export type CalculationQueryInput = {
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  executionStates?: InputMaybe<Array<CalculationState>>;
  calculationTypes?: InputMaybe<Array<CalculationType>>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
};

export type AssociatedActors = {
  __typename: 'AssociatedActors';
  email: Scalars['String']['output'];
  actors: Array<Scalars['UUID']['output']>;
};

export enum ESettStageComponent {
  Ingestion = 'INGESTION',
  Converter = 'CONVERTER',
  Sender = 'SENDER',
  Receiver = 'RECEIVER'
}

export type ImbalancePricePeriod = {
  __typename: 'ImbalancePricePeriod';
  name: Scalars['DateTime']['output'];
  priceAreaCode: PriceAreaCode;
  status: ImbalancePriceStatus;
};

export type PermissionDetailsDto = {
  __typename: 'PermissionDetailsDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
};

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
  calculationType: CalculationType;
};

export type CreateCalculationPayload = {
  __typename: 'CreateCalculationPayload';
  uuid?: Maybe<Scalars['UUID']['output']>;
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

export type UpdateUserProfileInput = {
  userProfileUpdateDto: UserProfileUpdateDtoInput;
};

export type UpdateUserProfileError = ApiError;

export type UpdateUserProfilePayload = {
  __typename: 'UpdateUserProfilePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateUserProfileError>>;
};

export type ResendWaitingEsettExchangeMessagesPayload = {
  __typename: 'ResendWaitingEsettExchangeMessagesPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateDelegationsForActorInput = {
  actorId: Scalars['UUID']['input'];
  delegations: CreateProcessDelegationsDtoInput;
};

export type CreateDelegationsForActorError = ApiError;

export type CreateDelegationsForActorPayload = {
  __typename: 'CreateDelegationsForActorPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<CreateDelegationsForActorError>>;
};

export type StopDelegationInput = {
  stopMessageDelegationDto: Array<StopProcessDelegationDtoInput>;
};

export type StopDelegationError = ApiError;

export type StopDelegationPayload = {
  __typename: 'StopDelegationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<StopDelegationError>>;
};

export type GetAssociatedActorsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetAssociatedActorsQuery = { __typename: 'Query', associatedActors: { __typename: 'AssociatedActors', email: string, actors: Array<any> } };

export type GetPermissionsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GetPermissionsQuery = { __typename: 'Query', permissions: Array<{ __typename: 'Permission', id: number, name: string, description: string, created: Date }> };

export type GetPermissionAuditLogsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionAuditLogsQuery = { __typename: 'Query', permissionAuditLogs: Array<{ __typename: 'PermissionAuditedChangeAuditLogDto', change: PermissionAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetUserAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserAuditLogsQuery = { __typename: 'Query', userAuditLogs: Array<{ __typename: 'UserAuditedChangeAuditLogDto', change: UserAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedActorName?: string | null, affectedUserRoleName?: string | null }> };

export type GetUserRoleAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleAuditLogsQuery = { __typename: 'Query', userRoleAuditLogs: Array<{ __typename: 'UserRoleAuditedChangeAuditLogDto', change: UserRoleAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedPermissionName?: string | null }> };

export type GetImbalancePricesMonthOverviewQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
}>;


export type GetImbalancePricesMonthOverviewQuery = { __typename: 'Query', imbalancePricesForMonth: Array<{ __typename: 'ImbalancePriceDaily', status: ImbalancePriceStatus, timeStamp: Date, importedAt?: Date | null, imbalancePrices: Array<{ __typename: 'ImbalancePrice', timestamp: Date, price: number }> }> };

export type GetKnownEmailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetKnownEmailsQuery = { __typename: 'Query', knownEmails: Array<string> };

export type GetGridAreaOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreaOverviewQuery = { __typename: 'Query', gridAreaOverview: Array<{ __typename: 'GridAreaOverviewItemDto', id: any, code: string, name: string, priceAreaCode: string, validFrom: Date, validTo?: Date | null, actorNumber?: string | null, actorName?: string | null, organizationName?: string | null, fullFlexDate?: Date | null }> };

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionDetailsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string, created: Date, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename: 'UserRoleDto', id: any, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type DownloadMeteringGridAreaImbalanceQueryVariables = Exact<{
  locale: Scalars['String']['input'];
  createdFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdTo?: InputMaybe<Scalars['DateTime']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  sortProperty: MeteringGridAreaImbalanceSortProperty;
  sortDirection: SortDirection;
}>;


export type DownloadMeteringGridAreaImbalanceQuery = { __typename: 'Query', downloadMeteringGridAreaImbalance: string };

export type DownloadBalanceResponsiblesQueryVariables = Exact<{
  locale: Scalars['String']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
}>;


export type DownloadBalanceResponsiblesQuery = { __typename: 'Query', downloadBalanceResponsibles: string };

export type GetImbalancePricesOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetImbalancePricesOverviewQuery = { __typename: 'Query', imbalancePricesOverview: { __typename: 'ImbalancePricesOverview', pricePeriods: Array<{ __typename: 'ImbalancePricePeriod', name: Date, priceAreaCode: PriceAreaCode, status: ImbalancePriceStatus }> } };

export type DownloadEsettExchangeEventsQueryVariables = Exact<{
  locale: Scalars['String']['input'];
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  sortProperty: ExchangeEventSortProperty;
  sortDirection: SortDirection;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type DownloadEsettExchangeEventsQuery = { __typename: 'Query', downloadEsettExchangeEvents: string };

export type GetMeteringGridAreaImbalanceQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  createdFrom?: InputMaybe<Scalars['DateTime']['input']>;
  createdTo?: InputMaybe<Scalars['DateTime']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  sortProperty: MeteringGridAreaImbalanceSortProperty;
  sortDirection: SortDirection;
}>;


export type GetMeteringGridAreaImbalanceQuery = { __typename: 'Query', meteringGridAreaImbalance: { __typename: 'MeteringGridAreaImbalanceSearchResponse', totalCount: number, items: Array<{ __typename: 'MeteringGridAreaImbalanceSearchResult', id: string, documentDateTime: Date, receivedDateTime: Date, period: { start: Date, end: Date | null }, gridArea?: { __typename: 'GridAreaDto', displayName: string } | null, incomingImbalancePerDay: Array<{ __typename: 'MeteringGridAreaImbalancePerDayDto', imbalanceDay: Date, firstOccurrenceOfImbalance: Date, firstPositionOfImbalance: number, quantity: number }>, outgoingImbalancePerDay: Array<{ __typename: 'MeteringGridAreaImbalancePerDayDto', imbalanceDay: Date, firstOccurrenceOfImbalance: Date, firstPositionOfImbalance: number, quantity: number }> }> } };

export type GetOutgoingMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatus?: InputMaybe<DocumentStatus>;
  timeSeriesType?: InputMaybe<TimeSeriesType>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  sortProperty: ExchangeEventSortProperty;
  sortDirection: SortDirection;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOutgoingMessagesQuery = { __typename: 'Query', esettExchangeEvents: { __typename: 'ExchangeEventSearchResponse', totalCount: number, gridAreaCount: number, items: Array<{ __typename: 'ExchangeEventSearchResult', created: Date, lastDispatched?: Date | null, documentId: string, actorNumber?: string | null, calculationType: ExchangeEventCalculationType, timeSeriesType: TimeSeriesType, gridAreaCodeOut?: string | null, documentStatus: DocumentStatus, energySupplier?: { __typename: 'ActorNameDto', value: string } | null, gridArea?: { __typename: 'GridAreaDto', displayName: string } | null }> } };

export type GetServiceStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServiceStatusQuery = { __typename: 'Query', esettServiceStatus: Array<{ __typename: 'ReadinessStatusDto', component: ESettStageComponent, isReady: boolean }> };

export type GetOutgoingMessageByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetOutgoingMessageByIdQuery = { __typename: 'Query', esettOutgoingMessageById: { __typename: 'EsettOutgoingMessage', documentId: string, calculationType: ExchangeEventCalculationType, created: Date, period: { start: Date, end: Date | null }, documentStatus: DocumentStatus, lastDispatched?: Date | null, timeSeriesType: TimeSeriesType, gridArea?: { __typename: 'GridAreaDto', displayName: string } | null } };

export type GetBalanceResponsibleMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
}>;


export type GetBalanceResponsibleMessagesQuery = { __typename: 'Query', balanceResponsible: { __typename: 'BalanceResponsiblePageResult', totalCount: number, page: Array<{ __typename: 'BalanceResponsibleType', id: string, receivedDateTime: Date, supplier: string, balanceResponsible: string, meteringPointType: TimeSeriesType, validPeriod: { start: Date, end: Date | null }, gridArea: string, supplierWithName?: { __typename: 'ActorNameDto', value: string } | null, balanceResponsibleWithName?: { __typename: 'ActorNameDto', value: string } | null, gridAreaWithName?: { __typename: 'GridAreaDto', code: string, name: string } | null }> } };

export type GetStatusReportQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatusReportQuery = { __typename: 'Query', esettExchangeStatusReport: { __typename: 'ExchangeEventStatusReportResponse', waitingForExternalResponse: number } };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename: 'Mutation', createCalculation: { __typename: 'CreateCalculationPayload', uuid?: any | null } };

export type ResendExchangeMessagesMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendExchangeMessagesMutation = { __typename: 'Mutation', resendWaitingEsettExchangeMessages: { __typename: 'ResendWaitingEsettExchangeMessagesPayload', success?: boolean | null } };

export type GetActorsForSettlementReportQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForSettlementReportQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', value: string, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetActorFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorFilterQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', value: any, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetSelectedActorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectedActorQuery = { __typename: 'Query', selectedActor: { __typename: 'Actor', glnOrEicNumber: string, marketRole?: EicFunction | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> } };

export type GetCalculationsQueryVariables = Exact<{
  input: CalculationQueryInput;
}>;


export type GetCalculationsQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', id: any, executionState: CalculationState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date | null }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> }> };

export type GetCalculationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCalculationByIdQuery = { __typename: 'Query', calculationById: { __typename: 'Calculation', id: any, executionState: CalculationState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date | null }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, id: any, priceAreaCode: PriceAreaCode, validFrom: Date }> } };

export type GetLatestBalanceFixingQueryVariables = Exact<{
  period: Scalars['DateRange']['input'];
}>;


export type GetLatestBalanceFixingQuery = { __typename: 'Query', latestBalanceFixing?: { __typename: 'Calculation', period: { start: Date, end: Date | null } } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename: 'Mutation', updateUserProfile: { __typename: 'UpdateUserProfilePayload', saved?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

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

export type OnCalculationProgressSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCalculationProgressSubscription = { __typename: 'Subscription', calculationProgress: { __typename: 'Calculation', id: any, executionState: CalculationState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date | null }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> } };

export type GetActorsForRequestCalculationQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForRequestCalculationQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', marketRole?: EicFunction | null, value: string, displayValue: string }> };

export type CreateMarketParticipantMutationVariables = Exact<{
  input: CreateMarketParticipantInput;
}>;


export type CreateMarketParticipantMutation = { __typename: 'Mutation', createMarketParticipant: { __typename: 'CreateMarketParticipantPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetAuditLogByActorIdQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByActorIdQuery = { __typename: 'Query', actorAuditLogs: Array<{ __typename: 'ActorAuditedChangeAuditLogDto', change: ActorAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetActorEditableFieldsQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetActorEditableFieldsQuery = { __typename: 'Query', actorById: { __typename: 'Actor', name: string, organization: { __typename: 'Organization', domain: string }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserProfileQuery = { __typename: 'Query', userProfile: { __typename: 'GetUserProfileResponse', firstName: string, lastName: string, phoneNumber: string } };

export type GetAuditLogByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByOrganizationIdQuery = { __typename: 'Query', organizationAuditLogs: Array<{ __typename: 'OrganizationAuditedChangeAuditLogDto', change: OrganizationAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetActorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActorByIdQuery = { __typename: 'Query', actorById: { __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, displayName: string, id: any }>, organization: { __typename: 'Organization', name: string } } };

export type GetActorsByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetActorsByOrganizationIdQuery = { __typename: 'Query', actorsByOrganizationId: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetOrganizationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOrganizationByIdQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', organizationId?: string | null, name: string, businessRegisterIdentifier: string, domain: string, address: { __typename: 'AddressDto', country: string } } };

export type GetDelegationsForActorQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetDelegationsForActorQuery = { __typename: 'Query', delegationsForActor: Array<{ __typename: 'MessageDelegationType', periodId: any, id: any, process: DelegatedProcess, validPeriod: { start: Date, end: Date | null }, status: ActorDelegationStatus, delegatedBy?: { __typename: 'Actor', id: any, name: string } | null, delegatedTo?: { __typename: 'Actor', id: any, name: string } | null, gridArea?: { __typename: 'GridAreaDto', id: any, code: string } | null }> };

export type CreateDelegationForActorMutationVariables = Exact<{
  input: CreateDelegationsForActorInput;
}>;


export type CreateDelegationForActorMutation = { __typename: 'Mutation', createDelegationsForActor: { __typename: 'CreateDelegationsForActorPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetOrganizationFromCvrQueryVariables = Exact<{
  cvr: Scalars['String']['input'];
}>;


export type GetOrganizationFromCvrQuery = { __typename: 'Query', searchOrganizationInCVR: { __typename: 'CVROrganizationResult', name: string, hasResult: boolean } };

export type GetUserRolesByEicfunctionQueryVariables = Exact<{
  eicfunction: EicFunction;
}>;


export type GetUserRolesByEicfunctionQuery = { __typename: 'Query', userRolesByEicFunction: Array<{ __typename: 'UserRoleDto', name: string, id: any, description: string }> };

export type UpdateActorMutationVariables = Exact<{
  input: UpdateActorInput;
}>;


export type UpdateActorMutation = { __typename: 'Mutation', updateActor: { __typename: 'UpdateActorPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string }> | null } };

export type GetDelegatesQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetDelegatesQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', name: string, id: any, glnOrEicNumber: string }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', organizationId?: string | null, businessRegisterIdentifier: string, name: string, domain: string }> };

export type GetActorsForEicFunctionQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForEicFunctionQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', id: any, code: string, name: string, displayName: string, validTo?: Date | null, validFrom: Date }> };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type StopDelegationsMutationVariables = Exact<{
  input: StopDelegationInput;
}>;


export type StopDelegationsMutation = { __typename: 'Mutation', stopDelegation: { __typename: 'StopDelegationPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename: 'Mutation', updateOrganization: { __typename: 'UpdateOrganizationPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };


export const GetAssociatedActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssociatedActors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedActors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"actors"}}]}}]}}]} as unknown as DocumentNode<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetPermissionAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>;
export const GetUserAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedActorName"}},{"kind":"Field","name":{"kind":"Name","value":"affectedUserRoleName"}}]}}]}}]} as unknown as DocumentNode<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>;
export const GetUserRoleAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedPermissionName"}}]}}]}}]} as unknown as DocumentNode<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>;
export const GetImbalancePricesMonthOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesMonthOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PriceAreaCode"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesForMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"areaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timeStamp"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"imbalancePrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>;
export const GetKnownEmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetKnownEmails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"knownEmails"}}]}}]} as unknown as DocumentNode<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>;
export const GetGridAreaOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"fullFlexDate"}}]}}]}}]} as unknown as DocumentNode<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>;
export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const DownloadMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"downloadMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridImbalanceValuesToInclude"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridAreaImbalanceSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadMeteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"valuesToInclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}}}]}]}}]} as unknown as DocumentNode<DownloadMeteringGridAreaImbalanceQuery, DownloadMeteringGridAreaImbalanceQueryVariables>;
export const DownloadBalanceResponsiblesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"downloadBalanceResponsibles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceResponsibleSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadBalanceResponsibles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}]}]}}]} as unknown as DocumentNode<DownloadBalanceResponsiblesQuery, DownloadBalanceResponsiblesQueryVariables>;
export const GetImbalancePricesOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricePeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>;
export const DownloadEsettExchangeEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"downloadEsettExchangeEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadEsettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}}]}]}}]} as unknown as DocumentNode<DownloadEsettExchangeEventsQuery, DownloadEsettExchangeEventsQueryVariables>;
export const GetMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridImbalanceValuesToInclude"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridAreaImbalanceSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"valuesToInclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"incomingImbalancePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalanceDay"}},{"kind":"Field","name":{"kind":"Name","value":"firstOccurrenceOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"firstPositionOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingImbalancePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalanceDay"}},{"kind":"Field","name":{"kind":"Name","value":"firstOccurrenceOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"firstPositionOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>;
export const GetOutgoingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOutgoingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastDispatched"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCodeOut"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCount"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>;
export const GetServiceStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}}]}}]}}]} as unknown as DocumentNode<GetServiceStatusQuery, GetServiceStatusQueryVariables>;
export const GetOutgoingMessageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettOutgoingMessageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastDispatched"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>;
export const GetBalanceResponsibleMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBalanceResponsibleMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceResponsibleSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"supplierWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>;
export const GetStatusReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitingForExternalResponse"}}]}}]}}]} as unknown as DocumentNode<GetStatusReportQuery, GetStatusReportQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const ResendExchangeMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendWaitingEsettExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>;
export const GetActorsForSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>;
export const GetActorFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorFilterQuery, GetActorFilterQueryVariables>;
export const GetSelectedActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSelectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSelectedActorQuery, GetSelectedActorQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetCalculationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>;
export const GetLatestBalanceFixingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestBalanceFixing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestBalanceFixing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"saved"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const RequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processtType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EdiB2CProcessType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringPointType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAggregatedMeasureDataRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"balanceResponsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"processType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processtType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"energySupplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"gridArea"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestCalculationMutation, RequestCalculationMutationVariables>;
export const OnCalculationProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnCalculationProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<OnCalculationProgressSubscription, OnCalculationProgressSubscriptionVariables>;
export const GetActorsForRequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForRequestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>;
export const CreateMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>;
export const GetAuditLogByActorIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByActorId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>;
export const GetActorEditableFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorEditableFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetAuditLogByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>;
export const GetActorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorByIdQuery, GetActorByIdQueryVariables>;
export const GetActorsByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsByOrganizationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>;
export const GetOrganizationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>;
export const GetDelegationsForActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDelegationsForActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delegationsForActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"process"}},{"kind":"Field","name":{"kind":"Name","value":"delegatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delegatedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetDelegationsForActorQuery, GetDelegationsForActorQueryVariables>;
export const CreateDelegationForActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDelegationForActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDelegationsForActorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDelegationsForActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateDelegationForActorMutation, CreateDelegationForActorMutationVariables>;
export const GetOrganizationFromCvrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationFromCVR"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchOrganizationInCVR"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cvr"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hasResult"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>;
export const GetUserRolesByEicfunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByEicfunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>;
export const UpdateActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateActorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateActorMutation, UpdateActorMutationVariables>;
export const GetDelegatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDelegates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}}]}}]} as unknown as DocumentNode<GetDelegatesQuery, GetDelegatesQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetActorsForEicFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForEicFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsForEicFunctionQuery, GetActorsForEicFunctionQueryVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const GetActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsQuery, GetActorsQueryVariables>;
export const StopDelegationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"stopDelegations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StopDelegationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopDelegation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<StopDelegationsMutation, StopDelegationsMutationVariables>;
export const UpdateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAssociatedActorsQuery(
 *   ({ query, variables }) => {
 *     const { email } = variables;
 *     return HttpResponse.json({
 *       data: { associatedActors }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAssociatedActorsQuery = (resolver: GraphQLResponseResolver<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>(
    'GetAssociatedActors',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionsQuery(
 *   ({ query, variables }) => {
 *     const { searchTerm } = variables;
 *     return HttpResponse.json({
 *       data: { permissions }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionsQuery = (resolver: GraphQLResponseResolver<GetPermissionsQuery, GetPermissionsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>(
    'GetPermissions',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { permissionAuditLogs }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionAuditLogsQuery = (resolver: GraphQLResponseResolver<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>(
    'GetPermissionAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userAuditLogs }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserAuditLogsQuery = (resolver: GraphQLResponseResolver<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>(
    'GetUserAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRoleAuditLogsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userRoleAuditLogs }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRoleAuditLogsQuery = (resolver: GraphQLResponseResolver<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>(
    'GetUserRoleAuditLogs',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetImbalancePricesMonthOverviewQuery(
 *   ({ query, variables }) => {
 *     const { year, month, areaCode } = variables;
 *     return HttpResponse.json({
 *       data: { imbalancePricesForMonth }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetImbalancePricesMonthOverviewQuery = (resolver: GraphQLResponseResolver<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>(
    'GetImbalancePricesMonthOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetKnownEmailsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { knownEmails }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetKnownEmailsQuery = (resolver: GraphQLResponseResolver<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>(
    'GetKnownEmails',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreaOverviewQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { gridAreaOverview }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetGridAreaOverviewQuery = (resolver: GraphQLResponseResolver<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>(
    'GetGridAreaOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionDetailsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { permissionById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionDetailsQuery = (resolver: GraphQLResponseResolver<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>(
    'GetPermissionDetails',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDownloadMeteringGridAreaImbalanceQuery(
 *   ({ query, variables }) => {
 *     const { locale, createdFrom, createdTo, calculationPeriod, gridAreaCode, documentId, valuesToInclude, sortProperty, sortDirection } = variables;
 *     return HttpResponse.json({
 *       data: { downloadMeteringGridAreaImbalance }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDownloadMeteringGridAreaImbalanceQuery = (resolver: GraphQLResponseResolver<DownloadMeteringGridAreaImbalanceQuery, DownloadMeteringGridAreaImbalanceQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<DownloadMeteringGridAreaImbalanceQuery, DownloadMeteringGridAreaImbalanceQueryVariables>(
    'downloadMeteringGridAreaImbalance',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDownloadBalanceResponsiblesQuery(
 *   ({ query, variables }) => {
 *     const { locale, sortProperty, sortDirection } = variables;
 *     return HttpResponse.json({
 *       data: { downloadBalanceResponsibles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDownloadBalanceResponsiblesQuery = (resolver: GraphQLResponseResolver<DownloadBalanceResponsiblesQuery, DownloadBalanceResponsiblesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<DownloadBalanceResponsiblesQuery, DownloadBalanceResponsiblesQueryVariables>(
    'downloadBalanceResponsibles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetImbalancePricesOverviewQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { imbalancePricesOverview }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetImbalancePricesOverviewQuery = (resolver: GraphQLResponseResolver<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>(
    'GetImbalancePricesOverview',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDownloadEsettExchangeEventsQuery(
 *   ({ query, variables }) => {
 *     const { locale, periodInterval, createdInterval, sentInterval, gridAreaCode, calculationType, timeSeriesType, documentStatus, documentId, sortProperty, sortDirection, actorNumber } = variables;
 *     return HttpResponse.json({
 *       data: { downloadEsettExchangeEvents }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDownloadEsettExchangeEventsQuery = (resolver: GraphQLResponseResolver<DownloadEsettExchangeEventsQuery, DownloadEsettExchangeEventsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<DownloadEsettExchangeEventsQuery, DownloadEsettExchangeEventsQueryVariables>(
    'downloadEsettExchangeEvents',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetMeteringGridAreaImbalanceQuery(
 *   ({ query, variables }) => {
 *     const { pageNumber, pageSize, createdFrom, createdTo, calculationPeriod, gridAreaCode, documentId, valuesToInclude, sortProperty, sortDirection } = variables;
 *     return HttpResponse.json({
 *       data: { meteringGridAreaImbalance }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetMeteringGridAreaImbalanceQuery = (resolver: GraphQLResponseResolver<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>(
    'getMeteringGridAreaImbalance',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessagesQuery(
 *   ({ query, variables }) => {
 *     const { pageNumber, pageSize, periodInterval, sentInterval, gridAreaCode, createdInterval, calculationType, documentStatus, timeSeriesType, documentId, sortProperty, sortDirection, actorNumber } = variables;
 *     return HttpResponse.json({
 *       data: { esettExchangeEvents }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOutgoingMessagesQuery = (resolver: GraphQLResponseResolver<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>(
    'getOutgoingMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetServiceStatusQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { esettServiceStatus }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetServiceStatusQuery = (resolver: GraphQLResponseResolver<GetServiceStatusQuery, GetServiceStatusQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetServiceStatusQuery, GetServiceStatusQueryVariables>(
    'getServiceStatus',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOutgoingMessageByIdQuery(
 *   ({ query, variables }) => {
 *     const { documentId } = variables;
 *     return HttpResponse.json({
 *       data: { esettOutgoingMessageById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOutgoingMessageByIdQuery = (resolver: GraphQLResponseResolver<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>(
    'GetOutgoingMessageById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetBalanceResponsibleMessagesQuery(
 *   ({ query, variables }) => {
 *     const { pageNumber, pageSize, sortProperty, sortDirection } = variables;
 *     return HttpResponse.json({
 *       data: { balanceResponsible }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetBalanceResponsibleMessagesQuery = (resolver: GraphQLResponseResolver<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>(
    'getBalanceResponsibleMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetStatusReportQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { esettExchangeStatusReport }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetStatusReportQuery = (resolver: GraphQLResponseResolver<GetStatusReportQuery, GetStatusReportQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetStatusReportQuery, GetStatusReportQueryVariables>(
    'GetStatusReport',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateCalculationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createCalculation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateCalculationMutation = (resolver: GraphQLResponseResolver<CreateCalculationMutation, CreateCalculationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateCalculationMutation, CreateCalculationMutationVariables>(
    'CreateCalculation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockResendExchangeMessagesMutation(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { resendWaitingEsettExchangeMessages }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockResendExchangeMessagesMutation = (resolver: GraphQLResponseResolver<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>(
    'ResendExchangeMessages',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForSettlementReportQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { actorsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorsForSettlementReportQuery = (resolver: GraphQLResponseResolver<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>(
    'GetActorsForSettlementReport',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorFilterQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { actors }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorFilterQuery = (resolver: GraphQLResponseResolver<GetActorFilterQuery, GetActorFilterQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorFilterQuery, GetActorFilterQueryVariables>(
    'GetActorFilter',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSelectedActorQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { selectedActor }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSelectedActorQuery = (resolver: GraphQLResponseResolver<GetSelectedActorQuery, GetSelectedActorQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetSelectedActorQuery, GetSelectedActorQueryVariables>(
    'getSelectedActor',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationsQuery(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { calculations }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetCalculationsQuery = (resolver: GraphQLResponseResolver<GetCalculationsQuery, GetCalculationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetCalculationsQuery, GetCalculationsQueryVariables>(
    'GetCalculations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { calculationById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetCalculationByIdQuery = (resolver: GraphQLResponseResolver<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>(
    'GetCalculationById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetLatestBalanceFixingQuery(
 *   ({ query, variables }) => {
 *     const { period } = variables;
 *     return HttpResponse.json({
 *       data: { latestBalanceFixing }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetLatestBalanceFixingQuery = (resolver: GraphQLResponseResolver<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>(
    'GetLatestBalanceFixing',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserProfileMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserProfile }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserProfileMutation = (resolver: GraphQLResponseResolver<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(
    'UpdateUserProfile',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockRequestCalculationMutation(
 *   ({ query, variables }) => {
 *     const { processtType, meteringPointType, startDate, endDate, energySupplierId, gridArea, balanceResponsibleId } = variables;
 *     return HttpResponse.json({
 *       data: { createAggregatedMeasureDataRequest }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestCalculationMutation = (resolver: GraphQLResponseResolver<RequestCalculationMutation, RequestCalculationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<RequestCalculationMutation, RequestCalculationMutationVariables>(
    'requestCalculation',
    resolver,
    options
  )


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForRequestCalculationQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { actorsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorsForRequestCalculationQuery = (resolver: GraphQLResponseResolver<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>(
    'GetActorsForRequestCalculation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateMarketParticipantMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createMarketParticipant }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateMarketParticipantMutation = (resolver: GraphQLResponseResolver<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>(
    'CreateMarketParticipant',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAuditLogByActorIdQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { actorAuditLogs }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAuditLogByActorIdQuery = (resolver: GraphQLResponseResolver<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>(
    'GetAuditLogByActorId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorEditableFieldsQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { actorById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorEditableFieldsQuery = (resolver: GraphQLResponseResolver<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>(
    'GetActorEditableFields',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserProfileQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { userProfile }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserProfileQuery = (resolver: GraphQLResponseResolver<GetUserProfileQuery, GetUserProfileQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserProfileQuery, GetUserProfileQueryVariables>(
    'getUserProfile',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetAuditLogByOrganizationIdQuery(
 *   ({ query, variables }) => {
 *     const { organizationId } = variables;
 *     return HttpResponse.json({
 *       data: { organizationAuditLogs }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetAuditLogByOrganizationIdQuery = (resolver: GraphQLResponseResolver<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>(
    'GetAuditLogByOrganizationId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { actorById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorByIdQuery = (resolver: GraphQLResponseResolver<GetActorByIdQuery, GetActorByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorByIdQuery, GetActorByIdQueryVariables>(
    'GetActorById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsByOrganizationIdQuery(
 *   ({ query, variables }) => {
 *     const { organizationId } = variables;
 *     return HttpResponse.json({
 *       data: { actorsByOrganizationId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorsByOrganizationIdQuery = (resolver: GraphQLResponseResolver<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>(
    'GetActorsByOrganizationId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { organizationById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationByIdQuery = (resolver: GraphQLResponseResolver<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>(
    'GetOrganizationById',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetDelegationsForActorQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { delegationsForActor }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetDelegationsForActorQuery = (resolver: GraphQLResponseResolver<GetDelegationsForActorQuery, GetDelegationsForActorQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetDelegationsForActorQuery, GetDelegationsForActorQueryVariables>(
    'GetDelegationsForActor',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateDelegationForActorMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createDelegationsForActor }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateDelegationForActorMutation = (resolver: GraphQLResponseResolver<CreateDelegationForActorMutation, CreateDelegationForActorMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateDelegationForActorMutation, CreateDelegationForActorMutationVariables>(
    'createDelegationForActor',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationFromCvrQuery(
 *   ({ query, variables }) => {
 *     const { cvr } = variables;
 *     return HttpResponse.json({
 *       data: { searchOrganizationInCVR }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationFromCvrQuery = (resolver: GraphQLResponseResolver<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>(
    'GetOrganizationFromCVR',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesByEicfunctionQuery(
 *   ({ query, variables }) => {
 *     const { eicfunction } = variables;
 *     return HttpResponse.json({
 *       data: { userRolesByEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesByEicfunctionQuery = (resolver: GraphQLResponseResolver<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>(
    'GetUserRolesByEicfunction',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateActorMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateActor }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateActorMutation = (resolver: GraphQLResponseResolver<UpdateActorMutation, UpdateActorMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateActorMutation, UpdateActorMutationVariables>(
    'UpdateActor',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetDelegatesQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { actorsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetDelegatesQuery = (resolver: GraphQLResponseResolver<GetDelegatesQuery, GetDelegatesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetDelegatesQuery, GetDelegatesQueryVariables>(
    'getDelegates',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { organizations }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetOrganizationsQuery = (resolver: GraphQLResponseResolver<GetOrganizationsQuery, GetOrganizationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetOrganizationsQuery, GetOrganizationsQueryVariables>(
    'GetOrganizations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsForEicFunctionQuery(
 *   ({ query, variables }) => {
 *     const { eicFunctions } = variables;
 *     return HttpResponse.json({
 *       data: { actorsForEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorsForEicFunctionQuery = (resolver: GraphQLResponseResolver<GetActorsForEicFunctionQuery, GetActorsForEicFunctionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorsForEicFunctionQuery, GetActorsForEicFunctionQueryVariables>(
    'GetActorsForEicFunction',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetGridAreasQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { gridAreas }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetGridAreasQuery = (resolver: GraphQLResponseResolver<GetGridAreasQuery, GetGridAreasQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetGridAreasQuery, GetGridAreasQueryVariables>(
    'GetGridAreas',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { actors }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorsQuery = (resolver: GraphQLResponseResolver<GetActorsQuery, GetActorsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorsQuery, GetActorsQueryVariables>(
    'GetActors',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockStopDelegationsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { stopDelegation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockStopDelegationsMutation = (resolver: GraphQLResponseResolver<StopDelegationsMutation, StopDelegationsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<StopDelegationsMutation, StopDelegationsMutationVariables>(
    'stopDelegations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateOrganizationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateOrganization }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateOrganizationMutation = (resolver: GraphQLResponseResolver<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(
    'UpdateOrganization',
    resolver,
    options
  )

import { dateRangeTypePolicy, dateTypePolicy } from "libs/dh/shared/domain/src/lib/type-policies";

export const scalarTypePolicies = {
  ActorAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  BalanceResponsibilityAgreement: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  BalanceResponsibleType: { fields: { validPeriod: dateRangeTypePolicy, receivedDateTime: dateTypePolicy } },
  Calculation: {
    fields: { period: dateRangeTypePolicy, executionTimeStart: dateTypePolicy, executionTimeEnd: dateTypePolicy },
  },
  EsettOutgoingMessage: {
    fields: { period: dateRangeTypePolicy, created: dateTypePolicy, lastDispatched: dateTypePolicy },
  },
  ExchangeEventSearchResult: { fields: { created: dateTypePolicy, lastDispatched: dateTypePolicy } },
  GridAreaDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  ImbalancePrice: { fields: { timestamp: dateTypePolicy } },
  ImbalancePriceDaily: { fields: { timeStamp: dateTypePolicy, importedAt: dateTypePolicy } },
  MessageDelegationType: { fields: { validPeriod: dateRangeTypePolicy } },
  MeteringGridAreaImbalanceSearchResult: {
    fields: { period: dateRangeTypePolicy, documentDateTime: dateTypePolicy, receivedDateTime: dateTypePolicy },
  },
  OrganizationAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  PermissionAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  Permission: { fields: { created: dateTypePolicy } },
  UserAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  UserRoleAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  MeteringGridAreaImbalancePerDayDto: {
    fields: { imbalanceDay: dateTypePolicy, firstOccurrenceOfImbalance: dateTypePolicy },
  },
  GridAreaOverviewItemDto: {
    fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy, fullFlexDate: dateTypePolicy },
  },
  ImbalancePricePeriod: { fields: { name: dateTypePolicy } },
  PermissionDetailsDto: { fields: { created: dateTypePolicy } },
};
