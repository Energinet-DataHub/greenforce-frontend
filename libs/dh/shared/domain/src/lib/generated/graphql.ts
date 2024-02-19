/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { graphql } from 'msw'
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
  DateTime: { input: Date; output: Date; }
  UUID: { input: any; output: any; }
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
  permissionById: Permission;
  permissions: Array<Permission>;
  permissionAuditLogs: Array<PermissionAuditedChangeAuditLogDto>;
  userRoleAuditLogs: Array<UserRoleAuditedChangeAuditLogDto>;
  userAuditLogs: Array<UserAuditedChangeAuditLogDto>;
  organizationAuditLogs: Array<OrganizationAuditedChangeAuditLogDto>;
  actorAuditLogs: Array<ActorAuditedChangeAuditLogDto>;
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
  esettServiceStatus: Array<ReadinessStatusDto>;
  esettExchangeStatusReport: ExchangeEventStatusReportResponse;
  esettOutgoingMessageById: EsettOutgoingMessage;
  esettExchangeEvents: ExchangeEventSearchResponse;
  meteringGridAreaImbalance: MeteringGridAreaImbalanceSearchResponse;
  balanceResponsible: BalanceResponsiblePageResult;
  actorsByOrganizationId: Array<Actor>;
  emailExists: Scalars['Boolean']['output'];
  knownEmails: Array<Scalars['String']['output']>;
  associatedActors: AssociatedActors;
  gridAreaOverview: Array<GridAreaOverviewItemDto>;
  imbalancePricesOverview: ImbalancePricesOverview;
  imbalancePricesForMonth: Array<ImbalancePriceDaily>;
  userProfile: GetUserProfileResponse;
  searchOrganizationInCVR: CvrOrganizationResult;
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


export type QueryOrganizationAuditLogsArgs = {
  organizationId: Scalars['UUID']['input'];
};


