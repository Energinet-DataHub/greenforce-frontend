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
  JSON: { input: any; output: any; }
  UUID: { input: string; output: string; }
};

export type Error = {
  message: Scalars['String']['output'];
};

export type Actor = {
  __typename: 'Actor';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  glnOrEicNumber: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  marketRole?: Maybe<EicFunction>;
  userRoles: Array<ActorUserRole>;
  status: ActorStatus;
  gridAreas: Array<GridAreaDto>;
  contact?: Maybe<ActorContactDto>;
  organization: Organization;
  balanceResponsibleAgreements?: Maybe<Array<BalanceResponsibilityAgreement>>;
  credentials?: Maybe<ActorCredentialsDto>;
  publicMail?: Maybe<ActorPublicMail>;
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

export type ActorCertificateCredentialsDto = {
  __typename: 'ActorCertificateCredentialsDto';
  thumbprint: Scalars['String']['output'];
  expirationDate: Scalars['DateTime']['output'];
};

export type ActorClientSecretCredentialsDto = {
  __typename: 'ActorClientSecretCredentialsDto';
  clientSecretIdentifier: Scalars['UUID']['output'];
  expirationDate: Scalars['DateTime']['output'];
};

export type ActorClientSecretDto = {
  __typename: 'ActorClientSecretDto';
  secretText: Scalars['String']['output'];
};

export type ActorContactDto = {
  __typename: 'ActorContactDto';
  contactId: Scalars['UUID']['output'];
  actorId: Scalars['UUID']['output'];
  category: ContactCategory;
  name: Scalars['String']['output'];
  email: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type ActorCredentialsDto = {
  __typename: 'ActorCredentialsDto';
  assignCertificateCredentialsUrl: Scalars['String']['output'];
  removeActorCredentialsUrl: Scalars['String']['output'];
  certificateCredentials?: Maybe<ActorCertificateCredentialsDto>;
  clientSecretCredentials?: Maybe<ActorClientSecretCredentialsDto>;
};


export type ActorCredentialsDtoAssignCertificateCredentialsUrlArgs = {
  actorId: Scalars['UUID']['input'];
};


export type ActorCredentialsDtoRemoveActorCredentialsUrlArgs = {
  actorId: Scalars['UUID']['input'];
};

export type ActorNameDto = {
  __typename: 'ActorNameDto';
  value: Scalars['String']['output'];
};

export type ActorNameWithId = {
  __typename: 'ActorNameWithId';
  id: Scalars['UUID']['output'];
  actorName: ActorNameDto;
};

export type ActorPublicMail = {
  __typename: 'ActorPublicMail';
  mail: Scalars['String']['output'];
};

export type ActorUserRole = {
  __typename: 'ActorUserRole';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  status: UserRoleStatus;
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  assigned: Scalars['Boolean']['output'];
};

export type ActorViewDto = {
  __typename: 'ActorViewDto';
  id: Scalars['UUID']['output'];
  organizationName: Scalars['String']['output'];
  actorNumber: Scalars['String']['output'];
  name: Scalars['String']['output'];
  userRoles: Array<UserRoleViewDto>;
};

export type AddressDto = {
  __typename: 'AddressDto';
  streetName?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
};

export type ApiError = Error & {
  __typename: 'ApiError';
  message: Scalars['String']['output'];
  apiErrors: Array<ApiErrorDescriptor>;
  statusCode: Scalars['Int']['output'];
  response?: Maybe<Scalars['String']['output']>;
  headers: Array<KeyValuePairOfStringAndIEnumerableOfString>;
};

export type ApiErrorDescriptor = {
  __typename: 'ApiErrorDescriptor';
  message: Scalars['String']['output'];
  code: Scalars['String']['output'];
  args: Scalars['JSON']['output'];
};

export type AssociatedActors = {
  __typename: 'AssociatedActors';
  email: Scalars['String']['output'];
  actors: Array<Scalars['UUID']['output']>;
};

export type BalanceResponsibilityAgreement = {
  __typename: 'BalanceResponsibilityAgreement';
  meteringPointType: MarketParticipantMeteringPointType;
  gridArea?: Maybe<GridAreaDto>;
  energySupplierWithName?: Maybe<ActorNameWithId>;
  balanceResponsibleWithName?: Maybe<ActorNameWithId>;
  validPeriod: Scalars['DateRange']['output'];
  status: BalanceResponsibilityAgreementStatus;
};

export type BalanceResponsiblePageResult = {
  __typename: 'BalanceResponsiblePageResult';
  balanceResponsiblesUrl?: Maybe<Scalars['String']['output']>;
  page: Array<BalanceResponsibleType>;
  totalCount: Scalars['Int']['output'];
};


export type BalanceResponsiblePageResultBalanceResponsiblesUrlArgs = {
  locale: Scalars['String']['input'];
};

export type BalanceResponsibleType = {
  __typename: 'BalanceResponsibleType';
  validPeriod: Scalars['DateRange']['output'];
  storageDocumentUrl?: Maybe<Scalars['String']['output']>;
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

export type CvrOrganizationResult = {
  __typename: 'CVROrganizationResult';
  name: Scalars['String']['output'];
  hasResult: Scalars['Boolean']['output'];
};

/** An immutable calculation. */
export type Calculation = {
  __typename: 'Calculation';
  id: Scalars['UUID']['output'];
  /** Defines the wholesale calculation type */
  calculationType: CalculationType;
  period: Scalars['DateRange']['output'];
  executionTimeStart?: Maybe<Scalars['DateTime']['output']>;
  executionTimeEnd?: Maybe<Scalars['DateTime']['output']>;
  createdByUserName?: Maybe<Scalars['String']['output']>;
  gridAreas: Array<GridAreaDto>;
  state: CalculationOrchestrationState;
  statusType: ProcessStatus;
  currentStep: CalculationProgressStep;
  progress: Array<CalculationProgress>;
};

export type CalculationProgress = {
  __typename: 'CalculationProgress';
  step: CalculationProgressStep;
  status: ProgressStatus;
};

export type CreateCalculationPayload = {
  __typename: 'CreateCalculationPayload';
  uuid?: Maybe<Scalars['UUID']['output']>;
};

export type CreateDelegationsForActorPayload = {
  __typename: 'CreateDelegationsForActorPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<CreateDelegationsForActorError>>;
};

export type CreateMarketParticipantPayload = {
  __typename: 'CreateMarketParticipantPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<CreateMarketParticipantError>>;
};

export type CreateUserRolePayload = {
  __typename: 'CreateUserRolePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<CreateUserRoleError>>;
};

export type DeactivateUserPayload = {
  __typename: 'DeactivateUserPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeactivateUserError>>;
};

export type DeactivateUserRolePayload = {
  __typename: 'DeactivateUserRolePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeactivateUserRoleError>>;
};

export type EsettOutgoingMessage = {
  __typename: 'EsettOutgoingMessage';
  period: Scalars['DateRange']['output'];
  dispatchDocumentUrl?: Maybe<Scalars['String']['output']>;
  responseDocumentUrl: Scalars['String']['output'];
  gridArea?: Maybe<GridAreaDto>;
  documentId: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  calculationType: ExchangeEventCalculationType;
  timeSeriesType: TimeSeriesType;
  documentStatus: DocumentStatus;
  lastDispatched?: Maybe<Scalars['DateTime']['output']>;
};

export type ExchangeEventSearchResponse = {
  __typename: 'ExchangeEventSearchResponse';
  items: Array<ExchangeEventSearchResult>;
  totalCount: Scalars['Int']['output'];
  gridAreaCount: Scalars['Int']['output'];
};

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

export type ExchangeEventStatusReportResponse = {
  __typename: 'ExchangeEventStatusReportResponse';
  waitingForExternalResponse: Scalars['Int']['output'];
};

export type GetUserOverviewResponse = {
  __typename: 'GetUserOverviewResponse';
  users: Array<User>;
  totalUserCount: Scalars['Int']['output'];
};

export type GetUserProfileResponse = {
  __typename: 'GetUserProfileResponse';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
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
  imbalancePricesDownloadImbalanceUrl: Scalars['String']['output'];
  timeStamp: Scalars['DateTime']['output'];
  imbalancePrices: Array<ImbalancePrice>;
  importedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ImbalancePricePeriod = {
  __typename: 'ImbalancePricePeriod';
  name: Scalars['DateTime']['output'];
  priceAreaCode: PriceAreaCode;
  status: ImbalancePriceStatus;
};

export type ImbalancePricesOverview = {
  __typename: 'ImbalancePricesOverview';
  uploadImbalancePricesUrl: Scalars['String']['output'];
  pricePeriods: Array<ImbalancePricePeriod>;
};

export type InitiateMitIdSignupPayload = {
  __typename: 'InitiateMitIdSignupPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<InitiateMitIdSignupError>>;
};

export type InviteUserPayload = {
  __typename: 'InviteUserPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<InviteUserError>>;
};

export type KeyValuePairOfStringAndIEnumerableOfString = {
  __typename: 'KeyValuePairOfStringAndIEnumerableOfString';
  key: Scalars['String']['output'];
  value: Array<Scalars['String']['output']>;
};

export type KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation = {
  __typename: 'KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation';
  key: Scalars['String']['output'];
  value: Array<RequestSettlementReportGridAreaCalculation>;
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

export type MeteringGridAreaImbalancePerDayDto = {
  __typename: 'MeteringGridAreaImbalancePerDayDto';
  imbalanceDay: Scalars['DateTime']['output'];
  firstOccurrenceOfImbalance: Scalars['DateTime']['output'];
  firstPositionOfImbalance: Scalars['Int']['output'];
  quantity: Scalars['Float']['output'];
};

export type MeteringGridAreaImbalanceSearchResponse = {
  __typename: 'MeteringGridAreaImbalanceSearchResponse';
  items: Array<MeteringGridAreaImbalanceSearchResult>;
  totalCount: Scalars['Int']['output'];
};

export type MeteringGridAreaImbalanceSearchResult = {
  __typename: 'MeteringGridAreaImbalanceSearchResult';
  period: Scalars['DateRange']['output'];
  mgaImbalanceDocumentUrl?: Maybe<Scalars['String']['output']>;
  gridArea?: Maybe<GridAreaDto>;
  id: Scalars['String']['output'];
  documentDateTime: Scalars['DateTime']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  incomingImbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
  outgoingImbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
};

export type Mutation = {
  __typename: 'Mutation';
  updateActor: UpdateActorPayload;
  createMarketParticipant: CreateMarketParticipantPayload;
  createDelegationsForActor: CreateDelegationsForActorPayload;
  stopDelegation: StopDelegationPayload;
  requestClientSecretCredentials: RequestClientSecretCredentialsPayload;
  createCalculation: CreateCalculationPayload;
  requestCalculation: RequestCalculationPayload;
  resendWaitingEsettExchangeMessages: ResendWaitingEsettExchangeMessagesPayload;
  updateOrganization: UpdateOrganizationPayload;
  updatePermission: UpdatePermissionPayload;
  requestSettlementReport: RequestSettlementReportPayload;
  updateUserProfile: UpdateUserProfilePayload;
  updateUserIdentity: UpdateUserIdentityPayload;
  inviteUser: InviteUserPayload;
  reInviteUser: ReInviteUserPayload;
  resetTwoFactorAuthentication: ResetTwoFactorAuthenticationPayload;
  deactivateUser: DeactivateUserPayload;
  reActivateUser: ReActivateUserPayload;
  initiateMitIdSignup: InitiateMitIdSignupPayload;
  updateUserRoleAssignment: UpdateUserRoleAssignmentPayload;
  updateUserRole: UpdateUserRolePayload;
  createUserRole: CreateUserRolePayload;
  deactivateUserRole: DeactivateUserRolePayload;
};


export type MutationUpdateActorArgs = {
  input: UpdateActorInput;
};


export type MutationCreateMarketParticipantArgs = {
  input: CreateMarketParticipantInput;
};


export type MutationCreateDelegationsForActorArgs = {
  input: CreateDelegationsForActorInput;
};


export type MutationStopDelegationArgs = {
  input: StopDelegationInput;
};


export type MutationRequestClientSecretCredentialsArgs = {
  input: RequestClientSecretCredentialsInput;
};


export type MutationCreateCalculationArgs = {
  input: CreateCalculationInput;
};


export type MutationRequestCalculationArgs = {
  input: RequestCalculationInput;
};


export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput;
};


export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionInput;
};


export type MutationRequestSettlementReportArgs = {
  requestSettlementReportInput: RequestSettlementReportInput;
};


export type MutationUpdateUserProfileArgs = {
  input: UpdateUserProfileInput;
};


export type MutationUpdateUserIdentityArgs = {
  input: UpdateUserIdentityInput;
};


export type MutationInviteUserArgs = {
  input: InviteUserInput;
};


export type MutationReInviteUserArgs = {
  input: ReInviteUserInput;
};


export type MutationResetTwoFactorAuthenticationArgs = {
  input: ResetTwoFactorAuthenticationInput;
};


export type MutationDeactivateUserArgs = {
  input: DeactivateUserInput;
};


export type MutationReActivateUserArgs = {
  input: ReActivateUserInput;
};


export type MutationUpdateUserRoleAssignmentArgs = {
  input: UpdateUserRoleAssignmentInput;
};


export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRoleInput;
};


export type MutationCreateUserRoleArgs = {
  input: CreateUserRoleInput;
};


export type MutationDeactivateUserRoleArgs = {
  input: DeactivateUserRoleInput;
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

export type OrganizationAuditedChangeAuditLogDto = {
  __typename: 'OrganizationAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  change: OrganizationAuditedChange;
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

export type PermissionAuditedChangeAuditLogDto = {
  __typename: 'PermissionAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  change: PermissionAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
};

export type PermissionDetailsDto = {
  __typename: 'PermissionDetailsDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
};

export type Permissions = {
  __typename: 'Permissions';
  getPermissionRelationsUrl: Scalars['String']['output'];
  permissions: Array<Permission>;
};

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
  filteredActors: Array<Actor>;
  selectionActors: Array<SelectionActorDto>;
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
  gridAreaOverview: Array<GridAreaOverviewItemDto>;
  gridAreas: Array<GridAreaDto>;
  imbalancePricesOverview: ImbalancePricesOverview;
  imbalancePricesForMonth: Array<ImbalancePriceDaily>;
  organizationAuditLogs: Array<OrganizationAuditedChangeAuditLogDto>;
  organizationById: Organization;
  organizations: Array<Organization>;
  searchOrganizationInCVR: CvrOrganizationResult;
  permissionById: Permission;
  permissions: Permissions;
  permissionAuditLogs: Array<PermissionAuditedChangeAuditLogDto>;
  permissionsByEicFunction: Array<PermissionDetailsDto>;
  settlementReports: Array<SettlementReport>;
  settlementReportGridAreaCalculationsForPeriod: Array<KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation>;
  userRoleAuditLogs: Array<UserRoleAuditedChangeAuditLogDto>;
  userAuditLogs: Array<UserAuditedChangeAuditLogDto>;
  userProfile: GetUserProfileResponse;
  userById: User;
  emailExists: Scalars['Boolean']['output'];
  knownEmails: Array<Scalars['String']['output']>;
  userOverviewSearch: GetUserOverviewResponse;
  userRolesByActorId: Array<UserRoleDto>;
  userRolesByEicFunction: Array<UserRoleDto>;
  userRoleById: UserRoleWithPermissions;
  userRoles: Array<UserRoleDto>;
  userRoleView: Array<ActorViewDto>;
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


export type QueryPermissionsByEicFunctionArgs = {
  eicFunction: EicFunction;
};


export type QuerySettlementReportGridAreaCalculationsForPeriodArgs = {
  calculationType: CalculationType;
  gridAreaId: Array<Scalars['String']['input']>;
  calculationPeriod: Scalars['DateRange']['input'];
};


export type QueryUserRoleAuditLogsArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserAuditLogsArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryEmailExistsArgs = {
  emailAddress: Scalars['String']['input'];
};


export type QueryUserOverviewSearchArgs = {
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: UserOverviewSortProperty;
  sortDirection: MarketParticipantSortDirctionType;
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  userRoleIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  userStatus?: InputMaybe<Array<UserStatus>>;
};


export type QueryUserRolesByActorIdArgs = {
  actorId: Scalars['UUID']['input'];
};


export type QueryUserRolesByEicFunctionArgs = {
  eicFunction: EicFunction;
};


export type QueryUserRoleByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserRoleViewArgs = {
  userId: Scalars['UUID']['input'];
};

export type ReActivateUserPayload = {
  __typename: 'ReActivateUserPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<ReActivateUserError>>;
};

export type ReInviteUserPayload = {
  __typename: 'ReInviteUserPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<ReInviteUserError>>;
};

export type ReadinessStatusDto = {
  __typename: 'ReadinessStatusDto';
  component: ESettStageComponent;
  isReady: Scalars['Boolean']['output'];
};

export type RequestCalculationPayload = {
  __typename: 'RequestCalculationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RequestClientSecretCredentialsPayload = {
  __typename: 'RequestClientSecretCredentialsPayload';
  actorClientSecretDto?: Maybe<ActorClientSecretDto>;
};

export type RequestSettlementReportGridAreaCalculation = {
  __typename: 'RequestSettlementReportGridAreaCalculation';
  gridAreaWithName?: Maybe<GridAreaDto>;
  calculationId: Scalars['UUID']['output'];
  calculationDate: Scalars['DateTime']['output'];
};

export type RequestSettlementReportPayload = {
  __typename: 'RequestSettlementReportPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type ResendWaitingEsettExchangeMessagesPayload = {
  __typename: 'ResendWaitingEsettExchangeMessagesPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type ResetTwoFactorAuthenticationPayload = {
  __typename: 'ResetTwoFactorAuthenticationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<ResetTwoFactorAuthenticationError>>;
};

export type SelectionActorDto = {
  __typename: 'SelectionActorDto';
  id: Scalars['UUID']['output'];
  gln: Scalars['String']['output'];
  actorName: Scalars['String']['output'];
  organizationName: Scalars['String']['output'];
  marketRole: EicFunction;
};

export type SettlementReport = {
  __typename: 'SettlementReport';
  settlementReportDownloadUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  actor?: Maybe<Actor>;
  calculationType: CalculationType;
  period: Scalars['DateRange']['output'];
  numberOfGridAreasInReport: Scalars['Int']['output'];
  includesBasisData: Scalars['Boolean']['output'];
  statusMessage: Scalars['String']['output'];
  progress: Scalars['Float']['output'];
  statusType: SettlementReportStatusType;
};

export type StopDelegationPayload = {
  __typename: 'StopDelegationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<StopDelegationError>>;
};

export type Subscription = {
  __typename: 'Subscription';
  calculationProgress: Calculation;
  isInProgress: Scalars['Boolean']['output'];
};


export type SubscriptionCalculationProgressArgs = {
  input: CalculationQueryInput;
};


export type SubscriptionIsInProgressArgs = {
  state: CalculationOrchestrationState;
};

export type UpdateActorPayload = {
  __typename: 'UpdateActorPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateActorError>>;
};

export type UpdateOrganizationPayload = {
  __typename: 'UpdateOrganizationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateOrganizationError>>;
};

export type UpdatePermissionPayload = {
  __typename: 'UpdatePermissionPayload';
  permission?: Maybe<Permission>;
  errors?: Maybe<Array<UpdatePermissionError>>;
};

export type UpdateUserIdentityPayload = {
  __typename: 'UpdateUserIdentityPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateUserIdentityError>>;
};

export type UpdateUserProfilePayload = {
  __typename: 'UpdateUserProfilePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateUserProfileError>>;
};

export type UpdateUserRoleAssignmentPayload = {
  __typename: 'UpdateUserRoleAssignmentPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateUserRoleAssignmentError>>;
};

export type UpdateUserRolePayload = {
  __typename: 'UpdateUserRolePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateUserRoleError>>;
};

export type User = {
  __typename: 'User';
  actors?: Maybe<Array<Actor>>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  status: UserStatus;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['DateTime']['output'];
};

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

export type UserRoleDto = {
  __typename: 'UserRoleDto';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
};

export type UserRoleViewDto = {
  __typename: 'UserRoleViewDto';
  id: Scalars['UUID']['output'];
  marketRole: EicFunction;
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  userActorId?: Maybe<Scalars['UUID']['output']>;
};

export type UserRoleWithPermissions = {
  __typename: 'UserRoleWithPermissions';
  userRoles: Array<UserRoleDto>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
  permissions: Array<PermissionDetailsDto>;
};

export type CreateDelegationsForActorError = ApiError;

export type CreateMarketParticipantError = ApiError;

export type CreateUserRoleError = ApiError;

export type DeactivateUserError = ApiError;

export type DeactivateUserRoleError = ApiError;

export type InitiateMitIdSignupError = ApiError;

export type InviteUserError = ApiError;

export type ReActivateUserError = ApiError;

export type ReInviteUserError = ApiError;

export type ResetTwoFactorAuthenticationError = ApiError;

export type StopDelegationError = ApiError;

export type UpdateActorError = ApiError;

export type UpdateOrganizationError = ApiError;

export type UpdatePermissionError = ApiError;

export type UpdateUserIdentityError = ApiError;

export type UpdateUserProfileError = ApiError;

export type UpdateUserRoleAssignmentError = ApiError;

export type UpdateUserRoleError = ApiError;

export type ActorNameDtoInput = {
  value: Scalars['String']['input'];
};

export type ActorNumberDtoInput = {
  value: Scalars['String']['input'];
};

export type AddressDtoInput = {
  streetName?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
};

export type CalculationQueryInput = {
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  states?: InputMaybe<Array<CalculationOrchestrationState>>;
  calculationTypes?: InputMaybe<Array<CalculationType>>;
  executionTime?: InputMaybe<Scalars['DateRange']['input']>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
};

export type CreateActorContactDtoInput = {
  name: Scalars['String']['input'];
  category: ContactCategory;
  email: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateActorGridAreaInput = {
  code: Scalars['String']['input'];
  meteringPointTypes: Array<Scalars['String']['input']>;
};

export type CreateActorInput = {
  organizationId: Scalars['UUID']['input'];
  name: ActorNameDtoInput;
  actorNumber: ActorNumberDtoInput;
  marketRoles: Array<CreateActorMarketRoleInput>;
};

export type CreateActorMarketRoleInput = {
  eicFunction: EicFunction;
  gridAreas: Array<CreateActorGridAreaInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCalculationInput = {
  period: Scalars['DateRange']['input'];
  gridAreaCodes: Array<Scalars['String']['input']>;
  calculationType: StartCalculationType;
};

export type CreateDelegationsForActorInput = {
  actorId: Scalars['UUID']['input'];
  delegations: CreateProcessDelegationsInput;
};

export type CreateMarketParticipantInput = {
  organizationId?: InputMaybe<Scalars['UUID']['input']>;
  organization?: InputMaybe<CreateOrganizationDtoInput>;
  actor: CreateActorInput;
  actorContact: CreateActorContactDtoInput;
};

export type CreateOrganizationDtoInput = {
  name: Scalars['String']['input'];
  businessRegisterIdentifier: Scalars['String']['input'];
  address: AddressDtoInput;
  domain: Scalars['String']['input'];
};

export type CreateProcessDelegationsInput = {
  delegatedFrom: Scalars['UUID']['input'];
  delegatedTo: Scalars['UUID']['input'];
  gridAreas: Array<Scalars['String']['input']>;
  delegatedProcesses: Array<DelegatedProcess>;
  startsAt: Scalars['DateTime']['input'];
};

export type CreateUserRoleDtoInput = {
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  status: UserRoleStatus;
  eicFunction: EicFunction;
  permissions: Array<Scalars['Int']['input']>;
};

export type CreateUserRoleInput = {
  userRole: CreateUserRoleDtoInput;
};

export type DeactivateUserInput = {
  userId: Scalars['UUID']['input'];
};

export type DeactivateUserRoleInput = {
  roleId: Scalars['UUID']['input'];
};

export type InvitationUserDetailsDtoInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type InviteUserInput = {
  userInviteDto: UserInvitationDtoInput;
};

export type ReActivateUserInput = {
  userId: Scalars['UUID']['input'];
};

export type ReInviteUserInput = {
  userId: Scalars['UUID']['input'];
};

export type RequestCalculationInput = {
  calculationType: CalculationType;
  period: Scalars['DateRange']['input'];
  gridArea?: InputMaybe<Scalars['String']['input']>;
  meteringPointType?: InputMaybe<MeteringPointType>;
  energySupplierId?: InputMaybe<Scalars['String']['input']>;
  balanceResponsibleId?: InputMaybe<Scalars['String']['input']>;
  priceType?: InputMaybe<PriceType>;
};

export type RequestClientSecretCredentialsInput = {
  actorId: Scalars['UUID']['input'];
};

export type RequestSettlementReportGridAreaInput = {
  calculationId?: InputMaybe<Scalars['UUID']['input']>;
  gridAreaCode: Scalars['String']['input'];
};

export type RequestSettlementReportInput = {
  calculationType: CalculationType;
  period: Scalars['DateRange']['input'];
  gridAreasWithCalculations: Array<RequestSettlementReportGridAreaInput>;
  combineResultInASingleFile: Scalars['Boolean']['input'];
  preventLargeTextFiles: Scalars['Boolean']['input'];
  includeMonthlySums: Scalars['Boolean']['input'];
  includeBasisData: Scalars['Boolean']['input'];
  energySupplier?: InputMaybe<Scalars['String']['input']>;
  csvLanguage?: InputMaybe<Scalars['String']['input']>;
};

export type ResetTwoFactorAuthenticationInput = {
  userId: Scalars['UUID']['input'];
};

export type StopDelegationInput = {
  stopMessageDelegationDto: Array<StopProcessDelegationDtoInput>;
};

export type StopProcessDelegationDtoInput = {
  id: Scalars['UUID']['input'];
  periodId: Scalars['UUID']['input'];
  stopsAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateActorInput = {
  actorId: Scalars['UUID']['input'];
  actorName: Scalars['String']['input'];
  departmentName: Scalars['String']['input'];
  departmentEmail: Scalars['String']['input'];
  departmentPhone: Scalars['String']['input'];
};

export type UpdateActorUserRolesInput = {
  actorId: Scalars['UUID']['input'];
  assignments: UpdateUserRoleAssignmentsDtoInput;
};

export type UpdateOrganizationInput = {
  orgId: Scalars['UUID']['input'];
  domain: Scalars['String']['input'];
};

export type UpdatePermissionInput = {
  id: Scalars['Int']['input'];
  description: Scalars['String']['input'];
};

export type UpdateUserIdentityInput = {
  userId: Scalars['UUID']['input'];
  userIdentityUpdateDto: UserIdentityUpdateDtoInput;
};

export type UpdateUserProfileInput = {
  userProfileUpdateDto: UserProfileUpdateDtoInput;
};

export type UpdateUserRoleAssignmentInput = {
  userId: Scalars['UUID']['input'];
  input: Array<UpdateActorUserRolesInput>;
};

export type UpdateUserRoleAssignmentsDtoInput = {
  added: Array<Scalars['UUID']['input']>;
  removed: Array<Scalars['UUID']['input']>;
};

export type UpdateUserRoleDtoInput = {
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  status: UserRoleStatus;
  permissions: Array<Scalars['Int']['input']>;
};

export type UpdateUserRoleInput = {
  userRoleId: Scalars['UUID']['input'];
  userRole: UpdateUserRoleDtoInput;
};

export type UserIdentityUpdateDtoInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type UserInvitationDtoInput = {
  email: Scalars['String']['input'];
  invitationUserDetails?: InputMaybe<InvitationUserDetailsDtoInput>;
  assignedActor: Scalars['UUID']['input'];
  assignedRoles: Array<Scalars['UUID']['input']>;
};

export type UserProfileUpdateDtoInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
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

export enum ActorDelegationStatus {
  Awaiting = 'AWAITING',
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Cancelled = 'CANCELLED'
}

export enum ActorStatus {
  New = 'New',
  Active = 'Active',
  Inactive = 'Inactive',
  Passive = 'Passive'
}

export enum ApplyPolicy {
  BeforeResolver = 'BEFORE_RESOLVER',
  AfterResolver = 'AFTER_RESOLVER',
  Validation = 'VALIDATION'
}

/** Represents the status of a balance responsibility agreement. */
export enum BalanceResponsibilityAgreementStatus {
  Awaiting = 'AWAITING',
  Active = 'ACTIVE',
  SoonToExpire = 'SOON_TO_EXPIRE',
  Expired = 'EXPIRED'
}

export enum BalanceResponsibleSortProperty {
  ValidFrom = 'VALID_FROM',
  ValidTo = 'VALID_TO',
  ReceivedDate = 'RECEIVED_DATE'
}

export enum CalculationOrchestrationState {
  Scheduled = 'SCHEDULED',
  Calculating = 'CALCULATING',
  Calculated = 'CALCULATED',
  CalculationFailed = 'CALCULATION_FAILED',
  ActorMessagesEnqueuing = 'ACTOR_MESSAGES_ENQUEUING',
  ActorMessagesEnqueued = 'ACTOR_MESSAGES_ENQUEUED',
  ActorMessagesEnqueuingFailed = 'ACTOR_MESSAGES_ENQUEUING_FAILED',
  Completed = 'COMPLETED'
}

export enum CalculationProgressStep {
  Schedule = 'SCHEDULE',
  Calculate = 'CALCULATE',
  ActorMessageEnqueue = 'ACTOR_MESSAGE_ENQUEUE'
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

export enum DelegatedProcess {
  RequestEnergyResults = 'REQUEST_ENERGY_RESULTS',
  ReceiveEnergyResults = 'RECEIVE_ENERGY_RESULTS',
  RequestWholesaleResults = 'REQUEST_WHOLESALE_RESULTS',
  ReceiveWholesaleResults = 'RECEIVE_WHOLESALE_RESULTS'
}

export enum DocumentStatus {
  Received = 'RECEIVED',
  AwaitingDispatch = 'AWAITING_DISPATCH',
  AwaitingReply = 'AWAITING_REPLY',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  BizTalkAccepted = 'BIZ_TALK_ACCEPTED'
}

export enum ESettStageComponent {
  Ingestion = 'INGESTION',
  Converter = 'CONVERTER',
  Sender = 'SENDER',
  Receiver = 'RECEIVER'
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
  Delegated = 'Delegated',
  ItSupplier = 'ItSupplier'
}

export enum ExchangeEventCalculationType {
  BalanceFixing = 'BALANCE_FIXING',
  Aggregation = 'AGGREGATION'
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

export enum ImbalancePriceStatus {
  NoData = 'NO_DATA',
  InComplete = 'IN_COMPLETE',
  Complete = 'COMPLETE'
}

export enum MarketParticipantMeteringPointType {
  Unknown = 'Unknown',
  D01VeProduction = 'D01VeProduction',
  D02Analysis = 'D02Analysis',
  D03NotUsed = 'D03NotUsed',
  D04SurplusProductionGroup6 = 'D04SurplusProductionGroup6',
  D05NetProduction = 'D05NetProduction',
  D06SupplyToGrid = 'D06SupplyToGrid',
  D07ConsumptionFromGrid = 'D07ConsumptionFromGrid',
  D08WholeSaleServicesInformation = 'D08WholeSaleServicesInformation',
  D09OwnProduction = 'D09OwnProduction',
  D10NetFromGrid = 'D10NetFromGrid',
  D11NetToGrid = 'D11NetToGrid',
  D12TotalConsumption = 'D12TotalConsumption',
  D13NetLossCorrection = 'D13NetLossCorrection',
  D14ElectricalHeating = 'D14ElectricalHeating',
  D15NetConsumption = 'D15NetConsumption',
  D17OtherConsumption = 'D17OtherConsumption',
  D18OtherProduction = 'D18OtherProduction',
  D20ExchangeReactiveEnergy = 'D20ExchangeReactiveEnergy',
  D99InternalUse = 'D99InternalUse',
  E17Consumption = 'E17Consumption',
  E18Production = 'E18Production',
  E20Exchange = 'E20Exchange'
}

export enum MarketParticipantSortDirctionType {
  Asc = 'Asc',
  Desc = 'Desc'
}

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

export enum MeteringPointType {
  Production = 'PRODUCTION',
  FlexConsumption = 'FLEX_CONSUMPTION',
  TotalConsumption = 'TOTAL_CONSUMPTION',
  NonProfiledConsumption = 'NON_PROFILED_CONSUMPTION',
  Exchange = 'EXCHANGE'
}

export enum OrganizationAuditedChange {
  Domain = 'DOMAIN',
  Name = 'NAME'
}

export enum PermissionAuditedChange {
  Claim = 'CLAIM',
  Description = 'DESCRIPTION'
}

export enum PriceAreaCode {
  Dk1 = 'DK1',
  Dk2 = 'DK2'
}

/**
 * The price type enum is used to make B2C Wholesale Settlement requests from the UI, and describes a combination of
 * the resolution and charge type fields in the RequestWholesaleSettlement document
 */
export enum PriceType {
  TariffSubscriptionAndFee = 'TARIFF_SUBSCRIPTION_AND_FEE',
  Tariff = 'TARIFF',
  Subscription = 'SUBSCRIPTION',
  Fee = 'FEE',
  MonthlyTariff = 'MONTHLY_TARIFF',
  MonthlySubscription = 'MONTHLY_SUBSCRIPTION',
  MonthlyFee = 'MONTHLY_FEE',
  MonthlyTariffSubscriptionAndFee = 'MONTHLY_TARIFF_SUBSCRIPTION_AND_FEE'
}

export enum ProcessStatus {
  Warning = 'warning',
  Success = 'success',
  Danger = 'danger',
  Info = 'info',
  Neutral = 'neutral'
}

export enum ProgressStatus {
  Pending = 'pending',
  Executing = 'executing',
  Failed = 'failed',
  Completed = 'completed'
}

export enum SettlementReportStatusType {
  InProgress = 'IN_PROGRESS',
  Error = 'ERROR',
  Completed = 'COMPLETED'
}

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

/** Defines the wholesale orchestrations calculation type */
export enum StartCalculationType {
  /** Balance fixing */
  BalanceFixing = 'BALANCE_FIXING',
  /** Aggregation. */
  Aggregation = 'AGGREGATION',
  /** Wholesale fixing. */
  WholesaleFixing = 'WHOLESALE_FIXING',
  /** First correction settlement. */
  FirstCorrectionSettlement = 'FIRST_CORRECTION_SETTLEMENT',
  /** Second correction settlement. */
  SecondCorrectionSettlement = 'SECOND_CORRECTION_SETTLEMENT',
  /** Third correction settlement. */
  ThirdCorrectionSettlement = 'THIRD_CORRECTION_SETTLEMENT'
}

export enum TimeSeriesType {
  MgaExchange = 'MGA_EXCHANGE',
  Production = 'PRODUCTION',
  Consumption = 'CONSUMPTION'
}

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

export enum UserOverviewSortProperty {
  FirstName = 'FirstName',
  LastName = 'LastName',
  Email = 'Email',
  PhoneNumber = 'PhoneNumber',
  CreatedDate = 'CreatedDate',
  Status = 'Status'
}

export enum UserRoleAuditedChange {
  Name = 'NAME',
  Description = 'DESCRIPTION',
  Status = 'STATUS',
  PermissionAdded = 'PERMISSION_ADDED',
  PermissionRemoved = 'PERMISSION_REMOVED'
}

export enum UserRoleStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Invited = 'INVITED',
  InviteExpired = 'INVITE_EXPIRED'
}

export type CreateUserRoleMutationVariables = Exact<{
  input: CreateUserRoleInput;
}>;


export type CreateUserRoleMutation = { __typename: 'Mutation', createUserRole: { __typename: 'CreateUserRolePayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type DeactivateUserMutationVariables = Exact<{
  input: DeactivateUserInput;
}>;


export type DeactivateUserMutation = { __typename: 'Mutation', deactivateUser: { __typename: 'DeactivateUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type DeactivateUserRoleMutationVariables = Exact<{
  input: DeactivateUserRoleInput;
}>;


export type DeactivateUserRoleMutation = { __typename: 'Mutation', deactivateUserRole: { __typename: 'DeactivateUserRolePayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetFilteredActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFilteredActorsQuery = { __typename: 'Query', filteredActors: Array<{ __typename: 'Actor', displayName: string, id: string, organization: { __typename: 'Organization', domain: string } }> };

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionDetailsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string, created: Date, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename: 'UserRoleDto', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type GetPermissionByEicFunctionQueryVariables = Exact<{
  eicFunction: EicFunction;
}>;


export type GetPermissionByEicFunctionQuery = { __typename: 'Query', permissionsByEicFunction: Array<{ __typename: 'PermissionDetailsDto', id: number, name: string, description: string, created: Date }> };

export type GetKnownEmailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetKnownEmailsQuery = { __typename: 'Query', knownEmails: Array<string> };

export type GetSelectionActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectionActorsQuery = { __typename: 'Query', selectionActors: Array<{ __typename: 'SelectionActorDto', id: string, gln: string, actorName: string, organizationName: string, marketRole: EicFunction }> };

export type GetAssociatedActorsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetAssociatedActorsQuery = { __typename: 'Query', associatedActors: { __typename: 'AssociatedActors', email: string, actors: Array<string> } };

export type GetPermissionsQueryVariables = Exact<{
  searchTerm: Scalars['String']['input'];
}>;


export type GetPermissionsQuery = { __typename: 'Query', permissions: { __typename: 'Permissions', getPermissionRelationsUrl: string, permissions: Array<{ __typename: 'Permission', id: number, name: string, description: string, created: Date }> } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserByIdQuery = { __typename: 'Query', userById: { __typename: 'User', id: string, email: string, phoneNumber?: string | null, status: UserStatus, createdDate: Date, firstName: string, lastName: string } };

export type GetUserAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserAuditLogsQuery = { __typename: 'Query', userAuditLogs: Array<{ __typename: 'UserAuditedChangeAuditLogDto', change: UserAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedActorName?: string | null, affectedUserRoleName?: string | null }> };

export type GetPermissionAuditLogsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionAuditLogsQuery = { __typename: 'Query', permissionAuditLogs: Array<{ __typename: 'PermissionAuditedChangeAuditLogDto', change: PermissionAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetUserRoleWithPermissionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleWithPermissionsQuery = { __typename: 'Query', userRoleById: { __typename: 'UserRoleWithPermissions', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus, permissions: Array<{ __typename: 'PermissionDetailsDto', id: number, name: string, description: string }> } };

export type GetUserRoleAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleAuditLogsQuery = { __typename: 'Query', userRoleAuditLogs: Array<{ __typename: 'UserRoleAuditedChangeAuditLogDto', change: UserRoleAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedPermissionName?: string | null }> };

export type GetUserRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserRolesQuery = { __typename: 'Query', userRoles: Array<{ __typename: 'UserRoleDto', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> };

export type GetUserRolesByActorIdQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetUserRolesByActorIdQuery = { __typename: 'Query', userRolesByActorId: Array<{ __typename: 'UserRoleDto', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> };

export type GetUserRoleViewQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type GetUserRoleViewQuery = { __typename: 'Query', userRoleView: Array<{ __typename: 'ActorViewDto', id: string, organizationName: string, actorNumber: string, name: string, userRoles: Array<{ __typename: 'UserRoleViewDto', id: string, marketRole: EicFunction, name: string, description: string, userActorId?: string | null }> }> };

export type ReActivateUserMutationVariables = Exact<{
  input: ReActivateUserInput;
}>;


export type ReActivateUserMutation = { __typename: 'Mutation', reActivateUser: { __typename: 'ReActivateUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type Reset2faMutationVariables = Exact<{
  input: ResetTwoFactorAuthenticationInput;
}>;


export type Reset2faMutation = { __typename: 'Mutation', resetTwoFactorAuthentication: { __typename: 'ResetTwoFactorAuthenticationPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename: 'Mutation', inviteUser: { __typename: 'InviteUserPayload', sucess?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type ReInviteUserMutationVariables = Exact<{
  input: ReInviteUserInput;
}>;


export type ReInviteUserMutation = { __typename: 'Mutation', reInviteUser: { __typename: 'ReInviteUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UpdatePermissionMutationVariables = Exact<{
  input: UpdatePermissionInput;
}>;


export type UpdatePermissionMutation = { __typename: 'Mutation', updatePermission: { __typename: 'UpdatePermissionPayload', permission?: { __typename: 'Permission', id: number } | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UpdateUserAndRolesMutationVariables = Exact<{
  updateUserInput: UpdateUserIdentityInput;
  updateRolesInput: UpdateUserRoleAssignmentInput;
}>;


export type UpdateUserAndRolesMutation = { __typename: 'Mutation', updateUserIdentity: { __typename: 'UpdateUserIdentityPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null }, updateUserRoleAssignment: { __typename: 'UpdateUserRoleAssignmentPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UpdateUserRoleMutationVariables = Exact<{
  input: UpdateUserRoleInput;
}>;


export type UpdateUserRoleMutation = { __typename: 'Mutation', updateUserRole: { __typename: 'UpdateUserRolePayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UserOverviewSearchQueryVariables = Exact<{
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  userRoleIds?: InputMaybe<Array<Scalars['UUID']['input']> | Scalars['UUID']['input']>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  userStatus?: InputMaybe<Array<UserStatus> | UserStatus>;
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortDirection: MarketParticipantSortDirctionType;
  sortProperty: UserOverviewSortProperty;
}>;


export type UserOverviewSearchQuery = { __typename: 'Query', userOverviewSearch: { __typename: 'GetUserOverviewResponse', totalUserCount: number, users: Array<{ __typename: 'User', firstName: string, lastName: string, email: string, phoneNumber?: string | null, status: UserStatus, id: string }> } };

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

export type GetBalanceResponsibleMessagesQueryVariables = Exact<{
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  sortProperty: BalanceResponsibleSortProperty;
  sortDirection: SortDirection;
  locale: Scalars['String']['input'];
}>;


export type GetBalanceResponsibleMessagesQuery = { __typename: 'Query', balanceResponsible: { __typename: 'BalanceResponsiblePageResult', balanceResponsiblesUrl?: string | null, totalCount: number, page: Array<{ __typename: 'BalanceResponsibleType', id: string, receivedDateTime: Date, supplier: string, storageDocumentUrl?: string | null, balanceResponsible: string, meteringPointType: TimeSeriesType, validPeriod: { start: Date, end: Date | null }, gridArea: string, supplierWithName?: { __typename: 'ActorNameDto', value: string } | null, balanceResponsibleWithName?: { __typename: 'ActorNameDto', value: string } | null, gridAreaWithName?: { __typename: 'GridAreaDto', code: string, name: string } | null }> } };

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


export type GetMeteringGridAreaImbalanceQuery = { __typename: 'Query', meteringGridAreaImbalance: { __typename: 'MeteringGridAreaImbalanceSearchResponse', totalCount: number, items: Array<{ __typename: 'MeteringGridAreaImbalanceSearchResult', id: string, mgaImbalanceDocumentUrl?: string | null, documentDateTime: Date, receivedDateTime: Date, period: { start: Date, end: Date | null }, gridArea?: { __typename: 'GridAreaDto', displayName: string } | null, incomingImbalancePerDay: Array<{ __typename: 'MeteringGridAreaImbalancePerDayDto', imbalanceDay: Date, firstOccurrenceOfImbalance: Date, firstPositionOfImbalance: number, quantity: number }>, outgoingImbalancePerDay: Array<{ __typename: 'MeteringGridAreaImbalancePerDayDto', imbalanceDay: Date, firstOccurrenceOfImbalance: Date, firstPositionOfImbalance: number, quantity: number }> }> } };

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

export type GetOutgoingMessageByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetOutgoingMessageByIdQuery = { __typename: 'Query', esettOutgoingMessageById: { __typename: 'EsettOutgoingMessage', documentId: string, calculationType: ExchangeEventCalculationType, created: Date, period: { start: Date, end: Date | null }, documentStatus: DocumentStatus, lastDispatched?: Date | null, timeSeriesType: TimeSeriesType, responseDocumentUrl: string, dispatchDocumentUrl?: string | null, gridArea?: { __typename: 'GridAreaDto', displayName: string } | null } };

export type GetImbalancePricesMonthOverviewQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
}>;


export type GetImbalancePricesMonthOverviewQuery = { __typename: 'Query', imbalancePricesForMonth: Array<{ __typename: 'ImbalancePriceDaily', status: ImbalancePriceStatus, timeStamp: Date, importedAt?: Date | null, imbalancePricesDownloadImbalanceUrl: string, imbalancePrices: Array<{ __typename: 'ImbalancePrice', timestamp: Date, price: number }> }> };

export type GetImbalancePricesOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetImbalancePricesOverviewQuery = { __typename: 'Query', imbalancePricesOverview: { __typename: 'ImbalancePricesOverview', uploadImbalancePricesUrl: string, pricePeriods: Array<{ __typename: 'ImbalancePricePeriod', name: Date, priceAreaCode: PriceAreaCode, status: ImbalancePriceStatus }> } };

export type ResendExchangeMessagesMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendExchangeMessagesMutation = { __typename: 'Mutation', resendWaitingEsettExchangeMessages: { __typename: 'ResendWaitingEsettExchangeMessagesPayload', success?: boolean | null } };

export type GetServiceStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServiceStatusQuery = { __typename: 'Query', esettServiceStatus: Array<{ __typename: 'ReadinessStatusDto', component: ESettStageComponent, isReady: boolean }> };

export type GetStatusReportQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatusReportQuery = { __typename: 'Query', esettExchangeStatusReport: { __typename: 'ExchangeEventStatusReportResponse', waitingForExternalResponse: number } };

export type GetGridAreaOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreaOverviewQuery = { __typename: 'Query', gridAreaOverview: Array<{ __typename: 'GridAreaOverviewItemDto', id: string, code: string, name: string, priceAreaCode: string, validFrom: Date, validTo?: Date | null, actorNumber?: string | null, actorName?: string | null, organizationName?: string | null, fullFlexDate?: Date | null }> };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename: 'Mutation', createCalculation: { __typename: 'CreateCalculationPayload', uuid?: string | null } };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename: 'Mutation', updateUserProfile: { __typename: 'UpdateUserProfilePayload', saved?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserProfileQuery = { __typename: 'Query', userProfile: { __typename: 'GetUserProfileResponse', firstName: string, lastName: string, phoneNumber: string } };

export type GetCalculationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCalculationByIdQuery = { __typename: 'Query', calculationById: { __typename: 'Calculation', id: string, state: CalculationOrchestrationState, executionTimeStart?: Date | null, executionTimeEnd?: Date | null, period: { start: Date, end: Date | null }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, currentStep: CalculationProgressStep, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, displayName: string }>, progress: Array<{ __typename: 'CalculationProgress', step: CalculationProgressStep, status: ProgressStatus }> } };

export type GetSelectedActorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectedActorQuery = { __typename: 'Query', selectedActor: { __typename: 'Actor', glnOrEicNumber: string, marketRole?: EicFunction | null, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string }> } };

export type GetActorsForRequestCalculationQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForRequestCalculationQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', marketRole?: EicFunction | null, value: string, displayValue: string }> };

export type GetLatestBalanceFixingQueryVariables = Exact<{
  period: Scalars['DateRange']['input'];
}>;


export type GetLatestBalanceFixingQuery = { __typename: 'Query', latestBalanceFixing?: { __typename: 'Calculation', period: { start: Date, end: Date | null } } | null };

export type GetCalculationsQueryVariables = Exact<{
  input: CalculationQueryInput;
}>;


export type GetCalculationsQuery = { __typename: 'Query', calculations: Array<{ __typename: 'Calculation', id: string, state: CalculationOrchestrationState, executionTimeStart?: Date | null, executionTimeEnd?: Date | null, period: { start: Date, end: Date | null }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, currentStep: CalculationProgressStep, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, displayName: string }>, progress: Array<{ __typename: 'CalculationProgress', step: CalculationProgressStep, status: ProgressStatus }> }> };

export type GetSettlementReportCalculationsByGridAreasQueryVariables = Exact<{
  calculationType: CalculationType;
  gridAreaIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  calculationPeriod: Scalars['DateRange']['input'];
}>;


export type GetSettlementReportCalculationsByGridAreasQuery = { __typename: 'Query', settlementReportGridAreaCalculationsForPeriod: Array<{ __typename: 'KeyValuePairOfStringAndListOfRequestSettlementReportGridAreaCalculation', key: string, value: Array<{ __typename: 'RequestSettlementReportGridAreaCalculation', calculationId: string, calculationDate: Date, gridAreaWithName?: { __typename: 'GridAreaDto', displayName: string, code: string } | null }> }> };

export type OnCalculationProgressSubscriptionVariables = Exact<{
  input: CalculationQueryInput;
}>;


export type OnCalculationProgressSubscription = { __typename: 'Subscription', calculationProgress: { __typename: 'Calculation', id: string, state: CalculationOrchestrationState, executionTimeEnd?: Date | null, executionTimeStart?: Date | null, period: { start: Date, end: Date | null }, statusType: ProcessStatus, calculationType: CalculationType, createdByUserName?: string | null, currentStep: CalculationProgressStep, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, displayName: string }>, progress: Array<{ __typename: 'CalculationProgress', step: CalculationProgressStep, status: ProgressStatus }> } };

export type GetSettlementReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettlementReportsQuery = { __typename: 'Query', settlementReports: Array<{ __typename: 'SettlementReport', id: string, calculationType: CalculationType, period: { start: Date, end: Date | null }, numberOfGridAreasInReport: number, includesBasisData: boolean, progress: number, statusType: SettlementReportStatusType, settlementReportDownloadUrl?: string | null, actor?: { __typename: 'Actor', id: string, name: string } | null }> };

export type GetActorCredentialsQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetActorCredentialsQuery = { __typename: 'Query', actorById: { __typename: 'Actor', id: string, credentials?: { __typename: 'ActorCredentialsDto', assignCertificateCredentialsUrl: string, removeActorCredentialsUrl: string, clientSecretCredentials?: { __typename: 'ActorClientSecretCredentialsDto', clientSecretIdentifier: string, expirationDate: Date } | null, certificateCredentials?: { __typename: 'ActorCertificateCredentialsDto', thumbprint: string, expirationDate: Date } | null } | null } };

export type CreateMarketParticipantMutationVariables = Exact<{
  input: CreateMarketParticipantInput;
}>;


export type CreateMarketParticipantMutation = { __typename: 'Mutation', createMarketParticipant: { __typename: 'CreateMarketParticipantPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type RequestCalculationMutationVariables = Exact<{
  calculationType: CalculationType;
  period: Scalars['DateRange']['input'];
  gridArea?: InputMaybe<Scalars['String']['input']>;
  meteringPointType?: InputMaybe<MeteringPointType>;
  priceType?: InputMaybe<PriceType>;
  balanceResponsibleId?: InputMaybe<Scalars['String']['input']>;
  energySupplierId?: InputMaybe<Scalars['String']['input']>;
}>;


export type RequestCalculationMutation = { __typename: 'Mutation', requestCalculation: { __typename: 'RequestCalculationPayload', success?: boolean | null } };

export type RequestSettlementReportMutationVariables = Exact<{
  input: RequestSettlementReportInput;
}>;


export type RequestSettlementReportMutation = { __typename: 'Mutation', requestSettlementReport: { __typename: 'RequestSettlementReportPayload', boolean?: boolean | null } };

export type GetActorEditableFieldsQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetActorEditableFieldsQuery = { __typename: 'Query', actorById: { __typename: 'Actor', name: string, organization: { __typename: 'Organization', domain: string }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type CreateDelegationForActorMutationVariables = Exact<{
  input: CreateDelegationsForActorInput;
}>;


export type CreateDelegationForActorMutation = { __typename: 'Mutation', createDelegationsForActor: { __typename: 'CreateDelegationsForActorPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetBalanceResponsibleRelationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBalanceResponsibleRelationQuery = { __typename: 'Query', actorById: { __typename: 'Actor', balanceResponsibleAgreements?: Array<{ __typename: 'BalanceResponsibilityAgreement', validPeriod: { start: Date, end: Date | null }, status: BalanceResponsibilityAgreementStatus, meteringPointType: MarketParticipantMeteringPointType, gridArea?: { __typename: 'GridAreaDto', displayName: string, id: string, code: string } | null, balanceResponsibleWithName?: { __typename: 'ActorNameWithId', id: string, actorName: { __typename: 'ActorNameDto', value: string } } | null, energySupplierWithName?: { __typename: 'ActorNameWithId', id: string, actorName: { __typename: 'ActorNameDto', value: string } } | null }> | null } };

export type GetDelegatesQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetDelegatesQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', name: string, id: string, glnOrEicNumber: string }> };

export type GetDelegationsForActorQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetDelegationsForActorQuery = { __typename: 'Query', delegationsForActor: Array<{ __typename: 'MessageDelegationType', periodId: string, id: string, process: DelegatedProcess, validPeriod: { start: Date, end: Date | null }, status: ActorDelegationStatus, delegatedBy?: { __typename: 'Actor', id: string, name: string, glnOrEicNumber: string } | null, delegatedTo?: { __typename: 'Actor', id: string, name: string, glnOrEicNumber: string } | null, gridArea?: { __typename: 'GridAreaDto', id: string, code: string } | null }> };

export type GetOrganizationFromCvrQueryVariables = Exact<{
  cvr: Scalars['String']['input'];
}>;


export type GetOrganizationFromCvrQuery = { __typename: 'Query', searchOrganizationInCVR: { __typename: 'CVROrganizationResult', name: string, hasResult: boolean } };

export type GetOrganizationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOrganizationByIdQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', organizationId?: string | null, name: string, businessRegisterIdentifier: string, domain: string, address: { __typename: 'AddressDto', country: string } } };

export type GetActorsByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetActorsByOrganizationIdQuery = { __typename: 'Query', actorsByOrganizationId: Array<{ __typename: 'Actor', id: string, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', organizationId?: string | null, businessRegisterIdentifier: string, name: string, domain: string }> };

export type GetAuditLogByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByOrganizationIdQuery = { __typename: 'Query', organizationAuditLogs: Array<{ __typename: 'OrganizationAuditedChangeAuditLogDto', change: OrganizationAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type GetAuditLogByActorIdQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByActorIdQuery = { __typename: 'Query', actorAuditLogs: Array<{ __typename: 'ActorAuditedChangeAuditLogDto', change: ActorAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> };

export type RequestClientSecretCredentialsMutationVariables = Exact<{
  input: RequestClientSecretCredentialsInput;
}>;


export type RequestClientSecretCredentialsMutation = { __typename: 'Mutation', requestClientSecretCredentials: { __typename: 'RequestClientSecretCredentialsPayload', actorClientSecretDto?: { __typename: 'ActorClientSecretDto', secretText: string } | null } };

export type GetUserRolesByEicfunctionQueryVariables = Exact<{
  eicfunction: EicFunction;
}>;


export type GetUserRolesByEicfunctionQuery = { __typename: 'Query', userRolesByEicFunction: Array<{ __typename: 'UserRoleDto', name: string, id: string, description: string }> };

export type GetActorsForEicFunctionQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetActorsForEicFunctionQuery = { __typename: 'Query', actorsForEicFunction: Array<{ __typename: 'Actor', id: string, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus }> };

export type GetActorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActorByIdQuery = { __typename: 'Query', actorById: { __typename: 'Actor', id: string, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, displayName: string, id: string }>, organization: { __typename: 'Organization', name: string } } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename: 'Mutation', updateOrganization: { __typename: 'UpdateOrganizationPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, name: string, displayName: string, validTo?: Date | null, validFrom: Date }> };

export type UpdateActorMutationVariables = Exact<{
  input: UpdateActorInput;
}>;


export type UpdateActorMutation = { __typename: 'Mutation', updateActor: { __typename: 'UpdateActorPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string }> | null } };

export type StopDelegationsMutationVariables = Exact<{
  input: StopDelegationInput;
}>;


export type StopDelegationsMutation = { __typename: 'Mutation', stopDelegation: { __typename: 'StopDelegationPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type InitiateMitIdSignupMutationVariables = Exact<{ [key: string]: never; }>;


export type InitiateMitIdSignupMutation = { __typename: 'Mutation', initiateMitIdSignup: { __typename: 'InitiateMitIdSignupPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename: 'Query', actors: Array<{ __typename: 'Actor', id: string, glnOrEicNumber: string, name: string, marketRole?: EicFunction | null, status: ActorStatus, publicMail?: { __typename: 'ActorPublicMail', mail: string } | null }> };

export type ErrorsFragment = { __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> };

export const ErrorsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ErrorsFragment, unknown>;
export const CreateUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserRoleMutation, CreateUserRoleMutationVariables>;
export const DeactivateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deactivateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<DeactivateUserMutation, DeactivateUserMutationVariables>;
export const DeactivateUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deactivateUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<DeactivateUserRoleMutation, DeactivateUserRoleMutationVariables>;
export const GetFilteredActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFilteredActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filteredActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]}}]} as unknown as DocumentNode<GetFilteredActorsQuery, GetFilteredActorsQueryVariables>;
export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const GetPermissionByEicFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionByEicFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionsByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionByEicFunctionQuery, GetPermissionByEicFunctionQueryVariables>;
export const GetKnownEmailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetKnownEmails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"knownEmails"}}]}}]} as unknown as DocumentNode<GetKnownEmailsQuery, GetKnownEmailsQueryVariables>;
export const GetSelectionActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSelectionActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gln"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}}]}}]}}]} as unknown as DocumentNode<GetSelectionActorsQuery, GetSelectionActorsQueryVariables>;
export const GetAssociatedActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssociatedActors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedActors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"actors"}}]}}]}}]} as unknown as DocumentNode<GetAssociatedActorsQuery, GetAssociatedActorsQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchTerm"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPermissionRelationsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetUserAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedActorName"}},{"kind":"Field","name":{"kind":"Name","value":"affectedUserRoleName"}}]}}]}}]} as unknown as DocumentNode<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>;
export const GetPermissionAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>;
export const GetUserRoleWithPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleWithPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserRoleWithPermissionsQuery, GetUserRoleWithPermissionsQueryVariables>;
export const GetUserRoleAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedPermissionName"}}]}}]}}]} as unknown as DocumentNode<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>;
export const GetUserRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesQuery, GetUserRolesQueryVariables>;
export const GetUserRolesByActorIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByActorId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByActorId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByActorIdQuery, GetUserRolesByActorIdQueryVariables>;
export const GetUserRoleViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"userActorId"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserRoleViewQuery, GetUserRoleViewQueryVariables>;
export const ReActivateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reActivateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReActivateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reActivateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ReActivateUserMutation, ReActivateUserMutationVariables>;
export const Reset2faDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reset2fa"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetTwoFactorAuthenticationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetTwoFactorAuthentication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<Reset2faMutation, Reset2faMutationVariables>;
export const InviteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"inviteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"sucess"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<InviteUserMutation, InviteUserMutationVariables>;
export const ReInviteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reInviteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReInviteUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reInviteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ReInviteUserMutation, ReInviteUserMutationVariables>;
export const UpdatePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const UpdateUserAndRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserAndRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserIdentityInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateRolesInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserRoleAssignmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserIdentity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateUserRoleAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateRolesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<UpdateUserAndRolesMutation, UpdateUserAndRolesMutationVariables>;
export const UpdateUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const UserOverviewSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userOverviewSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userRoleIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchText"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketParticipantSortDirctionType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserOverviewSortProperty"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userOverviewSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userRoleIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userRoleIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"userStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchText"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchText"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalUserCount"}}]}}]}}]} as unknown as DocumentNode<UserOverviewSearchQuery, UserOverviewSearchQueryVariables>;
export const DownloadEsettExchangeEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"downloadEsettExchangeEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadEsettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}}]}]}}]} as unknown as DocumentNode<DownloadEsettExchangeEventsQuery, DownloadEsettExchangeEventsQueryVariables>;
export const GetBalanceResponsibleMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBalanceResponsibleMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceResponsibleSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"supplierWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"storageDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsiblesUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>;
export const DownloadMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"downloadMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridImbalanceValuesToInclude"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridAreaImbalanceSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadMeteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"valuesToInclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}}}]}]}}]} as unknown as DocumentNode<DownloadMeteringGridAreaImbalanceQuery, DownloadMeteringGridAreaImbalanceQueryVariables>;
export const GetMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridImbalanceValuesToInclude"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridAreaImbalanceSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdFrom"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdFrom"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"valuesToInclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mgaImbalanceDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"documentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"incomingImbalancePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalanceDay"}},{"kind":"Field","name":{"kind":"Name","value":"firstOccurrenceOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"firstPositionOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingImbalancePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalanceDay"}},{"kind":"Field","name":{"kind":"Name","value":"firstOccurrenceOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"firstPositionOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>;
export const GetOutgoingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOutgoingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventSortProperty"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortProperty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortProperty"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastDispatched"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCodeOut"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCount"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>;
export const GetOutgoingMessageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettOutgoingMessageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastDispatched"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}},{"kind":"Field","name":{"kind":"Name","value":"responseDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dispatchDocumentUrl"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>;
export const GetImbalancePricesMonthOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesMonthOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PriceAreaCode"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesForMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"areaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timeStamp"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesDownloadImbalanceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imbalancePrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>;
export const GetImbalancePricesOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadImbalancePricesUrl"}},{"kind":"Field","name":{"kind":"Name","value":"pricePeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>;
export const ResendExchangeMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendWaitingEsettExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>;
export const GetServiceStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}}]}}]}}]} as unknown as DocumentNode<GetServiceStatusQuery, GetServiceStatusQueryVariables>;
export const GetStatusReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitingForExternalResponse"}}]}}]}}]} as unknown as DocumentNode<GetStatusReportQuery, GetStatusReportQueryVariables>;
export const GetGridAreaOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreaOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"fullFlexDate"}}]}}]}}]} as unknown as DocumentNode<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"saved"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetCalculationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>;
export const GetSelectedActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSelectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedActor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSelectedActorQuery, GetSelectedActorQueryVariables>;
export const GetActorsForRequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForRequestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetActorsForRequestCalculationQuery, GetActorsForRequestCalculationQueryVariables>;
export const GetLatestBalanceFixingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestBalanceFixing"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestBalanceFixing"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]} as unknown as DocumentNode<GetLatestBalanceFixingQuery, GetLatestBalanceFixingQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetSettlementReportCalculationsByGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReportCalculationsByGridAreas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReportGridAreaCalculationsForPeriod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationDate"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportCalculationsByGridAreasQuery, GetSettlementReportCalculationsByGridAreasQueryVariables>;
export const OnCalculationProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnCalculationProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeEnd"}},{"kind":"Field","name":{"kind":"Name","value":"executionTimeStart"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserName"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<OnCalculationProgressSubscription, OnCalculationProgressSubscriptionVariables>;
export const GetSettlementReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSettlementReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfGridAreasInReport"}},{"kind":"Field","name":{"kind":"Name","value":"includesBasisData"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"settlementReportDownloadUrl"}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;
export const GetActorCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignCertificateCredentialsUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}]},{"kind":"Field","name":{"kind":"Name","value":"removeActorCredentialsUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}]},{"kind":"Field","name":{"kind":"Name","value":"clientSecretCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientSecretIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificateCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbprint"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActorCredentialsQuery, GetActorCredentialsQueryVariables>;
export const CreateMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>;
export const RequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringPointType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priceType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PriceType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"gridArea"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridArea"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"priceType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priceType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"balanceResponsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"balanceResponsibleId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"energySupplierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"energySupplierId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestCalculationMutation, RequestCalculationMutationVariables>;
export const RequestSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestSettlementReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestSettlementReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestSettlementReportInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestSettlementReportMutation, RequestSettlementReportMutationVariables>;
export const GetActorEditableFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorEditableFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorEditableFieldsQuery, GetActorEditableFieldsQueryVariables>;
export const CreateDelegationForActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDelegationForActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDelegationsForActorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDelegationsForActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateDelegationForActorMutation, CreateDelegationForActorMutationVariables>;
export const GetBalanceResponsibleRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBalanceResponsibleRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleAgreements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"energySupplierWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleRelationQuery, GetBalanceResponsibleRelationQueryVariables>;
export const GetDelegatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDelegates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}}]}}]} as unknown as DocumentNode<GetDelegatesQuery, GetDelegatesQueryVariables>;
export const GetDelegationsForActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDelegationsForActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delegationsForActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"process"}},{"kind":"Field","name":{"kind":"Name","value":"delegatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delegatedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetDelegationsForActorQuery, GetDelegationsForActorQueryVariables>;
export const GetOrganizationFromCvrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationFromCVR"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchOrganizationInCVR"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cvr"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hasResult"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>;
export const GetOrganizationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>;
export const GetActorsByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsByOrganizationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsByOrganizationIdQuery, GetActorsByOrganizationIdQueryVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const GetAuditLogByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>;
export const GetAuditLogByActorIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByActorId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorAuditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByActorIdQuery, GetAuditLogByActorIdQueryVariables>;
export const RequestClientSecretCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestClientSecretCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestClientSecretCredentialsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestClientSecretCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorClientSecretDto"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secretText"}}]}}]}}]}}]} as unknown as DocumentNode<RequestClientSecretCredentialsMutation, RequestClientSecretCredentialsMutationVariables>;
export const GetUserRolesByEicfunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByEicfunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>;
export const GetActorsForEicFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsForEicFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetActorsForEicFunctionQuery, GetActorsForEicFunctionQueryVariables>;
export const GetActorByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorByIdQuery, GetActorByIdQueryVariables>;
export const UpdateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const UpdateActorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateActor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateActorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateActorMutation, UpdateActorMutationVariables>;
export const StopDelegationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"stopDelegations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StopDelegationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopDelegation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<StopDelegationsMutation, StopDelegationsMutationVariables>;
export const InitiateMitIdSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitiateMitIdSignup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateMitIdSignup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<InitiateMitIdSignupMutation, InitiateMitIdSignupMutationVariables>;
export const GetActorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publicMail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsQuery, GetActorsQueryVariables>;

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateUserRoleMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createUserRole }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateUserRoleMutation = (resolver: GraphQLResponseResolver<CreateUserRoleMutation, CreateUserRoleMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<CreateUserRoleMutation, CreateUserRoleMutationVariables>(
    'CreateUserRole',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeactivateUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { deactivateUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeactivateUserMutation = (resolver: GraphQLResponseResolver<DeactivateUserMutation, DeactivateUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<DeactivateUserMutation, DeactivateUserMutationVariables>(
    'deactivateUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeactivateUserRoleMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { deactivateUserRole }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeactivateUserRoleMutation = (resolver: GraphQLResponseResolver<DeactivateUserRoleMutation, DeactivateUserRoleMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<DeactivateUserRoleMutation, DeactivateUserRoleMutationVariables>(
    'deactivateUserRole',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetFilteredActorsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { filteredActors }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetFilteredActorsQuery = (resolver: GraphQLResponseResolver<GetFilteredActorsQuery, GetFilteredActorsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetFilteredActorsQuery, GetFilteredActorsQueryVariables>(
    'GetFilteredActors',
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
 * mockGetPermissionByEicFunctionQuery(
 *   ({ query, variables }) => {
 *     const { eicFunction } = variables;
 *     return HttpResponse.json({
 *       data: { permissionsByEicFunction }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetPermissionByEicFunctionQuery = (resolver: GraphQLResponseResolver<GetPermissionByEicFunctionQuery, GetPermissionByEicFunctionQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetPermissionByEicFunctionQuery, GetPermissionByEicFunctionQueryVariables>(
    'GetPermissionByEicFunction',
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
 * mockGetSelectionActorsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { selectionActors }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSelectionActorsQuery = (resolver: GraphQLResponseResolver<GetSelectionActorsQuery, GetSelectionActorsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetSelectionActorsQuery, GetSelectionActorsQueryVariables>(
    'GetSelectionActors',
    resolver,
    options
  )

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
 * mockGetUserByIdQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserByIdQuery = (resolver: GraphQLResponseResolver<GetUserByIdQuery, GetUserByIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserByIdQuery, GetUserByIdQueryVariables>(
    'GetUserById',
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
 * mockGetUserRoleWithPermissionsQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { userRoleById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRoleWithPermissionsQuery = (resolver: GraphQLResponseResolver<GetUserRoleWithPermissionsQuery, GetUserRoleWithPermissionsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserRoleWithPermissionsQuery, GetUserRoleWithPermissionsQueryVariables>(
    'GetUserRoleWithPermissions',
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
 * mockGetUserRolesQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { userRoles }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesQuery = (resolver: GraphQLResponseResolver<GetUserRolesQuery, GetUserRolesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserRolesQuery, GetUserRolesQueryVariables>(
    'GetUserRoles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRolesByActorIdQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { userRolesByActorId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRolesByActorIdQuery = (resolver: GraphQLResponseResolver<GetUserRolesByActorIdQuery, GetUserRolesByActorIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserRolesByActorIdQuery, GetUserRolesByActorIdQueryVariables>(
    'GetUserRolesByActorId',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetUserRoleViewQuery(
 *   ({ query, variables }) => {
 *     const { userId } = variables;
 *     return HttpResponse.json({
 *       data: { userRoleView }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetUserRoleViewQuery = (resolver: GraphQLResponseResolver<GetUserRoleViewQuery, GetUserRoleViewQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetUserRoleViewQuery, GetUserRoleViewQueryVariables>(
    'GetUserRoleView',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReActivateUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { reActivateUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockReActivateUserMutation = (resolver: GraphQLResponseResolver<ReActivateUserMutation, ReActivateUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<ReActivateUserMutation, ReActivateUserMutationVariables>(
    'reActivateUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReset2faMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { resetTwoFactorAuthentication }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockReset2faMutation = (resolver: GraphQLResponseResolver<Reset2faMutation, Reset2faMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Reset2faMutation, Reset2faMutationVariables>(
    'reset2fa',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInviteUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { inviteUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockInviteUserMutation = (resolver: GraphQLResponseResolver<InviteUserMutation, InviteUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<InviteUserMutation, InviteUserMutationVariables>(
    'inviteUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReInviteUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { reInviteUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockReInviteUserMutation = (resolver: GraphQLResponseResolver<ReInviteUserMutation, ReInviteUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<ReInviteUserMutation, ReInviteUserMutationVariables>(
    'reInviteUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdatePermissionMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updatePermission }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdatePermissionMutation = (resolver: GraphQLResponseResolver<UpdatePermissionMutation, UpdatePermissionMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdatePermissionMutation, UpdatePermissionMutationVariables>(
    'UpdatePermission',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserAndRolesMutation(
 *   ({ query, variables }) => {
 *     const { updateUserInput, updateRolesInput } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserIdentity, updateUserRoleAssignment }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserAndRolesMutation = (resolver: GraphQLResponseResolver<UpdateUserAndRolesMutation, UpdateUserAndRolesMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateUserAndRolesMutation, UpdateUserAndRolesMutationVariables>(
    'updateUserAndRoles',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserRoleMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserRole }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserRoleMutation = (resolver: GraphQLResponseResolver<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>(
    'UpdateUserRole',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserOverviewSearchQuery(
 *   ({ query, variables }) => {
 *     const { actorId, userRoleIds, searchText, userStatus, pageNumber, pageSize, sortDirection, sortProperty } = variables;
 *     return HttpResponse.json({
 *       data: { userOverviewSearch }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserOverviewSearchQuery = (resolver: GraphQLResponseResolver<UserOverviewSearchQuery, UserOverviewSearchQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<UserOverviewSearchQuery, UserOverviewSearchQueryVariables>(
    'userOverviewSearch',
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
 * mockGetBalanceResponsibleMessagesQuery(
 *   ({ query, variables }) => {
 *     const { pageNumber, pageSize, sortProperty, sortDirection, locale } = variables;
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
    'GetSelectedActor',
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
 * mockGetSettlementReportCalculationsByGridAreasQuery(
 *   ({ query, variables }) => {
 *     const { calculationType, gridAreaIds, calculationPeriod } = variables;
 *     return HttpResponse.json({
 *       data: { settlementReportGridAreaCalculationsForPeriod }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSettlementReportCalculationsByGridAreasQuery = (resolver: GraphQLResponseResolver<GetSettlementReportCalculationsByGridAreasQuery, GetSettlementReportCalculationsByGridAreasQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetSettlementReportCalculationsByGridAreasQuery, GetSettlementReportCalculationsByGridAreasQueryVariables>(
    'GetSettlementReportCalculationsByGridAreas',
    resolver,
    options
  )


/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetSettlementReportsQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { settlementReports }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetSettlementReportsQuery = (resolver: GraphQLResponseResolver<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>(
    'getSettlementReports',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockGetActorCredentialsQuery(
 *   ({ query, variables }) => {
 *     const { actorId } = variables;
 *     return HttpResponse.json({
 *       data: { actorById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetActorCredentialsQuery = (resolver: GraphQLResponseResolver<GetActorCredentialsQuery, GetActorCredentialsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetActorCredentialsQuery, GetActorCredentialsQueryVariables>(
    'GetActorCredentials',
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
 * mockRequestCalculationMutation(
 *   ({ query, variables }) => {
 *     const { calculationType, period, gridArea, meteringPointType, priceType, balanceResponsibleId, energySupplierId } = variables;
 *     return HttpResponse.json({
 *       data: { requestCalculation }
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
 * mockRequestSettlementReportMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestSettlementReport }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestSettlementReportMutation = (resolver: GraphQLResponseResolver<RequestSettlementReportMutation, RequestSettlementReportMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<RequestSettlementReportMutation, RequestSettlementReportMutationVariables>(
    'RequestSettlementReport',
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
 * mockGetBalanceResponsibleRelationQuery(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { actorById }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockGetBalanceResponsibleRelationQuery = (resolver: GraphQLResponseResolver<GetBalanceResponsibleRelationQuery, GetBalanceResponsibleRelationQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<GetBalanceResponsibleRelationQuery, GetBalanceResponsibleRelationQueryVariables>(
    'getBalanceResponsibleRelation',
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
 * mockRequestClientSecretCredentialsMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { requestClientSecretCredentials }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockRequestClientSecretCredentialsMutation = (resolver: GraphQLResponseResolver<RequestClientSecretCredentialsMutation, RequestClientSecretCredentialsMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<RequestClientSecretCredentialsMutation, RequestClientSecretCredentialsMutationVariables>(
    'requestClientSecretCredentials',
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
 * mockInitiateMitIdSignupMutation(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { initiateMitIdSignup }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockInitiateMitIdSignupMutation = (resolver: GraphQLResponseResolver<InitiateMitIdSignupMutation, InitiateMitIdSignupMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<InitiateMitIdSignupMutation, InitiateMitIdSignupMutationVariables>(
    'InitiateMitIdSignup',
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

import { dateRangeTypePolicy, dateTypePolicy } from "libs/dh/shared/domain/src/lib/type-policies";

export const scalarTypePolicies = {
  ActorAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  ActorCertificateCredentialsDto: { fields: { expirationDate: dateTypePolicy } },
  ActorClientSecretCredentialsDto: { fields: { expirationDate: dateTypePolicy } },
  BalanceResponsibilityAgreement: { fields: { validPeriod: dateRangeTypePolicy } },
  BalanceResponsibleType: { fields: { validPeriod: dateRangeTypePolicy, receivedDateTime: dateTypePolicy } },
  Calculation: {
    fields: { period: dateRangeTypePolicy, executionTimeStart: dateTypePolicy, executionTimeEnd: dateTypePolicy },
  },
  EsettOutgoingMessage: {
    fields: { period: dateRangeTypePolicy, created: dateTypePolicy, lastDispatched: dateTypePolicy },
  },
  ExchangeEventSearchResult: { fields: { created: dateTypePolicy, lastDispatched: dateTypePolicy } },
  GridAreaDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  GridAreaOverviewItemDto: {
    fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy, fullFlexDate: dateTypePolicy },
  },
  ImbalancePrice: { fields: { timestamp: dateTypePolicy } },
  ImbalancePriceDaily: { fields: { timeStamp: dateTypePolicy, importedAt: dateTypePolicy } },
  ImbalancePricePeriod: { fields: { name: dateTypePolicy } },
  MessageDelegationType: { fields: { validPeriod: dateRangeTypePolicy } },
  MeteringGridAreaImbalancePerDayDto: {
    fields: { imbalanceDay: dateTypePolicy, firstOccurrenceOfImbalance: dateTypePolicy },
  },
  MeteringGridAreaImbalanceSearchResult: {
    fields: { period: dateRangeTypePolicy, documentDateTime: dateTypePolicy, receivedDateTime: dateTypePolicy },
  },
  OrganizationAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  Permission: { fields: { created: dateTypePolicy } },
  PermissionAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  PermissionDetailsDto: { fields: { created: dateTypePolicy } },
  RequestSettlementReportGridAreaCalculation: { fields: { calculationDate: dateTypePolicy } },
  SettlementReport: { fields: { period: dateRangeTypePolicy } },
  User: { fields: { createdDate: dateTypePolicy } },
  UserAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  UserRoleAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
};