export type QueryActorAuditLogsArgs = {
  actorId: Scalars['UUID']['input'];
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
  executionStates?: InputMaybe<Array<CalculationState>>;
  calculationTypes?: InputMaybe<Array<CalculationType>>;
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


export type QueryEmailExistsArgs = {
  emailAddress: Scalars['String']['input'];
};


export type QueryAssociatedActorsArgs = {
  email: Scalars['String']['input'];
};


export type QueryImbalancePricesForMonthArgs = {
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
};


export type QuerySearchOrganizationInCvrArgs = {
  cvr: Scalars['String']['input'];
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

export enum ActorAuditedChange {
  Name = 'NAME',
  Status = 'STATUS',
  ContactName = 'CONTACT_NAME',
  ContactEmail = 'CONTACT_EMAIL',
  ContactPhone = 'CONTACT_PHONE',
  ContactCategoryAdded = 'CONTACT_CATEGORY_ADDED',
  ContactCategoryRemoved = 'CONTACT_CATEGORY_REMOVED',
  CertificateCredentials = 'CERTIFICATE_CREDENTIALS',
  ClientSecretCredentials = 'CLIENT_SECRET_CREDENTIALS'
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

export type CvrOrganizationResult = {
  __typename: 'CVROrganizationResult';
  name: Scalars['String']['output'];
  hasResult: Scalars['Boolean']['output'];
};

export type GetUserProfileResponse = {
  __typename: 'GetUserProfileResponse';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
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

export type AssociatedActors = {
  __typename: 'AssociatedActors';
  email: Scalars['String']['output'];
  actors: Array<Scalars['UUID']['output']>;
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

export type ExchangeEventStatusReportResponse = {
  __typename: 'ExchangeEventStatusReportResponse';
  waitingForExternalResponse: Scalars['Int']['output'];
};

export type ReadinessStatusDto = {
  __typename: 'ReadinessStatusDto';
  component: ESettStageComponent;
  isReady: Scalars['Boolean']['output'];
};

export type SettlementReport = {
  __typename: 'SettlementReport';
  calculationId: Scalars['UUID']['output'];
  calculationType: CalculationType;
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

export type PermissionDetailsDto = {
  __typename: 'PermissionDetailsDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
};

export enum ESettStageComponent {
  Ingestion = 'INGESTION',
  Converter = 'CONVERTER',
  Sender = 'SENDER',
  Receiver = 'RECEIVER'
}

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
};

export type ImbalancePricePeriod = {
  __typename: 'ImbalancePricePeriod';
  name: Scalars['DateTime']['output'];
  priceAreaCode: PriceAreaCode;
  status: ImbalancePriceStatus;
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
  calculationType: CalculationType;
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

export type GetAssociatedActorsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetAssociatedActorsQuery = { __typename: 'Query', associatedActors: { __typename: 'AssociatedActors', email: string, actors: Array<any> } };

export type GetPermissionsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GetPermissionsQuery = { __typename: 'Query', permissions: Array<{ __typename: 'Permission', id: number, name: string, description: string, created: Date }> };

export type GetUserAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserAuditLogsQuery = { __typename: 'Query', userAuditLogs: Array<{ __typename: 'UserAuditedChangeAuditLogDto', change: UserAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedActorName?: string | null, affectedUserRoleName?: string | null }> };

export type GetKnownEmailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetKnownEmailsQuery = { __typename: 'Query', knownEmails: Array<string> };

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionDetailsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string, created: Date, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename: 'UserRoleDto', id: any, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type GetUserRoleAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleAuditLogsQuery = { __typename: 'Query', userRoleAuditLogs: Array<{ __typename: 'UserRoleAuditedChangeAuditLogDto', change: UserRoleAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedPermissionName?: string | null }> };

export type GetPermissionAuditLogsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionAuditLogsQuery = { __typename: 'Query', permissionAuditLogs: Array<{ __typename: 'PermissionAuditedChangeAuditLogDto', change: PermissionAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetImbalancePricesMonthOverviewQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
}>;


export type GetImbalancePricesMonthOverviewQuery = { __typename: 'Query', imbalancePricesForMonth: Array<{ __typename: 'ImbalancePriceDaily', status: ImbalancePriceStatus, timeStamp: Date, importedAt?: Date | null, imbalancePrices: Array<{ __typename: 'ImbalancePrice', timestamp: Date, price: number }> }> };

export type GetImbalancePricesOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetImbalancePricesOverviewQuery = { __typename: 'Query', imbalancePricesOverview: { __typename: 'ImbalancePricesOverview', pricePeriods: Array<{ __typename: 'ImbalancePricePeriod', name: Date, priceAreaCode: PriceAreaCode, status: ImbalancePriceStatus }> } };

export type GetMeteringGridAreaImbalanceQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  periodFrom?: InputMaybe<Scalars['DateTime']['input']>;
  periodTo?: InputMaybe<Scalars['DateTime']['input']>;
  gridAreaCode?: InputMaybe<Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMeteringGridAreaImbalanceQuery = { __typename: 'Query', meteringGridAreaImbalance: { __typename: 'MeteringGridAreaImbalanceSearchResponse', totalCount: number, items: Array<{ __typename: 'MeteringGridAreaImbalanceSearchResult', id: string, gridAreaCode: string, documentDateTime: Date, receivedDateTime: Date, periodStart: Date, periodEnd: Date }> } };

export type GetGridAreaOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreaOverviewQuery = { __typename: 'Query', gridAreaOverview: Array<{ __typename: 'GridAreaOverviewItemDto', id: any, code: string, name: string, priceAreaCode: string, validFrom: Date, validTo?: Date | null, actorNumber?: string | null, actorName?: string | null, organizationName?: string | null, fullFlexDate?: Date | null }> };

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

export type GetBalanceResponsibleMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
}>;


export type GetBalanceResponsibleMessagesQuery = { __typename: 'Query', balanceResponsible: { __typename: 'BalanceResponsiblePageResult', totalCount: number, page: Array<{ __typename: 'BalanceResponsibleType', id: string, receivedDateTime: Date, supplier: string, balanceResponsible: string, meteringPointType: TimeSeriesType, validFromDate: Date, validToDate?: Date | null, gridArea: string, supplierWithName?: { __typename: 'ActorNameDto', value: string } | null, balanceResponsibleWithName?: { __typename: 'ActorNameDto', value: string } | null, gridAreaWithName?: { __typename: 'GridAreaDto', code: string, name: string } | null }> } };

export type GetServiceStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServiceStatusQuery = { __typename: 'Query', esettServiceStatus: Array<{ __typename: 'ReadinessStatusDto', component: ESettStageComponent, isReady: boolean }> };

export type GetStatusReportQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatusReportQuery = { __typename: 'Query', esettExchangeStatusReport: { __typename: 'ExchangeEventStatusReportResponse', waitingForExternalResponse: number } };

export type ResendExchangeMessagesMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendExchangeMessagesMutation = { __typename: 'Mutation', resendWaitingEsettExchangeMessages: { __typename: 'ResendWaitingEsettExchangeMessagesPayload', success?: boolean | null } };

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserProfileQuery = { __typename: 'Query', userProfile: { __typename: 'GetUserProfileResponse', firstName: string, lastName: string, phoneNumber: string } };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename: 'Mutation', createCalculation: { __typename: 'CreateCalculationPayload', calculation?: { __typename: 'Calculation', id: any } | null } };

export type GetOutgoingMessageByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetOutgoingMessageByIdQuery = { __typename: 'Query', esettOutgoingMessageById: { __typename: 'EsettOutgoingMessage', documentId: string, calculationType: ExchangeEventCalculationType, created: Date, periodFrom: Date, periodTo: Date, documentStatus: DocumentStatus, timeSeriesType: TimeSeriesType, gridArea?: { __typename: 'GridAreaDto', code: string, name: string } | null } };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename: 'Mutation', updateUserProfile: { __typename: 'UpdateUserProfilePayload', saved?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

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


export type GetCalculationByIdQuery = { __typename: 'Query', calculationById: { __typename: 'Calculation', id: any, executionState: CalculationState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, id: any, priceAreaCode: PriceAreaCode, validFrom: Date }> } };

export type GetCalculationsQueryVariables = Exact<{
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
  calculationTypes?: InputMaybe<Array<CalculationType> | CalculationType>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  executionStates?: InputMaybe<Array<CalculationState> | CalculationState>;
}>;


export type GetCalculationsQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', id: any, executionState: CalculationState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> }> };

export type GetLatestBalanceFixingQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']['input']>;
}>;


export type GetLatestBalanceFixingQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', period: { start: Date, end: Date } }> };

export type GetActorFilterQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorFilterQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', value: any, displayValue: string, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }> }> };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, validTo?: Date | null, validFrom: Date }> };

export type GetSelectedActorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectedActorQuery = { __typename: 'Query', selectedActor: { __typename: 'Actor', glnOrEicNumber: string, marketRole?: EicFunction | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> } };

export type CreateMarketParticipantMutationVariables = Exact<{
  input: CreateMarketParticipantInput;
}>;


export type CreateMarketParticipantMutation = { __typename: 'Mutation', createMarketParticipant: { __typename: 'CreateMarketParticipantPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetSettlementReportsQueryVariables = Exact<{
  period?: InputMaybe<Scalars['DateRange']['input']>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
}>;


export type GetSettlementReportsQuery = { __typename: 'Query', settlementReports: Array<{ __typename: 'SettlementReport', calculationId: any, calculationType: CalculationType, period: { start: Date, end: Date }, executionTime?: Date | null, gridArea: { __typename: 'GridAreaDto', code: string, name: string } }> };

export type GetActorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActorByIdQuery = { __typename: 'Query', actorById: { __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string }>, organization: { __typename: 'Organization', name: string } } };

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

export type GetActorEditableFieldsQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetActorEditableFieldsQuery = { __typename: 'Query', actorById: { __typename: 'Actor', name: string, organization: { __typename: 'Organization', domain: string }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetAuditLogByActorIdQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByActorIdQuery = { __typename: 'Query', actorAuditLogs: Array<{ __typename: 'ActorAuditedChangeAuditLogDto', change: ActorAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetAuditLogByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByOrganizationIdQuery = { __typename: 'Query', organizationAuditLogs: Array<{ __typename: 'OrganizationAuditedChangeAuditLogDto', change: OrganizationAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetActorsByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetActorsByOrganizationIdQuery = { __typename: 'Query', actorsByOrganizationId: Array<{ __typename: 'Actor', id: any, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetGridAreasForCreateActorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasForCreateActorQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', id: any, code: string }> };

export type GetOrganizationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOrganizationByIdQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', organizationId?: string | null, name: string, businessRegisterIdentifier: string, domain: string } };

export type GetUserRolesByEicfunctionQueryVariables = Exact<{
  eicfunction: EicFunction;
}>;


export type GetUserRolesByEicfunctionQuery = { __typename: 'Query', userRolesByEicFunction: Array<{ __typename: 'UserRoleDto', name: string, id: any, description: string }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', organizationId?: string | null, businessRegisterIdentifier: string, name: string, domain: string }> };

export type UpdateActorMutationVariables = Exact<{
  input: UpdateActorInput;
}>;


export type UpdateActorMutation = { __typename: 'Mutation', updateActor: { __typename: 'UpdateActorPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string }> | null } };

export type GetOrganizationFromCvrQueryVariables = Exact<{
  cvr: Scalars['String']['input'];
}>;


export type GetOrganizationFromCvrQuery = { __typename: 'Query', searchOrganizationInCVR: { __typename: 'CVROrganizationResult', name: string, hasResult: boolean } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename: 'Mutation', updateOrganization: { __typename: 'UpdateOrganizationPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };


export const GetAssociatedActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssociatedActors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedActors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"actors"}}]}}]}}]} as unknown as DocumentNode<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetUserAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedActorName"}},{"kind":"Field","name":{"kind":"Name","value":"affectedUserRoleName"}}]}}]}}]} as unknown as DocumentNode<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>;
export const GetKnownEmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetKnownEmails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"knownEmails"}}]}}]} as unknown as DocumentNode<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>;
export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const GetUserRoleAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedPermissionName"}}]}}]}}]} as unknown as DocumentNode<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>;
export const GetPermissionAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>;
export const GetImbalancePricesMonthOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesMonthOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PriceAreaCode"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesForMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"areaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timeStamp"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"imbalancePrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>;
export const GetImbalancePricesOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricePeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>;
export const GetMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"documentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"periodStart"}},{"kind":"Field","name":{"kind":"Name","value":"periodEnd"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>;
export const GetGridAreaOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"fullFlexDate"}}]}}]}}]} as unknown as DocumentNode<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>;
export const GetOutgoingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOutgoingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>;
export const GetBalanceResponsibleMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBalanceResponsibleMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceResponsibleSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"supplierWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"validFromDate"}},{"kind":"Field","name":{"kind":"Name","value":"validToDate"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>;
export const GetServiceStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}}]}}]}}]} as unknown as DocumentNode<GetServiceStatusQuery, GetServiceStatusQueryVariables>;
export const GetStatusReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitingForExternalResponse"}}]}}]}}]} as unknown as DocumentNode<GetStatusReportQuery, GetStatusReportQueryVariables>;
export const ResendExchangeMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendWaitingEsettExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const GetOutgoingMessageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettOutgoingMessageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"periodFrom"}},{"kind":"Field","name":{"kind":"Name","value":"periodTo"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"saved"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const GetActorsForRequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForRequestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>;
export const GetActorsForSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>;
export const GetCalculationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationState"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionStates"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"executionState"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetLatestBalanceFixingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestBalanceFixing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationTypes"},"value":{"kind":"EnumValue","value":"BALANCE_FIXING"}},{"kind":"Argument","name":{"kind":"Name","value":"executionStates"},"value":{"kind":"EnumValue","value":"COMPLETED"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>;
export const GetActorFilterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorFilter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorFilterQuery, GetActorFilterQueryVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const GetSelectedActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSelectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSelectedActorQuery, GetSelectedActorQueryVariables>;
export const CreateMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>;
export const GetSettlementReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"Argument","name":{"kind":"Name","value":"executionTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"executionTime"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;
export const GetActorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorByIdQuery, GetActorByIdQueryVariables>;
export const RequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"processtType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EdiB2CProcessType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringPointType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAggregatedMeasureDataRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"balanceResponsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"processType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"processtType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"energySupplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"gridArea"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestCalculationMutation, RequestCalculationMutationVariables>;
export const GetActorEditableFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorEditableFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>;
export const GetActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsQuery, GetActorsQueryVariables>;
export const GetAuditLogByActorIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByActorId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>;
export const GetAuditLogByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>;
export const GetActorsByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsByOrganizationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>;
export const GetGridAreasForCreateActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreasForCreateActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasForCreateActorQuery, GetGridAreasForCreateActorQueryVariables>;
export const GetOrganizationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>;
export const GetUserRolesByEicfunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByEicfunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const UpdateActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateActorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateActorMutation, UpdateActorMutationVariables>;
export const GetOrganizationFromCvrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationFromCVR"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchOrganizationInCVR"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cvr"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hasResult"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>;
export const UpdateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;

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
export const mockGetAssociatedActorsQuery = (resolver: Parameters<typeof graphql.query<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>>[1]) =>
  graphql.query<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>(
    'GetAssociatedActors',
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
export const mockGetPermissionsQuery = (resolver: Parameters<typeof graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>>[1]) =>
  graphql.query<GetPermissionsQuery, GetPermissionsQueryVariables>(
    'GetPermissions',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserAuditLogsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ userAuditLogs })
 *   )
 * })
 */
export const mockGetUserAuditLogsQuery = (resolver: Parameters<typeof graphql.query<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>>[1]) =>
  graphql.query<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>(
    'GetUserAuditLogs',
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
export const mockGetKnownEmailsQuery = (resolver: Parameters<typeof graphql.query<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>>[1]) =>
  graphql.query<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>(
    'GetKnownEmails',
    resolver
  )

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
export const mockGetPermissionDetailsQuery = (resolver: Parameters<typeof graphql.query<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>>[1]) =>
  graphql.query<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>(
    'GetPermissionDetails',
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
export const mockGetUserRoleAuditLogsQuery = (resolver: Parameters<typeof graphql.query<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>>[1]) =>
  graphql.query<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>(
    'GetUserRoleAuditLogs',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetPermissionAuditLogsQuery((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ permissionAuditLogs })
 *   )
 * })
 */
export const mockGetPermissionAuditLogsQuery = (resolver: Parameters<typeof graphql.query<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>>[1]) =>
  graphql.query<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>(
    'GetPermissionAuditLogs',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetImbalancePricesMonthOverviewQuery((req, res, ctx) => {
 *   const { year, month, areaCode } = req.variables;
 *   return res(
 *     ctx.data({ imbalancePricesForMonth })
 *   )
 * })
 */
export const mockGetImbalancePricesMonthOverviewQuery = (resolver: Parameters<typeof graphql.query<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>>[1]) =>
  graphql.query<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>(
    'GetImbalancePricesMonthOverview',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetImbalancePricesOverviewQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ imbalancePricesOverview })
 *   )
 * })
 */
export const mockGetImbalancePricesOverviewQuery = (resolver: Parameters<typeof graphql.query<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>>[1]) =>
  graphql.query<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>(
    'GetImbalancePricesOverview',
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
export const mockGetMeteringGridAreaImbalanceQuery = (resolver: Parameters<typeof graphql.query<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>>[1]) =>
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
export const mockGetGridAreaOverviewQuery = (resolver: Parameters<typeof graphql.query<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>>[1]) =>
  graphql.query<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>(
    'GetGridAreaOverview',
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
export const mockGetOutgoingMessagesQuery = (resolver: Parameters<typeof graphql.query<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>>[1]) =>
  graphql.query<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>(
    'getOutgoingMessages',
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
export const mockGetBalanceResponsibleMessagesQuery = (resolver: Parameters<typeof graphql.query<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>>[1]) =>
  graphql.query<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>(
    'getBalanceResponsibleMessages',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetServiceStatusQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ esettServiceStatus })
 *   )
 * })
 */
export const mockGetServiceStatusQuery = (resolver: Parameters<typeof graphql.query<GetServiceStatusQuery, GetServiceStatusQueryVariables>>[1]) =>
  graphql.query<GetServiceStatusQuery, GetServiceStatusQueryVariables>(
    'getServiceStatus',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetStatusReportQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ esettExchangeStatusReport })
 *   )
 * })
 */
export const mockGetStatusReportQuery = (resolver: Parameters<typeof graphql.query<GetStatusReportQuery, GetStatusReportQueryVariables>>[1]) =>
  graphql.query<GetStatusReportQuery, GetStatusReportQueryVariables>(
    'GetStatusReport',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockResendExchangeMessagesMutation((req, res, ctx) => {
 *   return res(
 *     ctx.data({ resendWaitingEsettExchangeMessages })
 *   )
 * })
 */
export const mockResendExchangeMessagesMutation = (resolver: Parameters<typeof graphql.mutation<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>>[1]) =>
  graphql.mutation<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>(
    'ResendExchangeMessages',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserProfileQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ userProfile })
 *   )
 * })
 */
export const mockGetUserProfileQuery = (resolver: Parameters<typeof graphql.query<GetUserProfileQuery, GetUserProfileQueryVariables>>[1]) =>
  graphql.query<GetUserProfileQuery, GetUserProfileQueryVariables>(
    'getUserProfile',
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
export const mockCreateCalculationMutation = (resolver: Parameters<typeof graphql.mutation<CreateCalculationMutation, CreateCalculationMutationVariables>>[1]) =>
  graphql.mutation<CreateCalculationMutation, CreateCalculationMutationVariables>(
    'CreateCalculation',
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
export const mockGetOutgoingMessageByIdQuery = (resolver: Parameters<typeof graphql.query<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>>[1]) =>
  graphql.query<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>(
    'GetOutgoingMessageById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserProfileMutation((req, res, ctx) => {
 *   const { input } = req.variables;
 *   return res(
 *     ctx.data({ updateUserProfile })
 *   )
 * })
 */
export const mockUpdateUserProfileMutation = (resolver: Parameters<typeof graphql.mutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>>[1]) =>
  graphql.mutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(
    'UpdateUserProfile',
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
export const mockGetActorsForRequestCalculationQuery = (resolver: Parameters<typeof graphql.query<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>>[1]) =>
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
export const mockGetActorsForSettlementReportQuery = (resolver: Parameters<typeof graphql.query<GetActorsForSettlementReportQuery, GetActorsForSettlementReportQueryVariables>>[1]) =>
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
export const mockGetCalculationByIdQuery = (resolver: Parameters<typeof graphql.query<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>>[1]) =>
  graphql.query<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>(
    'GetCalculationById',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetCalculationsQuery((req, res, ctx) => {
 *   const { executionTime, period, calculationTypes, gridAreaCodes, executionStates } = req.variables;
 *   return res(
 *     ctx.data({ calculations })
 *   )
 * })
 */
export const mockGetCalculationsQuery = (resolver: Parameters<typeof graphql.query<GetCalculationsQuery, GetCalculationsQueryVariables>>[1]) =>
  graphql.query<GetCalculationsQuery, GetCalculationsQueryVariables>(
    'GetCalculations',
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
export const mockGetLatestBalanceFixingQuery = (resolver: Parameters<typeof graphql.query<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>>[1]) =>
  graphql.query<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>(
    'GetLatestBalanceFixing',
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
export const mockGetActorFilterQuery = (resolver: Parameters<typeof graphql.query<GetActorFilterQuery, GetActorFilterQueryVariables>>[1]) =>
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
export const mockGetGridAreasQuery = (resolver: Parameters<typeof graphql.query<GetGridAreasQuery, GetGridAreasQueryVariables>>[1]) =>
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
export const mockGetSelectedActorQuery = (resolver: Parameters<typeof graphql.query<GetSelectedActorQuery, GetSelectedActorQueryVariables>>[1]) =>
  graphql.query<GetSelectedActorQuery, GetSelectedActorQueryVariables>(
    'getSelectedActor',
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
export const mockCreateMarketParticipantMutation = (resolver: Parameters<typeof graphql.mutation<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>>[1]) =>
  graphql.mutation<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>(
    'CreateMarketParticipant',
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
export const mockGetSettlementReportsQuery = (resolver: Parameters<typeof graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>>[1]) =>
  graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>(
    'GetSettlementReports',
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
export const mockGetActorByIdQuery = (resolver: Parameters<typeof graphql.query<GetActorByIdQuery, GetActorByIdQueryVariables>>[1]) =>
  graphql.query<GetActorByIdQuery, GetActorByIdQueryVariables>(
    'GetActorById',
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
export const mockRequestCalculationMutation = (resolver: Parameters<typeof graphql.mutation<RequestCalculationMutation, RequestCalculationMutationVariables>>[1]) =>
  graphql.mutation<RequestCalculationMutation, RequestCalculationMutationVariables>(
    'requestCalculation',
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
export const mockGetActorEditableFieldsQuery = (resolver: Parameters<typeof graphql.query<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>>[1]) =>
  graphql.query<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>(
    'GetActorEditableFields',
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
export const mockGetActorsQuery = (resolver: Parameters<typeof graphql.query<GetActorsQuery, GetActorsQueryVariables>>[1]) =>
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
export const mockGetAuditLogByActorIdQuery = (resolver: Parameters<typeof graphql.query<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>>[1]) =>
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
 *     ctx.data({ organizationAuditLogs })
 *   )
 * })
 */
export const mockGetAuditLogByOrganizationIdQuery = (resolver: Parameters<typeof graphql.query<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>>[1]) =>
  graphql.query<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>(
    'GetAuditLogByOrganizationId',
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
export const mockGetActorsByOrganizationIdQuery = (resolver: Parameters<typeof graphql.query<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>>[1]) =>
  graphql.query<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>(
    'GetActorsByOrganizationId',
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
export const mockGetGridAreasForCreateActorQuery = (resolver: Parameters<typeof graphql.query<GetGridAreasForCreateActorQuery, GetGridAreasForCreateActorQueryVariables>>[1]) =>
  graphql.query<GetGridAreasForCreateActorQuery, GetGridAreasForCreateActorQueryVariables>(
    'GetGridAreasForCreateActor',
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
export const mockGetOrganizationByIdQuery = (resolver: Parameters<typeof graphql.query<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>>[1]) =>
  graphql.query<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>(
    'GetOrganizationById',
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
export const mockGetUserRolesByEicfunctionQuery = (resolver: Parameters<typeof graphql.query<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>>[1]) =>
  graphql.query<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>(
    'GetUserRolesByEicfunction',
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
export const mockGetOrganizationsQuery = (resolver: Parameters<typeof graphql.query<GetOrganizationsQuery, GetOrganizationsQueryVariables>>[1]) =>
  graphql.query<GetOrganizationsQuery, GetOrganizationsQueryVariables>(
    'GetOrganizations',
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
export const mockUpdateActorMutation = (resolver: Parameters<typeof graphql.mutation<UpdateActorMutation, UpdateActorMutationVariables>>[1]) =>
  graphql.mutation<UpdateActorMutation, UpdateActorMutationVariables>(
    'UpdateActor',
    resolver
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetOrganizationFromCvrQuery((req, res, ctx) => {
 *   const { cvr } = req.variables;
 *   return res(
 *     ctx.data({ searchOrganizationInCVR })
 *   )
 * })
 */
export const mockGetOrganizationFromCvrQuery = (resolver: Parameters<typeof graphql.query<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>>[1]) =>
  graphql.query<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>(
    'GetOrganizationFromCVR',
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
export const mockUpdateOrganizationMutation = (resolver: Parameters<typeof graphql.mutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>>[1]) =>
  graphql.mutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(
    'UpdateOrganization',
    resolver
  )

import { dateRangeTypePolicy, dateTypePolicy } from "libs/dh/shared/domain/src/lib/type-policies";

export const scalarTypePolicies = {
  ActorAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  BalanceResponsibleType: {
    fields: { receivedDateTime: dateTypePolicy, validFromDate: dateTypePolicy, validToDate: dateTypePolicy },
  },
  Calculation: {
    fields: { period: dateRangeTypePolicy, executionTimeStart: dateTypePolicy, executionTimeEnd: dateTypePolicy },
  },
  EsettOutgoingMessage: { fields: { created: dateTypePolicy, periodFrom: dateTypePolicy, periodTo: dateTypePolicy } },
  GridAreaDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  ImbalancePrice: { fields: { timestamp: dateTypePolicy } },
  ImbalancePriceDaily: { fields: { timeStamp: dateTypePolicy, importedAt: dateTypePolicy } },
  OrganizationAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  PermissionAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  Permission: { fields: { created: dateTypePolicy } },
  UserAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  UserRoleAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  GridAreaOverviewItemDto: {
    fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy, fullFlexDate: dateTypePolicy },
  },
  SettlementReport: { fields: { period: dateRangeTypePolicy, executionTime: dateTypePolicy } },
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
  ImbalancePricePeriod: { fields: { name: dateTypePolicy } },
  MeteringGridAreaImbalancePerDayDto: { fields: { imbalanceDay: dateTypePolicy } },
};
