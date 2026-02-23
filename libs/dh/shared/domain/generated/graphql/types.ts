import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** The `Date` scalar represents an ISO-8601 compliant date type. */
  Date: { input: Date; output: Date; }
  /** Represents a date range */
  DateRange: { input: { start: Date, end: Date | null }; output: { start: Date, end: Date | null }; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: Date; output: Date; }
  /** The `Decimal` scalar type represents a decimal floating-point number. */
  Decimal: { input: number; output: number; }
  JSON: { input: any; output: any; }
  /**
   * LocalDate represents a date within the calendar, with no reference to a particular time zone or time of day.
   *
   * Allowed patterns:
   * - `YYYY-MM-DD`
   *
   * Examples:
   * - `2000-01-01`
   */
  LocalDate: { input: any; output: any; }
  /** Represents a long */
  Long: { input: string; output: string; }
  URL: { input: any; output: any; }
  UUID: { input: string; output: string; }
  /** Represents a year and month */
  YearMonth: { input: string; output: string; }
};

export type ActorRequestQueryResult = {
  messageId?: Maybe<Scalars['String']['output']>;
  calculationType?: Maybe<RequestCalculationType>;
  period?: Maybe<Scalars['DateRange']['output']>;
  requestedBy?: Maybe<MarketParticipant>;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type Calculation = {
  executionType: CalculationExecutionType;
  calculationType: CalculationTypeQueryParameterV1;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type Error = {
  message: Scalars['String']['output'];
};

export type OrchestrationInstance = {
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type ActorAuditedChangeAuditLogDto = {
  __typename: 'ActorAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  consolidation?: Maybe<MarketParticipantConsolidationAuditLog>;
  delegation?: Maybe<MarketParticipantDelegationAuditLog>;
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
  assignCertificateCredentialsUrl?: Maybe<Scalars['String']['output']>;
  removeMarketParticipantCredentialsUrl?: Maybe<Scalars['String']['output']>;
  certificateCredentials?: Maybe<ActorCertificateCredentialsDto>;
  clientSecretCredentials?: Maybe<ActorClientSecretCredentialsDto>;
};


export type ActorCredentialsDtoAssignCertificateCredentialsUrlArgs = {
  marketParticipantId: Scalars['UUID']['input'];
};


export type ActorCredentialsDtoRemoveMarketParticipantCredentialsUrlArgs = {
  marketParticipantId: Scalars['UUID']['input'];
};

export type ActorNameDto = {
  __typename: 'ActorNameDto';
  value: Scalars['String']['output'];
};

export type AddChargeSeriesPayload = {
  __typename: 'AddChargeSeriesPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type AddMeteringPointsToAdditionalRecipientPayload = {
  __typename: 'AddMeteringPointsToAdditionalRecipientPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<AddMeteringPointsToAdditionalRecipientError>>;
};

export type AddTokenToDownloadUrlPayload = {
  __typename: 'AddTokenToDownloadUrlPayload';
  string?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<AddTokenToDownloadUrlError>>;
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

export type ArchivedMessage = {
  __typename: 'ArchivedMessage';
  sender?: Maybe<MarketParticipant>;
  receiver?: Maybe<MarketParticipant>;
  documentUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  messageId: Scalars['String']['output'];
  documentType: DocumentType;
  createdAt: Scalars['DateTime']['output'];
};

/** A connection to a list of items. */
export type ArchivedMessagesConnection = {
  __typename: 'ArchivedMessagesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<ArchivedMessagesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<ArchivedMessage>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ArchivedMessagesEdge = {
  __typename: 'ArchivedMessagesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ArchivedMessage;
};

/** A connection to a list of items. */
export type ArchivedMessagesForMeteringPointConnection = {
  __typename: 'ArchivedMessagesForMeteringPointConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<ArchivedMessagesForMeteringPointEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<ArchivedMessage>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ArchivedMessagesForMeteringPointEdge = {
  __typename: 'ArchivedMessagesForMeteringPointEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ArchivedMessage;
};

export type AssociatedMarketParticipants = {
  __typename: 'AssociatedMarketParticipants';
  email: Scalars['String']['output'];
  marketParticipants: Array<Scalars['UUID']['output']>;
};

export type AuditIdentityDto = {
  __typename: 'AuditIdentityDto';
  auditIdentityId: Scalars['UUID']['output'];
  displayName: Scalars['String']['output'];
};

export type BalanceResponsibilityAgreement = {
  __typename: 'BalanceResponsibilityAgreement';
  gridArea?: Maybe<GridAreaDto>;
  energySupplierWithName?: Maybe<MarketParticipantNameWithId>;
  balanceResponsibleWithName?: Maybe<MarketParticipantNameWithId>;
  meteringPointType: MarketParticipantMeteringPointType;
  validPeriod: Scalars['DateRange']['output'];
  status: BalanceResponsibilityAgreementStatus;
};

export type BalanceResponsible = {
  __typename: 'BalanceResponsible';
  storageDocumentUrl?: Maybe<Scalars['String']['output']>;
  gridArea?: Maybe<GridAreaDto>;
  energySupplierName?: Maybe<Scalars['String']['output']>;
  balanceResponsibleName?: Maybe<Scalars['String']['output']>;
  validPeriod: Scalars['DateRange']['output'];
  id: Scalars['String']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  supplier: Scalars['String']['output'];
  balanceResponsible: Scalars['String']['output'];
  meteringPointType: BalanceResponsibilityMeteringPointType;
};

/** A segment of a collection. */
export type BalanceResponsibleCollectionSegment = {
  __typename: 'BalanceResponsibleCollectionSegment';
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  /** A flattened list of the items. */
  items?: Maybe<Array<BalanceResponsible>>;
  totalCount: Scalars['Int']['output'];
  balanceResponsiblesUrl?: Maybe<Scalars['String']['output']>;
  balanceResponsibleImportUrl?: Maybe<Scalars['String']['output']>;
};


/** A segment of a collection. */
export type BalanceResponsibleCollectionSegmentBalanceResponsiblesUrlArgs = {
  locale: Scalars['String']['input'];
};

export type BalanceResponsiblePageResult = {
  __typename: 'BalanceResponsiblePageResult';
  page: Array<BalanceResponsible>;
  totalCount: Scalars['Int']['output'];
};

export type CprResponse = {
  __typename: 'CPRResponse';
  result: Scalars['String']['output'];
};

export type CvrOrganizationResult = {
  __typename: 'CVROrganizationResult';
  name: Scalars['String']['output'];
  hasResult: Scalars['Boolean']['output'];
};

/** A connection to a list of items. */
export type CalculationsConnection = {
  __typename: 'CalculationsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<CalculationsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Calculation>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
  capacitySettlementsUploadUrl?: Maybe<Scalars['String']['output']>;
};

/** An edge in a connection. */
export type CalculationsEdge = {
  __typename: 'CalculationsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Calculation;
};

export type CancelChargeLinkPayload = {
  __typename: 'CancelChargeLinkPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CancelMeasurementsReportPayload = {
  __typename: 'CancelMeasurementsReportPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CancelScheduledCalculationPayload = {
  __typename: 'CancelScheduledCalculationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CancelSettlementReportPayload = {
  __typename: 'CancelSettlementReportPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CapacitySettlementCalculation = Calculation & OrchestrationInstance & {
  __typename: 'CapacitySettlementCalculation';
  yearMonth: Scalars['YearMonth']['output'];
  executionType: CalculationExecutionType;
  calculationType: CalculationTypeQueryParameterV1;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type ChangeCustomerCharacteristicsPayload = {
  __typename: 'ChangeCustomerCharacteristicsPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type Charge = {
  __typename: 'Charge';
  series: Array<ChargeSeriesPoint>;
  owner?: Maybe<MarketParticipant>;
  id: Scalars['String']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: ChargeType;
  displayName: Scalars['String']['output'];
  description: Scalars['String']['output'];
  periods: Array<ChargePeriod>;
  resolution: ChargeResolution;
  status: ChargeStatus;
  vatInclusive: Scalars['Boolean']['output'];
  transparentInvoicing: Scalars['Boolean']['output'];
  spotDependingPrice: Scalars['Boolean']['output'];
};


export type ChargeSeriesArgs = {
  interval: Scalars['DateRange']['input'];
};

export type ChargeLink = {
  __typename: 'ChargeLink';
  history: Array<ChargeLinkHistory>;
  charge?: Maybe<Charge>;
  amount: Scalars['Int']['output'];
  period?: Maybe<ChargeLinkPeriod>;
  id: Scalars['String']['output'];
};

export type ChargeLinkHistory = {
  __typename: 'ChargeLinkHistory';
  submittedAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  messageId: Scalars['String']['output'];
};

export type ChargeLinkPeriod = {
  __typename: 'ChargeLinkPeriod';
  interval: Scalars['DateRange']['output'];
  amount: Scalars['Int']['output'];
};

export type ChargePeriod = {
  __typename: 'ChargePeriod';
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  transparentInvoicing: Scalars['Boolean']['output'];
  vatInclusive: Scalars['Boolean']['output'];
  period: Scalars['DateRange']['output'];
  status: ChargeStatus;
};

export type ChargeSeriesPoint = {
  __typename: 'ChargeSeriesPoint';
  price: Scalars['Decimal']['output'];
  hasChanged: Scalars['Boolean']['output'];
  period: Scalars['DateRange']['output'];
  changes: Array<ChargeSeriesPointChange>;
};

export type ChargeSeriesPointChange = {
  __typename: 'ChargeSeriesPointChange';
  price: Scalars['Decimal']['output'];
  isCurrent: Scalars['Boolean']['output'];
  messageId?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type ChargesConnection = {
  __typename: 'ChargesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<ChargesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Charge>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ChargesEdge = {
  __typename: 'ChargesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Charge;
};

export type CloseConversationPayload = {
  __typename: 'CloseConversationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

/** Information about the offset pagination. */
export type CollectionSegmentInfo = {
  __typename: 'CollectionSegmentInfo';
  /** Indicates whether more items exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more items exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
};

/** Conversation */
export type Conversation = {
  __typename: 'Conversation';
  displayId?: Maybe<Scalars['String']['output']>;
  /** Display Id of the conversation */
  id: Scalars['ID']['output'];
  /** Internal note from the creator */
  internalNote?: Maybe<Scalars['String']['output']>;
  subject: ConversationSubject;
  /** true for conversations that are closed. false otherwise. */
  closed: Scalars['Boolean']['output'];
  /** Messages associated with a conversation */
  messages: Array<ConversationMessage>;
};

/** Conversation info */
export type ConversationInfo = {
  __typename: 'ConversationInfo';
  /** Conversation id */
  id: Scalars['UUID']['output'];
  /** Display id of the conversation */
  displayId: Scalars['ID']['output'];
  subject: ConversationSubject;
  /** Specifies whether the conversation has been read or not */
  read: Scalars['Boolean']['output'];
  /** Conversation is closed or not */
  closed: Scalars['Boolean']['output'];
  /** Last updated time of the conversation */
  lastUpdated: Scalars['DateTime']['output'];
};

/** Conversation message */
export type ConversationMessage = {
  __typename: 'ConversationMessage';
  actorName?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
  /** Message content */
  content: Scalars['String']['output'];
  messageType: MessageType;
  /** Created time */
  createdTime: Scalars['DateTime']['output'];
  senderType: ActorType;
  /** Sender user id */
  userId?: Maybe<Scalars['String']['output']>;
};

/** Conversations */
export type Conversations = {
  __typename: 'Conversations';
  /** List of Conversations */
  conversations: Array<ConversationInfo>;
};

export type CreateCalculationPayload = {
  __typename: 'CreateCalculationPayload';
  uuid?: Maybe<Scalars['UUID']['output']>;
};

export type CreateChargeLinkPayload = {
  __typename: 'CreateChargeLinkPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateChargePayload = {
  __typename: 'CreateChargePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateDelegationsForMarketParticipantPayload = {
  __typename: 'CreateDelegationsForMarketParticipantPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<CreateDelegationsForMarketParticipantError>>;
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

export type DismissAllNotificationsPayload = {
  __typename: 'DismissAllNotificationsPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DismissAllNotificationsError>>;
};

export type DismissNotificationPayload = {
  __typename: 'DismissNotificationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DismissNotificationError>>;
};

export type EditChargeLinkPayload = {
  __typename: 'EditChargeLinkPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type ElectricalHeatingCalculation = Calculation & OrchestrationInstance & {
  __typename: 'ElectricalHeatingCalculation';
  executionType: CalculationExecutionType;
  calculationType: CalculationTypeQueryParameterV1;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type ElectricityMarketV2EventDto = {
  __typename: 'ElectricityMarketV2EventDto';
  id: Scalars['UUID']['output'];
  timestamp: Scalars['DateTime']['output'];
  type: Scalars['String']['output'];
  dataJson: Scalars['String']['output'];
};

export type ElectricityMarketViewAnnualDate = {
  __typename: 'ElectricityMarketViewAnnualDate';
  month: Scalars['Int']['output'];
  day: Scalars['Int']['output'];
};

export type ElectricityMarketViewCommercialRelationDto = {
  __typename: 'ElectricityMarketViewCommercialRelationDto';
  energySupplierName?: Maybe<ActorNameDto>;
  id: Scalars['String']['output'];
  energySupplier: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  endDate: Scalars['DateTime']['output'];
  activeEnergySupplyPeriod?: Maybe<ElectricityMarketViewEnergySupplyPeriodDto>;
  energySupplyPeriodTimeline: Array<ElectricityMarketViewEnergySupplyPeriodDto>;
  activeElectricalHeatingPeriods?: Maybe<ElectricityMarketViewElectricalHeatingDto>;
  electricalHeatingPeriods: Array<ElectricityMarketViewElectricalHeatingDto>;
};

export type ElectricityMarketViewCustomerContactDto = {
  __typename: 'ElectricityMarketViewCustomerContactDto';
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  isProtectedAddress: Scalars['Boolean']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  mobile?: Maybe<Scalars['String']['output']>;
  attention?: Maybe<Scalars['String']['output']>;
  streetCode?: Maybe<Scalars['String']['output']>;
  streetName?: Maybe<Scalars['String']['output']>;
  buildingNumber?: Maybe<Scalars['String']['output']>;
  postCode?: Maybe<Scalars['String']['output']>;
  cityName?: Maybe<Scalars['String']['output']>;
  citySubDivisionName?: Maybe<Scalars['String']['output']>;
  darReference?: Maybe<Scalars['UUID']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  floor?: Maybe<Scalars['String']['output']>;
  room?: Maybe<Scalars['String']['output']>;
  postBox?: Maybe<Scalars['String']['output']>;
  municipalityCode?: Maybe<Scalars['String']['output']>;
};

export type ElectricityMarketViewCustomerDto = {
  __typename: 'ElectricityMarketViewCustomerDto';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  cvr?: Maybe<Scalars['String']['output']>;
  isProtectedName: Scalars['Boolean']['output'];
  relationType: ElectricityMarketViewCustomerRelationType;
  legalContact?: Maybe<ElectricityMarketViewCustomerContactDto>;
  technicalContact?: Maybe<ElectricityMarketViewCustomerContactDto>;
};

export type ElectricityMarketViewElectricalHeatingDto = {
  __typename: 'ElectricityMarketViewElectricalHeatingDto';
  id: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo: Scalars['DateTime']['output'];
  isActive: Scalars['Boolean']['output'];
  transactionType?: Maybe<ElectricityMarketViewTransactionType>;
};

export type ElectricityMarketViewEnergySupplyPeriodDto = {
  __typename: 'ElectricityMarketViewEnergySupplyPeriodDto';
  id: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo: Scalars['DateTime']['output'];
  customers: Array<ElectricityMarketViewCustomerDto>;
};

export type ElectricityMarketViewInstallationAddressDto = {
  __typename: 'ElectricityMarketViewInstallationAddressDto';
  id: Scalars['String']['output'];
  streetCode?: Maybe<Scalars['String']['output']>;
  streetName: Scalars['String']['output'];
  buildingNumber: Scalars['String']['output'];
  cityName: Scalars['String']['output'];
  citySubDivisionName?: Maybe<Scalars['String']['output']>;
  darReference?: Maybe<Scalars['UUID']['output']>;
  washInstructions?: Maybe<ElectricityMarketViewWashInstructions>;
  countryCode: Scalars['String']['output'];
  floor?: Maybe<Scalars['String']['output']>;
  room?: Maybe<Scalars['String']['output']>;
  postCode: Scalars['String']['output'];
  municipalityCode?: Maybe<Scalars['String']['output']>;
  locationDescription?: Maybe<Scalars['String']['output']>;
};

export type ElectricityMarketViewMeteringPointDto = {
  __typename: 'ElectricityMarketViewMeteringPointDto';
  meteringPointId: Scalars['String']['output'];
  isChild: Scalars['Boolean']['output'];
  isEnergySupplier: Scalars['Boolean']['output'];
  isGridAccessProvider: Scalars['Boolean']['output'];
  electricalHeatingStartDate?: Maybe<Scalars['DateTime']['output']>;
  hadElectricalHeating: Scalars['Boolean']['output'];
  haveElectricalHeating: Scalars['Boolean']['output'];
  createdDate?: Maybe<Scalars['DateTime']['output']>;
  connectionDate?: Maybe<Scalars['DateTime']['output']>;
  closedDownDate?: Maybe<Scalars['DateTime']['output']>;
  disconnectedDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  identification: Scalars['String']['output'];
  metadata: ElectricityMarketViewMeteringPointMetadataDto;
  metadataTimeline: Array<ElectricityMarketViewMeteringPointMetadataDto>;
  commercialRelation?: Maybe<ElectricityMarketViewCommercialRelationDto>;
  commercialRelationTimeline: Array<ElectricityMarketViewCommercialRelationDto>;
};


export type ElectricityMarketViewMeteringPointDtoIsEnergySupplierArgs = {
  energySupplierActorGln: Scalars['String']['input'];
};


export type ElectricityMarketViewMeteringPointDtoIsGridAccessProviderArgs = {
  gridAccessProviderActorGln: Scalars['String']['input'];
};

export type ElectricityMarketViewMeteringPointMetadataDto = {
  __typename: 'ElectricityMarketViewMeteringPointMetadataDto';
  gridArea?: Maybe<GridAreaDto>;
  fromGridArea?: Maybe<GridAreaDto>;
  toGridArea?: Maybe<GridAreaDto>;
  internalMeteringPointParentId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  validFrom: Scalars['DateTime']['output'];
  validTo: Scalars['DateTime']['output'];
  parentMeteringPoint?: Maybe<Scalars['String']['output']>;
  type: ElectricityMarketViewMeteringPointType;
  subType?: Maybe<ElectricityMarketViewMeteringPointSubType>;
  connectionState?: Maybe<ElectricityMarketViewConnectionState>;
  resolution: Scalars['String']['output'];
  ownedBy: Scalars['String']['output'];
  connectionType?: Maybe<ElectricityMarketViewConnectionType>;
  disconnectionType?: Maybe<ElectricityMarketViewDisconnectionType>;
  product?: Maybe<ElectricityMarketViewProduct>;
  productObligation?: Maybe<Scalars['Boolean']['output']>;
  measureUnit: ElectricityMarketViewMeteringPointMeasureUnit;
  assetType?: Maybe<ElectricityMarketViewAssetType>;
  environmentalFriendly?: Maybe<Scalars['Boolean']['output']>;
  capacity?: Maybe<Scalars['String']['output']>;
  powerLimitKw?: Maybe<Scalars['Float']['output']>;
  powerLimitAmp?: Maybe<Scalars['Int']['output']>;
  meterNumber?: Maybe<Scalars['String']['output']>;
  netSettlementGroup?: Maybe<Scalars['Int']['output']>;
  scheduledMeterReadingMonth?: Maybe<Scalars['Int']['output']>;
  scheduledMeterReadingDate?: Maybe<ElectricityMarketViewAnnualDate>;
  powerPlantGsrn?: Maybe<Scalars['String']['output']>;
  settlementMethod?: Maybe<ElectricityMarketViewSettlementMethod>;
  installationAddress?: Maybe<ElectricityMarketViewInstallationAddressDto>;
  manuallyHandled: Scalars['Boolean']['output'];
};


export type ElectricityMarketViewMeteringPointMetadataDtoInternalMeteringPointParentIdArgs = {
  searchMigratedMeteringPoints?: InputMaybe<Scalars['Boolean']['input']>;
};

/** A segment of a collection. */
export type EsettExchangeEventsCollectionSegment = {
  __typename: 'EsettExchangeEventsCollectionSegment';
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  /** A flattened list of the items. */
  items?: Maybe<Array<ExchangeEventSearchResult>>;
  totalCount: Scalars['Int']['output'];
  gridAreaCount: Scalars['Int']['output'];
};

export type EsettOutgoingMessage = {
  __typename: 'EsettOutgoingMessage';
  dispatchDocumentUrl?: Maybe<Scalars['String']['output']>;
  responseDocumentUrl?: Maybe<Scalars['String']['output']>;
  gridArea?: Maybe<GridAreaDto>;
  period: Scalars['DateRange']['output'];
  documentId: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  gridAreaCode: Scalars['String']['output'];
  calculationType: ExchangeEventCalculationType;
  timeSeriesType: EsettTimeSeriesType;
  documentStatus: DocumentStatus;
  lastDispatched?: Maybe<Scalars['DateTime']['output']>;
  manuallyHandledExchangeEventMetaData?: Maybe<ManuallyHandledExchangeEventMetaData>;
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
  timeSeriesType: EsettTimeSeriesType;
  documentStatus: DocumentStatus;
  lastDispatched?: Maybe<Scalars['DateTime']['output']>;
};

export type ExchangeEventStatusReportResponse = {
  __typename: 'ExchangeEventStatusReportResponse';
  waitingForExternalResponse: Scalars['Int']['output'];
};

export type ExecuteMeteringPointManualCorrectionPayload = {
  __typename: 'ExecuteMeteringPointManualCorrectionPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

/** A connection to a list of items. */
export type FailedSendMeasurementsInstancesConnection = {
  __typename: 'FailedSendMeasurementsInstancesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<FailedSendMeasurementsInstancesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<SendMeasurementsInstanceDto>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type FailedSendMeasurementsInstancesEdge = {
  __typename: 'FailedSendMeasurementsInstancesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: SendMeasurementsInstanceDto;
};

/** A connection to a list of items. */
export type FilteredPermissionsConnection = {
  __typename: 'FilteredPermissionsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<FilteredPermissionsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Permission>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
  permissionRelationsUrl?: Maybe<Scalars['String']['output']>;
};

/** An edge in a connection. */
export type FilteredPermissionsEdge = {
  __typename: 'FilteredPermissionsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Permission;
};

/** A connection to a list of items. */
export type FilteredUserRolesConnection = {
  __typename: 'FilteredUserRolesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<FilteredUserRolesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<UserRoleDto>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type FilteredUserRolesEdge = {
  __typename: 'FilteredUserRolesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: UserRoleDto;
};

export type GetMeteringPointDebugResultDtoV1 = {
  __typename: 'GetMeteringPointDebugResultDtoV1';
  meteringPointJson: Scalars['String']['output'];
  events: Array<ElectricityMarketV2EventDto>;
};

export type GridAreaAuditedChangeAuditLogDto = {
  __typename: 'GridAreaAuditedChangeAuditLogDto';
  auditedBy?: Maybe<Scalars['String']['output']>;
  currentOwner?: Maybe<Scalars['String']['output']>;
  previousOwner?: Maybe<Scalars['String']['output']>;
  consolidatedAt?: Maybe<Scalars['DateTime']['output']>;
  change: GridAreaAuditedChange;
  timestamp: Scalars['DateTime']['output'];
  isInitialAssignment: Scalars['Boolean']['output'];
  currentValue?: Maybe<Scalars['String']['output']>;
  previousValue?: Maybe<Scalars['String']['output']>;
};

export type GridAreaDto = {
  __typename: 'GridAreaDto';
  includedInCalculation: Scalars['Boolean']['output'];
  id: Scalars['UUID']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceAreaCode: PriceAreaCode;
  type: GridAreaType;
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
  toBeDiscontinued: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  status: GridAreaStatus;
};


export type GridAreaDtoIncludedInCalculationArgs = {
  environment?: InputMaybe<Scalars['String']['input']>;
};

export type GridAreaOverviewItemDto = {
  __typename: 'GridAreaOverviewItemDto';
  actor: Scalars['String']['output'];
  auditLog: Array<GridAreaAuditedChangeAuditLogDto>;
  id: Scalars['UUID']['output'];
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priceAreaCode: PriceAreaCode;
  validFrom: Scalars['DateTime']['output'];
  validTo?: Maybe<Scalars['DateTime']['output']>;
  actorNumber?: Maybe<Scalars['String']['output']>;
  actorName?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  fullFlexDate?: Maybe<Scalars['DateTime']['output']>;
  type: GridAreaType;
  toBeDiscontinued: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  status: GridAreaStatus;
};

/** A connection to a list of items. */
export type GridAreaOverviewItemsConnection = {
  __typename: 'GridAreaOverviewItemsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<GridAreaOverviewItemsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<GridAreaOverviewItemDto>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type GridAreaOverviewItemsEdge = {
  __typename: 'GridAreaOverviewItemsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GridAreaOverviewItemDto;
};

/** Imbalance price */
export type ImbalancePrice = {
  __typename: 'ImbalancePrice';
  priceAreaCode: PriceAreaCode;
  timestamp: Scalars['DateTime']['output'];
  price?: Maybe<Scalars['Float']['output']>;
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

export type InitiateMoveInPayload = {
  __typename: 'InitiateMoveInPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
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

export type KeyValuePairOfStringAndListOfSettlementReportApplicableCalculation = {
  __typename: 'KeyValuePairOfStringAndListOfSettlementReportApplicableCalculation';
  key: Scalars['String']['output'];
  value: Array<RequestSettlementReportGridAreaCalculation>;
};

export type ManuallyHandleOutgoingMessagePayload = {
  __typename: 'ManuallyHandleOutgoingMessagePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type ManuallyHandledExchangeEventMetaData = {
  __typename: 'ManuallyHandledExchangeEventMetaData';
  manuallyHandledByIdentityDisplayName: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  manuallyHandledAt: Scalars['DateTime']['output'];
  manuallyHandledBy: Scalars['UUID']['output'];
};

export type MarkConversationReadPayload = {
  __typename: 'MarkConversationReadPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type MarkConversationUnReadPayload = {
  __typename: 'MarkConversationUnReadPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type MarketParticipant = {
  __typename: 'MarketParticipant';
  gridAreas: Array<GridAreaDto>;
  userRoles: Array<MarketParticipantUserRole>;
  organization: Organization;
  balanceResponsibleAgreements?: Maybe<Array<BalanceResponsibilityAgreement>>;
  credentials: ActorCredentialsDto;
  auditLogs: Array<ActorAuditedChangeAuditLogDto>;
  delegations: Array<MessageDelegationType>;
  displayName: Scalars['String']['output'];
  additionalRecipientForMeasurements: Array<Scalars['String']['output']>;
  publicMail?: Maybe<MarketParticipantPublicMail>;
  contact?: Maybe<ActorContactDto>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  status: MarketParticipantStatus;
  glnOrEicNumber: Scalars['String']['output'];
  marketRole: EicFunction;
};


export type MarketParticipantUserRolesArgs = {
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

export type MarketParticipantConsolidationAuditLog = {
  __typename: 'MarketParticipantConsolidationAuditLog';
  currentOwner: Scalars['String']['output'];
  currentOwnerGln: Scalars['String']['output'];
  previousOwner?: Maybe<Scalars['String']['output']>;
  previousOwnerGln: Scalars['String']['output'];
  previousOwnerStopsAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MarketParticipantDelegationAuditLog = {
  __typename: 'MarketParticipantDelegationAuditLog';
  marketParticipantName: Scalars['String']['output'];
  gln: Scalars['String']['output'];
  startsAt: Scalars['String']['output'];
  stopsAt?: Maybe<Scalars['String']['output']>;
  gridAreaName: Scalars['String']['output'];
  processType: Scalars['String']['output'];
};

export type MarketParticipantNameWithId = {
  __typename: 'MarketParticipantNameWithId';
  id: Scalars['UUID']['output'];
  actorName: ActorNameDto;
};

export type MarketParticipantPublicMail = {
  __typename: 'MarketParticipantPublicMail';
  mail: Scalars['String']['output'];
};

export type MarketParticipantUserRole = {
  __typename: 'MarketParticipantUserRole';
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  status: UserRoleStatus;
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  assigned: Scalars['Boolean']['output'];
};

export type MeasurementAggregationByDateDto = {
  __typename: 'MeasurementAggregationByDateDto';
  date?: Maybe<Scalars['Date']['output']>;
  quantity?: Maybe<Scalars['Decimal']['output']>;
  qualities: Array<Quality>;
  unit: Unit;
};

export type MeasurementAggregationByMonthDto = {
  __typename: 'MeasurementAggregationByMonthDto';
  yearMonth: Scalars['YearMonth']['output'];
  quantity?: Maybe<Scalars['Decimal']['output']>;
  qualities: Array<Quality>;
  unit: Unit;
};

export type MeasurementAggregationByYearDto = {
  __typename: 'MeasurementAggregationByYearDto';
  year: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Decimal']['output']>;
  qualities: Array<Quality>;
  unit: Unit;
};

export type MeasurementDto = {
  __typename: 'MeasurementDto';
  measurementPositions: Array<MeasurementPositionDto>;
};

export type MeasurementPointDto = {
  __typename: 'MeasurementPointDto';
  order: Scalars['Int']['output'];
  quantity?: Maybe<Scalars['Decimal']['output']>;
  quality: Quality;
  unit: Unit;
  resolution: Resolution;
  persistedTime: Scalars['DateTime']['output'];
  registrationTime: Scalars['DateTime']['output'];
};

export type MeasurementPositionDto = {
  __typename: 'MeasurementPositionDto';
  current?: Maybe<MeasurementPointDto>;
  hasQuantityOrQualityChanged: Scalars['Boolean']['output'];
  resolution: Resolution;
  historic: Array<MeasurementPointDto>;
  index: Scalars['Int']['output'];
  observationTime: Scalars['DateTime']['output'];
  measurementPoints: Array<MeasurementPointDto>;
};

export type MeasurementsReport = {
  __typename: 'MeasurementsReport';
  period: Scalars['DateRange']['output'];
  statusType: MeasurementsReportStatusType;
  measurementsReportDownloadUrl?: Maybe<Scalars['String']['output']>;
  actor?: Maybe<MarketParticipant>;
  id: Scalars['String']['output'];
  requestedByActorId: Scalars['UUID']['output'];
  gridAreaCodes: Array<Scalars['String']['output']>;
  createdDateTime: Scalars['DateTime']['output'];
  meteringPointTypes: Array<MeasurementsReportMeteringPointType>;
  meteringPointIds?: Maybe<Array<Scalars['String']['output']>>;
};

export type MergeMarketParticipantsPayload = {
  __typename: 'MergeMarketParticipantsPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<MergeMarketParticipantsError>>;
};

export type MessageDelegationType = {
  __typename: 'MessageDelegationType';
  gridArea?: Maybe<GridAreaDto>;
  delegatedBy?: Maybe<MarketParticipant>;
  delegatedTo?: Maybe<MarketParticipant>;
  periodId: Scalars['UUID']['output'];
  id: Scalars['UUID']['output'];
  process: DelegatedProcess;
  validPeriod: Scalars['DateRange']['output'];
  status: MarketParticipantDelegationStatus;
};

/** A segment of a collection. */
export type MeteringGridAreaImbalanceCollectionSegment = {
  __typename: 'MeteringGridAreaImbalanceCollectionSegment';
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  /** A flattened list of the items. */
  items?: Maybe<Array<MeteringGridAreaImbalanceSearchResult>>;
  totalCount: Scalars['Int']['output'];
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
  gridArea?: Maybe<GridAreaDto>;
  mgaImbalanceDocumentUrl?: Maybe<Scalars['String']['output']>;
  period: Scalars['DateRange']['output'];
  id: Scalars['String']['output'];
  documentDateTime: Scalars['DateTime']['output'];
  receivedDateTime: Scalars['DateTime']['output'];
  incomingImbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
  outgoingImbalancePerDay: Array<MeteringGridAreaImbalancePerDayDto>;
};

export type MeteringPointIdentificationDto = {
  __typename: 'MeteringPointIdentificationDto';
  identification: Scalars['String']['output'];
};

export type MeteringPointProcess = {
  __typename: 'MeteringPointProcess';
  initiator?: Maybe<MarketParticipant>;
  steps: Array<MeteringPointProcessStep>;
  availableActions?: Maybe<Array<WorkflowAction>>;
  id: Scalars['String']['output'];
  reasonCode: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  cutoffDate?: Maybe<Scalars['DateTime']['output']>;
  state: ProcessState;
};

export type MeteringPointProcessStep = {
  __typename: 'MeteringPointProcessStep';
  actor?: Maybe<MarketParticipant>;
  /**
   * Generates the URL for fetching the master data document content.
   * The MessageId on the step contains the ArchivedMessageId (GUID) from ProcessManager.
   */
  documentUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  step: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  state: ProcessState;
  messageId?: Maybe<Scalars['String']['output']>;
};

export type MeteringPointsGroupByPackageNumber = {
  __typename: 'MeteringPointsGroupByPackageNumber';
  packageNumber: Scalars['String']['output'];
  meteringPoints: Array<MeteringPointIdentificationDto>;
};

export type MissingMeasurementsLogCalculation = Calculation & OrchestrationInstance & {
  __typename: 'MissingMeasurementsLogCalculation';
  executionType: CalculationExecutionType;
  calculationType: CalculationTypeQueryParameterV1;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type Mutation = {
  __typename: 'Mutation';
  startConversation: StartConversationPayload;
  sendActorConversationMessage: SendActorConversationMessagePayload;
  updateInternalConversationNote: UpdateInternalConversationNotePayload;
  markConversationRead: MarkConversationReadPayload;
  markConversationUnRead: MarkConversationUnReadPayload;
  closeConversation: CloseConversationPayload;
  createCharge: CreateChargePayload;
  updateCharge: UpdateChargePayload;
  stopCharge: StopChargePayload;
  addChargeSeries: AddChargeSeriesPayload;
  stopChargeLink: StopChargeLinkPayload;
  editChargeLink: EditChargeLinkPayload;
  createChargeLink: CreateChargeLinkPayload;
  cancelChargeLink: CancelChargeLinkPayload;
  sendMeasurements: Scalars['Boolean']['output'];
  simulateMeteringPointManualCorrection: SimulateMeteringPointManualCorrectionPayload;
  executeMeteringPointManualCorrection: ExecuteMeteringPointManualCorrectionPayload;
  requestConnectionStateChange: RequestConnectionStateChangePayload;
  requestEndOfSupply: RequestEndOfSupplyPayload;
  resendWaitingEsettExchangeMessages: ResendWaitingEsettExchangeMessagesPayload;
  manuallyHandleOutgoingMessage: ManuallyHandleOutgoingMessagePayload;
  addTokenToDownloadUrl: AddTokenToDownloadUrlPayload;
  updateMarketParticipant: UpdateMarketParticipantPayload;
  createMarketParticipant: CreateMarketParticipantPayload;
  createDelegationsForMarketParticipant: CreateDelegationsForMarketParticipantPayload;
  stopDelegation: StopDelegationPayload;
  requestClientSecretCredentials: RequestClientSecretCredentialsPayload;
  addMeteringPointsToAdditionalRecipient: AddMeteringPointsToAdditionalRecipientPayload;
  removeMeteringPointsFromAdditionalRecipient: RemoveMeteringPointsFromAdditionalRecipientPayload;
  mergeMarketParticipants: MergeMarketParticipantsPayload;
  updateOrganization: UpdateOrganizationPayload;
  updatePermission: UpdatePermissionPayload;
  updateUserProfile: UpdateUserProfilePayload;
  updateUserIdentity: UpdateUserIdentityPayload;
  inviteUser: InviteUserPayload;
  reInviteUser: ReInviteUserPayload;
  resetTwoFactorAuthentication: ResetTwoFactorAuthenticationPayload;
  deactivateUser: DeactivateUserPayload;
  reActivateUser: ReActivateUserPayload;
  initiateMitIdSignup: InitiateMitIdSignupPayload;
  resetMitId: ResetMitIdPayload;
  updateUserRoleAssignment: UpdateUserRoleAssignmentPayload;
  updateUserRole: UpdateUserRolePayload;
  createUserRole: CreateUserRolePayload;
  deactivateUserRole: DeactivateUserRolePayload;
  requestMeasurementsReport: RequestMeasurementsReportPayload;
  cancelMeasurementsReport: CancelMeasurementsReportPayload;
  dismissNotification: DismissNotificationPayload;
  dismissAllNotifications: DismissAllNotificationsPayload;
  createCalculation: CreateCalculationPayload;
  cancelScheduledCalculation: CancelScheduledCalculationPayload;
  initiateMoveIn: InitiateMoveInPayload;
  changeCustomerCharacteristics: ChangeCustomerCharacteristicsPayload;
  requestMissingMeasurementsLog: RequestMissingMeasurementsLogPayload;
  request: RequestPayload;
  requestSettlementReport: RequestSettlementReportPayload;
  cancelSettlementReport: CancelSettlementReportPayload;
};


export type MutationStartConversationArgs = {
  startConversationInput: StartConversationInput;
};


export type MutationSendActorConversationMessageArgs = {
  sendActorConversationMessageInput: SendActorConversationMessageInput;
};


export type MutationUpdateInternalConversationNoteArgs = {
  updateInternalConversationNoteInput: UpdateInternalConversationNoteInput;
};


export type MutationMarkConversationReadArgs = {
  input: MarkConversationReadInput;
};


export type MutationMarkConversationUnReadArgs = {
  input: MarkConversationUnReadInput;
};


export type MutationCloseConversationArgs = {
  input: CloseConversationInput;
};


export type MutationCreateChargeArgs = {
  input: CreateChargeInput;
};


export type MutationUpdateChargeArgs = {
  input: UpdateChargeInput;
};


export type MutationStopChargeArgs = {
  input: StopChargeInput;
};


export type MutationAddChargeSeriesArgs = {
  input: AddChargeSeriesInput;
};


export type MutationStopChargeLinkArgs = {
  input: StopChargeLinkInput;
};


export type MutationEditChargeLinkArgs = {
  input: EditChargeLinkInput;
};


export type MutationCreateChargeLinkArgs = {
  input: CreateChargeLinkInput;
};


export type MutationCancelChargeLinkArgs = {
  input: CancelChargeLinkInput;
};


export type MutationSendMeasurementsArgs = {
  input: SendMeasurementsRequestV2Input;
};


export type MutationSimulateMeteringPointManualCorrectionArgs = {
  input: SimulateMeteringPointManualCorrectionInput;
};


export type MutationExecuteMeteringPointManualCorrectionArgs = {
  input: ExecuteMeteringPointManualCorrectionInput;
};


export type MutationRequestConnectionStateChangeArgs = {
  input: RequestConnectionStateChangeInput;
};


export type MutationRequestEndOfSupplyArgs = {
  input: RequestEndOfSupplyInput;
};


export type MutationManuallyHandleOutgoingMessageArgs = {
  input: ManuallyHandleOutgoingMessageInput;
};


export type MutationAddTokenToDownloadUrlArgs = {
  input: AddTokenToDownloadUrlInput;
};


export type MutationUpdateMarketParticipantArgs = {
  input: UpdateMarketParticipantInput;
};


export type MutationCreateMarketParticipantArgs = {
  input: CreateMarketParticipantInput;
};


export type MutationCreateDelegationsForMarketParticipantArgs = {
  input: CreateDelegationsForMarketParticipantInput;
};


export type MutationStopDelegationArgs = {
  input: StopDelegationInput;
};


export type MutationRequestClientSecretCredentialsArgs = {
  input: RequestClientSecretCredentialsInput;
};


export type MutationAddMeteringPointsToAdditionalRecipientArgs = {
  input: AddMeteringPointsToAdditionalRecipientInput;
};


export type MutationRemoveMeteringPointsFromAdditionalRecipientArgs = {
  input: RemoveMeteringPointsFromAdditionalRecipientInput;
};


export type MutationMergeMarketParticipantsArgs = {
  input: MergeMarketParticipantsInput;
};


export type MutationUpdateOrganizationArgs = {
  input: UpdateOrganizationInput;
};


export type MutationUpdatePermissionArgs = {
  input: UpdatePermissionInput;
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


export type MutationResetMitIdArgs = {
  input: ResetMitIdInput;
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


export type MutationRequestMeasurementsReportArgs = {
  requestMeasurementsReportInput: RequestMeasurementsReportInput;
};


export type MutationCancelMeasurementsReportArgs = {
  input: CancelMeasurementsReportInput;
};


export type MutationDismissNotificationArgs = {
  input: DismissNotificationInput;
};


export type MutationDismissAllNotificationsArgs = {
  input: DismissAllNotificationsInput;
};


export type MutationCreateCalculationArgs = {
  input: CreateCalculationInput;
};


export type MutationCancelScheduledCalculationArgs = {
  input: CancelScheduledCalculationInput;
};


export type MutationInitiateMoveInArgs = {
  input: InitiateMoveInInput;
};


export type MutationChangeCustomerCharacteristicsArgs = {
  input: ChangeCustomerCharacteristicsInput;
};


export type MutationRequestMissingMeasurementsLogArgs = {
  input: RequestMissingMeasurementsLogInput;
};


export type MutationRequestArgs = {
  input: RequestInput;
};


export type MutationRequestSettlementReportArgs = {
  input: RequestSettlementReportInput;
};


export type MutationCancelSettlementReportArgs = {
  input: CancelSettlementReportInput;
};

export type NetConsumptionCalculation = Calculation & OrchestrationInstance & {
  __typename: 'NetConsumptionCalculation';
  executionType: CalculationExecutionType;
  calculationType: CalculationTypeQueryParameterV1;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type NotificationDto = {
  __typename: 'NotificationDto';
  notificationType: NotificationType;
  id: Scalars['Int']['output'];
  occurredAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  relatedToId?: Maybe<Scalars['String']['output']>;
};

export type OptionOfMeteringPointType = {
  __typename: 'OptionOfMeteringPointType';
  value: MeteringPointType;
  displayValue: Scalars['String']['output'];
};

export type OptionOfRequestCalculationType = {
  __typename: 'OptionOfRequestCalculationType';
  value: RequestCalculationType;
  displayValue: Scalars['String']['output'];
};

export type OrchestrationInstanceStep = {
  __typename: 'OrchestrationInstanceStep';
  state: ProcessStepState;
  isCurrent: Scalars['Boolean']['output'];
};

export type Organization = {
  __typename: 'Organization';
  auditLogs: Array<OrganizationAuditedChangeAuditLogDto>;
  marketParticipants?: Maybe<Array<MarketParticipant>>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  businessRegisterIdentifier: Scalars['String']['output'];
  domains: Array<Scalars['String']['output']>;
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

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename: 'PageInfo';
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type PaginatedMarketParticipantsConnection = {
  __typename: 'PaginatedMarketParticipantsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<PaginatedMarketParticipantsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<MarketParticipant>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type PaginatedMarketParticipantsEdge = {
  __typename: 'PaginatedMarketParticipantsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: MarketParticipant;
};

/** A connection to a list of items. */
export type PaginatedOrganizationsConnection = {
  __typename: 'PaginatedOrganizationsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<PaginatedOrganizationsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Organization>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type PaginatedOrganizationsEdge = {
  __typename: 'PaginatedOrganizationsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Organization;
};

export type Permission = {
  __typename: 'Permission';
  userRoles: Array<UserRoleDto>;
  auditLogs: Array<PermissionAuditedChangeAuditLogDto>;
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

/** A connection to a list of items. */
export type ProcessesConnection = {
  __typename: 'ProcessesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<ProcessesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<OrchestrationInstance>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ProcessesEdge = {
  __typename: 'ProcessesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: OrchestrationInstance;
};

export type Query = {
  __typename: 'Query';
  conversation: Conversation;
  conversationsForMeteringPoint: Conversations;
  charges?: Maybe<ChargesConnection>;
  chargeById?: Maybe<Charge>;
  chargesByType: Array<Charge>;
  chargeLinksByMeteringPointId: Array<ChargeLink>;
  chargeLinkById?: Maybe<ChargeLink>;
  aggregatedMeasurementsForMonth: Array<MeasurementAggregationByDateDto>;
  aggregatedMeasurementsForYear: Array<MeasurementAggregationByMonthDto>;
  aggregatedMeasurementsForAllYears: Array<MeasurementAggregationByYearDto>;
  measurements: MeasurementDto;
  measurementPoints: Array<MeasurementPointDto>;
  failedSendMeasurementsInstances?: Maybe<FailedSendMeasurementsInstancesConnection>;
  debugView: Scalars['String']['output'];
  meteringPointsByGridAreaCode: Array<MeteringPointsGroupByPackageNumber>;
  eventsDebugView?: Maybe<GetMeteringPointDebugResultDtoV1>;
  meteringPointForManualCorrection: Scalars['String']['output'];
  meteringPointContactCpr: CprResponse;
  meteringPointExists: ElectricityMarketViewMeteringPointDto;
  relatedMeteringPoints: RelatedMeteringPointsDto;
  meteringPoint: ElectricityMarketViewMeteringPointDto;
  selectableDatesForEndOfSupply: Array<Scalars['DateTime']['output']>;
  balanceResponsible?: Maybe<BalanceResponsibleCollectionSegment>;
  balanceResponsibleById: BalanceResponsible;
  esettServiceStatus: Array<ReadinessStatusDto>;
  esettExchangeStatusReport: ExchangeEventStatusReportResponse;
  esettExchangeEvents?: Maybe<EsettExchangeEventsCollectionSegment>;
  downloadEsettExchangeEvents: Scalars['String']['output'];
  esettOutgoingMessageById: EsettOutgoingMessage;
  meteringGridAreaImbalance?: Maybe<MeteringGridAreaImbalanceCollectionSegment>;
  meteringGridAreaImbalanceById?: Maybe<MeteringGridAreaImbalanceSearchResult>;
  downloadMeteringGridAreaImbalance: Scalars['String']['output'];
  imbalancePricesOverview: ImbalancePricesOverview;
  imbalancePricesForMonth: Array<ImbalancePriceDaily>;
  gridAreas: Array<GridAreaDto>;
  relevantGridAreas: Array<GridAreaDto>;
  gridAreaOverviewItemById: GridAreaOverviewItemDto;
  gridAreaOverviewItems?: Maybe<GridAreaOverviewItemsConnection>;
  selectedMarketParticipant: MarketParticipant;
  marketParticipantById: MarketParticipant;
  marketParticipants: Array<MarketParticipant>;
  paginatedMarketParticipants?: Maybe<PaginatedMarketParticipantsConnection>;
  marketParticipantsByOrganizationId: Array<MarketParticipant>;
  marketParticipantsForEicFunction: Array<MarketParticipant>;
  associatedMarketParticipants: AssociatedMarketParticipants;
  filteredMarketParticipants: Array<MarketParticipant>;
  selectionMarketParticipants: Array<SelectionActorDto>;
  organizationById: Organization;
  organizations: Array<Organization>;
  paginatedOrganizations?: Maybe<PaginatedOrganizationsConnection>;
  searchOrganizationInCVR: CvrOrganizationResult;
  permissionById: Permission;
  filteredPermissions?: Maybe<FilteredPermissionsConnection>;
  permissionsByEicFunction: Array<PermissionDetailsDto>;
  domainExists: Scalars['Boolean']['output'];
  emailExists: Scalars['Boolean']['output'];
  userById: User;
  users?: Maybe<UsersCollectionSegment>;
  userProfile: UserProfile;
  userRolesByActorId: Array<UserRoleDto>;
  userRolesByEicFunction: Array<UserRoleDto>;
  filteredUserRoles?: Maybe<FilteredUserRolesConnection>;
  userRoles: Array<UserRoleDto>;
  userRoleById: UserRoleWithPermissions;
  measurementsReports: Array<MeasurementsReport>;
  archivedMessagesForMeteringPoint?: Maybe<ArchivedMessagesForMeteringPointConnection>;
  archivedMessages?: Maybe<ArchivedMessagesConnection>;
  meteringPointProcessOverview: Array<MeteringPointProcess>;
  meteringPointProcessById?: Maybe<MeteringPointProcess>;
  notifications: Array<NotificationDto>;
  calculationById?: Maybe<Calculation>;
  calculations?: Maybe<CalculationsConnection>;
  latestCalculation?: Maybe<Calculation>;
  processes?: Maybe<ProcessesConnection>;
  processById: OrchestrationInstance;
  requests?: Maybe<RequestsConnection>;
  requestOptions: RequestOptions;
  releaseToggles: Array<Scalars['String']['output']>;
  settlementReportById?: Maybe<SettlementReport>;
  settlementReports: Array<SettlementReport>;
  settlementReportGridAreaCalculationsForPeriod: Array<KeyValuePairOfStringAndListOfSettlementReportApplicableCalculation>;
};


export type QueryConversationArgs = {
  conversationId: Scalars['UUID']['input'];
  meteringPointIdentification: Scalars['String']['input'];
};


export type QueryConversationsForMeteringPointArgs = {
  meteringPointIdentification: Scalars['String']['input'];
};


export type QueryChargesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<ChargesQueryInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<ChargeSortInput>>;
};


export type QueryChargeByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryChargesByTypeArgs = {
  type: ChargeType;
};


export type QueryChargeLinksByMeteringPointIdArgs = {
  meteringPointId: Scalars['String']['input'];
  order?: InputMaybe<Array<ChargeLinkDtoSortInput>>;
};


export type QueryChargeLinkByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAggregatedMeasurementsForMonthArgs = {
  showOnlyChangedValues: Scalars['Boolean']['input'];
  query: GetMonthlyAggregateByDateQueryInput;
};


export type QueryAggregatedMeasurementsForYearArgs = {
  query: GetYearlyAggregateByMonthQueryInput;
};


export type QueryAggregatedMeasurementsForAllYearsArgs = {
  query: GetAggregateByYearQueryInput;
};


export type QueryMeasurementsArgs = {
  showOnlyChangedValues: Scalars['Boolean']['input'];
  showHistoricalValues: Scalars['Boolean']['input'];
  query: GetByDayQueryInput;
};


export type QueryMeasurementPointsArgs = {
  observationTime: Scalars['DateTime']['input'];
  query: GetByDayQueryInput;
};


export type QueryFailedSendMeasurementsInstancesArgs = {
  created: Scalars['DateRange']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<SendMeasurementsInstanceDtoSortInput>>;
};


export type QueryDebugViewArgs = {
  meteringPointId: Scalars['String']['input'];
};


export type QueryMeteringPointsByGridAreaCodeArgs = {
  gridAreaCode: Scalars['String']['input'];
};


export type QueryEventsDebugViewArgs = {
  meteringPointId: Scalars['String']['input'];
};


export type QueryMeteringPointForManualCorrectionArgs = {
  meteringPointId: Scalars['String']['input'];
};


export type QueryMeteringPointContactCprArgs = {
  meteringPointId: Scalars['String']['input'];
  contactId: Scalars['Long']['input'];
};


export type QueryMeteringPointExistsArgs = {
  searchMigratedMeteringPoints: Scalars['Boolean']['input'];
  internalMeteringPointId?: InputMaybe<Scalars['String']['input']>;
  meteringPointId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRelatedMeteringPointsArgs = {
  meteringPointId: Scalars['String']['input'];
  searchMigratedMeteringPoints?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryMeteringPointArgs = {
  meteringPointId: Scalars['String']['input'];
  searchMigratedMeteringPoints?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryBalanceResponsibleArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<BalanceResponsibleSortInput>;
};


export type QueryBalanceResponsibleByIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryEsettExchangeEventsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatuses?: InputMaybe<Array<DocumentStatus>>;
  timeSeriesType?: InputMaybe<EsettTimeSeriesType>;
  filter?: InputMaybe<Scalars['String']['input']>;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<EsettExchangeEventSortInput>;
};


export type QueryDownloadEsettExchangeEventsArgs = {
  locale: Scalars['String']['input'];
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatuses?: InputMaybe<Array<DocumentStatus>>;
  timeSeriesType?: InputMaybe<EsettTimeSeriesType>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<EsettExchangeEventSortInput>;
};


export type QueryEsettOutgoingMessageByIdArgs = {
  documentId: Scalars['String']['input'];
};


export type QueryMeteringGridAreaImbalanceArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  created?: InputMaybe<Scalars['DateRange']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  filter?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<MeteringGridAreaImbalanceSortInput>;
};


export type QueryMeteringGridAreaImbalanceByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryDownloadMeteringGridAreaImbalanceArgs = {
  locale: Scalars['String']['input'];
  created?: InputMaybe<Scalars['DateRange']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  order?: InputMaybe<MeteringGridAreaImbalanceSortInput>;
};


export type QueryImbalancePricesForMonthArgs = {
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
};


export type QueryRelevantGridAreasArgs = {
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  period: PeriodInput;
};


export type QueryGridAreaOverviewItemByIdArgs = {
  gridAreaId: Scalars['UUID']['input'];
};


export type QueryGridAreaOverviewItemsArgs = {
  type?: InputMaybe<GridAreaType>;
  statuses?: InputMaybe<Array<GridAreaStatus>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<GridAreaSortInput>>;
};


export type QueryMarketParticipantByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryPaginatedMarketParticipantsArgs = {
  statuses?: InputMaybe<Array<MarketParticipantStatus>>;
  eicFunctions?: InputMaybe<Array<EicFunction>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<MarketParticipantSortInput>>;
};


export type QueryMarketParticipantsByOrganizationIdArgs = {
  organizationId: Scalars['UUID']['input'];
};


export type QueryMarketParticipantsForEicFunctionArgs = {
  eicFunctions?: InputMaybe<Array<EicFunction>>;
};


export type QueryAssociatedMarketParticipantsArgs = {
  email: Scalars['String']['input'];
};


export type QueryOrganizationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryPaginatedOrganizationsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<OrganizationSortInput>>;
};


export type QuerySearchOrganizationInCvrArgs = {
  cvr: Scalars['String']['input'];
};


export type QueryPermissionByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFilteredPermissionsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<PermissionDtoSortInput>>;
};


export type QueryPermissionsByEicFunctionArgs = {
  eicFunction: EicFunction;
};


export type QueryDomainExistsArgs = {
  email: Scalars['String']['input'];
};


export type QueryEmailExistsArgs = {
  email: Scalars['String']['input'];
};


export type QueryUserByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUsersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  userRoleIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  userStatus?: InputMaybe<Array<UserStatus>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<UsersSortInput>;
};


export type QueryUserRolesByActorIdArgs = {
  actorId: Scalars['UUID']['input'];
};


export type QueryUserRolesByEicFunctionArgs = {
  eicFunction: EicFunction;
};


export type QueryFilteredUserRolesArgs = {
  status?: InputMaybe<UserRoleStatus>;
  eicFunctions?: InputMaybe<Array<EicFunction>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<UserRoleSortInput>>;
};


export type QueryUserRolesArgs = {
  actorId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryUserRoleByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryArchivedMessagesForMeteringPointArgs = {
  created: Scalars['DateRange']['input'];
  meteringPointId: Scalars['String']['input'];
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  receiverId?: InputMaybe<Scalars['UUID']['input']>;
  documentType?: InputMaybe<MeteringPointDocumentType>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<ArchivedMessageSortInput>;
};


export type QueryArchivedMessagesArgs = {
  created: Scalars['DateRange']['input'];
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  receiverId?: InputMaybe<Scalars['UUID']['input']>;
  documentTypes?: InputMaybe<Array<ArchivedMessageDocumentType>>;
  businessReasons?: InputMaybe<Array<BusinessReason>>;
  includeRelated?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<ArchivedMessageSortInput>;
};


export type QueryMeteringPointProcessOverviewArgs = {
  meteringPointId: Scalars['String']['input'];
  created: Scalars['DateRange']['input'];
};


export type QueryMeteringPointProcessByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCalculationByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCalculationsArgs = {
  input: CalculationsQueryInput;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<CalculationSortInput>>;
};


export type QueryLatestCalculationArgs = {
  calculationType: StartCalculationType;
  period: PeriodInput;
};


export type QueryProcessesArgs = {
  input: CalculationsQueryInput;
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<ProcessSortInput>>;
};


export type QueryProcessByIdArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<RequestSortInput>>;
};


export type QuerySettlementReportByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySettlementReportGridAreaCalculationsForPeriodArgs = {
  calculationType: CalculationType;
  gridAreaId: Array<Scalars['String']['input']>;
  calculationPeriod: Scalars['DateRange']['input'];
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

/** Represents a metering point's data */
export type RelatedMeteringPointDto = {
  __typename: 'RelatedMeteringPointDto';
  /**
   * A representation of the metering point GSRN id, without containing the actual GSRN number. Is used to
   * show in the URL, to avoid saving the real metering point id in the browser history.
   */
  id: Scalars['String']['output'];
  /** The metering point GSRN id, e.g. 57XXXXXXXXXXXXXXXX. */
  meteringPointIdentification: Scalars['String']['output'];
  type: ElectricityMarketViewMeteringPointType;
  connectionState: ElectricityMarketViewConnectionState;
  createdDate?: Maybe<Scalars['DateTime']['output']>;
  connectionDate?: Maybe<Scalars['DateTime']['output']>;
  closedDownDate?: Maybe<Scalars['DateTime']['output']>;
  disconnectionDate?: Maybe<Scalars['DateTime']['output']>;
};

export type RelatedMeteringPointsDto = {
  __typename: 'RelatedMeteringPointsDto';
  current: RelatedMeteringPointDto;
  parent?: Maybe<RelatedMeteringPointDto>;
  relatedMeteringPoints: Array<RelatedMeteringPointDto>;
  relatedByGsrn: Array<RelatedMeteringPointDto>;
  historicalMeteringPoints: Array<RelatedMeteringPointDto>;
};

export type RemoveMeteringPointsFromAdditionalRecipientPayload = {
  __typename: 'RemoveMeteringPointsFromAdditionalRecipientPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<RemoveMeteringPointsFromAdditionalRecipientError>>;
};

export type RequestCalculatedEnergyTimeSeriesResult = ActorRequestQueryResult & OrchestrationInstance & {
  __typename: 'RequestCalculatedEnergyTimeSeriesResult';
  meteringPointType?: Maybe<MeteringPointType>;
  messageId?: Maybe<Scalars['String']['output']>;
  calculationType?: Maybe<RequestCalculationType>;
  period?: Maybe<Scalars['DateRange']['output']>;
  requestedBy?: Maybe<MarketParticipant>;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type RequestCalculatedWholesaleServicesResult = ActorRequestQueryResult & OrchestrationInstance & {
  __typename: 'RequestCalculatedWholesaleServicesResult';
  priceType?: Maybe<PriceType>;
  messageId?: Maybe<Scalars['String']['output']>;
  calculationType?: Maybe<RequestCalculationType>;
  period?: Maybe<Scalars['DateRange']['output']>;
  requestedBy?: Maybe<MarketParticipant>;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type RequestClientSecretCredentialsPayload = {
  __typename: 'RequestClientSecretCredentialsPayload';
  actorClientSecretDto?: Maybe<ActorClientSecretDto>;
  errors?: Maybe<Array<RequestClientSecretCredentialsError>>;
};

export type RequestConnectionStateChangePayload = {
  __typename: 'RequestConnectionStateChangePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RequestEndOfSupplyPayload = {
  __typename: 'RequestEndOfSupplyPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RequestMeasurementsReportPayload = {
  __typename: 'RequestMeasurementsReportPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RequestMissingMeasurementsLogPayload = {
  __typename: 'RequestMissingMeasurementsLogPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RequestOptions = {
  __typename: 'RequestOptions';
  calculationTypes: Array<OptionOfRequestCalculationType>;
  meteringPointTypes: Array<OptionOfMeteringPointType>;
  isGridAreaRequired: Scalars['Boolean']['output'];
};

export type RequestPayload = {
  __typename: 'RequestPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RequestSettlementReportGridAreaCalculation = {
  __typename: 'RequestSettlementReportGridAreaCalculation';
  calculationId: Scalars['UUID']['output'];
  calculationDate: Scalars['DateTime']['output'];
  gridAreaWithName?: Maybe<GridAreaDto>;
};

export type RequestSettlementReportPayload = {
  __typename: 'RequestSettlementReportPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

/** A connection to a list of items. */
export type RequestsConnection = {
  __typename: 'RequestsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<RequestsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<ActorRequestQueryResult>>;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type RequestsEdge = {
  __typename: 'RequestsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ActorRequestQueryResult;
};

export type ResendWaitingEsettExchangeMessagesPayload = {
  __typename: 'ResendWaitingEsettExchangeMessagesPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type ResetMitIdPayload = {
  __typename: 'ResetMitIdPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<ResetMitIdError>>;
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

export type SendActorConversationMessagePayload = {
  __typename: 'SendActorConversationMessagePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type SendMeasurementsInstanceDto = {
  __typename: 'SendMeasurementsInstanceDto';
  id: Scalars['UUID']['output'];
  idempotencyKeyHash: Scalars['String']['output'];
  transactionId: Scalars['String']['output'];
  meteringPointId?: Maybe<Scalars['String']['output']>;
  masterData?: Maybe<Scalars['String']['output']>;
  validationErrors?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  businessValidationSucceededAt?: Maybe<Scalars['DateTime']['output']>;
  sentToMeasurementsAt?: Maybe<Scalars['DateTime']['output']>;
  receivedFromMeasurementsAt?: Maybe<Scalars['DateTime']['output']>;
  sentToEnqueueActorMessagesAt?: Maybe<Scalars['DateTime']['output']>;
  receivedFromEnqueueActorMessagesAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  failedAt?: Maybe<Scalars['DateTime']['output']>;
  failedCount: Scalars['Int']['output'];
  errorText?: Maybe<Scalars['String']['output']>;
};

export type SettlementReport = {
  __typename: 'SettlementReport';
  period: Scalars['DateRange']['output'];
  statusType: SettlementReportStatusType;
  executionTime: Scalars['DateRange']['output'];
  gridAreas: Array<Scalars['String']['output']>;
  settlementReportDownloadUrl?: Maybe<Scalars['String']['output']>;
  combineResultInASingleFile: Scalars['Boolean']['output'];
  actor?: Maybe<MarketParticipant>;
  id: Scalars['String']['output'];
  requestedByActorId: Scalars['UUID']['output'];
  calculationType: CalculationType;
  numberOfGridAreasInReport: Scalars['Int']['output'];
  includesBasisData: Scalars['Boolean']['output'];
  progress: Scalars['Float']['output'];
  includeMonthlyAmount: Scalars['Boolean']['output'];
};

export type SimulateMeteringPointManualCorrectionPayload = {
  __typename: 'SimulateMeteringPointManualCorrectionPayload';
  string?: Maybe<Scalars['String']['output']>;
};

export type StartConversationPayload = {
  __typename: 'StartConversationPayload';
  string?: Maybe<Scalars['String']['output']>;
};

export type StopChargeLinkPayload = {
  __typename: 'StopChargeLinkPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type StopChargePayload = {
  __typename: 'StopChargePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type StopDelegationPayload = {
  __typename: 'StopDelegationPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<StopDelegationError>>;
};

export type Subscription = {
  __typename: 'Subscription';
  notificationAdded: NotificationDto;
  calculationUpdated: Calculation;
};

export type UpdateChargePayload = {
  __typename: 'UpdateChargePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateInternalConversationNotePayload = {
  __typename: 'UpdateInternalConversationNotePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateMarketParticipantPayload = {
  __typename: 'UpdateMarketParticipantPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateMarketParticipantError>>;
};

export type UpdateOrganizationPayload = {
  __typename: 'UpdateOrganizationPayload';
  organization?: Maybe<Organization>;
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
  auditLogs: Array<UserAuditedChangeAuditLogDto>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  status: UserStatus;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  administratedBy?: Maybe<MarketParticipant>;
  createdDate: Scalars['DateTime']['output'];
  latestLoginAt?: Maybe<Scalars['DateTime']['output']>;
  actors: Array<MarketParticipant>;
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

export type UserOverviewItemDto = {
  __typename: 'UserOverviewItemDto';
  name: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  status: UserStatus;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  createdDate: Scalars['DateTime']['output'];
  administratedBy?: Maybe<MarketParticipant>;
  administratedByName: Scalars['String']['output'];
  administratedByOrganizationName: Scalars['String']['output'];
  latestLoginAt?: Maybe<Scalars['DateTime']['output']>;
  actors: Array<MarketParticipant>;
};

export type UserProfile = {
  __typename: 'UserProfile';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  hasFederatedLogin: Scalars['Boolean']['output'];
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

export type UserRoleWithPermissions = {
  __typename: 'UserRoleWithPermissions';
  auditLogs: Array<UserRoleAuditedChangeAuditLogDto>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  eicFunction: EicFunction;
  status: UserRoleStatus;
  permissions: Array<PermissionDetailsDto>;
};

/** A segment of a collection. */
export type UsersCollectionSegment = {
  __typename: 'UsersCollectionSegment';
  /** Information to aid in pagination. */
  pageInfo: CollectionSegmentInfo;
  /** A flattened list of the items. */
  items?: Maybe<Array<UserOverviewItemDto>>;
  totalCount: Scalars['Int']['output'];
};

export type WholesaleAndEnergyCalculation = Calculation & OrchestrationInstance & {
  __typename: 'WholesaleAndEnergyCalculation';
  gridAreas: Array<GridAreaDto>;
  period: Scalars['DateRange']['output'];
  executionType: CalculationExecutionType;
  calculationType: CalculationTypeQueryParameterV1;
  id: Scalars['UUID']['output'];
  createdAt: Scalars['DateTime']['output'];
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  terminatedAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<AuditIdentityDto>;
  state: ProcessState;
  steps: Array<OrchestrationInstanceStep>;
};

export type AddMeteringPointsToAdditionalRecipientError = ApiError;

export type AddTokenToDownloadUrlError = ApiError;

export type CreateDelegationsForMarketParticipantError = ApiError;

export type CreateMarketParticipantError = ApiError;

export type CreateUserRoleError = ApiError;

export type DeactivateUserError = ApiError;

export type DeactivateUserRoleError = ApiError;

export type DismissAllNotificationsError = ApiError;

export type DismissNotificationError = ApiError;

export type InitiateMitIdSignupError = ApiError;

export type InviteUserError = ApiError;

export type MergeMarketParticipantsError = ApiError;

export type ReActivateUserError = ApiError;

export type ReInviteUserError = ApiError;

export type RemoveMeteringPointsFromAdditionalRecipientError = ApiError;

export type RequestClientSecretCredentialsError = ApiError;

export type ResetMitIdError = ApiError;

export type ResetTwoFactorAuthenticationError = ApiError;

export type StopDelegationError = ApiError;

export type UpdateMarketParticipantError = ApiError;

export type UpdateOrganizationError = ApiError;

export type UpdatePermissionError = ApiError;

export type UpdateUserIdentityError = ApiError;

export type UpdateUserProfileError = ApiError;

export type UpdateUserRoleAssignmentError = ApiError;

export type UpdateUserRoleError = ApiError;

export type ActorMarketRoleDtoSortInput = {
  eicFunction?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
};

export type ActorNameDtoInput = {
  value: Scalars['String']['input'];
};

export type ActorNumberDtoInput = {
  value: Scalars['String']['input'];
};

export type AddChargeSeriesInput = {
  id: Scalars['String']['input'];
  start: Scalars['DateTime']['input'];
  end: Scalars['DateTime']['input'];
  points: Array<ChargePointV2Input>;
};

export type AddMeteringPointsToAdditionalRecipientInput = {
  marketParticipantId: Scalars['UUID']['input'];
  meteringPointIds: Array<Scalars['String']['input']>;
};

export type AddTokenToDownloadUrlInput = {
  downloadUrl: Scalars['URL']['input'];
};

export type AddressDtoInput = {
  streetName?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
};

export type ArchivedMessageSortInput = {
  messageId?: InputMaybe<SortEnumType>;
  documentType?: InputMaybe<SortEnumType>;
  sender?: InputMaybe<SortEnumType>;
  receiver?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
};

export type BalanceResponsibleSortInput = {
  validFrom?: InputMaybe<SortDirection>;
  validTo?: InputMaybe<SortDirection>;
  receivedDate?: InputMaybe<SortDirection>;
};

export type CalculationSortInput = {
  calculationType?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  executionType?: InputMaybe<SortEnumType>;
  period?: InputMaybe<SortEnumType>;
  executionTime?: InputMaybe<SortEnumType>;
};

export type CalculationsQueryInput = {
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  state?: InputMaybe<ProcessState>;
  executionType?: InputMaybe<CalculationExecutionType>;
  calculationTypes?: InputMaybe<Array<CalculationTypeQueryParameterV1>>;
  period?: InputMaybe<Scalars['DateRange']['input']>;
};

export type CancelChargeLinkInput = {
  id: Scalars['String']['input'];
};

export type CancelMeasurementsReportInput = {
  id: Scalars['String']['input'];
};

export type CancelScheduledCalculationInput = {
  id: Scalars['UUID']['input'];
};

export type CancelSettlementReportInput = {
  id: Scalars['String']['input'];
};

export type ChangeCustomerCharacteristicsInput = {
  meteringPointId: Scalars['String']['input'];
  businessReason: ChangeCustomerCharacteristicsBusinessReason;
  firstCustomerCpr?: InputMaybe<Scalars['String']['input']>;
  firstCustomerCvr?: InputMaybe<Scalars['String']['input']>;
  firstCustomerName?: InputMaybe<Scalars['String']['input']>;
  secondCustomerCpr?: InputMaybe<Scalars['String']['input']>;
  secondCustomerName?: InputMaybe<Scalars['String']['input']>;
  protectedName?: InputMaybe<Scalars['Boolean']['input']>;
  electricalHeating: Scalars['Boolean']['input'];
  usagePointLocations?: InputMaybe<Array<UsagePointLocationV1Input>>;
};

export type ChargeIdentifierDtoSortInput = {
  code?: InputMaybe<SortEnumType>;
  owner?: InputMaybe<SortEnumType>;
  typeDto?: InputMaybe<SortEnumType>;
};

export type ChargeLinkDtoSortInput = {
  meteringPointId?: InputMaybe<SortEnumType>;
  chargeIdentifier?: InputMaybe<ChargeIdentifierDtoSortInput>;
};

export type ChargePointV2Input = {
  position: Scalars['Int']['input'];
  priceAmount: Scalars['Decimal']['input'];
};

export type ChargeSortInput = {
  name?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
};

export type ChargesQueryInput = {
  types?: InputMaybe<Array<ChargeType>>;
  owners?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Array<ChargeStatus>>;
  resolution?: InputMaybe<Array<ChargeResolution>>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  transparentInvoicing?: InputMaybe<Scalars['Boolean']['input']>;
  spotDependingPrice?: InputMaybe<Scalars['Boolean']['input']>;
  missingPriceSeries?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CloseConversationInput = {
  conversationId: Scalars['UUID']['input'];
};

export type CreateActorContactDtoInput = {
  name: Scalars['String']['input'];
  category: ContactCategory;
  email: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateActorMarketRoleInput = {
  eicFunction: EicFunction;
  gridAreas: Array<CreateMarketParticipantGridAreaInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCalculationInput = {
  executionType: CalculationExecutionType;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  calculationType: StartCalculationType;
  period: PeriodInput;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateChargeInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  type: ChargeType;
  resolution: ChargeResolution;
  validFrom: Scalars['DateTime']['input'];
  vat: Scalars['Boolean']['input'];
  transparentInvoicing?: InputMaybe<Scalars['Boolean']['input']>;
  spotDependingPrice: Scalars['Boolean']['input'];
};

export type CreateChargeLinkInput = {
  chargeId: Scalars['String']['input'];
  meteringPointId: Scalars['String']['input'];
  newStartDate: Scalars['DateTime']['input'];
  factor: Scalars['Int']['input'];
};

export type CreateDelegationsForMarketParticipantInput = {
  delegations: CreateProcessDelegationsInput;
};

export type CreateMarketParticipantDtoInput = {
  organizationId: Scalars['UUID']['input'];
  name: ActorNameDtoInput;
  actorNumber: ActorNumberDtoInput;
  marketRole: CreateActorMarketRoleInput;
};

export type CreateMarketParticipantGridAreaInput = {
  id: Scalars['UUID']['input'];
  meteringPointTypes: Array<Scalars['String']['input']>;
};

export type CreateMarketParticipantInput = {
  organizationId?: InputMaybe<Scalars['UUID']['input']>;
  organization?: InputMaybe<CreateOrganizationDtoInput>;
  marketParticipant: CreateMarketParticipantDtoInput;
  actorContact: CreateActorContactDtoInput;
};

export type CreateOrganizationDtoInput = {
  name: Scalars['String']['input'];
  businessRegisterIdentifier: Scalars['String']['input'];
  address: AddressDtoInput;
  domains: Array<Scalars['String']['input']>;
};

export type CreateProcessDelegationsInput = {
  delegatedFrom: Scalars['UUID']['input'];
  delegatedTo: Scalars['UUID']['input'];
  gridAreaIds: Array<Scalars['UUID']['input']>;
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

export type CustomerIdentificationInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type DeactivateUserInput = {
  userId: Scalars['UUID']['input'];
};

export type DeactivateUserRoleInput = {
  roleId: Scalars['UUID']['input'];
};

export type DismissAllNotificationsInput = {
  notificationIds: Array<Scalars['Int']['input']>;
};

export type DismissNotificationInput = {
  notificationId: Scalars['Int']['input'];
};

export type EditChargeLinkInput = {
  id: Scalars['String']['input'];
  newStartDate: Scalars['DateTime']['input'];
  factor: Scalars['Int']['input'];
};

export type EsettExchangeEventSortInput = {
  calculationType?: InputMaybe<SortEnumType>;
  created?: InputMaybe<SortEnumType>;
  documentId?: InputMaybe<SortEnumType>;
  documentStatus?: InputMaybe<SortEnumType>;
  gridAreaCode?: InputMaybe<SortEnumType>;
  latestDispatched?: InputMaybe<SortEnumType>;
  timeSeriesType?: InputMaybe<SortEnumType>;
};

export type ExecuteMeteringPointManualCorrectionInput = {
  meteringPointId: Scalars['String']['input'];
  json: Scalars['String']['input'];
};

export type GetAggregateByYearQueryInput = {
  meteringPointId: Scalars['String']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
};

export type GetByDayQueryInput = {
  meteringPointId: Scalars['String']['input'];
  date: Scalars['LocalDate']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
};

export type GetMonthlyAggregateByDateQueryInput = {
  meteringPointId: Scalars['String']['input'];
  yearMonth: Scalars['YearMonth']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
};

export type GetYearlyAggregateByMonthQueryInput = {
  meteringPointId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
};

export type GridAreaSortInput = {
  actor?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  organization?: InputMaybe<SortEnumType>;
  priceArea?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
};

export type InitiateMoveInInput = {
  meteringPointId: Scalars['String']['input'];
  businessReason: ChangeOfSupplierBusinessReason;
  startDate: Scalars['DateTime']['input'];
  customerIdentification: CustomerIdentificationInput;
  customerName: Scalars['String']['input'];
  energySupplier: Scalars['String']['input'];
};

export type InvitationUserDetailsDtoInput = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type InviteUserInput = {
  userInviteDto: UserInvitationDtoInput;
};

export type ManuallyHandleOutgoingMessageInput = {
  documentId: Scalars['String']['input'];
  comment: Scalars['String']['input'];
};

export type MarkConversationReadInput = {
  conversationId: Scalars['UUID']['input'];
};

export type MarkConversationUnReadInput = {
  conversationId: Scalars['UUID']['input'];
};

export type MarketParticipantSortInput = {
  name?: InputMaybe<SortEnumType>;
  glnOrEicNumber?: InputMaybe<SortEnumType>;
  marketRole?: InputMaybe<ActorMarketRoleDtoSortInput>;
  status?: InputMaybe<SortEnumType>;
};

export type MeasurementInput = {
  position: Scalars['Int']['input'];
  quantity: Scalars['Float']['input'];
  quality: SendMeasurementsQuality;
};

export type MergeMarketParticipantsInput = {
  survivingEntity: Scalars['UUID']['input'];
  discontinuedEntity: Scalars['UUID']['input'];
  mergeDate: Scalars['DateTime']['input'];
};

export type MeteringGridAreaImbalanceSortInput = {
  documentDateTime?: InputMaybe<SortDirection>;
  gridAreaCode?: InputMaybe<SortDirection>;
  documentId?: InputMaybe<SortDirection>;
  receivedDateTime?: InputMaybe<SortDirection>;
};

export type OrganizationSortInput = {
  name?: InputMaybe<SortEnumType>;
  businessRegisterIdentifier?: InputMaybe<SortEnumType>;
};

export type PeriodInput =
  { interval: Scalars['DateRange']['input']; yearMonth?: never; }
  |  { interval?: never; yearMonth: Scalars['YearMonth']['input']; };

export type PermissionDtoSortInput = {
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  created?: InputMaybe<SortEnumType>;
};

export type ProcessSortInput = {
  id?: InputMaybe<SortEnumType>;
  scheduledAt?: InputMaybe<SortEnumType>;
  terminatedAt?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  createdBy?: InputMaybe<SortEnumType>;
};

export type ReActivateUserInput = {
  userId: Scalars['UUID']['input'];
};

export type ReInviteUserInput = {
  userId: Scalars['UUID']['input'];
};

export type RemoveMeteringPointsFromAdditionalRecipientInput = {
  marketParticipantId: Scalars['UUID']['input'];
  meteringPointIds: Array<Scalars['String']['input']>;
};

export type RequestCalculatedEnergyTimeSeriesInput = {
  calculationType: RequestCalculationType;
  gridArea?: InputMaybe<Scalars['String']['input']>;
  period: PeriodInput;
  meteringPointType?: InputMaybe<MeteringPointType>;
};

export type RequestCalculatedWholesaleServicesInput = {
  calculationType: RequestCalculationType;
  gridArea?: InputMaybe<Scalars['String']['input']>;
  period: PeriodInput;
  priceType: PriceType;
};

export type RequestClientSecretCredentialsInput = {
  marketParticipantId: Scalars['UUID']['input'];
};

export type RequestConnectionStateChangeInput = {
  meteringPointId: Scalars['String']['input'];
  validityDate: Scalars['DateTime']['input'];
};

export type RequestEndOfSupplyInput = {
  meteringPointId: Scalars['String']['input'];
  terminationDate: Scalars['DateTime']['input'];
};

export type RequestInput =
  { requestCalculatedEnergyTimeSeries: RequestCalculatedEnergyTimeSeriesInput; requestCalculatedWholesaleServices?: never; }
  |  { requestCalculatedEnergyTimeSeries?: never; requestCalculatedWholesaleServices: RequestCalculatedWholesaleServicesInput; };

export type RequestMeasurementsReportInput = {
  period: Scalars['DateRange']['input'];
  gridAreaCodes: Array<Scalars['String']['input']>;
  resolution: AggregatedResolution;
  meteringPointTypes: Array<MeasurementsReportMeteringPointType>;
  preventLargeTextFiles: Scalars['Boolean']['input'];
  energySupplier?: InputMaybe<Scalars['String']['input']>;
  requestAsMarketRole?: InputMaybe<MeasurementsReportMarketRole>;
  requestAsActorId?: InputMaybe<Scalars['String']['input']>;
  meteringPointIDs?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RequestMissingMeasurementsLogInput = {
  period: Scalars['DateRange']['input'];
  gridAreaCodes: Array<Scalars['String']['input']>;
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
  includeBasisData: Scalars['Boolean']['input'];
  energySupplier?: InputMaybe<Scalars['String']['input']>;
  csvLanguage?: InputMaybe<Scalars['String']['input']>;
  requestAsActorId?: InputMaybe<Scalars['String']['input']>;
  requestAsMarketRole?: InputMaybe<SettlementReportMarketRole>;
};

export type RequestSortInput = {
  messageId?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  requestedBy?: InputMaybe<SortEnumType>;
  calculationType?: InputMaybe<SortEnumType>;
  period?: InputMaybe<SortEnumType>;
  meteringPointTypeOrPriceType?: InputMaybe<SortEnumType>;
};

export type ResetMitIdInput = {
  userId: Scalars['UUID']['input'];
};

export type ResetTwoFactorAuthenticationInput = {
  userId: Scalars['UUID']['input'];
};

export type SendActorConversationMessageInput = {
  conversationId: Scalars['UUID']['input'];
  meteringPointIdentification: Scalars['String']['input'];
  actorId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  anonymous: Scalars['Boolean']['input'];
};

export type SendMeasurementsInstanceDtoSortInput = {
  id?: InputMaybe<SortEnumType>;
  idempotencyKeyHash?: InputMaybe<SortEnumType>;
  transactionId?: InputMaybe<SortEnumType>;
  meteringPointId?: InputMaybe<SortEnumType>;
  masterData?: InputMaybe<SortEnumType>;
  validationErrors?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  businessValidationSucceededAt?: InputMaybe<SortEnumType>;
  sentToMeasurementsAt?: InputMaybe<SortEnumType>;
  receivedFromMeasurementsAt?: InputMaybe<SortEnumType>;
  sentToEnqueueActorMessagesAt?: InputMaybe<SortEnumType>;
  receivedFromEnqueueActorMessagesAt?: InputMaybe<SortEnumType>;
  terminatedAt?: InputMaybe<SortEnumType>;
  failedAt?: InputMaybe<SortEnumType>;
  failedCount?: InputMaybe<SortEnumType>;
  errorText?: InputMaybe<SortEnumType>;
};

export type SendMeasurementsRequestV2Input = {
  meteringPointId: Scalars['String']['input'];
  meteringPointType: SendMeasurementsMeteringPointType;
  measurementUnit: SendMeasurementsMeasurementUnit;
  resolution: SendMeasurementsResolution;
  start: Scalars['DateTime']['input'];
  end: Scalars['DateTime']['input'];
  measurements: Array<MeasurementInput>;
};

export type SimulateMeteringPointManualCorrectionInput = {
  meteringPointId: Scalars['String']['input'];
  json: Scalars['String']['input'];
};

export type StartConversationInput = {
  subject: ConversationSubject;
  meteringPointIdentification: Scalars['String']['input'];
  internalNote?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  anonymous: Scalars['Boolean']['input'];
  receiver: ActorType;
};

export type StopChargeInput = {
  id: Scalars['String']['input'];
  terminationDate: Scalars['DateTime']['input'];
};

export type StopChargeLinkInput = {
  id: Scalars['String']['input'];
  stopDate: Scalars['DateTime']['input'];
};

export type StopDelegationInput = {
  stopDelegationPeriods: Array<StopDelegationPeriodInput>;
};

export type StopDelegationPeriodInput = {
  delegationId: Scalars['UUID']['input'];
  stopPeriod: StopProcessDelegationDtoInput;
};

export type StopProcessDelegationDtoInput = {
  periodId: Scalars['UUID']['input'];
  stopsAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type StreetDetailV1Input = {
  buildingNumber?: InputMaybe<Scalars['String']['input']>;
  streetName?: InputMaybe<Scalars['String']['input']>;
  streetCode?: InputMaybe<Scalars['String']['input']>;
  suiteNumber?: InputMaybe<Scalars['String']['input']>;
  floor?: InputMaybe<Scalars['String']['input']>;
};

export type TownDetailV1Input = {
  municipalityCode?: InputMaybe<Scalars['String']['input']>;
  additionalCityName?: InputMaybe<Scalars['String']['input']>;
  cityName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateActorUserRolesInput = {
  actorId: Scalars['UUID']['input'];
  assignments: UpdateUserRoleAssignmentsDtoInput;
};

export type UpdateChargeInput = {
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  description: Scalars['String']['input'];
  cutoffDate: Scalars['DateTime']['input'];
  vat: Scalars['Boolean']['input'];
  transparentInvoicing: Scalars['Boolean']['input'];
};

export type UpdateInternalConversationNoteInput = {
  conversationId: Scalars['UUID']['input'];
  internalNote: Scalars['String']['input'];
};

export type UpdateMarketParticipantInput = {
  marketParticipantId: Scalars['UUID']['input'];
  marketParticipantName: Scalars['String']['input'];
  departmentName: Scalars['String']['input'];
  departmentEmail: Scalars['String']['input'];
  departmentPhone: Scalars['String']['input'];
};

export type UpdateOrganizationInput = {
  orgId: Scalars['UUID']['input'];
  domains: Array<Scalars['String']['input']>;
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

export type UsagePointLocationV1Input = {
  addressType: AddressTypeV1;
  darReference?: InputMaybe<Scalars['String']['input']>;
  attention?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  streetDetail?: InputMaybe<StreetDetailV1Input>;
  townDetail?: InputMaybe<TownDetailV1Input>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  poBox?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  protectedAddress?: InputMaybe<Scalars['Boolean']['input']>;
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

export type UserRoleSortInput = {
  name?: InputMaybe<SortEnumType>;
  eicFunction?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
};

export type UsersSortInput = {
  name?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  latestLoginAt?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
};

export const ActorAuditedChange = {
  Name: 'NAME',
  Status: 'STATUS',
  ContactName: 'CONTACT_NAME',
  ContactEmail: 'CONTACT_EMAIL',
  ContactPhone: 'CONTACT_PHONE',
  ContactCategoryAdded: 'CONTACT_CATEGORY_ADDED',
  ContactCategoryRemoved: 'CONTACT_CATEGORY_REMOVED',
  CertificateCredentials: 'CERTIFICATE_CREDENTIALS',
  ClientSecretCredentials: 'CLIENT_SECRET_CREDENTIALS',
  DelegationStart: 'DELEGATION_START',
  DelegationStop: 'DELEGATION_STOP',
  ConsolidationRequested: 'CONSOLIDATION_REQUESTED',
  ConsolidationCompleted: 'CONSOLIDATION_COMPLETED',
  AdditionalRecipientMeteringPointAdded: 'ADDITIONAL_RECIPIENT_METERING_POINT_ADDED',
  AdditionalRecipientMeteringPointRemoved: 'ADDITIONAL_RECIPIENT_METERING_POINT_REMOVED'
} as const;

export type ActorAuditedChange = typeof ActorAuditedChange[keyof typeof ActorAuditedChange];
/** Application layer receiver type */
export const ActorType = {
  EnergySupplier: 'ENERGY_SUPPLIER',
  Energinet: 'ENERGINET',
  GridAccessProvider: 'GRID_ACCESS_PROVIDER'
} as const;

export type ActorType = typeof ActorType[keyof typeof ActorType];
export const AddressTypeV1 = {
  Technical: 'TECHNICAL',
  Legal: 'LEGAL'
} as const;

export type AddressTypeV1 = typeof AddressTypeV1[keyof typeof AddressTypeV1];
export const AggregatedResolution = {
  ActualResolution: 'ACTUAL_RESOLUTION',
  SumOfDay: 'SUM_OF_DAY',
  SumOfMonth: 'SUM_OF_MONTH',
  SumOfHour: 'SUM_OF_HOUR'
} as const;

export type AggregatedResolution = typeof AggregatedResolution[keyof typeof AggregatedResolution];
/** Defines when a policy shall be executed. */
export const ApplyPolicy = {
  /** Before the resolver was executed. */
  BeforeResolver: 'BEFORE_RESOLVER',
  /** After the resolver was executed. */
  AfterResolver: 'AFTER_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation: 'VALIDATION'
} as const;

export type ApplyPolicy = typeof ApplyPolicy[keyof typeof ApplyPolicy];
export const ArchivedMessageDocumentType = {
  B2CRequestAggregatedMeasureData: 'B2C_REQUEST_AGGREGATED_MEASURE_DATA',
  B2CRequestWholesaleSettlement: 'B2C_REQUEST_WHOLESALE_SETTLEMENT',
  B2CRequestChangeOfPriceList: 'B2C_REQUEST_CHANGE_OF_PRICE_LIST',
  NotifyAggregatedMeasureData: 'NOTIFY_AGGREGATED_MEASURE_DATA',
  NotifyWholesaleServices: 'NOTIFY_WHOLESALE_SERVICES',
  RejectRequestAggregatedMeasureData: 'REJECT_REQUEST_AGGREGATED_MEASURE_DATA',
  RejectRequestWholesaleSettlement: 'REJECT_REQUEST_WHOLESALE_SETTLEMENT',
  RequestAggregatedMeasureData: 'REQUEST_AGGREGATED_MEASURE_DATA',
  RequestWholesaleSettlement: 'REQUEST_WHOLESALE_SETTLEMENT',
  ReminderOfMissingMeasurements: 'REMINDER_OF_MISSING_MEASUREMENTS',
  RequestChangeOfPriceList: 'REQUEST_CHANGE_OF_PRICE_LIST',
  ConfirmRequestChangeOfPriceList: 'CONFIRM_REQUEST_CHANGE_OF_PRICE_LIST',
  RejectRequestChangeOfPriceList: 'REJECT_REQUEST_CHANGE_OF_PRICE_LIST',
  NotifyPriceList: 'NOTIFY_PRICE_LIST'
} as const;

export type ArchivedMessageDocumentType = typeof ArchivedMessageDocumentType[keyof typeof ArchivedMessageDocumentType];
export const AuthEicFunctionType = {
  BalanceResponsibleParty: 'BalanceResponsibleParty',
  BillingAgent: 'BillingAgent',
  EnergySupplier: 'EnergySupplier',
  GridAccessProvider: 'GridAccessProvider',
  ImbalanceSettlementResponsible: 'ImbalanceSettlementResponsible',
  MeterOperator: 'MeterOperator',
  MeteredDataAdministrator: 'MeteredDataAdministrator',
  MeteredDataResponsible: 'MeteredDataResponsible',
  MeteringPointAdministrator: 'MeteringPointAdministrator',
  SystemOperator: 'SystemOperator',
  DanishEnergyAgency: 'DanishEnergyAgency',
  DataHubAdministrator: 'DataHubAdministrator',
  IndependentAggregator: 'IndependentAggregator',
  SerialEnergyTrader: 'SerialEnergyTrader',
  Delegated: 'Delegated',
  ItSupplier: 'ItSupplier'
} as const;

export type AuthEicFunctionType = typeof AuthEicFunctionType[keyof typeof AuthEicFunctionType];
/** Represents the status of a balance responsibility agreement. */
export const BalanceResponsibilityAgreementStatus = {
  Awaiting: 'AWAITING',
  Active: 'ACTIVE',
  SoonToExpire: 'SOON_TO_EXPIRE',
  Expired: 'EXPIRED'
} as const;

export type BalanceResponsibilityAgreementStatus = typeof BalanceResponsibilityAgreementStatus[keyof typeof BalanceResponsibilityAgreementStatus];
export const BalanceResponsibilityMeteringPointType = {
  MgaExchange: 'MgaExchange',
  Production: 'Production',
  Consumption: 'Consumption'
} as const;

export type BalanceResponsibilityMeteringPointType = typeof BalanceResponsibilityMeteringPointType[keyof typeof BalanceResponsibilityMeteringPointType];
export const BusinessReason = {
  D03: 'D03',
  D04: 'D04',
  D05: 'D05',
  D32: 'D32',
  E65: 'E65',
  D29: 'D29',
  E34: 'E34',
  E01: 'E01'
} as const;

export type BusinessReason = typeof BusinessReason[keyof typeof BusinessReason];
export const CalculationExecutionType = {
  External: 'EXTERNAL',
  Internal: 'INTERNAL'
} as const;

export type CalculationExecutionType = typeof CalculationExecutionType[keyof typeof CalculationExecutionType];
export const CalculationType = {
  BalanceFixing: 'BALANCE_FIXING',
  Aggregation: 'AGGREGATION',
  WholesaleFixing: 'WHOLESALE_FIXING',
  FirstCorrectionSettlement: 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement: 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement: 'THIRD_CORRECTION_SETTLEMENT'
} as const;

export type CalculationType = typeof CalculationType[keyof typeof CalculationType];
export const CalculationTypeQueryParameterV1 = {
  BalanceFixing: 'BALANCE_FIXING',
  Aggregation: 'AGGREGATION',
  WholesaleFixing: 'WHOLESALE_FIXING',
  FirstCorrectionSettlement: 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement: 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement: 'THIRD_CORRECTION_SETTLEMENT',
  ElectricalHeating: 'ELECTRICAL_HEATING',
  CapacitySettlement: 'CAPACITY_SETTLEMENT',
  NetConsumption: 'NET_CONSUMPTION',
  MissingMeasurementsLog: 'MISSING_MEASUREMENTS_LOG'
} as const;

export type CalculationTypeQueryParameterV1 = typeof CalculationTypeQueryParameterV1[keyof typeof CalculationTypeQueryParameterV1];
export const ChangeCustomerCharacteristicsBusinessReason = {
  ElectricHeating: 'ELECTRIC_HEATING',
  SecondaryMoveIn: 'SECONDARY_MOVE_IN',
  ChangeOfEnergySupplier: 'CHANGE_OF_ENERGY_SUPPLIER',
  UpdateMasterDataConsumer: 'UPDATE_MASTER_DATA_CONSUMER',
  CustomerMoveIn: 'CUSTOMER_MOVE_IN'
} as const;

export type ChangeCustomerCharacteristicsBusinessReason = typeof ChangeCustomerCharacteristicsBusinessReason[keyof typeof ChangeCustomerCharacteristicsBusinessReason];
export const ChangeOfSupplierBusinessReason = {
  CustomerMoveIn: 'CUSTOMER_MOVE_IN',
  SecondaryMoveIn: 'SECONDARY_MOVE_IN',
  ChangeOfEnergySupplier: 'CHANGE_OF_ENERGY_SUPPLIER'
} as const;

export type ChangeOfSupplierBusinessReason = typeof ChangeOfSupplierBusinessReason[keyof typeof ChangeOfSupplierBusinessReason];
export const ChargeResolution = {
  QuarterHourly: 'QUARTER_HOURLY',
  Hourly: 'HOURLY',
  Daily: 'DAILY',
  Monthly: 'MONTHLY'
} as const;

export type ChargeResolution = typeof ChargeResolution[keyof typeof ChargeResolution];
export const ChargeStatus = {
  Cancelled: 'CANCELLED',
  Current: 'CURRENT',
  Awaiting: 'AWAITING',
  Closed: 'CLOSED'
} as const;

export type ChargeStatus = typeof ChargeStatus[keyof typeof ChargeStatus];
export const ChargeType = {
  Tariff: 'TARIFF',
  TariffTax: 'TARIFF_TAX',
  Subscription: 'SUBSCRIPTION',
  Fee: 'FEE'
} as const;

export type ChargeType = typeof ChargeType[keyof typeof ChargeType];
export const ContactCategory = {
  Default: 'DEFAULT',
  Charges: 'CHARGES',
  ChargeLinks: 'CHARGE_LINKS',
  ElectricalHeating: 'ELECTRICAL_HEATING',
  EndOfSupply: 'END_OF_SUPPLY',
  EnerginetInquiry: 'ENERGINET_INQUIRY',
  ErrorReport: 'ERROR_REPORT',
  IncorrectMove: 'INCORRECT_MOVE',
  IncorrectSwitch: 'INCORRECT_SWITCH',
  MeasurementData: 'MEASUREMENT_DATA',
  MeteringPoint: 'METERING_POINT',
  NetSettlement: 'NET_SETTLEMENT',
  Notification: 'NOTIFICATION',
  Recon: 'RECON',
  Reminder: 'REMINDER'
} as const;

export type ContactCategory = typeof ContactCategory[keyof typeof ContactCategory];
/** Application layer conversation subject */
export const ConversationSubject = {
  QuestionForEnerginet: 'QUESTION_FOR_ENERGINET',
  InterruptionReconnection: 'INTERRUPTION_RECONNECTION',
  ElectricalHeating: 'ELECTRICAL_HEATING',
  WrongfulMoveOrSupplierChange: 'WRONGFUL_MOVE_OR_SUPPLIER_CHANGE',
  CustomerMasterData: 'CUSTOMER_MASTER_DATA',
  MeasurementData: 'MEASUREMENT_DATA',
  MeasurementPointMasterData: 'MEASUREMENT_POINT_MASTER_DATA',
  PriceLinking: 'PRICE_LINKING'
} as const;

export type ConversationSubject = typeof ConversationSubject[keyof typeof ConversationSubject];
export const DelegatedProcess = {
  RequestEnergyResults: 'REQUEST_ENERGY_RESULTS',
  ReceiveEnergyResults: 'RECEIVE_ENERGY_RESULTS',
  RequestWholesaleResults: 'REQUEST_WHOLESALE_RESULTS',
  ReceiveWholesaleResults: 'RECEIVE_WHOLESALE_RESULTS',
  RequestMeteringPointData: 'REQUEST_METERING_POINT_DATA',
  ReceiveMeteringPointData: 'RECEIVE_METERING_POINT_DATA',
  SendMeteringPointData: 'SEND_METERING_POINT_DATA',
  ReceiveGapLog: 'RECEIVE_GAP_LOG'
} as const;

export type DelegatedProcess = typeof DelegatedProcess[keyof typeof DelegatedProcess];
export const DocumentStatus = {
  Received: 'RECEIVED',
  AwaitingDispatch: 'AWAITING_DISPATCH',
  AwaitingReply: 'AWAITING_REPLY',
  Accepted: 'ACCEPTED',
  Rejected: 'REJECTED',
  BizTalkAccepted: 'BIZ_TALK_ACCEPTED',
  ManuallyHandled: 'MANUALLY_HANDLED'
} as const;

export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus];
export const DocumentType = {
  NotifyAggregatedMeasureData: 'NOTIFY_AGGREGATED_MEASURE_DATA',
  NotifyWholesaleServices: 'NOTIFY_WHOLESALE_SERVICES',
  RejectRequestAggregatedMeasureData: 'REJECT_REQUEST_AGGREGATED_MEASURE_DATA',
  RejectRequestWholesaleSettlement: 'REJECT_REQUEST_WHOLESALE_SETTLEMENT',
  RequestAggregatedMeasureData: 'REQUEST_AGGREGATED_MEASURE_DATA',
  RequestWholesaleSettlement: 'REQUEST_WHOLESALE_SETTLEMENT',
  ReminderOfMissingMeasurements: 'REMINDER_OF_MISSING_MEASUREMENTS',
  NotifyPriceList: 'NOTIFY_PRICE_LIST',
  RequestChangeOfPriceList: 'REQUEST_CHANGE_OF_PRICE_LIST',
  ConfirmRequestChangeOfPriceList: 'CONFIRM_REQUEST_CHANGE_OF_PRICE_LIST',
  RejectRequestChangeOfPriceList: 'REJECT_REQUEST_CHANGE_OF_PRICE_LIST',
  B2CRequestAggregatedMeasureData: 'B2C_REQUEST_AGGREGATED_MEASURE_DATA',
  B2CRequestWholesaleSettlement: 'B2C_REQUEST_WHOLESALE_SETTLEMENT',
  Acknowledgement: 'ACKNOWLEDGEMENT',
  SendMeasurements: 'SEND_MEASUREMENTS',
  RequestMeasurements: 'REQUEST_MEASUREMENTS',
  RejectRequestMeasurements: 'REJECT_REQUEST_MEASUREMENTS',
  UpdateChargeLinks: 'UPDATE_CHARGE_LINKS',
  ConfirmRequestChangeBillingMasterData: 'CONFIRM_REQUEST_CHANGE_BILLING_MASTER_DATA',
  RejectRequestChangeBillingMasterData: 'REJECT_REQUEST_CHANGE_BILLING_MASTER_DATA',
  NotifyBillingMasterData: 'NOTIFY_BILLING_MASTER_DATA',
  B2CUpdateChargeLinks: 'B2C_UPDATE_CHARGE_LINKS',
  B2CRequestChangeAccountingPointCharacteristics: 'B2C_REQUEST_CHANGE_ACCOUNTING_POINT_CHARACTERISTICS',
  B2CRequestChangeBillingMasterData: 'B2C_REQUEST_CHANGE_BILLING_MASTER_DATA',
  B2CRequestChangeOfPriceList: 'B2C_REQUEST_CHANGE_OF_PRICE_LIST',
  B2CRequestChangeOfSupplier: 'B2C_REQUEST_CHANGE_OF_SUPPLIER',
  B2CRequestChangeCustomerCharacteristics: 'B2C_REQUEST_CHANGE_CUSTOMER_CHARACTERISTICS'
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];
export const ESettStageComponent = {
  Converter: 'CONVERTER',
  Sender: 'SENDER',
  Receiver: 'RECEIVER'
} as const;

export type ESettStageComponent = typeof ESettStageComponent[keyof typeof ESettStageComponent];
export const EicFunction = {
  BalanceResponsibleParty: 'BalanceResponsibleParty',
  BillingAgent: 'BillingAgent',
  EnergySupplier: 'EnergySupplier',
  GridAccessProvider: 'GridAccessProvider',
  ImbalanceSettlementResponsible: 'ImbalanceSettlementResponsible',
  MeterOperator: 'MeterOperator',
  MeteredDataAdministrator: 'MeteredDataAdministrator',
  MeteredDataResponsible: 'MeteredDataResponsible',
  MeteringPointAdministrator: 'MeteringPointAdministrator',
  SystemOperator: 'SystemOperator',
  DanishEnergyAgency: 'DanishEnergyAgency',
  DataHubAdministrator: 'DataHubAdministrator',
  IndependentAggregator: 'IndependentAggregator',
  SerialEnergyTrader: 'SerialEnergyTrader',
  Delegated: 'Delegated',
  ItSupplier: 'ItSupplier'
} as const;

export type EicFunction = typeof EicFunction[keyof typeof EicFunction];
export const ElectricityEicFunctionType = {
  BalanceResponsibleParty: 'BalanceResponsibleParty',
  BillingAgent: 'BillingAgent',
  EnergySupplier: 'EnergySupplier',
  GridAccessProvider: 'GridAccessProvider',
  ImbalanceSettlementResponsible: 'ImbalanceSettlementResponsible',
  MeterOperator: 'MeterOperator',
  MeteredDataAdministrator: 'MeteredDataAdministrator',
  MeteredDataResponsible: 'MeteredDataResponsible',
  MeteringPointAdministrator: 'MeteringPointAdministrator',
  SystemOperator: 'SystemOperator',
  DanishEnergyAgency: 'DanishEnergyAgency',
  DataHubAdministrator: 'DataHubAdministrator',
  IndependentAggregator: 'IndependentAggregator',
  SerialEnergyTrader: 'SerialEnergyTrader',
  Delegated: 'Delegated',
  ItSupplier: 'ItSupplier'
} as const;

export type ElectricityEicFunctionType = typeof ElectricityEicFunctionType[keyof typeof ElectricityEicFunctionType];
export const ElectricityMarketConnectionStateType = {
  NotUsed: 'NOT_USED',
  ClosedDown: 'CLOSED_DOWN',
  New: 'NEW',
  Connected: 'CONNECTED',
  Disconnected: 'DISCONNECTED'
} as const;

export type ElectricityMarketConnectionStateType = typeof ElectricityMarketConnectionStateType[keyof typeof ElectricityMarketConnectionStateType];
export const ElectricityMarketMeteringPointType = {
  Consumption: 'Consumption',
  Production: 'Production',
  Exchange: 'Exchange',
  VeProduction: 'VEProduction',
  Analysis: 'Analysis',
  NotUsed: 'NotUsed',
  SurplusProductionGroup6: 'SurplusProductionGroup6',
  NetProduction: 'NetProduction',
  SupplyToGrid: 'SupplyToGrid',
  ConsumptionFromGrid: 'ConsumptionFromGrid',
  WholesaleServicesOrInformation: 'WholesaleServicesOrInformation',
  OwnProduction: 'OwnProduction',
  NetFromGrid: 'NetFromGrid',
  NetToGrid: 'NetToGrid',
  TotalConsumption: 'TotalConsumption',
  NetLossCorrection: 'NetLossCorrection',
  ElectricalHeating: 'ElectricalHeating',
  NetConsumption: 'NetConsumption',
  OtherConsumption: 'OtherConsumption',
  OtherProduction: 'OtherProduction',
  CapacitySettlement: 'CapacitySettlement',
  ExchangeReactiveEnergy: 'ExchangeReactiveEnergy',
  CollectiveNetProduction: 'CollectiveNetProduction',
  CollectiveNetConsumption: 'CollectiveNetConsumption',
  ActivatedDownregulation: 'ActivatedDownregulation',
  ActivatedUpregulation: 'ActivatedUpregulation',
  ActualConsumption: 'ActualConsumption',
  ActualProduction: 'ActualProduction',
  InternalUse: 'InternalUse'
} as const;

export type ElectricityMarketMeteringPointType = typeof ElectricityMarketMeteringPointType[keyof typeof ElectricityMarketMeteringPointType];
export const ElectricityMarketV2ConnectionState = {
  Unknown: 'Unknown',
  New: 'New',
  Connected: 'Connected',
  Disconnected: 'Disconnected',
  ClosedDown: 'ClosedDown'
} as const;

export type ElectricityMarketV2ConnectionState = typeof ElectricityMarketV2ConnectionState[keyof typeof ElectricityMarketV2ConnectionState];
export const ElectricityMarketV2MeteringPointType = {
  Unknown: 'Unknown',
  Consumption: 'Consumption',
  Production: 'Production',
  Exchange: 'Exchange',
  VeProduction: 'VEProduction',
  Analysis: 'Analysis',
  NotUsed: 'NotUsed',
  SurplusProductionGroup6: 'SurplusProductionGroup6',
  NetProduction: 'NetProduction',
  SupplyToGrid: 'SupplyToGrid',
  ConsumptionFromGrid: 'ConsumptionFromGrid',
  WholesaleServicesOrInformation: 'WholesaleServicesOrInformation',
  OwnProduction: 'OwnProduction',
  NetFromGrid: 'NetFromGrid',
  NetToGrid: 'NetToGrid',
  TotalConsumption: 'TotalConsumption',
  NetLossCorrection: 'NetLossCorrection',
  ElectricalHeating: 'ElectricalHeating',
  NetConsumption: 'NetConsumption',
  OtherConsumption: 'OtherConsumption',
  OtherProduction: 'OtherProduction',
  CapacitySettlement: 'CapacitySettlement',
  ExchangeReactiveEnergy: 'ExchangeReactiveEnergy',
  CollectiveNetProduction: 'CollectiveNetProduction',
  CollectiveNetConsumption: 'CollectiveNetConsumption',
  ActivatedDownregulation: 'ActivatedDownregulation',
  ActivatedUpregulation: 'ActivatedUpregulation',
  ActualConsumption: 'ActualConsumption',
  ActualProduction: 'ActualProduction',
  InternalUse: 'InternalUse'
} as const;

export type ElectricityMarketV2MeteringPointType = typeof ElectricityMarketV2MeteringPointType[keyof typeof ElectricityMarketV2MeteringPointType];
export const ElectricityMarketViewAssetType = {
  SteamTurbineWithBackPressureMode: 'STEAM_TURBINE_WITH_BACK_PRESSURE_MODE',
  GasTurbine: 'GAS_TURBINE',
  CombinedCycle: 'COMBINED_CYCLE',
  CombustionEngineGas: 'COMBUSTION_ENGINE_GAS',
  SteamTurbineWithCondensationSteam: 'STEAM_TURBINE_WITH_CONDENSATION_STEAM',
  Boiler: 'BOILER',
  StirlingEngine: 'STIRLING_ENGINE',
  PermanentConnectedElectricalEnergyStorageFacilities: 'PERMANENT_CONNECTED_ELECTRICAL_ENERGY_STORAGE_FACILITIES',
  TemporarilyConnectedElectricalEnergyStorageFacilities: 'TEMPORARILY_CONNECTED_ELECTRICAL_ENERGY_STORAGE_FACILITIES',
  FuelCells: 'FUEL_CELLS',
  PhotoVoltaicCells: 'PHOTO_VOLTAIC_CELLS',
  WindTurbines: 'WIND_TURBINES',
  HydroelectricPower: 'HYDROELECTRIC_POWER',
  WavePower: 'WAVE_POWER',
  MixedProduction: 'MIXED_PRODUCTION',
  ProductionWithElectricalEnergyStorageFacilities: 'PRODUCTION_WITH_ELECTRICAL_ENERGY_STORAGE_FACILITIES',
  PowerToX: 'POWER_TO_X',
  RegenerativeDemandFacility: 'REGENERATIVE_DEMAND_FACILITY',
  CombustionEngineDiesel: 'COMBUSTION_ENGINE_DIESEL',
  CombustionEngineBio: 'COMBUSTION_ENGINE_BIO',
  NoTechnology: 'NO_TECHNOLOGY',
  UnknownTechnology: 'UNKNOWN_TECHNOLOGY'
} as const;

export type ElectricityMarketViewAssetType = typeof ElectricityMarketViewAssetType[keyof typeof ElectricityMarketViewAssetType];
export const ElectricityMarketViewConnectionState = {
  NotUsed: 'NOT_USED',
  ClosedDown: 'CLOSED_DOWN',
  New: 'NEW',
  Connected: 'CONNECTED',
  Disconnected: 'DISCONNECTED'
} as const;

export type ElectricityMarketViewConnectionState = typeof ElectricityMarketViewConnectionState[keyof typeof ElectricityMarketViewConnectionState];
export const ElectricityMarketViewConnectionType = {
  Direct: 'DIRECT',
  Installation: 'INSTALLATION'
} as const;

export type ElectricityMarketViewConnectionType = typeof ElectricityMarketViewConnectionType[keyof typeof ElectricityMarketViewConnectionType];
export const ElectricityMarketViewCustomerRelationType = {
  Contact1: 'CONTACT1',
  Contact4: 'CONTACT4',
  Secondary: 'SECONDARY'
} as const;

export type ElectricityMarketViewCustomerRelationType = typeof ElectricityMarketViewCustomerRelationType[keyof typeof ElectricityMarketViewCustomerRelationType];
export const ElectricityMarketViewDisconnectionType = {
  RemoteDisconnection: 'REMOTE_DISCONNECTION',
  ManualDisconnection: 'MANUAL_DISCONNECTION'
} as const;

export type ElectricityMarketViewDisconnectionType = typeof ElectricityMarketViewDisconnectionType[keyof typeof ElectricityMarketViewDisconnectionType];
export const ElectricityMarketViewMeteringPointMeasureUnit = {
  Ampere: 'AMPERE',
  Stk: 'STK',
  KvArh: 'KV_ARH',
  KWh: 'K_WH',
  Kw: 'KW',
  Mw: 'MW',
  MWh: 'M_WH',
  Tonne: 'TONNE',
  MvAr: 'MV_AR',
  DanishTariffCode: 'DANISH_TARIFF_CODE'
} as const;

export type ElectricityMarketViewMeteringPointMeasureUnit = typeof ElectricityMarketViewMeteringPointMeasureUnit[keyof typeof ElectricityMarketViewMeteringPointMeasureUnit];
export const ElectricityMarketViewMeteringPointSubType = {
  Physical: 'PHYSICAL',
  Virtual: 'VIRTUAL',
  Calculated: 'CALCULATED'
} as const;

export type ElectricityMarketViewMeteringPointSubType = typeof ElectricityMarketViewMeteringPointSubType[keyof typeof ElectricityMarketViewMeteringPointSubType];
export const ElectricityMarketViewMeteringPointType = {
  Consumption: 'Consumption',
  Production: 'Production',
  Exchange: 'Exchange',
  VeProduction: 'VEProduction',
  Analysis: 'Analysis',
  NotUsed: 'NotUsed',
  SurplusProductionGroup6: 'SurplusProductionGroup6',
  NetProduction: 'NetProduction',
  SupplyToGrid: 'SupplyToGrid',
  ConsumptionFromGrid: 'ConsumptionFromGrid',
  WholesaleServicesOrInformation: 'WholesaleServicesOrInformation',
  OwnProduction: 'OwnProduction',
  NetFromGrid: 'NetFromGrid',
  NetToGrid: 'NetToGrid',
  TotalConsumption: 'TotalConsumption',
  NetLossCorrection: 'NetLossCorrection',
  ElectricalHeating: 'ElectricalHeating',
  NetConsumption: 'NetConsumption',
  OtherConsumption: 'OtherConsumption',
  OtherProduction: 'OtherProduction',
  CapacitySettlement: 'CapacitySettlement',
  ExchangeReactiveEnergy: 'ExchangeReactiveEnergy',
  CollectiveNetProduction: 'CollectiveNetProduction',
  CollectiveNetConsumption: 'CollectiveNetConsumption',
  ActivatedDownregulation: 'ActivatedDownregulation',
  ActivatedUpregulation: 'ActivatedUpregulation',
  ActualConsumption: 'ActualConsumption',
  ActualProduction: 'ActualProduction',
  InternalUse: 'InternalUse'
} as const;

export type ElectricityMarketViewMeteringPointType = typeof ElectricityMarketViewMeteringPointType[keyof typeof ElectricityMarketViewMeteringPointType];
export const ElectricityMarketViewProduct = {
  Tariff: 'TARIFF',
  FuelQuantity: 'FUEL_QUANTITY',
  PowerActive: 'POWER_ACTIVE',
  PowerReactive: 'POWER_REACTIVE',
  EnergyActive: 'ENERGY_ACTIVE',
  EnergyReactive: 'ENERGY_REACTIVE'
} as const;

export type ElectricityMarketViewProduct = typeof ElectricityMarketViewProduct[keyof typeof ElectricityMarketViewProduct];
export const ElectricityMarketViewSettlementMethod = {
  FlexSettled: 'FLEX_SETTLED',
  Profiled: 'PROFILED',
  NonProfiled: 'NON_PROFILED'
} as const;

export type ElectricityMarketViewSettlementMethod = typeof ElectricityMarketViewSettlementMethod[keyof typeof ElectricityMarketViewSettlementMethod];
export const ElectricityMarketViewTransactionType = {
  ChangeSupplier: 'CHANGE_SUPPLIER',
  EndSupply: 'END_SUPPLY',
  IncorrectSupplierChange: 'INCORRECT_SUPPLIER_CHANGE',
  MasterDataSent: 'MASTER_DATA_SENT',
  AttachChild: 'ATTACH_CHILD',
  DettachChild: 'DETTACH_CHILD',
  EnergiSupplierMoveIn: 'ENERGI_SUPPLIER_MOVE_IN',
  EnergiSupplierMoveOut: 'ENERGI_SUPPLIER_MOVE_OUT',
  TransactionTypeIncMove: 'TRANSACTION_TYPE_INC_MOVE',
  IncorrectMoveIn: 'INCORRECT_MOVE_IN',
  ElectricalHeatingOn: 'ELECTRICAL_HEATING_ON',
  ElectricalHeatingOff: 'ELECTRICAL_HEATING_OFF',
  ChangeSupplierShort: 'CHANGE_SUPPLIER_SHORT',
  ManualChangeSupplier: 'MANUAL_CHANGE_SUPPLIER',
  ManualCorrections: 'MANUAL_CORRECTIONS',
  CreateMeteringPoint: 'CREATE_METERING_POINT',
  CreateSpecialMeteringPoint: 'CREATE_SPECIAL_METERING_POINT',
  RegisterMeterIdentifier: 'REGISTER_METER_IDENTIFIER',
  AddedByDataMigration: 'ADDED_BY_DATA_MIGRATION',
  DeliveryTermination: 'DELIVERY_TERMINATION',
  SendingHistoricalAnnualConsumptionToElectricitySupplier: 'SENDING_HISTORICAL_ANNUAL_CONSUMPTION_TO_ELECTRICITY_SUPPLIER',
  ManualWebPasswordGeneration: 'MANUAL_WEB_PASSWORD_GENERATION',
  ManualUpdateOfWebAccessCode: 'MANUAL_UPDATE_OF_WEB_ACCESS_CODE',
  MaintenanceOfSettlementMasterData: 'MAINTENANCE_OF_SETTLEMENT_MASTER_DATA',
  GridAccessProviderMoveIn: 'GRID_ACCESS_PROVIDER_MOVE_IN',
  GridAccessProviderMoveOut: 'GRID_ACCESS_PROVIDER_MOVE_OUT',
  SendingCustomerMasterData: 'SENDING_CUSTOMER_MASTER_DATA',
  RequestForMasterData: 'REQUEST_FOR_MASTER_DATA',
  RequestForMasterDataNotOwner: 'REQUEST_FOR_MASTER_DATA_NOT_OWNER',
  RequestForMeasurementData: 'REQUEST_FOR_MEASUREMENT_DATA',
  RequestForSettlementMasterData: 'REQUEST_FOR_SETTLEMENT_MASTER_DATA',
  SubmitExpectedAnnualConsumptionEnergySupplier: 'SUBMIT_EXPECTED_ANNUAL_CONSUMPTION_ENERGY_SUPPLIER',
  SubmitExpectedAnnualConsumptionGridAccessProvider: 'SUBMIT_EXPECTED_ANNUAL_CONSUMPTION_GRID_ACCESS_PROVIDER',
  SubmitCounterReadingEnergySupplier: 'SUBMIT_COUNTER_READING_ENERGY_SUPPLIER',
  SubmitCounterReadingGridAccessProvider: 'SUBMIT_COUNTER_READING_GRID_ACCESS_PROVIDER',
  RequestForServiceFromGridAccessProvider: 'REQUEST_FOR_SERVICE_FROM_GRID_ACCESS_PROVIDER',
  Unsubscribe: 'UNSUBSCRIBE',
  StopTariff: 'STOP_TARIFF',
  DismantlingOfMeter: 'DISMANTLING_OF_METER',
  UpdateSpecialMeteringPoint: 'UPDATE_SPECIAL_METERING_POINT',
  UpdateHistoricMeteringPoint: 'UPDATE_HISTORIC_METERING_POINT',
  ChangeMeter: 'CHANGE_METER',
  ChangeInPurchaseObligation: 'CHANGE_IN_PURCHASE_OBLIGATION',
  DisplayingCumulativeDataNotOwner: 'DISPLAYING_CUMULATIVE_DATA_NOT_OWNER',
  ViewingMoves: 'VIEWING_MOVES',
  DisplayingMeasurementPoint: 'DISPLAYING_MEASUREMENT_POINT',
  DisplayingMeasurementPointNotOwner: 'DISPLAYING_MEASUREMENT_POINT_NOT_OWNER',
  DisplayingMeasurementDataNotOwner: 'DISPLAYING_MEASUREMENT_DATA_NOT_OWNER',
  InterruptionAndReopeningOfMeasurementPoint: 'INTERRUPTION_AND_REOPENING_OF_MEASUREMENT_POINT',
  ConnectingMeasuringPoint: 'CONNECTING_MEASURING_POINT',
  ChangeBalanceResponsiblePartyConsumption: 'CHANGE_BALANCE_RESPONSIBLE_PARTY_CONSUMPTION',
  ChangeBalanceResponsiblePartyProduction: 'CHANGE_BALANCE_RESPONSIBLE_PARTY_PRODUCTION',
  MergerOfNetworkAreas: 'MERGER_OF_NETWORK_AREAS',
  MassCorrection: 'MASS_CORRECTION',
  ChangeOfPaymentMethod: 'CHANGE_OF_PAYMENT_METHOD',
  DecommissioningMeasuringPoint: 'DECOMMISSIONING_MEASURING_POINT',
  CancellationOfConsumptionStatementMarketProcess: 'CANCELLATION_OF_CONSUMPTION_STATEMENT_MARKET_PROCESS',
  CancellationOfConsumptionStatementReadingDate: 'CANCELLATION_OF_CONSUMPTION_STATEMENT_READING_DATE',
  ConsumptionStatementMeasuringPoint: 'CONSUMPTION_STATEMENT_MEASURING_POINT',
  HistoricalTransactionCorrection: 'HISTORICAL_TRANSACTION_CORRECTION',
  StartCancellationOfSupplierChange: 'START_CANCELLATION_OF_SUPPLIER_CHANGE',
  ConsumptionStatementCancelsNotMarketProcess: 'CONSUMPTION_STATEMENT_CANCELS_NOT_MARKET_PROCESS',
  ConsumptionStatementCancelsMarketProcess: 'CONSUMPTION_STATEMENT_CANCELS_MARKET_PROCESS',
  CreateHistoricalMeteringPoint: 'CREATE_HISTORICAL_METERING_POINT',
  EmptyTransaction: 'EMPTY_TRANSACTION'
} as const;

export type ElectricityMarketViewTransactionType = typeof ElectricityMarketViewTransactionType[keyof typeof ElectricityMarketViewTransactionType];
export const ElectricityMarketViewWashInstructions = {
  Washable: 'WASHABLE',
  NotWashable: 'NOT_WASHABLE'
} as const;

export type ElectricityMarketViewWashInstructions = typeof ElectricityMarketViewWashInstructions[keyof typeof ElectricityMarketViewWashInstructions];
export const EsettTimeSeriesType = {
  MgaExchange: 'MgaExchange',
  Production: 'Production',
  Consumption: 'Consumption'
} as const;

export type EsettTimeSeriesType = typeof EsettTimeSeriesType[keyof typeof EsettTimeSeriesType];
export const ExchangeEventCalculationType = {
  BalanceFixing: 'BALANCE_FIXING',
  Aggregation: 'AGGREGATION'
} as const;

export type ExchangeEventCalculationType = typeof ExchangeEventCalculationType[keyof typeof ExchangeEventCalculationType];
export const GridAreaAuditedChange = {
  Name: 'NAME',
  ConsolidationRequested: 'CONSOLIDATION_REQUESTED',
  ConsolidationCompleted: 'CONSOLIDATION_COMPLETED',
  Decommissioned: 'DECOMMISSIONED'
} as const;

export type GridAreaAuditedChange = typeof GridAreaAuditedChange[keyof typeof GridAreaAuditedChange];
export const GridAreaStatus = {
  Created: 'Created',
  Active: 'Active',
  Expired: 'Expired',
  Archived: 'Archived',
  ToBeDiscontinued: 'ToBeDiscontinued'
} as const;

export type GridAreaStatus = typeof GridAreaStatus[keyof typeof GridAreaStatus];
export const GridAreaType = {
  NotSet: 'NotSet',
  Transmission: 'Transmission',
  Distribution: 'Distribution',
  Other: 'Other',
  Test: 'Test',
  GridLossDk: 'GridLossDK',
  GridLossAbroad: 'GridLossAbroad',
  Aboard: 'Aboard'
} as const;

export type GridAreaType = typeof GridAreaType[keyof typeof GridAreaType];
export const ImbalancePriceStatus = {
  NoData: 'NO_DATA',
  InComplete: 'IN_COMPLETE',
  Complete: 'COMPLETE'
} as const;

export type ImbalancePriceStatus = typeof ImbalancePriceStatus[keyof typeof ImbalancePriceStatus];
export const MarketParticipantDelegationStatus = {
  Awaiting: 'AWAITING',
  Active: 'ACTIVE',
  Expired: 'EXPIRED',
  Cancelled: 'CANCELLED'
} as const;

export type MarketParticipantDelegationStatus = typeof MarketParticipantDelegationStatus[keyof typeof MarketParticipantDelegationStatus];
export const MarketParticipantMeteringPointType = {
  Unknown: 'Unknown',
  D01VeProduction: 'D01VeProduction',
  D02Analysis: 'D02Analysis',
  D03NotUsed: 'D03NotUsed',
  D04SurplusProductionGroup6: 'D04SurplusProductionGroup6',
  D05NetProduction: 'D05NetProduction',
  D06SupplyToGrid: 'D06SupplyToGrid',
  D07ConsumptionFromGrid: 'D07ConsumptionFromGrid',
  D08WholeSaleServicesInformation: 'D08WholeSaleServicesInformation',
  D09OwnProduction: 'D09OwnProduction',
  D10NetFromGrid: 'D10NetFromGrid',
  D11NetToGrid: 'D11NetToGrid',
  D12TotalConsumption: 'D12TotalConsumption',
  D13NetLossCorrection: 'D13NetLossCorrection',
  D14ElectricalHeating: 'D14ElectricalHeating',
  D15NetConsumption: 'D15NetConsumption',
  D17OtherConsumption: 'D17OtherConsumption',
  D18OtherProduction: 'D18OtherProduction',
  D20ExchangeReactiveEnergy: 'D20ExchangeReactiveEnergy',
  D99InternalUse: 'D99InternalUse',
  E17Consumption: 'E17Consumption',
  E18Production: 'E18Production',
  E20Exchange: 'E20Exchange'
} as const;

export type MarketParticipantMeteringPointType = typeof MarketParticipantMeteringPointType[keyof typeof MarketParticipantMeteringPointType];
export const MarketParticipantStatus = {
  New: 'New',
  Active: 'Active',
  Inactive: 'Inactive',
  Passive: 'Passive',
  ToBeDiscontinued: 'ToBeDiscontinued',
  Discontinued: 'Discontinued'
} as const;

export type MarketParticipantStatus = typeof MarketParticipantStatus[keyof typeof MarketParticipantStatus];
export const MeasurementsReportMarketRole = {
  GridAccessProvider: 'GRID_ACCESS_PROVIDER',
  EnergySupplier: 'ENERGY_SUPPLIER',
  SystemOperator: 'SYSTEM_OPERATOR',
  DanishEnergyAgency: 'DANISH_ENERGY_AGENCY',
  DataHubAdministrator: 'DATA_HUB_ADMINISTRATOR'
} as const;

export type MeasurementsReportMarketRole = typeof MeasurementsReportMarketRole[keyof typeof MeasurementsReportMarketRole];
export const MeasurementsReportMeteringPointType = {
  Consumption: 'Consumption',
  Production: 'Production',
  Exchange: 'Exchange',
  VeProduction: 'VeProduction',
  NetProduction: 'NetProduction',
  SupplyToGrid: 'SupplyToGrid',
  ConsumptionFromGrid: 'ConsumptionFromGrid',
  WholesaleServicesInformation: 'WholesaleServicesInformation',
  OwnProduction: 'OwnProduction',
  NetFromGrid: 'NetFromGrid',
  NetToGrid: 'NetToGrid',
  TotalConsumption: 'TotalConsumption',
  ElectricalHeating: 'ElectricalHeating',
  NetConsumption: 'NetConsumption',
  CapacitySettlement: 'CapacitySettlement',
  Analysis: 'Analysis',
  OtherConsumption: 'OtherConsumption',
  OtherProduction: 'OtherProduction',
  ExchangeReactiveEnergy: 'ExchangeReactiveEnergy',
  CollectiveNetProduction: 'CollectiveNetProduction',
  CollectiveNetConsumption: 'CollectiveNetConsumption'
} as const;

export type MeasurementsReportMeteringPointType = typeof MeasurementsReportMeteringPointType[keyof typeof MeasurementsReportMeteringPointType];
export const MeasurementsReportStatusType = {
  InProgress: 'IN_PROGRESS',
  Error: 'ERROR',
  Completed: 'COMPLETED',
  Canceled: 'CANCELED'
} as const;

export type MeasurementsReportStatusType = typeof MeasurementsReportStatusType[keyof typeof MeasurementsReportStatusType];
/** Message type */
export const MessageType = {
  UserMessage: 'USER_MESSAGE',
  ClosingMessage: 'CLOSING_MESSAGE'
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];
export const MeteringGridImbalanceValuesToInclude = {
  Imbalances: 'IMBALANCES',
  Balances: 'BALANCES',
  Both: 'BOTH'
} as const;

export type MeteringGridImbalanceValuesToInclude = typeof MeteringGridImbalanceValuesToInclude[keyof typeof MeteringGridImbalanceValuesToInclude];
export const MeteringPointDocumentType = {
  B2CUpdateChargeLinks: 'B2C_UPDATE_CHARGE_LINKS',
  Acknowledgement: 'ACKNOWLEDGEMENT',
  SendMeasurements: 'SEND_MEASUREMENTS',
  RequestMeasurements: 'REQUEST_MEASUREMENTS',
  RejectRequestMeasurements: 'REJECT_REQUEST_MEASUREMENTS',
  UpdateChargeLinks: 'UPDATE_CHARGE_LINKS',
  ConfirmRequestChangeBillingMasterData: 'CONFIRM_REQUEST_CHANGE_BILLING_MASTER_DATA',
  RejectRequestChangeBillingMasterData: 'REJECT_REQUEST_CHANGE_BILLING_MASTER_DATA',
  NotifyBillingMasterData: 'NOTIFY_BILLING_MASTER_DATA'
} as const;

export type MeteringPointDocumentType = typeof MeteringPointDocumentType[keyof typeof MeteringPointDocumentType];
export const MeteringPointType = {
  All: 'ALL',
  Production: 'PRODUCTION',
  FlexConsumption: 'FLEX_CONSUMPTION',
  TotalConsumption: 'TOTAL_CONSUMPTION',
  NonProfiledConsumption: 'NON_PROFILED_CONSUMPTION',
  Exchange: 'EXCHANGE'
} as const;

export type MeteringPointType = typeof MeteringPointType[keyof typeof MeteringPointType];
export const NotificationType = {
  BalanceResponsibilityValidationFailed: 'BalanceResponsibilityValidationFailed',
  BalanceResponsibilityActorUnrecognized: 'BalanceResponsibilityActorUnrecognized',
  SettlementReportReadyForDownload: 'SettlementReportReadyForDownload',
  SettlementReportFailed: 'SettlementReportFailed',
  NewBalanceResponsibilityReceived: 'NewBalanceResponsibilityReceived',
  MeteringGridAreaIsImbalanced: 'MeteringGridAreaIsImbalanced',
  ActorCredentialsExpiring: 'ActorCredentialsExpiring',
  ActorConsolidationScheduled: 'ActorConsolidationScheduled',
  GridLossValidationError: 'GridLossValidationError',
  SystemCorrectionValidationError: 'SystemCorrectionValidationError'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
export const OrganizationAuditedChange = {
  Domain: 'DOMAIN',
  Name: 'NAME'
} as const;

export type OrganizationAuditedChange = typeof OrganizationAuditedChange[keyof typeof OrganizationAuditedChange];
export const PermissionAuditedChange = {
  Claim: 'CLAIM',
  Description: 'DESCRIPTION'
} as const;

export type PermissionAuditedChange = typeof PermissionAuditedChange[keyof typeof PermissionAuditedChange];
export const PriceAreaCode = {
  Dk1: 'DK1',
  Dk2: 'DK2'
} as const;

export type PriceAreaCode = typeof PriceAreaCode[keyof typeof PriceAreaCode];
export const PriceType = {
  Tariff: 'TARIFF',
  Subscription: 'SUBSCRIPTION',
  Fee: 'FEE',
  TariffSubscriptionAndFee: 'TARIFF_SUBSCRIPTION_AND_FEE',
  MonthlyTariff: 'MONTHLY_TARIFF',
  MonthlySubscription: 'MONTHLY_SUBSCRIPTION',
  MonthlyFee: 'MONTHLY_FEE',
  MonthlyTariffSubscriptionAndFee: 'MONTHLY_TARIFF_SUBSCRIPTION_AND_FEE'
} as const;

export type PriceType = typeof PriceType[keyof typeof PriceType];
export const ProcessState = {
  Scheduled: 'scheduled',
  Pending: 'pending',
  Running: 'running',
  Failed: 'failed',
  Canceled: 'canceled',
  Succeeded: 'succeeded'
} as const;

export type ProcessState = typeof ProcessState[keyof typeof ProcessState];
export const ProcessStepState = {
  Pending: 'pending',
  Running: 'running',
  Failed: 'failed',
  Skipped: 'skipped',
  Canceled: 'canceled',
  Succeeded: 'succeeded'
} as const;

export type ProcessStepState = typeof ProcessStepState[keyof typeof ProcessStepState];
export const Quality = {
  Missing: 'MISSING',
  Estimated: 'ESTIMATED',
  Calculated: 'CALCULATED',
  Measured: 'MEASURED'
} as const;

export type Quality = typeof Quality[keyof typeof Quality];
export const RequestCalculationType = {
  Aggregation: 'AGGREGATION',
  BalanceFixing: 'BALANCE_FIXING',
  WholesaleFixing: 'WHOLESALE_FIXING',
  FirstCorrectionSettlement: 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement: 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement: 'THIRD_CORRECTION_SETTLEMENT',
  LatestCorrectionSettlement: 'LATEST_CORRECTION_SETTLEMENT'
} as const;

export type RequestCalculationType = typeof RequestCalculationType[keyof typeof RequestCalculationType];
export const Resolution = {
  QuarterHourly: 'QUARTER_HOURLY',
  Hourly: 'HOURLY',
  Daily: 'DAILY',
  Monthly: 'MONTHLY',
  Yearly: 'YEARLY'
} as const;

export type Resolution = typeof Resolution[keyof typeof Resolution];
export const SendMeasurementsMeasurementUnit = {
  KilowattHour: 'KILOWATT_HOUR',
  KiloVoltAmpereReactiveHour: 'KILO_VOLT_AMPERE_REACTIVE_HOUR'
} as const;

export type SendMeasurementsMeasurementUnit = typeof SendMeasurementsMeasurementUnit[keyof typeof SendMeasurementsMeasurementUnit];
export const SendMeasurementsMeteringPointType = {
  Consumption: 'CONSUMPTION',
  Production: 'PRODUCTION',
  Exchange: 'EXCHANGE',
  VeProduction: 'VE_PRODUCTION',
  Analysis: 'ANALYSIS',
  SurplusProductionGroup6: 'SURPLUS_PRODUCTION_GROUP6',
  NetProduction: 'NET_PRODUCTION',
  SupplyToGrid: 'SUPPLY_TO_GRID',
  ConsumptionFromGrid: 'CONSUMPTION_FROM_GRID',
  WholesaleServicesInformation: 'WHOLESALE_SERVICES_INFORMATION',
  OwnProduction: 'OWN_PRODUCTION',
  NetFromGrid: 'NET_FROM_GRID',
  NetToGrid: 'NET_TO_GRID',
  TotalConsumption: 'TOTAL_CONSUMPTION',
  OtherConsumption: 'OTHER_CONSUMPTION',
  OtherProduction: 'OTHER_PRODUCTION',
  ExchangeReactiveEnergy: 'EXCHANGE_REACTIVE_ENERGY',
  CollectiveNetProduction: 'COLLECTIVE_NET_PRODUCTION',
  CollectiveNetConsumption: 'COLLECTIVE_NET_CONSUMPTION',
  InternalUse: 'INTERNAL_USE'
} as const;

export type SendMeasurementsMeteringPointType = typeof SendMeasurementsMeteringPointType[keyof typeof SendMeasurementsMeteringPointType];
export const SendMeasurementsQuality = {
  Estimated: 'ESTIMATED',
  Measured: 'MEASURED'
} as const;

export type SendMeasurementsQuality = typeof SendMeasurementsQuality[keyof typeof SendMeasurementsQuality];
export const SendMeasurementsResolution = {
  Monthly: 'MONTHLY',
  Hourly: 'HOURLY',
  QuarterHourly: 'QUARTER_HOURLY'
} as const;

export type SendMeasurementsResolution = typeof SendMeasurementsResolution[keyof typeof SendMeasurementsResolution];
export const SettlementReportMarketRole = {
  GridAccessProvider: 'GRID_ACCESS_PROVIDER',
  EnergySupplier: 'ENERGY_SUPPLIER',
  SystemOperator: 'SYSTEM_OPERATOR',
  DataHubAdministrator: 'DATA_HUB_ADMINISTRATOR'
} as const;

export type SettlementReportMarketRole = typeof SettlementReportMarketRole[keyof typeof SettlementReportMarketRole];
export const SettlementReportStatusType = {
  InProgress: 'IN_PROGRESS',
  Error: 'ERROR',
  Completed: 'COMPLETED',
  Canceled: 'CANCELED'
} as const;

export type SettlementReportStatusType = typeof SettlementReportStatusType[keyof typeof SettlementReportStatusType];
export const SortDirection = {
  Asc: 'ASC',
  Desc: 'DESC'
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
export const SortEnumType = {
  Asc: 'ASC',
  Desc: 'DESC'
} as const;

export type SortEnumType = typeof SortEnumType[keyof typeof SortEnumType];
export const StartCalculationType = {
  Aggregation: 'AGGREGATION',
  BalanceFixing: 'BALANCE_FIXING',
  WholesaleFixing: 'WHOLESALE_FIXING',
  FirstCorrectionSettlement: 'FIRST_CORRECTION_SETTLEMENT',
  SecondCorrectionSettlement: 'SECOND_CORRECTION_SETTLEMENT',
  ThirdCorrectionSettlement: 'THIRD_CORRECTION_SETTLEMENT',
  CapacitySettlement: 'CAPACITY_SETTLEMENT'
} as const;

export type StartCalculationType = typeof StartCalculationType[keyof typeof StartCalculationType];
export const Unit = {
  KWh: 'K_WH',
  KW: 'K_W',
  Mw: 'MW',
  MWh: 'M_WH',
  Tonne: 'TONNE',
  KVArh: 'K_V_ARH',
  MvAr: 'MV_AR'
} as const;

export type Unit = typeof Unit[keyof typeof Unit];
export const UserAuditedChange = {
  FirstName: 'FIRST_NAME',
  LastName: 'LAST_NAME',
  PhoneNumber: 'PHONE_NUMBER',
  Status: 'STATUS',
  InvitedIntoActor: 'INVITED_INTO_ACTOR',
  UserRoleAssigned: 'USER_ROLE_ASSIGNED',
  UserRoleRemoved: 'USER_ROLE_REMOVED',
  UserRoleRemovedDueToDeactivation: 'USER_ROLE_REMOVED_DUE_TO_DEACTIVATION',
  UserLoginFederationRequested: 'USER_LOGIN_FEDERATION_REQUESTED',
  UserLoginFederated: 'USER_LOGIN_FEDERATED',
  UserLoginFederationReset: 'USER_LOGIN_FEDERATION_RESET'
} as const;

export type UserAuditedChange = typeof UserAuditedChange[keyof typeof UserAuditedChange];
export const UserOverviewSortProperty = {
  FirstName: 'FirstName',
  LastName: 'LastName',
  Email: 'Email',
  PhoneNumber: 'PhoneNumber',
  CreatedDate: 'CreatedDate',
  Status: 'Status',
  LatestLoginAt: 'LatestLoginAt'
} as const;

export type UserOverviewSortProperty = typeof UserOverviewSortProperty[keyof typeof UserOverviewSortProperty];
export const UserRoleAuditedChange = {
  Name: 'NAME',
  Description: 'DESCRIPTION',
  Status: 'STATUS',
  PermissionAdded: 'PERMISSION_ADDED',
  PermissionRemoved: 'PERMISSION_REMOVED'
} as const;

export type UserRoleAuditedChange = typeof UserRoleAuditedChange[keyof typeof UserRoleAuditedChange];
export const UserRoleStatus = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE'
} as const;

export type UserRoleStatus = typeof UserRoleStatus[keyof typeof UserRoleStatus];
export const UserStatus = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Invited: 'INVITED',
  InviteExpired: 'INVITE_EXPIRED'
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];
export const WorkflowAction = {
  NoAction: 'NO_ACTION',
  SendInformation: 'SEND_INFORMATION',
  CancelWorkflow: 'CANCEL_WORKFLOW'
} as const;

export type WorkflowAction = typeof WorkflowAction[keyof typeof WorkflowAction];
export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename: 'Mutation', inviteUser: { __typename: 'InviteUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type DeactivateUserMutationVariables = Exact<{
  input: DeactivateUserInput;
}>;


export type DeactivateUserMutation = { __typename: 'Mutation', deactivateUser: { __typename: 'DeactivateUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type CreateUserRoleMutationVariables = Exact<{
  input: CreateUserRoleInput;
}>;


export type CreateUserRoleMutation = { __typename: 'Mutation', createUserRole: { __typename: 'CreateUserRolePayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type ReActivateUserMutationVariables = Exact<{
  input: ReActivateUserInput;
}>;


export type ReActivateUserMutation = { __typename: 'Mutation', reActivateUser: { __typename: 'ReActivateUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type DeactivateUserRoleMutationVariables = Exact<{
  input: DeactivateUserRoleInput;
}>;


export type DeactivateUserRoleMutation = { __typename: 'Mutation', deactivateUserRole: { __typename: 'DeactivateUserRolePayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type ReInviteUserMutationVariables = Exact<{
  input: ReInviteUserInput;
}>;


export type ReInviteUserMutation = { __typename: 'Mutation', reInviteUser: { __typename: 'ReInviteUserPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type Reset2faMutationVariables = Exact<{
  input: ResetTwoFactorAuthenticationInput;
}>;


export type Reset2faMutation = { __typename: 'Mutation', resetTwoFactorAuthentication: { __typename: 'ResetTwoFactorAuthenticationPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type ResetMitIdMutationVariables = Exact<{
  input: ResetMitIdInput;
}>;


export type ResetMitIdMutation = { __typename: 'Mutation', resetMitId: { __typename: 'ResetMitIdPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type CheckEmailExistsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type CheckEmailExistsQuery = { __typename: 'Query', emailExists: boolean };

export type CheckDomainExistsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type CheckDomainExistsQuery = { __typename: 'Query', domainExists: boolean };

export type UpdateUserAndRolesMutationVariables = Exact<{
  updateUserInput: UpdateUserIdentityInput;
  updateRolesInput: UpdateUserRoleAssignmentInput;
}>;


export type UpdateUserAndRolesMutation = { __typename: 'Mutation', updateUserIdentity: { __typename: 'UpdateUserIdentityPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null }, updateUserRoleAssignment: { __typename: 'UpdateUserRoleAssignmentPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UpdateUserRoleMutationVariables = Exact<{
  input: UpdateUserRoleInput;
}>;


export type UpdateUserRoleMutation = { __typename: 'Mutation', updateUserRole: { __typename: 'UpdateUserRolePayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UpdatePermissionMutationVariables = Exact<{
  input: UpdatePermissionInput;
}>;


export type UpdatePermissionMutation = { __typename: 'Mutation', updatePermission: { __typename: 'UpdatePermissionPayload', permission?: { __typename: 'Permission', id: number } | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetFilteredMarketParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFilteredMarketParticipantsQuery = { __typename: 'Query', filteredMarketParticipants: Array<{ __typename: 'MarketParticipant', id: string, name: string, marketRole: EicFunction, organization: { __typename: 'Organization', id: string, domains: Array<string> } }> };

export type GetFilteredUserRolesQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
  status?: InputMaybe<UserRoleStatus>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<UserRoleSortInput> | UserRoleSortInput>;
}>;


export type GetFilteredUserRolesQuery = { __typename: 'Query', filteredUserRoles?: { __typename: 'FilteredUserRolesConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'UserRoleDto', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> | null } | null };

export type GetFilteredPermissionsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<PermissionDtoSortInput> | PermissionDtoSortInput>;
}>;


export type GetFilteredPermissionsQuery = { __typename: 'Query', filteredPermissions?: { __typename: 'FilteredPermissionsConnection', permissionRelationsUrl?: string | null, totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'Permission', id: number, name: string, description: string }> | null } | null };

export type GetPermissionByEicFunctionQueryVariables = Exact<{
  eicFunction: EicFunction;
}>;


export type GetPermissionByEicFunctionQuery = { __typename: 'Query', permissionsByEicFunction: Array<{ __typename: 'PermissionDetailsDto', id: number, name: string, description: string, created: Date }> };

export type GetAssociatedMarketParticipantsQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GetAssociatedMarketParticipantsQuery = { __typename: 'Query', associatedMarketParticipants: { __typename: 'AssociatedMarketParticipants', email: string, marketParticipants: Array<string> } };

export type GetPermissionAuditLogsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionAuditLogsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, auditLogs: Array<{ __typename: 'PermissionAuditedChangeAuditLogDto', change: PermissionAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> } };

export type GetSelectionMarketParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectionMarketParticipantsQuery = { __typename: 'Query', selectionMarketParticipants: Array<{ __typename: 'SelectionActorDto', id: string, gln: string, actorName: string, organizationName: string, marketRole: EicFunction }> };

export type GetPermissionEditQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionEditQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string } };

export type GetPermissionDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPermissionDetailsQuery = { __typename: 'Query', permissionById: { __typename: 'Permission', id: number, name: string, description: string, created: Date, assignableTo: Array<EicFunction>, userRoles: Array<{ __typename: 'UserRoleDto', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> } };

export type GetUserAuditLogsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type GetUserAuditLogsQuery = { __typename: 'Query', userById: { __typename: 'User', id: string, auditLogs: Array<{ __typename: 'UserAuditedChangeAuditLogDto', change: UserAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedActorName?: string | null, affectedUserRoleName?: string | null }> } };

export type GetUserEditQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserEditQuery = { __typename: 'Query', userById: { __typename: 'User', id: string, firstName: string, phoneNumber?: string | null, lastName: string } };

export type GetUserRoleAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleAuditLogsQuery = { __typename: 'Query', userRoleById: { __typename: 'UserRoleWithPermissions', id: string, auditLogs: Array<{ __typename: 'UserRoleAuditedChangeAuditLogDto', change: UserRoleAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null, affectedPermissionName?: string | null }> } };

export type GetUserDetailsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserDetailsQuery = { __typename: 'Query', userById: { __typename: 'User', id: string, email: string, phoneNumber?: string | null, name: string, status: UserStatus } };

export type GetUserRolesByActorIdQueryVariables = Exact<{
  actorId: Scalars['UUID']['input'];
}>;


export type GetUserRolesByActorIdQuery = { __typename: 'Query', userRolesByActorId: Array<{ __typename: 'UserRoleDto', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus }> };

export type GetUserRolesQueryVariables = Exact<{
  actorId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type GetUserRolesQuery = { __typename: 'Query', userRoles: Array<{ __typename: 'UserRoleDto', id: string, name: string, eicFunction: EicFunction }> };

export type GetUsersForCsvQueryVariables = Exact<{
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  userStatus?: InputMaybe<Array<UserStatus> | UserStatus>;
  userRoleIds?: InputMaybe<Array<Scalars['UUID']['input']> | Scalars['UUID']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<UsersSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersForCsvQuery = { __typename: 'Query', users?: { __typename: 'UsersCollectionSegment', totalCount: number, items?: Array<{ __typename: 'UserOverviewItemDto', id: string, name: string, email: string, administratedByName: string, administratedByOrganizationName: string, latestLoginAt?: Date | null }> | null, pageInfo: { __typename: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetUsersQueryVariables = Exact<{
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  userRoleIds?: InputMaybe<Array<Scalars['UUID']['input']> | Scalars['UUID']['input']>;
  userStatus?: InputMaybe<Array<UserStatus> | UserStatus>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<UsersSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUsersQuery = { __typename: 'Query', users?: { __typename: 'UsersCollectionSegment', totalCount: number, items?: Array<{ __typename: 'UserOverviewItemDto', name: string, email: string, phoneNumber?: string | null, status: UserStatus, id: string, latestLoginAt?: Date | null }> | null, pageInfo: { __typename: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type DismissAllNotificationsMutationVariables = Exact<{
  input: DismissAllNotificationsInput;
}>;


export type DismissAllNotificationsMutation = { __typename: 'Mutation', dismissAllNotifications: { __typename: 'DismissAllNotificationsPayload', success?: boolean | null } };

export type GetUserRoleWithPermissionsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetUserRoleWithPermissionsQuery = { __typename: 'Query', userRoleById: { __typename: 'UserRoleWithPermissions', id: string, name: string, description: string, eicFunction: EicFunction, status: UserRoleStatus, permissions: Array<{ __typename: 'PermissionDetailsDto', id: number, name: string, description: string }> } };

export type DismissNotificationMutationVariables = Exact<{
  input: DismissNotificationInput;
}>;


export type DismissNotificationMutation = { __typename: 'Mutation', dismissNotification: { __typename: 'DismissNotificationPayload', success?: boolean | null } };

export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { __typename: 'Query', notifications: Array<{ __typename: 'NotificationDto', id: number, notificationType: NotificationType, occurredAt: Date, relatedToId?: string | null }> };

export type GetSettlementReportQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetSettlementReportQuery = { __typename: 'Query', settlementReportById?: { __typename: 'SettlementReport', id: string, period: { start: Date, end: Date | null }, calculationType: CalculationType, gridAreas: Array<string>, settlementReportDownloadUrl?: string | null } | null };

export type OnNotificationAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnNotificationAddedSubscription = { __typename: 'Subscription', notificationAdded: { __typename: 'NotificationDto', id: number, notificationType: NotificationType, relatedToId?: string | null, occurredAt: Date, expiresAt: Date } };

export type ManuallyHandleOutgoingMessageMutationVariables = Exact<{
  input: ManuallyHandleOutgoingMessageInput;
}>;


export type ManuallyHandleOutgoingMessageMutation = { __typename: 'Mutation', manuallyHandleOutgoingMessage: { __typename: 'ManuallyHandleOutgoingMessagePayload', success?: boolean | null } };

export type GetActorsAndUserRolesQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActorsAndUserRolesQuery = { __typename: 'Query', userById: { __typename: 'User', id: string, administratedBy?: { __typename: 'MarketParticipant', id: string, name: string } | null, actors: Array<{ __typename: 'MarketParticipant', id: string, name: string, glnOrEicNumber: string, organization: { __typename: 'Organization', id: string, name: string }, userRoles: Array<{ __typename: 'MarketParticipantUserRole', id: string, eicFunction: EicFunction, name: string, description: string, assigned: boolean }> }> } };

export type GetBalanceResponsibleByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetBalanceResponsibleByIdQuery = { __typename: 'Query', balanceResponsibleById: { __typename: 'BalanceResponsible', id: string, energySupplierName?: string | null, balanceResponsibleName?: string | null, meteringPointType: BalanceResponsibilityMeteringPointType, validPeriod: { start: Date, end: Date | null }, receivedDateTime: Date, storageDocumentUrl?: string | null, supplier: string, balanceResponsible: string, gridArea?: { __typename: 'GridAreaDto', id: string, name: string, code: string } | null } };

export type GetOutgoingMessageByIdQueryVariables = Exact<{
  documentId: Scalars['String']['input'];
}>;


export type GetOutgoingMessageByIdQuery = { __typename: 'Query', esettOutgoingMessageById: { __typename: 'EsettOutgoingMessage', documentId: string, calculationType: ExchangeEventCalculationType, created: Date, period: { start: Date, end: Date | null }, documentStatus: DocumentStatus, lastDispatched?: Date | null, timeSeriesType: EsettTimeSeriesType, responseDocumentUrl?: string | null, dispatchDocumentUrl?: string | null, gridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null, manuallyHandledExchangeEventMetaData?: { __typename: 'ManuallyHandledExchangeEventMetaData', comment: string, manuallyHandledAt: Date, manuallyHandledByIdentityDisplayName: string } | null } };

export type GetBalanceResponsibleMessagesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<BalanceResponsibleSortInput>;
  locale: Scalars['String']['input'];
}>;


export type GetBalanceResponsibleMessagesQuery = { __typename: 'Query', balanceResponsible?: { __typename: 'BalanceResponsibleCollectionSegment', balanceResponsiblesUrl?: string | null, balanceResponsibleImportUrl?: string | null, totalCount: number, items?: Array<{ __typename: 'BalanceResponsible', id: string, receivedDateTime: Date, energySupplierName?: string | null, supplier: string, balanceResponsibleName?: string | null, storageDocumentUrl?: string | null, balanceResponsible: string, meteringPointType: BalanceResponsibilityMeteringPointType, validPeriod: { start: Date, end: Date | null }, gridArea?: { __typename: 'GridAreaDto', id: string, code: string, name: string } | null }> | null, pageInfo: { __typename: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetOutgoingMessagesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  documentStatuses?: InputMaybe<Array<DocumentStatus> | DocumentStatus>;
  timeSeriesType?: InputMaybe<EsettTimeSeriesType>;
  filter?: InputMaybe<Scalars['String']['input']>;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<EsettExchangeEventSortInput>;
}>;


export type GetOutgoingMessagesQuery = { __typename: 'Query', esettExchangeEvents?: { __typename: 'EsettExchangeEventsCollectionSegment', totalCount: number, gridAreaCount: number, items?: Array<{ __typename: 'ExchangeEventSearchResult', created: Date, lastDispatched?: Date | null, documentId: string, actorNumber?: string | null, calculationType: ExchangeEventCalculationType, timeSeriesType: EsettTimeSeriesType, gridAreaCodeOut?: string | null, documentStatus: DocumentStatus, energySupplier?: { __typename: 'ActorNameDto', value: string } | null, gridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null }> | null, pageInfo: { __typename: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type ResendExchangeMessagesMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendExchangeMessagesMutation = { __typename: 'Mutation', resendWaitingEsettExchangeMessages: { __typename: 'ResendWaitingEsettExchangeMessagesPayload', success?: boolean | null } };

export type DownloadEsettExchangeEventsQueryVariables = Exact<{
  locale: Scalars['String']['input'];
  periodInterval?: InputMaybe<Scalars['DateRange']['input']>;
  createdInterval?: InputMaybe<Scalars['DateRange']['input']>;
  sentInterval?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  calculationType?: InputMaybe<ExchangeEventCalculationType>;
  timeSeriesType?: InputMaybe<EsettTimeSeriesType>;
  documentStatuses?: InputMaybe<Array<DocumentStatus> | DocumentStatus>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<EsettExchangeEventSortInput>;
  actorNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type DownloadEsettExchangeEventsQuery = { __typename: 'Query', downloadEsettExchangeEvents: string };

export type GetImbalancePricesMonthOverviewQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
  areaCode: PriceAreaCode;
}>;


export type GetImbalancePricesMonthOverviewQuery = { __typename: 'Query', imbalancePricesForMonth: Array<{ __typename: 'ImbalancePriceDaily', status: ImbalancePriceStatus, timeStamp: Date, importedAt?: Date | null, imbalancePricesDownloadImbalanceUrl: string, imbalancePrices: Array<{ __typename: 'ImbalancePrice', timestamp: Date, price?: number | null }> }> };

export type GetStatusReportQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatusReportQuery = { __typename: 'Query', esettExchangeStatusReport: { __typename: 'ExchangeEventStatusReportResponse', waitingForExternalResponse: number } };

export type GetServiceStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServiceStatusQuery = { __typename: 'Query', esettServiceStatus: Array<{ __typename: 'ReadinessStatusDto', component: ESettStageComponent, isReady: boolean }> };

export type GetImbalancePricesOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetImbalancePricesOverviewQuery = { __typename: 'Query', imbalancePricesOverview: { __typename: 'ImbalancePricesOverview', uploadImbalancePricesUrl: string, pricePeriods: Array<{ __typename: 'ImbalancePricePeriod', name: Date, priceAreaCode: PriceAreaCode, status: ImbalancePriceStatus }> } };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename: 'Mutation', updateUserProfile: { __typename: 'UpdateUserProfilePayload', saved?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type UserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProfileQuery = { __typename: 'Query', userProfile: { __typename: 'UserProfile', firstName: string, lastName: string, phoneNumber: string, hasFederatedLogin: boolean } };

export type CreateCalculationMutationVariables = Exact<{
  input: CreateCalculationInput;
}>;


export type CreateCalculationMutation = { __typename: 'Mutation', createCalculation: { __typename: 'CreateCalculationPayload', uuid?: string | null } };

type CalculationFields_CapacitySettlementCalculation_Fragment = { __typename: 'CapacitySettlementCalculation', yearMonth: string, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> };

type CalculationFields_ElectricalHeatingCalculation_Fragment = { __typename: 'ElectricalHeatingCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> };

type CalculationFields_MissingMeasurementsLogCalculation_Fragment = { __typename: 'MissingMeasurementsLogCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> };

type CalculationFields_NetConsumptionCalculation_Fragment = { __typename: 'NetConsumptionCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> };

type CalculationFields_WholesaleAndEnergyCalculation_Fragment = { __typename: 'WholesaleAndEnergyCalculation', period: { start: Date, end: Date | null }, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, displayName: string }>, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> };

export type CalculationFieldsFragment = CalculationFields_CapacitySettlementCalculation_Fragment | CalculationFields_ElectricalHeatingCalculation_Fragment | CalculationFields_MissingMeasurementsLogCalculation_Fragment | CalculationFields_NetConsumptionCalculation_Fragment | CalculationFields_WholesaleAndEnergyCalculation_Fragment;

export type GetMarketParticipantsForRequestCalculationQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetMarketParticipantsForRequestCalculationQuery = { __typename: 'Query', marketParticipantsForEicFunction: Array<{ __typename: 'MarketParticipant', id: string, marketRole: EicFunction, value: string, displayValue: string }> };

export type GetCalculationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetCalculationByIdQuery = { __typename: 'Query', calculationById?: { __typename: 'CapacitySettlementCalculation', yearMonth: string, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'ElectricalHeatingCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'MissingMeasurementsLogCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'NetConsumptionCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'WholesaleAndEnergyCalculation', period: { start: Date, end: Date | null }, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, displayName: string }>, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | null };

export type CancelScheduledCalculationMutationVariables = Exact<{
  input: CancelScheduledCalculationInput;
}>;


export type CancelScheduledCalculationMutation = { __typename: 'Mutation', cancelScheduledCalculation: { __typename: 'CancelScheduledCalculationPayload', boolean?: boolean | null } };

export type RequestMutationVariables = Exact<{
  input: RequestInput;
}>;


export type RequestMutation = { __typename: 'Mutation', request: { __typename: 'RequestPayload', success?: boolean | null } };

export type GetRequestOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRequestOptionsQuery = { __typename: 'Query', requestOptions: { __typename: 'RequestOptions', isGridAreaRequired: boolean, calculationTypes: Array<{ __typename: 'OptionOfRequestCalculationType', value: RequestCalculationType, displayValue: string }>, meteringPointTypes: Array<{ __typename: 'OptionOfMeteringPointType', value: MeteringPointType, displayValue: string }> } };

export type RequestMissingMeasurementsLogMutationVariables = Exact<{
  input: RequestMissingMeasurementsLogInput;
}>;


export type RequestMissingMeasurementsLogMutation = { __typename: 'Mutation', requestMissingMeasurementsLog: { __typename: 'RequestMissingMeasurementsLogPayload', success?: boolean | null } };

export type GetRequestsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<RequestSortInput> | RequestSortInput>;
}>;


export type GetRequestsQuery = { __typename: 'Query', requests?: { __typename: 'RequestsConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'RequestCalculatedEnergyTimeSeriesResult', calculationType?: RequestCalculationType | null, meteringPointType?: MeteringPointType | null, period?: { start: Date, end: Date | null } | null, id: string, createdAt: Date, state: ProcessState, messageId?: string | null, requestedBy?: { __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, displayName: string } | null } | { __typename: 'RequestCalculatedWholesaleServicesResult', calculationType?: RequestCalculationType | null, priceType?: PriceType | null, period?: { start: Date, end: Date | null } | null, id: string, createdAt: Date, state: ProcessState, messageId?: string | null, requestedBy?: { __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, displayName: string } | null }> | null } | null };

export type GetCalculationsQueryVariables = Exact<{
  input: CalculationsQueryInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<CalculationSortInput> | CalculationSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCalculationsQuery = { __typename: 'Query', calculations?: { __typename: 'CalculationsConnection', totalCount: number, capacitySettlementsUploadUrl?: string | null, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'CapacitySettlementCalculation', yearMonth: string, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'ElectricalHeatingCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'MissingMeasurementsLogCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'NetConsumptionCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'WholesaleAndEnergyCalculation', period: { start: Date, end: Date | null }, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, displayName: string }>, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> }> | null } | null };

export type GetSelectedMarketParticipantQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectedMarketParticipantQuery = { __typename: 'Query', selectedMarketParticipant: { __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, marketRole: EicFunction, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, name: string }> } };

export type GetArchivedMessagesQueryVariables = Exact<{
  created: Scalars['DateRange']['input'];
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  receiverId?: InputMaybe<Scalars['UUID']['input']>;
  documentTypes?: InputMaybe<Array<ArchivedMessageDocumentType> | ArchivedMessageDocumentType>;
  businessReasons?: InputMaybe<Array<BusinessReason> | BusinessReason>;
  includeRelated?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<ArchivedMessageSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetArchivedMessagesQuery = { __typename: 'Query', archivedMessages?: { __typename: 'ArchivedMessagesConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'ArchivedMessage', id: string, messageId: string, documentType: DocumentType, documentUrl?: string | null, createdAt: Date, sender?: { __typename: 'MarketParticipant', id: string, displayName: string, glnOrEicNumber: string } | null, receiver?: { __typename: 'MarketParticipant', id: string, displayName: string, glnOrEicNumber: string } | null }> | null } | null };

export type GetUserRolesForCsvQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
  status?: InputMaybe<UserRoleStatus>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<UserRoleSortInput> | UserRoleSortInput>;
}>;


export type GetUserRolesForCsvQuery = { __typename: 'Query', filteredUserRoles?: { __typename: 'FilteredUserRolesConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'UserRoleDto', id: string, name: string, eicFunction: EicFunction, status: UserRoleStatus }> | null } | null };

export type AddChargeSeriesMutationVariables = Exact<{
  input: AddChargeSeriesInput;
}>;


export type AddChargeSeriesMutation = { __typename: 'Mutation', addChargeSeries: { __typename: 'AddChargeSeriesPayload', boolean?: boolean | null } };

export type OnCalculationUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCalculationUpdatedSubscription = { __typename: 'Subscription', calculationUpdated: { __typename: 'CapacitySettlementCalculation', yearMonth: string, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'ElectricalHeatingCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'MissingMeasurementsLogCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'NetConsumptionCalculation', id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } | { __typename: 'WholesaleAndEnergyCalculation', period: { start: Date, end: Date | null }, id: string, state: ProcessState, startedAt?: Date | null, scheduledAt?: Date | null, terminatedAt?: Date | null, calculationType: CalculationTypeQueryParameterV1, executionType: CalculationExecutionType, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, displayName: string }>, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', isCurrent: boolean, state: ProcessStepState }> } };

export type CreateChargeMutationVariables = Exact<{
  input: CreateChargeInput;
}>;


export type CreateChargeMutation = { __typename: 'Mutation', createCharge: { __typename: 'CreateChargePayload', boolean?: boolean | null } };

export type GetLatestCalculationQueryVariables = Exact<{
  calculationType: StartCalculationType;
  period: PeriodInput;
}>;


export type GetLatestCalculationQuery = { __typename: 'Query', latestCalculation?: { __typename: 'CapacitySettlementCalculation', yearMonth: string, id: string } | { __typename: 'ElectricalHeatingCalculation', id: string } | { __typename: 'MissingMeasurementsLogCalculation', id: string } | { __typename: 'NetConsumptionCalculation', id: string } | { __typename: 'WholesaleAndEnergyCalculation', period: { start: Date, end: Date | null }, id: string } | null };

export type GetChargesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<ChargesQueryInput>;
  order?: InputMaybe<Array<ChargeSortInput> | ChargeSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetChargesQuery = { __typename: 'Query', charges?: { __typename: 'ChargesConnection', totalCount: number, nodes?: Array<{ __typename: 'Charge', id: string, code: string, type: ChargeType, resolution: ChargeResolution, name: string, displayName: string, description: string, status: ChargeStatus, vatInclusive: boolean, transparentInvoicing: boolean, spotDependingPrice: boolean, owner?: { __typename: 'MarketParticipant', id: string, name: string, displayName: string, glnOrEicNumber: string } | null, periods: Array<{ __typename: 'ChargePeriod', description: string, period: { start: Date, end: Date | null }, transparentInvoicing: boolean, vatInclusive: boolean, status: ChargeStatus, name: string }> }> | null, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null } } | null };

export type StopChargeMutationVariables = Exact<{
  input: StopChargeInput;
}>;


export type StopChargeMutation = { __typename: 'Mutation', stopCharge: { __typename: 'StopChargePayload', boolean?: boolean | null } };

export type GetChargeSeriesQueryVariables = Exact<{
  chargeId: Scalars['String']['input'];
  interval: Scalars['DateRange']['input'];
}>;


export type GetChargeSeriesQuery = { __typename: 'Query', chargeById?: { __typename: 'Charge', id: string, code: string, type: ChargeType, resolution: ChargeResolution, name: string, displayName: string, description: string, status: ChargeStatus, vatInclusive: boolean, transparentInvoicing: boolean, spotDependingPrice: boolean, series: Array<{ __typename: 'ChargeSeriesPoint', period: { start: Date, end: Date | null }, price: number, hasChanged: boolean, changes: Array<{ __typename: 'ChargeSeriesPointChange', isCurrent: boolean, price: number, messageId?: string | null }> }>, owner?: { __typename: 'MarketParticipant', id: string, name: string, displayName: string, glnOrEicNumber: string } | null, periods: Array<{ __typename: 'ChargePeriod', description: string, period: { start: Date, end: Date | null }, transparentInvoicing: boolean, vatInclusive: boolean, status: ChargeStatus, name: string }> } | null };

export type GetChargeByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetChargeByIdQuery = { __typename: 'Query', chargeById?: { __typename: 'Charge', id: string, code: string, type: ChargeType, resolution: ChargeResolution, name: string, displayName: string, description: string, status: ChargeStatus, vatInclusive: boolean, transparentInvoicing: boolean, spotDependingPrice: boolean, owner?: { __typename: 'MarketParticipant', id: string, name: string, displayName: string, glnOrEicNumber: string } | null, periods: Array<{ __typename: 'ChargePeriod', description: string, period: { start: Date, end: Date | null }, transparentInvoicing: boolean, vatInclusive: boolean, status: ChargeStatus, name: string }> } | null };

export type UpdateChargeMutationVariables = Exact<{
  input: UpdateChargeInput;
}>;


export type UpdateChargeMutation = { __typename: 'Mutation', updateCharge: { __typename: 'UpdateChargePayload', boolean?: boolean | null } };

export type ChargeFieldsFragment = { __typename: 'Charge', id: string, code: string, type: ChargeType, resolution: ChargeResolution, name: string, displayName: string, description: string, status: ChargeStatus, vatInclusive: boolean, transparentInvoicing: boolean, spotDependingPrice: boolean, owner?: { __typename: 'MarketParticipant', id: string, name: string, displayName: string, glnOrEicNumber: string } | null, periods: Array<{ __typename: 'ChargePeriod', description: string, period: { start: Date, end: Date | null }, transparentInvoicing: boolean, vatInclusive: boolean, status: ChargeStatus, name: string }> };

export type GetProcessByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetProcessByIdQuery = { __typename: 'Query', processById: { __typename: 'CapacitySettlementCalculation', id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'ElectricalHeatingCalculation', calculationType: CalculationTypeQueryParameterV1, id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'MissingMeasurementsLogCalculation', id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'NetConsumptionCalculation', id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'RequestCalculatedEnergyTimeSeriesResult', meteringPointType?: MeteringPointType | null, id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'RequestCalculatedWholesaleServicesResult', priceType?: PriceType | null, id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'WholesaleAndEnergyCalculation', calculationType: CalculationTypeQueryParameterV1, period: { start: Date, end: Date | null }, executionType: CalculationExecutionType, id: string, createdAt: Date, scheduledAt?: Date | null, startedAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, displayName: string }>, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } };

export type GetUserRolesByEicfunctionQueryVariables = Exact<{
  eicfunction: EicFunction;
}>;


export type GetUserRolesByEicfunctionQuery = { __typename: 'Query', userRolesByEicFunction: Array<{ __typename: 'UserRoleDto', name: string, id: string, description: string }> };

export type GetProcessesQueryVariables = Exact<{
  input: CalculationsQueryInput;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ProcessSortInput> | ProcessSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProcessesQuery = { __typename: 'Query', processes?: { __typename: 'ProcessesConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'CapacitySettlementCalculation', id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'ElectricalHeatingCalculation', calculationType: CalculationTypeQueryParameterV1, id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'MissingMeasurementsLogCalculation', id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'NetConsumptionCalculation', id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'RequestCalculatedEnergyTimeSeriesResult', id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'RequestCalculatedWholesaleServicesResult', id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> } | { __typename: 'WholesaleAndEnergyCalculation', calculationType: CalculationTypeQueryParameterV1, period: { start: Date, end: Date | null }, id: string, createdAt: Date, scheduledAt?: Date | null, terminatedAt?: Date | null, state: ProcessState, createdBy?: { __typename: 'AuditIdentityDto', displayName: string } | null, steps: Array<{ __typename: 'OrchestrationInstanceStep', state: ProcessStepState, isCurrent: boolean }> }> | null } | null };

export type GetGridAreaOverviewQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<GridAreaType>;
  statuses?: InputMaybe<Array<GridAreaStatus> | GridAreaStatus>;
  order?: InputMaybe<Array<GridAreaSortInput> | GridAreaSortInput>;
}>;


export type GetGridAreaOverviewQuery = { __typename: 'Query', gridAreaOverviewItems?: { __typename: 'GridAreaOverviewItemsConnection', totalCount: number, nodes?: Array<{ __typename: 'GridAreaOverviewItemDto', id: string, code: string, name: string, priceAreaCode: PriceAreaCode, validFrom: Date, validTo?: Date | null, actor: string, organizationName?: string | null, type: GridAreaType, fullFlexDate?: Date | null, status: GridAreaStatus }> | null, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null } } | null };

export type GetGridAreaDetailsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetGridAreaDetailsQuery = { __typename: 'Query', gridAreaOverviewItemById: { __typename: 'GridAreaOverviewItemDto', id: string, name: string, status: GridAreaStatus, code: string, actor: string, organizationName?: string | null, priceAreaCode: PriceAreaCode, type: GridAreaType, validFrom: Date, validTo?: Date | null, auditLog: Array<{ __typename: 'GridAreaAuditedChangeAuditLogDto', auditedBy?: string | null, change: GridAreaAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentOwner?: string | null, previousOwner?: string | null, consolidatedAt?: Date | null }> } };

export type CreateDelegationForMarketParticipantMutationVariables = Exact<{
  input: CreateDelegationsForMarketParticipantInput;
}>;


export type CreateDelegationForMarketParticipantMutation = { __typename: 'Mutation', createDelegationsForMarketParticipant: { __typename: 'CreateDelegationsForMarketParticipantPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type DownloadMeteringGridAreaImbalanceQueryVariables = Exact<{
  locale: Scalars['String']['input'];
  created?: InputMaybe<Scalars['DateRange']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  documentId?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  order?: InputMaybe<MeteringGridAreaImbalanceSortInput>;
}>;


export type DownloadMeteringGridAreaImbalanceQuery = { __typename: 'Query', downloadMeteringGridAreaImbalance: string };

export type StopDelegationsMutationVariables = Exact<{
  input: StopDelegationInput;
}>;


export type StopDelegationsMutation = { __typename: 'Mutation', stopDelegation: { __typename: 'StopDelegationPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type AddMeteringPointsToAdditionalRecipientMutationVariables = Exact<{
  input: AddMeteringPointsToAdditionalRecipientInput;
}>;


export type AddMeteringPointsToAdditionalRecipientMutation = { __typename: 'Mutation', addMeteringPointsToAdditionalRecipient: { __typename: 'AddMeteringPointsToAdditionalRecipientPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetMeteringGridAreaImbalanceQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  created?: InputMaybe<Scalars['DateRange']['input']>;
  calculationPeriod?: InputMaybe<Scalars['DateRange']['input']>;
  gridAreaCodes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  valuesToInclude: MeteringGridImbalanceValuesToInclude;
  order?: InputMaybe<MeteringGridAreaImbalanceSortInput>;
}>;


export type GetMeteringGridAreaImbalanceQuery = { __typename: 'Query', meteringGridAreaImbalance?: { __typename: 'MeteringGridAreaImbalanceCollectionSegment', totalCount: number, items?: Array<{ __typename: 'MeteringGridAreaImbalanceSearchResult', id: string, documentDateTime: Date, receivedDateTime: Date, period: { start: Date, end: Date | null }, gridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null }> | null, pageInfo: { __typename: 'CollectionSegmentInfo', hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetAdditionalRecipientOfMeasurementsQueryVariables = Exact<{
  marketParticipantId: Scalars['UUID']['input'];
}>;


export type GetAdditionalRecipientOfMeasurementsQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, additionalRecipientForMeasurements: Array<string> } };

export type GetMeteringGridAreaImbalanceByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMeteringGridAreaImbalanceByIdQuery = { __typename: 'Query', meteringGridAreaImbalanceById?: { __typename: 'MeteringGridAreaImbalanceSearchResult', id: string, documentDateTime: Date, receivedDateTime: Date, period: { start: Date, end: Date | null }, mgaImbalanceDocumentUrl?: string | null, gridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null, incomingImbalancePerDay: Array<{ __typename: 'MeteringGridAreaImbalancePerDayDto', imbalanceDay: Date, firstOccurrenceOfImbalance: Date, firstPositionOfImbalance: number, quantity: number }>, outgoingImbalancePerDay: Array<{ __typename: 'MeteringGridAreaImbalancePerDayDto', imbalanceDay: Date, firstOccurrenceOfImbalance: Date, firstPositionOfImbalance: number, quantity: number }> } | null };

export type GetMarketParticipantAuditLogsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetMarketParticipantAuditLogsQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, auditLogs: Array<{ __typename: 'ActorAuditedChangeAuditLogDto', auditedBy?: string | null, change: ActorAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, consolidation?: { __typename: 'MarketParticipantConsolidationAuditLog', currentOwner: string, currentOwnerGln: string, previousOwner?: string | null, previousOwnerGln: string, previousOwnerStopsAt?: Date | null } | null, delegation?: { __typename: 'MarketParticipantDelegationAuditLog', marketParticipantName: string, gln: string, startsAt: string, stopsAt?: string | null, gridAreaName: string, processType: string } | null }> } };

export type GetBalanceResponsibleRelationQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBalanceResponsibleRelationQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, balanceResponsibleAgreements?: Array<{ __typename: 'BalanceResponsibilityAgreement', validPeriod: { start: Date, end: Date | null }, status: BalanceResponsibilityAgreementStatus, meteringPointType: MarketParticipantMeteringPointType, gridArea?: { __typename: 'GridAreaDto', displayName: string, id: string, code: string } | null, balanceResponsibleWithName?: { __typename: 'MarketParticipantNameWithId', id: string, actorName: { __typename: 'ActorNameDto', value: string } } | null, energySupplierWithName?: { __typename: 'MarketParticipantNameWithId', id: string, actorName: { __typename: 'ActorNameDto', value: string } } | null }> | null } };

export type GetMarketParticipantsByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetMarketParticipantsByOrganizationIdQuery = { __typename: 'Query', marketParticipantsByOrganizationId: Array<{ __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, name: string, marketRole: EicFunction, status: MarketParticipantStatus }> };

export type GetMarketParticipantCredentialsQueryVariables = Exact<{
  marketParticipantId: Scalars['UUID']['input'];
}>;


export type GetMarketParticipantCredentialsQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, credentials: { __typename: 'ActorCredentialsDto', assignCertificateCredentialsUrl?: string | null, removeMarketParticipantCredentialsUrl?: string | null, clientSecretCredentials?: { __typename: 'ActorClientSecretCredentialsDto', clientSecretIdentifier: string, expirationDate: Date } | null, certificateCredentials?: { __typename: 'ActorCertificateCredentialsDto', thumbprint: string, expirationDate: Date } | null } } };

export type GetDelegatesQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetDelegatesQuery = { __typename: 'Query', marketParticipantsForEicFunction: Array<{ __typename: 'MarketParticipant', name: string, id: string, glnOrEicNumber: string, displayName: string }> };

export type GetPaginatedMarketParticipantsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
  statuses?: InputMaybe<Array<MarketParticipantStatus> | MarketParticipantStatus>;
  order?: InputMaybe<Array<MarketParticipantSortInput> | MarketParticipantSortInput>;
}>;


export type GetPaginatedMarketParticipantsQuery = { __typename: 'Query', paginatedMarketParticipants?: { __typename: 'PaginatedMarketParticipantsConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, name: string, status: MarketParticipantStatus, marketRole: EicFunction, publicMail?: { __typename: 'MarketParticipantPublicMail', mail: string } | null }> | null } | null };

export type GetMarketParticipantDetailsQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetMarketParticipantDetailsQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, name: string, marketRole: EicFunction, status: MarketParticipantStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, displayName: string, id: string }>, organization: { __typename: 'Organization', name: string, id: string, businessRegisterIdentifier: string, domains: Array<string>, address: { __typename: 'AddressDto', country: string } }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type MergeMarketParticipantsMutationVariables = Exact<{
  input: MergeMarketParticipantsInput;
}>;


export type MergeMarketParticipantsMutation = { __typename: 'Mutation', mergeMarketParticipants: { __typename: 'MergeMarketParticipantsPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetMarketParticipantEditableFieldsQueryVariables = Exact<{
  marketParticipantId: Scalars['UUID']['input'];
}>;


export type GetMarketParticipantEditableFieldsQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, name: string, organization: { __typename: 'Organization', domains: Array<string>, id: string }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type UpdateMarketParticipantMutationVariables = Exact<{
  input: UpdateMarketParticipantInput;
}>;


export type UpdateMarketParticipantMutation = { __typename: 'Mutation', updateMarketParticipant: { __typename: 'UpdateMarketParticipantPayload', boolean?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string }> | null } };

export type GetDelegationsForMarketParticipantQueryVariables = Exact<{
  marketParticipantId: Scalars['UUID']['input'];
}>;


export type GetDelegationsForMarketParticipantQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, delegations: Array<{ __typename: 'MessageDelegationType', periodId: string, id: string, process: DelegatedProcess, validPeriod: { start: Date, end: Date | null }, status: MarketParticipantDelegationStatus, delegatedBy?: { __typename: 'MarketParticipant', id: string, name: string, glnOrEicNumber: string } | null, delegatedTo?: { __typename: 'MarketParticipant', id: string, name: string, glnOrEicNumber: string } | null, gridArea?: { __typename: 'GridAreaDto', id: string, code: string } | null }> } };

export type GetOrganizationEditQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOrganizationEditQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', id: string, name: string, domains: Array<string> } };

export type GetOrganizationFromCvrQueryVariables = Exact<{
  cvr: Scalars['String']['input'];
}>;


export type GetOrganizationFromCvrQuery = { __typename: 'Query', searchOrganizationInCVR: { __typename: 'CVROrganizationResult', name: string, hasResult: boolean } };

export type GetAuditLogByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['UUID']['input'];
}>;


export type GetAuditLogByOrganizationIdQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', id: string, auditLogs: Array<{ __typename: 'OrganizationAuditedChangeAuditLogDto', change: OrganizationAuditedChange, timestamp: Date, isInitialAssignment: boolean, currentValue?: string | null, previousValue?: string | null, auditedBy?: string | null }> } };

export type RemoveMeteringPointsFromAdditionalRecipientMutationVariables = Exact<{
  input: RemoveMeteringPointsFromAdditionalRecipientInput;
}>;


export type RemoveMeteringPointsFromAdditionalRecipientMutation = { __typename: 'Mutation', removeMeteringPointsFromAdditionalRecipient: { __typename: 'RemoveMeteringPointsFromAdditionalRecipientPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type CreateMarketParticipantMutationVariables = Exact<{
  input: CreateMarketParticipantInput;
}>;


export type CreateMarketParticipantMutation = { __typename: 'Mutation', createMarketParticipant: { __typename: 'CreateMarketParticipantPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type GetOrganizationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationsQuery = { __typename: 'Query', organizations: Array<{ __typename: 'Organization', id: string, businessRegisterIdentifier: string, name: string, domains: Array<string> }> };

export type RequestClientSecretCredentialsMutationVariables = Exact<{
  input: RequestClientSecretCredentialsInput;
}>;


export type RequestClientSecretCredentialsMutation = { __typename: 'Mutation', requestClientSecretCredentials: { __typename: 'RequestClientSecretCredentialsPayload', actorClientSecretDto?: { __typename: 'ActorClientSecretDto', secretText: string } | null } };

export type UpdateOrganizationMutationVariables = Exact<{
  input: UpdateOrganizationInput;
}>;


export type UpdateOrganizationMutation = { __typename: 'Mutation', updateOrganization: { __typename: 'UpdateOrganizationPayload', errors?: Array<{ __typename: 'ApiError', apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type CloseConversationMutationVariables = Exact<{
  conversationId: Scalars['UUID']['input'];
}>;


export type CloseConversationMutation = { __typename: 'Mutation', closeConversation: { __typename: 'CloseConversationPayload', boolean?: boolean | null } };

export type GetOrganizationByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetOrganizationByIdQuery = { __typename: 'Query', organizationById: { __typename: 'Organization', id: string, name: string, businessRegisterIdentifier: string, domains: Array<string>, address: { __typename: 'AddressDto', country: string } } };

export type StartConversationMutationVariables = Exact<{
  subject: ConversationSubject;
  meteringPointIdentification: Scalars['String']['input'];
  internalNote?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  anonymous: Scalars['Boolean']['input'];
  receiver: ActorType;
}>;


export type StartConversationMutation = { __typename: 'Mutation', startConversation: { __typename: 'StartConversationPayload', string?: string | null } };

export type GetConversationsQueryVariables = Exact<{
  meteringPointIdentification: Scalars['String']['input'];
}>;


export type GetConversationsQuery = { __typename: 'Query', conversationsForMeteringPoint: { __typename: 'Conversations', conversations: Array<{ __typename: 'ConversationInfo', id: string, read: boolean, subject: ConversationSubject, displayId: string, closed: boolean, lastUpdated: Date }> } };

export type SendActorConversationMessageMutationVariables = Exact<{
  conversationId: Scalars['UUID']['input'];
  meteringPointIdentification: Scalars['String']['input'];
  actorId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  anonymous: Scalars['Boolean']['input'];
}>;


export type SendActorConversationMessageMutation = { __typename: 'Mutation', sendActorConversationMessage: { __typename: 'SendActorConversationMessagePayload', boolean?: boolean | null } };

export type GetConversationQueryVariables = Exact<{
  conversationId: Scalars['UUID']['input'];
  meteringPointId: Scalars['String']['input'];
}>;


export type GetConversationQuery = { __typename: 'Query', conversation: { __typename: 'Conversation', id: string, displayId?: string | null, internalNote?: string | null, subject: ConversationSubject, closed: boolean, messages: Array<{ __typename: 'ConversationMessage', senderType: ActorType, content: string, messageType: MessageType, createdTime: Date, actorName?: string | null, userName: string, userId?: string | null }> } };

export type GetPaginatedOrganizationsQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<OrganizationSortInput> | OrganizationSortInput>;
  filter?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPaginatedOrganizationsQuery = { __typename: 'Query', paginatedOrganizations?: { __typename: 'PaginatedOrganizationsConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'Organization', id: string, businessRegisterIdentifier: string, name: string, domains: Array<string> }> | null } | null };

export type CreateChargeLinkMutationVariables = Exact<{
  chargeId: Scalars['String']['input'];
  meteringPointId: Scalars['String']['input'];
  newStartDate: Scalars['DateTime']['input'];
  factor: Scalars['Int']['input'];
}>;


export type CreateChargeLinkMutation = { __typename: 'Mutation', createChargeLink: { __typename: 'CreateChargeLinkPayload', success?: boolean | null } };

export type CancelChargeLinkMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CancelChargeLinkMutation = { __typename: 'Mutation', cancelChargeLink: { __typename: 'CancelChargeLinkPayload', success?: boolean | null } };

export type MarkConversationReadMutationVariables = Exact<{
  conversationId: Scalars['UUID']['input'];
}>;


export type MarkConversationReadMutation = { __typename: 'Mutation', markConversationRead: { __typename: 'MarkConversationReadPayload', boolean?: boolean | null } };

export type GetChargeLinkByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetChargeLinkByIdQuery = { __typename: 'Query', chargeLinkById?: { __typename: 'ChargeLink', id: string, charge?: { __typename: 'Charge', id: string, code: string, displayName: string } | null } | null };

export type GetChargeLinksByMeteringPointIdQueryVariables = Exact<{
  order?: InputMaybe<Array<ChargeLinkDtoSortInput> | ChargeLinkDtoSortInput>;
  meteringPointId: Scalars['String']['input'];
}>;


export type GetChargeLinksByMeteringPointIdQuery = { __typename: 'Query', chargeLinksByMeteringPointId: Array<{ __typename: 'ChargeLink', id: string, amount: number, period?: { __typename: 'ChargeLinkPeriod', interval: { start: Date, end: Date | null } } | null, charge?: { __typename: 'Charge', id: string, code: string, transparentInvoicing: boolean, name: string, type: ChargeType, status: ChargeStatus, owner?: { __typename: 'MarketParticipant', id: string, displayName: string } | null } | null }> };

export type GetChargeLinkHistoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetChargeLinkHistoryQuery = { __typename: 'Query', chargeLinkById?: { __typename: 'ChargeLink', id: string, charge?: { __typename: 'Charge', id: string, displayName: string, owner?: { __typename: 'MarketParticipant', id: string, displayName: string } | null } | null, period?: { __typename: 'ChargeLinkPeriod', interval: { start: Date, end: Date | null } } | null, history: Array<{ __typename: 'ChargeLinkHistory', submittedAt: Date, description: string, messageId: string }> } | null };

export type GetMeteringPointDebugViewQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
}>;


export type GetMeteringPointDebugViewQuery = { __typename: 'Query', debugView: string };

export type GetChargeByTypeQueryVariables = Exact<{
  type: ChargeType;
}>;


export type GetChargeByTypeQuery = { __typename: 'Query', chargesByType: Array<{ __typename: 'Charge', value: string, displayValue: string }> };

export type GetMeteringPointEventsDebugViewQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
}>;


export type GetMeteringPointEventsDebugViewQuery = { __typename: 'Query', eventsDebugView?: { __typename: 'GetMeteringPointDebugResultDtoV1', meteringPointJson: string, events: Array<{ __typename: 'ElectricityMarketV2EventDto', id: string, timestamp: Date, type: string, dataJson: string }> } | null };

export type EditChargeLinkMutationVariables = Exact<{
  id: Scalars['String']['input'];
  newStartDate: Scalars['DateTime']['input'];
  factor: Scalars['Int']['input'];
}>;


export type EditChargeLinkMutation = { __typename: 'Mutation', editChargeLink: { __typename: 'EditChargeLinkPayload', success?: boolean | null } };

export type GetMeteringPointsByGridAreaQueryVariables = Exact<{
  gridAreaCode: Scalars['String']['input'];
}>;


export type GetMeteringPointsByGridAreaQuery = { __typename: 'Query', meteringPointsByGridAreaCode: Array<{ __typename: 'MeteringPointsGroupByPackageNumber', packageNumber: string, meteringPoints: Array<{ __typename: 'MeteringPointIdentificationDto', identification: string }> }> };

export type GetAggregatedMeasurementsForAllYearsQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
}>;


export type GetAggregatedMeasurementsForAllYearsQuery = { __typename: 'Query', aggregatedMeasurementsForAllYears: Array<{ __typename: 'MeasurementAggregationByYearDto', quantity?: number | null, qualities: Array<Quality>, year: number }> };

export type GetSelectableDatesForEndOfSupplyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectableDatesForEndOfSupplyQuery = { __typename: 'Query', selectableDatesForEndOfSupply: Array<Date> };

export type GetMeasurementPointsQueryVariables = Exact<{
  observationTime: Scalars['DateTime']['input'];
  meteringPointId: Scalars['String']['input'];
  date: Scalars['LocalDate']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
}>;


export type GetMeasurementPointsQuery = { __typename: 'Query', meteringPoint: { __typename: 'ElectricityMarketViewMeteringPointDto', id: string, metadata: { __typename: 'ElectricityMarketViewMeteringPointMetadataDto', id: string, subType?: ElectricityMarketViewMeteringPointSubType | null } }, measurementPoints: Array<{ __typename: 'MeasurementPointDto', order: number, quantity?: number | null, quality: Quality, unit: Unit, persistedTime: Date, registrationTime: Date }> };

export type MarkConversationUnReadMutationVariables = Exact<{
  conversationId: Scalars['UUID']['input'];
}>;


export type MarkConversationUnReadMutation = { __typename: 'Mutation', markConversationUnRead: { __typename: 'MarkConversationUnReadPayload', boolean?: boolean | null } };

export type GetAggregatedMeasurementsForMonthQueryVariables = Exact<{
  showOnlyChangedValues: Scalars['Boolean']['input'];
  meteringPointId: Scalars['String']['input'];
  yearMonth: Scalars['YearMonth']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
}>;


export type GetAggregatedMeasurementsForMonthQuery = { __typename: 'Query', aggregatedMeasurementsForMonth: Array<{ __typename: 'MeasurementAggregationByDateDto', date?: Date | null, quantity?: number | null, qualities: Array<Quality>, unit: Unit }> };

export type GetMeasurementsQueryVariables = Exact<{
  showOnlyChangedValues: Scalars['Boolean']['input'];
  showHistoricValues: Scalars['Boolean']['input'];
  meteringPointId: Scalars['String']['input'];
  date: Scalars['LocalDate']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
}>;


export type GetMeasurementsQuery = { __typename: 'Query', measurements: { __typename: 'MeasurementDto', measurementPositions: Array<{ __typename: 'MeasurementPositionDto', index: number, observationTime: Date, resolution: Resolution, hasQuantityOrQualityChanged: boolean, historic: Array<{ __typename: 'MeasurementPointDto', quantity?: number | null, quality: Quality, unit: Unit, registrationTime: Date, persistedTime: Date }>, current?: { __typename: 'MeasurementPointDto', quantity?: number | null, quality: Quality, resolution: Resolution, unit: Unit } | null }> } };

export type StopChargeLinkMutationVariables = Exact<{
  id: Scalars['String']['input'];
  stopDate: Scalars['DateTime']['input'];
}>;


export type StopChargeLinkMutation = { __typename: 'Mutation', stopChargeLink: { __typename: 'StopChargeLinkPayload', success?: boolean | null } };

export type RequestEndOfSupplyMutationVariables = Exact<{
  input: RequestEndOfSupplyInput;
}>;


export type RequestEndOfSupplyMutation = { __typename: 'Mutation', requestEndOfSupply: { __typename: 'RequestEndOfSupplyPayload', success?: boolean | null } };

export type InitiateMoveInMutationVariables = Exact<{
  input: InitiateMoveInInput;
}>;


export type InitiateMoveInMutation = { __typename: 'Mutation', initiateMoveIn: { __typename: 'InitiateMoveInPayload', success?: boolean | null } };

export type RequestChangeCustomerCharacteristicsMutationVariables = Exact<{
  input: ChangeCustomerCharacteristicsInput;
}>;


export type RequestChangeCustomerCharacteristicsMutation = { __typename: 'Mutation', changeCustomerCharacteristics: { __typename: 'ChangeCustomerCharacteristicsPayload', success?: boolean | null } };

export type GetArchivedMessagesForMeteringPointQueryVariables = Exact<{
  created: Scalars['DateRange']['input'];
  meteringPointId: Scalars['String']['input'];
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  receiverId?: InputMaybe<Scalars['UUID']['input']>;
  documentType?: InputMaybe<MeteringPointDocumentType>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<ArchivedMessageSortInput>;
}>;


export type GetArchivedMessagesForMeteringPointQuery = { __typename: 'Query', archivedMessagesForMeteringPoint?: { __typename: 'ArchivedMessagesForMeteringPointConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'ArchivedMessage', id: string, messageId: string, documentType: DocumentType, documentUrl?: string | null, createdAt: Date, sender?: { __typename: 'MarketParticipant', id: string, displayName: string, glnOrEicNumber: string } | null, receiver?: { __typename: 'MarketParticipant', id: string, displayName: string, glnOrEicNumber: string } | null }> | null } | null };

export type GetContactCprQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
  contactId: Scalars['Long']['input'];
}>;


export type GetContactCprQuery = { __typename: 'Query', meteringPointContactCpr: { __typename: 'CPRResponse', result: string } };

export type ExecuteMeteringPointManualCorrectionMutationVariables = Exact<{
  input: ExecuteMeteringPointManualCorrectionInput;
}>;


export type ExecuteMeteringPointManualCorrectionMutation = { __typename: 'Mutation', executeMeteringPointManualCorrection: { __typename: 'ExecuteMeteringPointManualCorrectionPayload', boolean?: boolean | null } };

export type GetFailedSendMeasurementsInstancesQueryVariables = Exact<{
  created: Scalars['DateRange']['input'];
  filter?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<SendMeasurementsInstanceDtoSortInput> | SendMeasurementsInstanceDtoSortInput>;
}>;


export type GetFailedSendMeasurementsInstancesQuery = { __typename: 'Query', failedSendMeasurementsInstances?: { __typename: 'FailedSendMeasurementsInstancesConnection', totalCount: number, pageInfo: { __typename: 'PageInfo', startCursor?: string | null, endCursor?: string | null }, nodes?: Array<{ __typename: 'SendMeasurementsInstanceDto', id: string, transactionId: string, meteringPointId?: string | null, createdAt: Date, failedAt?: Date | null, failedCount: number, errorText?: string | null }> | null } | null };

export type CustomerContactFragment = { __typename: 'ElectricityMarketViewCustomerContactDto', id: string, phone?: string | null, email?: string | null, streetName?: string | null, buildingNumber?: string | null, postCode?: string | null, streetCode?: string | null, cityName?: string | null, municipalityCode?: string | null, postBox?: string | null, countryCode?: string | null, darReference?: string | null, isProtectedAddress: boolean, citySubDivisionName?: string | null, name?: string | null, mobile?: string | null, floor?: string | null, room?: string | null };

export type GetMeteringPointByIdQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
  actorGln: Scalars['String']['input'];
  searchMigratedMeteringPoints?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetMeteringPointByIdQuery = { __typename: 'Query', meteringPoint: { __typename: 'ElectricityMarketViewMeteringPointDto', id: string, isChild: boolean, meteringPointId: string, isEnergySupplier: boolean, isGridAccessProvider: boolean, electricalHeatingStartDate?: Date | null, haveElectricalHeating: boolean, hadElectricalHeating: boolean, createdDate?: Date | null, closedDownDate?: Date | null, connectionDate?: Date | null, disconnectedDate?: Date | null, commercialRelation?: { __typename: 'ElectricityMarketViewCommercialRelationDto', id: string, startDate: Date, energySupplier: string, energySupplierName?: { __typename: 'ActorNameDto', value: string } | null, activeElectricalHeatingPeriods?: { __typename: 'ElectricityMarketViewElectricalHeatingDto', id: string, validFrom: Date } | null, electricalHeatingPeriods: Array<{ __typename: 'ElectricityMarketViewElectricalHeatingDto', id: string, validTo: Date }>, activeEnergySupplyPeriod?: { __typename: 'ElectricityMarketViewEnergySupplyPeriodDto', id: string, validFrom: Date, customers: Array<{ __typename: 'ElectricityMarketViewCustomerDto', id: string, isProtectedName: boolean, cvr?: string | null, name: string, relationType: ElectricityMarketViewCustomerRelationType, technicalContact?: { __typename: 'ElectricityMarketViewCustomerContactDto', id: string, phone?: string | null, email?: string | null, streetName?: string | null, buildingNumber?: string | null, postCode?: string | null, streetCode?: string | null, cityName?: string | null, municipalityCode?: string | null, postBox?: string | null, countryCode?: string | null, darReference?: string | null, isProtectedAddress: boolean, citySubDivisionName?: string | null, name?: string | null, mobile?: string | null, floor?: string | null, room?: string | null } | null, legalContact?: { __typename: 'ElectricityMarketViewCustomerContactDto', id: string, phone?: string | null, email?: string | null, streetName?: string | null, buildingNumber?: string | null, postCode?: string | null, streetCode?: string | null, cityName?: string | null, municipalityCode?: string | null, postBox?: string | null, countryCode?: string | null, darReference?: string | null, isProtectedAddress: boolean, citySubDivisionName?: string | null, name?: string | null, mobile?: string | null, floor?: string | null, room?: string | null } | null }> } | null } | null, metadata: { __typename: 'ElectricityMarketViewMeteringPointMetadataDto', id: string, measureUnit: ElectricityMarketViewMeteringPointMeasureUnit, manuallyHandled: boolean, type: ElectricityMarketViewMeteringPointType, subType?: ElectricityMarketViewMeteringPointSubType | null, parentMeteringPoint?: string | null, internalMeteringPointParentId?: string | null, ownedBy: string, connectionState?: ElectricityMarketViewConnectionState | null, netSettlementGroup?: number | null, resolution: string, product?: ElectricityMarketViewProduct | null, productObligation?: boolean | null, assetType?: ElectricityMarketViewAssetType | null, connectionType?: ElectricityMarketViewConnectionType | null, disconnectionType?: ElectricityMarketViewDisconnectionType | null, environmentalFriendly?: boolean | null, capacity?: string | null, powerLimitKw?: number | null, powerLimitAmp?: number | null, powerPlantGsrn?: string | null, meterNumber?: string | null, settlementMethod?: ElectricityMarketViewSettlementMethod | null, gridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null, scheduledMeterReadingDate?: { __typename: 'ElectricityMarketViewAnnualDate', month: number, day: number } | null, fromGridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null, toGridArea?: { __typename: 'GridAreaDto', id: string, displayName: string } | null, installationAddress?: { __typename: 'ElectricityMarketViewInstallationAddressDto', id: string, streetName: string, streetCode?: string | null, cityName: string, floor?: string | null, postCode: string, room?: string | null, municipalityCode?: string | null, citySubDivisionName?: string | null, locationDescription?: string | null, buildingNumber: string, darReference?: string | null, washInstructions?: ElectricityMarketViewWashInstructions | null, countryCode: string } | null } } };

export type GetMeteringPointForManualCorrectionQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
}>;


export type GetMeteringPointForManualCorrectionQuery = { __typename: 'Query', meteringPointForManualCorrection: string };

export type RelatedMeteringPointFragment = { __typename: 'RelatedMeteringPointDto', id: string, meteringPointIdentification: string, type: ElectricityMarketViewMeteringPointType, connectionState: ElectricityMarketViewConnectionState, createdDate?: Date | null, connectionDate?: Date | null, closedDownDate?: Date | null, disconnectionDate?: Date | null };

export type GetRelatedMeteringPointsByIdQueryVariables = Exact<{
  meteringPointIdentification: Scalars['String']['input'];
  searchMigratedMeteringPoints?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetRelatedMeteringPointsByIdQuery = { __typename: 'Query', relatedMeteringPoints: { __typename: 'RelatedMeteringPointsDto', parent?: { __typename: 'RelatedMeteringPointDto', id: string, meteringPointIdentification: string, type: ElectricityMarketViewMeteringPointType, connectionState: ElectricityMarketViewConnectionState, createdDate?: Date | null, connectionDate?: Date | null, closedDownDate?: Date | null, disconnectionDate?: Date | null } | null, current: { __typename: 'RelatedMeteringPointDto', id: string, meteringPointIdentification: string, type: ElectricityMarketViewMeteringPointType, connectionState: ElectricityMarketViewConnectionState, createdDate?: Date | null, connectionDate?: Date | null, closedDownDate?: Date | null, disconnectionDate?: Date | null }, relatedMeteringPoints: Array<{ __typename: 'RelatedMeteringPointDto', id: string, meteringPointIdentification: string, type: ElectricityMarketViewMeteringPointType, connectionState: ElectricityMarketViewConnectionState, createdDate?: Date | null, connectionDate?: Date | null, closedDownDate?: Date | null, disconnectionDate?: Date | null }>, relatedByGsrn: Array<{ __typename: 'RelatedMeteringPointDto', id: string, meteringPointIdentification: string, type: ElectricityMarketViewMeteringPointType, connectionState: ElectricityMarketViewConnectionState, createdDate?: Date | null, connectionDate?: Date | null, closedDownDate?: Date | null, disconnectionDate?: Date | null }>, historicalMeteringPoints: Array<{ __typename: 'RelatedMeteringPointDto', id: string, meteringPointIdentification: string, type: ElectricityMarketViewMeteringPointType, connectionState: ElectricityMarketViewConnectionState, createdDate?: Date | null, connectionDate?: Date | null, closedDownDate?: Date | null, disconnectionDate?: Date | null }> } };

export type GetAggregatedMeasurementsForYearQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
  actorNumber: Scalars['String']['input'];
  marketRole: AuthEicFunctionType;
}>;


export type GetAggregatedMeasurementsForYearQuery = { __typename: 'Query', aggregatedMeasurementsForYear: Array<{ __typename: 'MeasurementAggregationByMonthDto', yearMonth: string, quantity?: number | null, qualities: Array<Quality>, unit: Unit }> };

export type RequestConnectionStateChangeMutationVariables = Exact<{
  input: RequestConnectionStateChangeInput;
}>;


export type RequestConnectionStateChangeMutation = { __typename: 'Mutation', requestConnectionStateChange: { __typename: 'RequestConnectionStateChangePayload', success?: boolean | null } };

export type GetMeteringPointProcessByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetMeteringPointProcessByIdQuery = { __typename: 'Query', meteringPointProcessById?: { __typename: 'MeteringPointProcess', id: string, createdAt: Date, cutoffDate?: Date | null, reasonCode: string, state: ProcessState, steps: Array<{ __typename: 'MeteringPointProcessStep', id: string, step: string, comment?: string | null, completedAt?: Date | null, dueDate?: Date | null, state: ProcessState, documentUrl?: string | null, actor?: { __typename: 'MarketParticipant', id: string, name: string } | null }>, initiator?: { __typename: 'MarketParticipant', id: string, displayName: string } | null } | null };

export type SendMeasurementsMutationVariables = Exact<{
  input: SendMeasurementsRequestV2Input;
}>;


export type SendMeasurementsMutation = { __typename: 'Mutation', sendMeasurements: boolean };

export type GetMeteringPointProcessOverviewQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
  created: Scalars['DateRange']['input'];
}>;


export type GetMeteringPointProcessOverviewQuery = { __typename: 'Query', meteringPointProcessOverview: Array<{ __typename: 'MeteringPointProcess', id: string, createdAt: Date, cutoffDate?: Date | null, reasonCode: string, state: ProcessState, availableActions?: Array<WorkflowAction> | null, initiator?: { __typename: 'MarketParticipant', id: string, displayName: string } | null }> };

export type GetMeteringPointUploadMetadataByIdQueryVariables = Exact<{
  meteringPointId: Scalars['String']['input'];
  searchMigratedMeteringPoints?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetMeteringPointUploadMetadataByIdQuery = { __typename: 'Query', meteringPoint: { __typename: 'ElectricityMarketViewMeteringPointDto', id: string, metadata: { __typename: 'ElectricityMarketViewMeteringPointMetadataDto', id: string, measureUnit: ElectricityMarketViewMeteringPointMeasureUnit, resolution: string, type: ElectricityMarketViewMeteringPointType, subType?: ElectricityMarketViewMeteringPointSubType | null } } };

export type GetMeasurementsReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeasurementsReportsQuery = { __typename: 'Query', measurementsReports: Array<{ __typename: 'MeasurementsReport', id: string, createdDateTime: Date, meteringPointTypes: Array<MeasurementsReportMeteringPointType>, meteringPointIds?: Array<string> | null, gridAreaCodes: Array<string>, period: { start: Date, end: Date | null }, statusType: MeasurementsReportStatusType, measurementsReportDownloadUrl?: string | null, actor?: { __typename: 'MarketParticipant', id: string, name: string } | null }> };

export type CancelSettlementReportMutationVariables = Exact<{
  input: CancelSettlementReportInput;
}>;


export type CancelSettlementReportMutation = { __typename: 'Mutation', cancelSettlementReport: { __typename: 'CancelSettlementReportPayload', boolean?: boolean | null } };

export type RequestMeasurementsReportMutationVariables = Exact<{
  input: RequestMeasurementsReportInput;
}>;


export type RequestMeasurementsReportMutation = { __typename: 'Mutation', requestMeasurementsReport: { __typename: 'RequestMeasurementsReportPayload', boolean?: boolean | null } };

export type GetMarketParticipantOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMarketParticipantOptionsQuery = { __typename: 'Query', marketParticipants: Array<{ __typename: 'MarketParticipant', value: string, displayValue: string }> };

export type GetReleaseTogglesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReleaseTogglesQuery = { __typename: 'Query', releaseToggles: Array<string> };

export type GetSettlementReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettlementReportsQuery = { __typename: 'Query', settlementReports: Array<{ __typename: 'SettlementReport', id: string, calculationType: CalculationType, period: { start: Date, end: Date | null }, numberOfGridAreasInReport: number, includesBasisData: boolean, progress: number, statusType: SettlementReportStatusType, settlementReportDownloadUrl?: string | null, executionTime: { start: Date, end: Date | null }, combineResultInASingleFile: boolean, includeMonthlyAmount: boolean, gridAreas: Array<string>, actor?: { __typename: 'MarketParticipant', id: string, name: string } | null }> };

export type SimulateMeteringPointManualCorrectionMutationVariables = Exact<{
  input: SimulateMeteringPointManualCorrectionInput;
}>;


export type SimulateMeteringPointManualCorrectionMutation = { __typename: 'Mutation', simulateMeteringPointManualCorrection: { __typename: 'SimulateMeteringPointManualCorrectionPayload', string?: string | null } };

export type GetSettlementReportCalculationsByGridAreasQueryVariables = Exact<{
  calculationType: CalculationType;
  gridAreaIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  calculationPeriod: Scalars['DateRange']['input'];
}>;


export type GetSettlementReportCalculationsByGridAreasQuery = { __typename: 'Query', settlementReportGridAreaCalculationsForPeriod: Array<{ __typename: 'KeyValuePairOfStringAndListOfSettlementReportApplicableCalculation', key: string, value: Array<{ __typename: 'RequestSettlementReportGridAreaCalculation', calculationId: string, calculationDate: Date, gridAreaWithName?: { __typename: 'GridAreaDto', id: string, displayName: string, code: string } | null }> }> };

export type AddTokenToDownloadUrlMutationVariables = Exact<{
  url: Scalars['URL']['input'];
}>;


export type AddTokenToDownloadUrlMutation = { __typename: 'Mutation', addTokenToDownloadUrl: { __typename: 'AddTokenToDownloadUrlPayload', downloadUrlWithToken?: string | null } };

export type RequestSettlementReportMutationVariables = Exact<{
  input: RequestSettlementReportInput;
}>;


export type RequestSettlementReportMutation = { __typename: 'Mutation', requestSettlementReport: { __typename: 'RequestSettlementReportPayload', boolean?: boolean | null } };

export type GetMarketParticipantByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetMarketParticipantByIdQuery = { __typename: 'Query', marketParticipantById: { __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, name: string, marketRole: EicFunction, status: MarketParticipantStatus, gridAreas: Array<{ __typename: 'GridAreaDto', code: string, name: string, displayName: string, id: string }>, organization: { __typename: 'Organization', name: string, id: string, businessRegisterIdentifier: string, domains: Array<string>, address: { __typename: 'AddressDto', country: string } }, contact?: { __typename: 'ActorContactDto', name: string, email: string, phone?: string | null } | null } };

export type GetMarketParticipantsForEicFunctionQueryVariables = Exact<{
  eicFunctions?: InputMaybe<Array<EicFunction> | EicFunction>;
}>;


export type GetMarketParticipantsForEicFunctionQuery = { __typename: 'Query', marketParticipantsForEicFunction: Array<{ __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, name: string, marketRole: EicFunction, status: MarketParticipantStatus, gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string }> }> };

export type InitiateMitIdSignupMutationVariables = Exact<{ [key: string]: never; }>;


export type InitiateMitIdSignupMutation = { __typename: 'Mutation', initiateMitIdSignup: { __typename: 'InitiateMitIdSignupPayload', success?: boolean | null, errors?: Array<{ __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> }> | null } };

export type DoesInternalMeteringPointIdExistQueryVariables = Exact<{
  internalMeteringPointId?: InputMaybe<Scalars['String']['input']>;
  meteringPointId?: InputMaybe<Scalars['String']['input']>;
  searchMigratedMeteringPoints: Scalars['Boolean']['input'];
}>;


export type DoesInternalMeteringPointIdExistQuery = { __typename: 'Query', meteringPointExists: { __typename: 'ElectricityMarketViewMeteringPointDto', id: string, meteringPointId: string } };

export type GetGridAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGridAreasQuery = { __typename: 'Query', gridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, name: string, displayName: string, validTo?: Date | null, validFrom: Date, includedInCalculation: boolean, type: GridAreaType }> };

export type GetMarketParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMarketParticipantsQuery = { __typename: 'Query', marketParticipants: Array<{ __typename: 'MarketParticipant', id: string, glnOrEicNumber: string, name: string, marketRole: EicFunction, status: MarketParticipantStatus, publicMail?: { __typename: 'MarketParticipantPublicMail', mail: string } | null }> };

export type GetRelevantGridAreasQueryVariables = Exact<{
  actorId?: InputMaybe<Scalars['UUID']['input']>;
  period: PeriodInput;
  environment?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRelevantGridAreasQuery = { __typename: 'Query', relevantGridAreas: Array<{ __typename: 'GridAreaDto', id: string, code: string, name: string, displayName: string, validTo?: Date | null, validFrom: Date, includedInCalculation: boolean, type: GridAreaType }> };

export type ErrorsFragment = { __typename: 'ApiError', message: string, statusCode: number, apiErrors: Array<{ __typename: 'ApiErrorDescriptor', message: string, code: string, args: any }> };

export const CalculationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalculationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Calculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"terminatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"executionType"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapacitySettlementCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearMonth"}}]}}]}}]} as unknown as DocumentNode<CalculationFieldsFragment, unknown>;
export const ChargeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChargeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"spotDependingPrice"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ChargeFieldsFragment, unknown>;
export const CustomerContactFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ElectricityMarketViewCustomerContactDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"buildingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"streetCode"}},{"kind":"Field","name":{"kind":"Name","value":"cityName"}},{"kind":"Field","name":{"kind":"Name","value":"municipalityCode"}},{"kind":"Field","name":{"kind":"Name","value":"postBox"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"darReference"}},{"kind":"Field","name":{"kind":"Name","value":"isProtectedAddress"}},{"kind":"Field","name":{"kind":"Name","value":"citySubDivisionName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"room"}}]}}]} as unknown as DocumentNode<CustomerContactFragment, unknown>;
export const RelatedMeteringPointFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RelatedMeteringPoint"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RelatedMeteringPointDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointIdentification"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"connectionState"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"connectionDate"}},{"kind":"Field","name":{"kind":"Name","value":"closedDownDate"}},{"kind":"Field","name":{"kind":"Name","value":"disconnectionDate"}}]}}]} as unknown as DocumentNode<RelatedMeteringPointFragment, unknown>;
export const ErrorsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ErrorsFragment, unknown>;
export const InviteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"inviteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<InviteUserMutation, InviteUserMutationVariables>;
export const DeactivateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deactivateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<DeactivateUserMutation, DeactivateUserMutationVariables>;
export const CreateUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserRoleMutation, CreateUserRoleMutationVariables>;
export const ReActivateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reActivateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReActivateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reActivateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ReActivateUserMutation, ReActivateUserMutationVariables>;
export const DeactivateUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deactivateUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeactivateUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<DeactivateUserRoleMutation, DeactivateUserRoleMutationVariables>;
export const ReInviteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reInviteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReInviteUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reInviteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ReInviteUserMutation, ReInviteUserMutationVariables>;
export const Reset2faDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reset2fa"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetTwoFactorAuthenticationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetTwoFactorAuthentication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<Reset2faMutation, Reset2faMutationVariables>;
export const ResetMitIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetMitId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetMitIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetMitId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<ResetMitIdMutation, ResetMitIdMutationVariables>;
export const CheckEmailExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckEmailExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<CheckEmailExistsQuery, CheckEmailExistsQueryVariables>;
export const CheckDomainExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckDomainExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domainExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<CheckDomainExistsQuery, CheckDomainExistsQueryVariables>;
export const UpdateUserAndRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserAndRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserIdentityInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateRolesInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserRoleAssignmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserIdentity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"updateUserRoleAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateRolesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<UpdateUserAndRolesMutation, UpdateUserAndRolesMutationVariables>;
export const UpdateUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<UpdateUserRoleMutation, UpdateUserRoleMutationVariables>;
export const UpdatePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const GetFilteredMarketParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFilteredMarketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filteredMarketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"domains"}}]}}]}}]}}]} as unknown as DocumentNode<GetFilteredMarketParticipantsQuery, GetFilteredMarketParticipantsQueryVariables>;
export const GetFilteredUserRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFilteredUserRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserRoleStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserRoleSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filteredUserRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetFilteredUserRolesQuery, GetFilteredUserRolesQueryVariables>;
export const GetFilteredPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFilteredPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionDtoSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filteredPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissionRelationsUrl"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetFilteredPermissionsQuery, GetFilteredPermissionsQueryVariables>;
export const GetPermissionByEicFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionByEicFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionsByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}}]}}]}}]} as unknown as DocumentNode<GetPermissionByEicFunctionQuery, GetPermissionByEicFunctionQueryVariables>;
export const GetAssociatedMarketParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssociatedMarketParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associatedMarketParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"marketParticipants"}}]}}]}}]} as unknown as DocumentNode<GetAssociatedMarketParticipantsQuery, GetAssociatedMarketParticipantsQueryVariables>;
export const GetPermissionAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionAuditLogsQuery, GetPermissionAuditLogsQueryVariables>;
export const GetSelectionMarketParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSelectionMarketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectionMarketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gln"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}}]}}]}}]} as unknown as DocumentNode<GetSelectionMarketParticipantsQuery, GetSelectionMarketParticipantsQueryVariables>;
export const GetPermissionEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetPermissionEditQuery, GetPermissionEditQueryVariables>;
export const GetPermissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"assignableTo"}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionDetailsQuery, GetPermissionDetailsQueryVariables>;
export const GetUserAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedActorName"}},{"kind":"Field","name":{"kind":"Name","value":"affectedUserRoleName"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserAuditLogsQuery, GetUserAuditLogsQueryVariables>;
export const GetUserEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<GetUserEditQuery, GetUserEditQueryVariables>;
export const GetUserRoleAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"affectedPermissionName"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserRoleAuditLogsQuery, GetUserRoleAuditLogsQueryVariables>;
export const GetUserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetUserDetailsQuery, GetUserDetailsQueryVariables>;
export const GetUserRolesByActorIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByActorId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByActorId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByActorIdQuery, GetUserRolesByActorIdQueryVariables>;
export const GetUserRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesQuery, GetUserRolesQueryVariables>;
export const GetUsersForCsvDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersForCsv"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userRoleIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersSortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userRoleIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userRoleIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"userStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"administratedByName"}},{"kind":"Field","name":{"kind":"Name","value":"administratedByOrganizationName"}},{"kind":"Field","name":{"kind":"Name","value":"latestLoginAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersForCsvQuery, GetUsersForCsvQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userRoleIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersSortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userRoleIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userRoleIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"userStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latestLoginAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const DismissAllNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissAllNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DismissAllNotificationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissAllNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<DismissAllNotificationsMutation, DismissAllNotificationsMutationVariables>;
export const GetUserRoleWithPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoleWithPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRoleById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserRoleWithPermissionsQuery, GetUserRoleWithPermissionsQueryVariables>;
export const DismissNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DismissNotificationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<DismissNotificationMutation, DismissNotificationMutationVariables>;
export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationType"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"relatedToId"}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const GetSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReportById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"}},{"kind":"Field","name":{"kind":"Name","value":"settlementReportDownloadUrl"}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportQuery, GetSettlementReportQueryVariables>;
export const OnNotificationAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnNotificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notificationType"}},{"kind":"Field","name":{"kind":"Name","value":"relatedToId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<OnNotificationAddedSubscription, OnNotificationAddedSubscriptionVariables>;
export const ManuallyHandleOutgoingMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManuallyHandleOutgoingMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ManuallyHandleOutgoingMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"manuallyHandleOutgoingMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<ManuallyHandleOutgoingMessageMutation, ManuallyHandleOutgoingMessageMutationVariables>;
export const GetActorsAndUserRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorsAndUserRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administratedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assigned"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActorsAndUserRolesQuery, GetActorsAndUserRolesQueryVariables>;
export const GetBalanceResponsibleByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBalanceResponsibleById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplierName"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"storageDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleByIdQuery, GetBalanceResponsibleByIdQueryVariables>;
export const GetOutgoingMessageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettOutgoingMessageById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"lastDispatched"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}},{"kind":"Field","name":{"kind":"Name","value":"responseDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"dispatchDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyHandledExchangeEventMetaData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyHandledAt"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyHandledByIdentityDisplayName"}}]}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessageByIdQuery, GetOutgoingMessageByIdQueryVariables>;
export const GetBalanceResponsibleMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBalanceResponsibleMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BalanceResponsibleSortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplierName"}},{"kind":"Field","name":{"kind":"Name","value":"supplier"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleName"}},{"kind":"Field","name":{"kind":"Name","value":"storageDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsible"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsiblesUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}}]},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleImportUrl"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleMessagesQuery, GetBalanceResponsibleMessagesQueryVariables>;
export const GetOutgoingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOutgoingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EsettTimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EsettExchangeEventSortInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"lastDispatched"}},{"kind":"Field","name":{"kind":"Name","value":"documentId"}},{"kind":"Field","name":{"kind":"Name","value":"actorNumber"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"timeSeriesType"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCodeOut"}},{"kind":"Field","name":{"kind":"Name","value":"documentStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCount"}}]}}]}}]} as unknown as DocumentNode<GetOutgoingMessagesQuery, GetOutgoingMessagesQueryVariables>;
export const ResendExchangeMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendWaitingEsettExchangeMessages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<ResendExchangeMessagesMutation, ResendExchangeMessagesMutationVariables>;
export const DownloadEsettExchangeEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DownloadEsettExchangeEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ExchangeEventCalculationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EsettTimeSeriesType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentStatuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DocumentStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EsettExchangeEventSortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadEsettExchangeEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"periodInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"periodInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentInterval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentInterval"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"timeSeriesType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeSeriesType"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentStatuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentStatuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}}]}]}}]} as unknown as DocumentNode<DownloadEsettExchangeEventsQuery, DownloadEsettExchangeEventsQueryVariables>;
export const GetImbalancePricesMonthOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesMonthOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PriceAreaCode"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesForMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"areaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"areaCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"timeStamp"}},{"kind":"Field","name":{"kind":"Name","value":"importedAt"}},{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesDownloadImbalanceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imbalancePrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesMonthOverviewQuery, GetImbalancePricesMonthOverviewQueryVariables>;
export const GetStatusReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettExchangeStatusReport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitingForExternalResponse"}}]}}]}}]} as unknown as DocumentNode<GetStatusReportQuery, GetStatusReportQueryVariables>;
export const GetServiceStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"esettServiceStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"component"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}}]}}]}}]} as unknown as DocumentNode<GetServiceStatusQuery, GetServiceStatusQueryVariables>;
export const GetImbalancePricesOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalancePricesOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadImbalancePricesUrl"}},{"kind":"Field","name":{"kind":"Name","value":"pricePeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetImbalancePricesOverviewQuery, GetImbalancePricesOverviewQueryVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"saved"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"hasFederatedLogin"}}]}}]}}]} as unknown as DocumentNode<UserProfileQuery, UserProfileQueryVariables>;
export const CreateCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateCalculationMutation, CreateCalculationMutationVariables>;
export const GetMarketParticipantsForRequestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantsForRequestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantsForRequestCalculationQuery, GetMarketParticipantsForRequestCalculationQueryVariables>;
export const GetCalculationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalculationFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalculationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Calculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"terminatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"executionType"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapacitySettlementCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearMonth"}}]}}]}}]} as unknown as DocumentNode<GetCalculationByIdQuery, GetCalculationByIdQueryVariables>;
export const CancelScheduledCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelScheduledCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelScheduledCalculationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelScheduledCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<CancelScheduledCalculationMutation, CancelScheduledCalculationMutationVariables>;
export const RequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"request"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestMutation, RequestMutationVariables>;
export const GetRequestOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequestOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isGridAreaRequired"}},{"kind":"Field","name":{"kind":"Name","value":"calculationTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"displayValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"displayValue"}}]}}]}}]}}]} as unknown as DocumentNode<GetRequestOptionsQuery, GetRequestOptionsQueryVariables>;
export const RequestMissingMeasurementsLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestMissingMeasurementsLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestMissingMeasurementsLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestMissingMeasurementsLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestMissingMeasurementsLogMutation, RequestMissingMeasurementsLogMutationVariables>;
export const GetRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"requestedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestCalculatedEnergyTimeSeriesResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestCalculatedWholesaleServicesResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"priceType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRequestsQuery, GetRequestsQueryVariables>;
export const GetCalculationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationsQueryInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacitySettlementsUploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CalculationFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CalculationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Calculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"terminatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"executionType"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapacitySettlementCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearMonth"}}]}}]}}]} as unknown as DocumentNode<GetCalculationsQuery, GetCalculationsQueryVariables>;
export const GetSelectedMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSelectedMarketParticipant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedMarketParticipant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetSelectedMarketParticipantQuery, GetSelectedMarketParticipantQueryVariables>;
export const GetArchivedMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArchivedMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"senderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiverId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchivedMessageDocumentType"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"businessReasons"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BusinessReason"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeRelated"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchivedMessageSortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archivedMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"senderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"senderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"receiverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"businessReasons"},"value":{"kind":"Variable","name":{"kind":"Name","value":"businessReasons"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeRelated"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeRelated"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"}},{"kind":"Field","name":{"kind":"Name","value":"documentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"receiver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetArchivedMessagesQuery, GetArchivedMessagesQueryVariables>;
export const GetUserRolesForCsvDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesForCsv"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserRoleStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserRoleSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filteredUserRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"eicFunction"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesForCsvQuery, GetUserRolesForCsvQueryVariables>;
export const AddChargeSeriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChargeSeries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddChargeSeriesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChargeSeries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<AddChargeSeriesMutation, AddChargeSeriesMutationVariables>;
export const OnCalculationUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnCalculationUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"terminatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"executionType"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapacitySettlementCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearMonth"}}]}}]}}]}}]} as unknown as DocumentNode<OnCalculationUpdatedSubscription, OnCalculationUpdatedSubscriptionVariables>;
export const CreateChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCharge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChargeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCharge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<CreateChargeMutation, CreateChargeMutationVariables>;
export const GetLatestCalculationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestCalculation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartCalculationType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PeriodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CapacitySettlementCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearMonth"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestCalculationQuery, GetLatestCalculationQueryVariables>;
export const GetChargesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCharges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargesQueryInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChargeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChargeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"spotDependingPrice"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetChargesQuery, GetChargesQueryVariables>;
export const StopChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopCharge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StopChargeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopCharge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<StopChargeMutation, StopChargeMutationVariables>;
export const GetChargeSeriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChargeSeries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chargeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interval"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chargeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChargeFields"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"interval"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interval"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"hasChanged"}},{"kind":"Field","name":{"kind":"Name","value":"changes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChargeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"spotDependingPrice"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetChargeSeriesQuery, GetChargeSeriesQueryVariables>;
export const GetChargeByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChargeById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChargeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChargeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Charge"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"spotDependingPrice"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"vatInclusive"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetChargeByIdQuery, GetChargeByIdQueryVariables>;
export const UpdateChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCharge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateChargeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCharge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<UpdateChargeMutation, UpdateChargeMutationVariables>;
export const GetProcessByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProcessById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"processById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"terminatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestCalculatedWholesaleServicesResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceType"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestCalculatedEnergyTimeSeriesResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ElectricalHeatingCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationType"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"executionType"}}]}}]}}]}}]} as unknown as DocumentNode<GetProcessByIdQuery, GetProcessByIdQueryVariables>;
export const GetUserRolesByEicfunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRolesByEicfunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userRolesByEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicfunction"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetUserRolesByEicfunctionQuery, GetUserRolesByEicfunctionQueryVariables>;
export const GetProcessesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProcesses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationsQueryInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProcessSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"processes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"terminatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"isCurrent"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ElectricalHeatingCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationType"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WholesaleAndEnergyCalculation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetProcessesQuery, GetProcessesQueryVariables>;
export const GetGridAreaOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreaOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GridAreaType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GridAreaStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GridAreaSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreaOverviewItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"actor"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fullFlexDate"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetGridAreaOverviewQuery, GetGridAreaOverviewQueryVariables>;
export const GetGridAreaDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreaDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreaOverviewItemById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gridAreaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"actor"}},{"kind":"Field","name":{"kind":"Name","value":"organizationName"}},{"kind":"Field","name":{"kind":"Name","value":"priceAreaCode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"auditLog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentOwner"}},{"kind":"Field","name":{"kind":"Name","value":"previousOwner"}},{"kind":"Field","name":{"kind":"Name","value":"consolidatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetGridAreaDetailsQuery, GetGridAreaDetailsQueryVariables>;
export const CreateDelegationForMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createDelegationForMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDelegationsForMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDelegationsForMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateDelegationForMarketParticipantMutation, CreateDelegationForMarketParticipantMutationVariables>;
export const DownloadMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DownloadMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locale"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridImbalanceValuesToInclude"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridAreaImbalanceSortInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadMeteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locale"}}},{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"valuesToInclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}}}]}]}}]} as unknown as DocumentNode<DownloadMeteringGridAreaImbalanceQuery, DownloadMeteringGridAreaImbalanceQueryVariables>;
export const StopDelegationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"stopDelegations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StopDelegationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopDelegation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<StopDelegationsMutation, StopDelegationsMutationVariables>;
export const AddMeteringPointsToAdditionalRecipientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMeteringPointsToAdditionalRecipient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddMeteringPointsToAdditionalRecipientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMeteringPointsToAdditionalRecipient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<AddMeteringPointsToAdditionalRecipientMutation, AddMeteringPointsToAdditionalRecipientMutationVariables>;
export const GetMeteringGridAreaImbalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringGridAreaImbalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridImbalanceValuesToInclude"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringGridAreaImbalanceSortInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringGridAreaImbalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCodes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCodes"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"valuesToInclude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"valuesToInclude"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetMeteringGridAreaImbalanceQuery, GetMeteringGridAreaImbalanceQueryVariables>;
export const GetAdditionalRecipientOfMeasurementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdditionalRecipientOfMeasurements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"additionalRecipientForMeasurements"}}]}}]}}]} as unknown as DocumentNode<GetAdditionalRecipientOfMeasurementsQuery, GetAdditionalRecipientOfMeasurementsQueryVariables>;
export const GetMeteringGridAreaImbalanceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringGridAreaImbalanceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringGridAreaImbalanceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"documentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"receivedDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"mgaImbalanceDocumentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"incomingImbalancePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalanceDay"}},{"kind":"Field","name":{"kind":"Name","value":"firstOccurrenceOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"firstPositionOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outgoingImbalancePerDay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imbalanceDay"}},{"kind":"Field","name":{"kind":"Name","value":"firstOccurrenceOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"firstPositionOfImbalance"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeteringGridAreaImbalanceByIdQuery, GetMeteringGridAreaImbalanceByIdQueryVariables>;
export const GetMarketParticipantAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}},{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"consolidation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentOwner"}},{"kind":"Field","name":{"kind":"Name","value":"currentOwnerGln"}},{"kind":"Field","name":{"kind":"Name","value":"previousOwner"}},{"kind":"Field","name":{"kind":"Name","value":"previousOwnerGln"}},{"kind":"Field","name":{"kind":"Name","value":"previousOwnerStopsAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delegation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantName"}},{"kind":"Field","name":{"kind":"Name","value":"gln"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"stopsAt"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaName"}},{"kind":"Field","name":{"kind":"Name","value":"processType"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantAuditLogsQuery, GetMarketParticipantAuditLogsQueryVariables>;
export const GetBalanceResponsibleRelationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBalanceResponsibleRelation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleAgreements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointType"}},{"kind":"Field","name":{"kind":"Name","value":"balanceResponsibleWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"energySupplierWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBalanceResponsibleRelationQuery, GetBalanceResponsibleRelationQueryVariables>;
export const GetMarketParticipantsByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantsByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantsByOrganizationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantsByOrganizationIdQuery, GetMarketParticipantsByOrganizationIdQueryVariables>;
export const GetMarketParticipantCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"credentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignCertificateCredentialsUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"marketParticipantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}}}]},{"kind":"Field","name":{"kind":"Name","value":"removeMarketParticipantCredentialsUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"marketParticipantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}}}]},{"kind":"Field","name":{"kind":"Name","value":"clientSecretCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientSecretIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificateCredentials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbprint"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantCredentialsQuery, GetMarketParticipantCredentialsQueryVariables>;
export const GetDelegatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDelegates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GetDelegatesQuery, GetDelegatesQueryVariables>;
export const GetPaginatedMarketParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaginatedMarketParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketParticipantStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketParticipantSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatedMarketParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}},{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"publicMail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetPaginatedMarketParticipantsQuery, GetPaginatedMarketParticipantsQueryVariables>;
export const GetMarketParticipantDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domains"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantDetailsQuery, GetMarketParticipantDetailsQueryVariables>;
export const MergeMarketParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MergeMarketParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MergeMarketParticipantsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mergeMarketParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MergeMarketParticipantsMutation, MergeMarketParticipantsMutationVariables>;
export const GetMarketParticipantEditableFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantEditableFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domains"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantEditableFieldsQuery, GetMarketParticipantEditableFieldsQueryVariables>;
export const UpdateMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMarketParticipantMutation, UpdateMarketParticipantMutationVariables>;
export const GetDelegationsForMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDelegationsForMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketParticipantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"delegations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"process"}},{"kind":"Field","name":{"kind":"Name","value":"delegatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"delegatedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"validPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetDelegationsForMarketParticipantQuery, GetDelegationsForMarketParticipantQueryVariables>;
export const GetOrganizationEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domains"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationEditQuery, GetOrganizationEditQueryVariables>;
export const GetOrganizationFromCvrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationFromCVR"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchOrganizationInCVR"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cvr"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cvr"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hasResult"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationFromCvrQuery, GetOrganizationFromCvrQueryVariables>;
export const GetAuditLogByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"change"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"isInitialAssignment"}},{"kind":"Field","name":{"kind":"Name","value":"currentValue"}},{"kind":"Field","name":{"kind":"Name","value":"previousValue"}},{"kind":"Field","name":{"kind":"Name","value":"auditedBy"}}]}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByOrganizationIdQuery, GetAuditLogByOrganizationIdQueryVariables>;
export const RemoveMeteringPointsFromAdditionalRecipientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMeteringPointsFromAdditionalRecipient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveMeteringPointsFromAdditionalRecipientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMeteringPointsFromAdditionalRecipient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<RemoveMeteringPointsFromAdditionalRecipientMutation, RemoveMeteringPointsFromAdditionalRecipientMutationVariables>;
export const CreateMarketParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarketParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarketParticipantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarketParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateMarketParticipantMutation, CreateMarketParticipantMutationVariables>;
export const GetOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domains"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsQuery, GetOrganizationsQueryVariables>;
export const RequestClientSecretCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestClientSecretCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestClientSecretCredentialsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestClientSecretCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorClientSecretDto"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secretText"}}]}}]}}]}}]} as unknown as DocumentNode<RequestClientSecretCredentialsMutation, RequestClientSecretCredentialsMutationVariables>;
export const UpdateOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrganizationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>;
export const CloseConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloseConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closeConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<CloseConversationMutation, CloseConversationMutationVariables>;
export const GetOrganizationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"domains"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganizationByIdQuery, GetOrganizationByIdQueryVariables>;
export const StartConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subject"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationSubject"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"internalNote"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"anonymous"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiver"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActorType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startConversationInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"subject"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subject"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointIdentification"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"internalNote"},"value":{"kind":"Variable","name":{"kind":"Name","value":"internalNote"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"anonymous"},"value":{"kind":"Variable","name":{"kind":"Name","value":"anonymous"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"receiver"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiver"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"string"}}]}}]}}]} as unknown as DocumentNode<StartConversationMutation, StartConversationMutationVariables>;
export const GetConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversationsForMeteringPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointIdentification"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdated"}}]}}]}}]}}]} as unknown as DocumentNode<GetConversationsQuery, GetConversationsQueryVariables>;
export const SendActorConversationMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendActorConversationMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"anonymous"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendActorConversationMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendActorConversationMessageInput"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointIdentification"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"anonymous"},"value":{"kind":"Variable","name":{"kind":"Name","value":"anonymous"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<SendActorConversationMessageMutation, SendActorConversationMessageMutationVariables>;
export const GetConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"conversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"meteringPointIdentification"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"internalNote"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"senderType"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"messageType"}},{"kind":"Field","name":{"kind":"Name","value":"createdTime"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]}}]} as unknown as DocumentNode<GetConversationQuery, GetConversationQueryVariables>;
export const GetPaginatedOrganizationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaginatedOrganizations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrganizationSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatedOrganizations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"domains"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetPaginatedOrganizationsQuery, GetPaginatedOrganizationsQueryVariables>;
export const CreateChargeLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChargeLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chargeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newStartDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factor"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChargeLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chargeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chargeId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"newStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newStartDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"factor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factor"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<CreateChargeLinkMutation, CreateChargeLinkMutationVariables>;
export const CancelChargeLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelChargeLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelChargeLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<CancelChargeLinkMutation, CancelChargeLinkMutationVariables>;
export const MarkConversationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<MarkConversationReadMutation, MarkConversationReadMutationVariables>;
export const GetChargeLinkByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChargeLinkById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeLinkById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode<GetChargeLinkByIdQuery, GetChargeLinkByIdQueryVariables>;
export const GetChargeLinksByMeteringPointIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChargeLinksByMeteringPointId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeLinkDtoSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeLinksByMeteringPointId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}}]}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"transparentInvoicing"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChargeLinksByMeteringPointIdQuery, GetChargeLinksByMeteringPointIdQueryVariables>;
export const GetChargeLinkHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChargeLinkHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeLinkById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"charge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}}]}}]}}]} as unknown as DocumentNode<GetChargeLinkHistoryQuery, GetChargeLinkHistoryQueryVariables>;
export const GetMeteringPointDebugViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointDebugView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"debugView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}}]}]}}]} as unknown as DocumentNode<GetMeteringPointDebugViewQuery, GetMeteringPointDebugViewQueryVariables>;
export const GetChargeByTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChargeByType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargesByType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GetChargeByTypeQuery, GetChargeByTypeQueryVariables>;
export const GetMeteringPointEventsDebugViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointEventsDebugView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eventsDebugView"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointJson"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"dataJson"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeteringPointEventsDebugViewQuery, GetMeteringPointEventsDebugViewQueryVariables>;
export const EditChargeLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditChargeLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newStartDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"factor"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editChargeLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"newStartDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newStartDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"factor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"factor"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<EditChargeLinkMutation, EditChargeLinkMutationVariables>;
export const GetMeteringPointsByGridAreaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointsByGridArea"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointsByGridAreaCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gridAreaCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identification"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeteringPointsByGridAreaQuery, GetMeteringPointsByGridAreaQueryVariables>;
export const GetAggregatedMeasurementsForAllYearsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAggregatedMeasurementsForAllYears"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthEicFunctionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregatedMeasurementsForAllYears"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"marketRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"qualities"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]} as unknown as DocumentNode<GetAggregatedMeasurementsForAllYearsQuery, GetAggregatedMeasurementsForAllYearsQueryVariables>;
export const GetSelectableDatesForEndOfSupplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSelectableDatesForEndOfSupply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectableDatesForEndOfSupply"}}]}}]} as unknown as DocumentNode<GetSelectableDatesForEndOfSupplyQuery, GetSelectableDatesForEndOfSupplyQueryVariables>;
export const GetMeasurementPointsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeasurementPoints"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"observationTime"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocalDate"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthEicFunctionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"measurementPoints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"observationTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"observationTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"marketRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"quality"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"persistedTime"}},{"kind":"Field","name":{"kind":"Name","value":"registrationTime"}}]}}]}}]} as unknown as DocumentNode<GetMeasurementPointsQuery, GetMeasurementPointsQueryVariables>;
export const MarkConversationUnReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkConversationUnRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markConversationUnRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<MarkConversationUnReadMutation, MarkConversationUnReadMutationVariables>;
export const GetAggregatedMeasurementsForMonthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAggregatedMeasurementsForMonth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showOnlyChangedValues"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"yearMonth"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"YearMonth"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthEicFunctionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregatedMeasurementsForMonth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showOnlyChangedValues"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showOnlyChangedValues"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"yearMonth"},"value":{"kind":"Variable","name":{"kind":"Name","value":"yearMonth"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"marketRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"qualities"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]} as unknown as DocumentNode<GetAggregatedMeasurementsForMonthQuery, GetAggregatedMeasurementsForMonthQueryVariables>;
export const GetMeasurementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeasurements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showOnlyChangedValues"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"showHistoricValues"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocalDate"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthEicFunctionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"showOnlyChangedValues"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showOnlyChangedValues"}}},{"kind":"Argument","name":{"kind":"Name","value":"showHistoricalValues"},"value":{"kind":"Variable","name":{"kind":"Name","value":"showHistoricValues"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"marketRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurementPositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"observationTime"}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"hasQuantityOrQualityChanged"}},{"kind":"Field","name":{"kind":"Name","value":"historic"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"quality"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"registrationTime"}},{"kind":"Field","name":{"kind":"Name","value":"persistedTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"quality"}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMeasurementsQuery, GetMeasurementsQueryVariables>;
export const StopChargeLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopChargeLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stopDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopChargeLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stopDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stopDate"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<StopChargeLinkMutation, StopChargeLinkMutationVariables>;
export const RequestEndOfSupplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestEndOfSupply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestEndOfSupplyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestEndOfSupply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestEndOfSupplyMutation, RequestEndOfSupplyMutationVariables>;
export const InitiateMoveInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitiateMoveIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitiateMoveInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateMoveIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<InitiateMoveInMutation, InitiateMoveInMutationVariables>;
export const RequestChangeCustomerCharacteristicsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestChangeCustomerCharacteristics"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeCustomerCharacteristicsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeCustomerCharacteristics"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestChangeCustomerCharacteristicsMutation, RequestChangeCustomerCharacteristicsMutationVariables>;
export const GetArchivedMessagesForMeteringPointDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArchivedMessagesForMeteringPoint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"senderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiverId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MeteringPointDocumentType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchivedMessageSortInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archivedMessagesForMeteringPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"senderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"senderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"receiverId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiverId"}}},{"kind":"Argument","name":{"kind":"Name","value":"documentType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentType"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"documentType"}},{"kind":"Field","name":{"kind":"Name","value":"documentUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"receiver"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetArchivedMessagesForMeteringPointQuery, GetArchivedMessagesForMeteringPointQueryVariables>;
export const GetContactCprDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetContactCPR"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contactId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointContactCpr"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"contactId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contactId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<GetContactCprQuery, GetContactCprQueryVariables>;
export const ExecuteMeteringPointManualCorrectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExecuteMeteringPointManualCorrection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExecuteMeteringPointManualCorrectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"executeMeteringPointManualCorrection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<ExecuteMeteringPointManualCorrectionMutation, ExecuteMeteringPointManualCorrectionMutationVariables>;
export const GetFailedSendMeasurementsInstancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFailedSendMeasurementsInstances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMeasurementsInstanceDtoSortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"failedSendMeasurementsInstances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"failedAt"}},{"kind":"Field","name":{"kind":"Name","value":"failedCount"}},{"kind":"Field","name":{"kind":"Name","value":"errorText"}}]}}]}}]}}]} as unknown as DocumentNode<GetFailedSendMeasurementsInstancesQuery, GetFailedSendMeasurementsInstancesQueryVariables>;
export const GetMeteringPointByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorGln"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMigratedMeteringPoints"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isChild"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointId"}},{"kind":"Field","name":{"kind":"Name","value":"isEnergySupplier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"energySupplierActorGln"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorGln"}}}]},{"kind":"Field","name":{"kind":"Name","value":"isGridAccessProvider"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gridAccessProviderActorGln"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorGln"}}}]},{"kind":"Field","name":{"kind":"Name","value":"electricalHeatingStartDate"}},{"kind":"Field","name":{"kind":"Name","value":"haveElectricalHeating"}},{"kind":"Field","name":{"kind":"Name","value":"hadElectricalHeating"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"closedDownDate"}},{"kind":"Field","name":{"kind":"Name","value":"connectionDate"}},{"kind":"Field","name":{"kind":"Name","value":"disconnectedDate"}},{"kind":"Field","name":{"kind":"Name","value":"commercialRelation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplier"}},{"kind":"Field","name":{"kind":"Name","value":"energySupplierName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeElectricalHeatingPeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}}]}},{"kind":"Field","name":{"kind":"Name","value":"electricalHeatingPeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeEnergySupplyPeriod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isProtectedName"}},{"kind":"Field","name":{"kind":"Name","value":"cvr"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"relationType"}},{"kind":"Field","name":{"kind":"Name","value":"technicalContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerContact"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legalContact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerContact"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"manuallyHandled"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"subType"}},{"kind":"Field","name":{"kind":"Name","value":"gridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentMeteringPoint"}},{"kind":"Field","name":{"kind":"Name","value":"internalMeteringPointParentId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"searchMigratedMeteringPoints"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}}}]},{"kind":"Field","name":{"kind":"Name","value":"ownedBy"}},{"kind":"Field","name":{"kind":"Name","value":"connectionState"}},{"kind":"Field","name":{"kind":"Name","value":"netSettlementGroup"}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"productObligation"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledMeterReadingDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"day"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"connectionType"}},{"kind":"Field","name":{"kind":"Name","value":"disconnectionType"}},{"kind":"Field","name":{"kind":"Name","value":"environmentalFriendly"}},{"kind":"Field","name":{"kind":"Name","value":"fromGridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toGridArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"powerLimitKw"}},{"kind":"Field","name":{"kind":"Name","value":"powerLimitAmp"}},{"kind":"Field","name":{"kind":"Name","value":"powerPlantGsrn"}},{"kind":"Field","name":{"kind":"Name","value":"meterNumber"}},{"kind":"Field","name":{"kind":"Name","value":"settlementMethod"}},{"kind":"Field","name":{"kind":"Name","value":"installationAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"streetCode"}},{"kind":"Field","name":{"kind":"Name","value":"cityName"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"room"}},{"kind":"Field","name":{"kind":"Name","value":"municipalityCode"}},{"kind":"Field","name":{"kind":"Name","value":"citySubDivisionName"}},{"kind":"Field","name":{"kind":"Name","value":"locationDescription"}},{"kind":"Field","name":{"kind":"Name","value":"buildingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"darReference"}},{"kind":"Field","name":{"kind":"Name","value":"washInstructions"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerContact"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ElectricityMarketViewCustomerContactDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"streetName"}},{"kind":"Field","name":{"kind":"Name","value":"buildingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"streetCode"}},{"kind":"Field","name":{"kind":"Name","value":"cityName"}},{"kind":"Field","name":{"kind":"Name","value":"municipalityCode"}},{"kind":"Field","name":{"kind":"Name","value":"postBox"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"darReference"}},{"kind":"Field","name":{"kind":"Name","value":"isProtectedAddress"}},{"kind":"Field","name":{"kind":"Name","value":"citySubDivisionName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"room"}}]}}]} as unknown as DocumentNode<GetMeteringPointByIdQuery, GetMeteringPointByIdQueryVariables>;
export const GetMeteringPointForManualCorrectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointForManualCorrection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointForManualCorrection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}}]}]}}]} as unknown as DocumentNode<GetMeteringPointForManualCorrectionQuery, GetMeteringPointForManualCorrectionQueryVariables>;
export const GetRelatedMeteringPointsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRelatedMeteringPointsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relatedMeteringPoints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointIdentification"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMigratedMeteringPoints"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedMeteringPoint"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedMeteringPoint"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedMeteringPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedMeteringPoint"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedByGsrn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedMeteringPoint"}}]}},{"kind":"Field","name":{"kind":"Name","value":"historicalMeteringPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RelatedMeteringPoint"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RelatedMeteringPoint"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RelatedMeteringPointDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointIdentification"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"connectionState"}},{"kind":"Field","name":{"kind":"Name","value":"createdDate"}},{"kind":"Field","name":{"kind":"Name","value":"connectionDate"}},{"kind":"Field","name":{"kind":"Name","value":"closedDownDate"}},{"kind":"Field","name":{"kind":"Name","value":"disconnectionDate"}}]}}]} as unknown as DocumentNode<GetRelatedMeteringPointsByIdQuery, GetRelatedMeteringPointsByIdQueryVariables>;
export const GetAggregatedMeasurementsForYearDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAggregatedMeasurementsForYear"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthEicFunctionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregatedMeasurementsForYear"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"actorNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"marketRole"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketRole"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearMonth"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"qualities"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}}]}}]} as unknown as DocumentNode<GetAggregatedMeasurementsForYearQuery, GetAggregatedMeasurementsForYearQueryVariables>;
export const RequestConnectionStateChangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestConnectionStateChange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestConnectionStateChangeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestConnectionStateChange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestConnectionStateChangeMutation, RequestConnectionStateChangeMutationVariables>;
export const GetMeteringPointProcessByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointProcessById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointProcessById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cutoffDate"}},{"kind":"Field","name":{"kind":"Name","value":"reasonCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"steps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"step"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"documentUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"initiator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeteringPointProcessByIdQuery, GetMeteringPointProcessByIdQueryVariables>;
export const SendMeasurementsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMeasurements"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMeasurementsRequestV2Input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMeasurements"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SendMeasurementsMutation, SendMeasurementsMutationVariables>;
export const GetMeteringPointProcessOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointProcessOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"created"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointProcessOverview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"created"},"value":{"kind":"Variable","name":{"kind":"Name","value":"created"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cutoffDate"}},{"kind":"Field","name":{"kind":"Name","value":"reasonCode"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"initiator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"availableActions"}}]}}]}}]} as unknown as DocumentNode<GetMeteringPointProcessOverviewQuery, GetMeteringPointProcessOverviewQueryVariables>;
export const GetMeteringPointUploadMetadataByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeteringPointUploadMetadataById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPoint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMigratedMeteringPoints"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"measureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"resolution"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"subType"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeteringPointUploadMetadataByIdQuery, GetMeteringPointUploadMetadataByIdQueryVariables>;
export const GetMeasurementsReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeasurementsReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"measurementsReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointTypes"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointIds"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaCodes"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"measurementsReportDownloadUrl"}}]}}]}}]} as unknown as DocumentNode<GetMeasurementsReportsQuery, GetMeasurementsReportsQueryVariables>;
export const CancelSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelSettlementReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelSettlementReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<CancelSettlementReportMutation, CancelSettlementReportMutationVariables>;
export const RequestMeasurementsReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestMeasurementsReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestMeasurementsReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestMeasurementsReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestMeasurementsReportInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestMeasurementsReportMutation, RequestMeasurementsReportMutationVariables>;
export const GetMarketParticipantOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"value"},"name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"displayValue"},"name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantOptionsQuery, GetMarketParticipantOptionsQueryVariables>;
export const GetReleaseTogglesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetReleaseToggles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"releaseToggles"}}]}}]} as unknown as DocumentNode<GetReleaseTogglesQuery, GetReleaseTogglesQueryVariables>;
export const GetSettlementReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calculationType"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfGridAreasInReport"}},{"kind":"Field","name":{"kind":"Name","value":"includesBasisData"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"statusType"}},{"kind":"Field","name":{"kind":"Name","value":"settlementReportDownloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"executionTime"}},{"kind":"Field","name":{"kind":"Name","value":"combineResultInASingleFile"}},{"kind":"Field","name":{"kind":"Name","value":"includeMonthlyAmount"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportsQuery, GetSettlementReportsQueryVariables>;
export const SimulateMeteringPointManualCorrectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SimulateMeteringPointManualCorrection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SimulateMeteringPointManualCorrectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"simulateMeteringPointManualCorrection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"string"}}]}}]}}]} as unknown as DocumentNode<SimulateMeteringPointManualCorrectionMutation, SimulateMeteringPointManualCorrectionMutationVariables>;
export const GetSettlementReportCalculationsByGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettlementReportCalculationsByGridAreas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CalculationType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlementReportGridAreaCalculationsForPeriod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"calculationType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationType"}}},{"kind":"Argument","name":{"kind":"Name","value":"gridAreaId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gridAreaIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"calculationPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculationPeriod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calculationId"}},{"kind":"Field","name":{"kind":"Name","value":"calculationDate"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreaWithName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSettlementReportCalculationsByGridAreasQuery, GetSettlementReportCalculationsByGridAreasQueryVariables>;
export const AddTokenToDownloadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTokenToDownloadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"URL"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTokenToDownloadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"downloadUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"downloadUrlWithToken"},"name":{"kind":"Name","value":"string"}}]}}]}}]} as unknown as DocumentNode<AddTokenToDownloadUrlMutation, AddTokenToDownloadUrlMutationVariables>;
export const RequestSettlementReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestSettlementReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestSettlementReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestSettlementReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}}]}}]}}]} as unknown as DocumentNode<RequestSettlementReportMutation, RequestSettlementReportMutationVariables>;
export const GetMarketParticipantByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessRegisterIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domains"}}]}},{"kind":"Field","name":{"kind":"Name","value":"contact"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantByIdQuery, GetMarketParticipantByIdQueryVariables>;
export const GetMarketParticipantsForEicFunctionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipantsForEicFunction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EicFunction"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipantsForEicFunction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eicFunctions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eicFunctions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantsForEicFunctionQuery, GetMarketParticipantsForEicFunctionQueryVariables>;
export const InitiateMitIdSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitiateMitIdSignup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initiateMitIdSignup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Errors"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Errors"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ApiError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"apiErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"}}]}}]}}]} as unknown as DocumentNode<InitiateMitIdSignupMutation, InitiateMitIdSignupMutationVariables>;
export const DoesInternalMeteringPointIdExistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DoesInternalMeteringPointIdExist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"internalMeteringPointId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meteringPointExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"internalMeteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"internalMeteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"meteringPointId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meteringPointId"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchMigratedMeteringPoints"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchMigratedMeteringPoints"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meteringPointId"}}]}}]}}]} as unknown as DocumentNode<DoesInternalMeteringPointIdExistQuery, DoesInternalMeteringPointIdExistQueryVariables>;
export const GetGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gridAreas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"includedInCalculation"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetGridAreasQuery, GetGridAreasQueryVariables>;
export const GetMarketParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"glnOrEicNumber"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marketRole"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publicMail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]}}]} as unknown as DocumentNode<GetMarketParticipantsQuery, GetMarketParticipantsQueryVariables>;
export const GetRelevantGridAreasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRelevantGridAreas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PeriodInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"environment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relevantGridAreas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actorId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorId"}}},{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"validTo"}},{"kind":"Field","name":{"kind":"Name","value":"validFrom"}},{"kind":"Field","name":{"kind":"Name","value":"includedInCalculation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"environment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"environment"}}}]},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetRelevantGridAreasQuery, GetRelevantGridAreasQueryVariables>;
import { dateRangeTypePolicy, dateTypePolicy } from "../../type-policies";

export const scalarTypePolicies = {
  ActorAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  ActorCertificateCredentialsDto: { fields: { expirationDate: dateTypePolicy } },
  ActorClientSecretCredentialsDto: { fields: { expirationDate: dateTypePolicy } },
  ArchivedMessage: { fields: { createdAt: dateTypePolicy } },
  BalanceResponsibilityAgreement: { fields: { validPeriod: dateRangeTypePolicy } },
  BalanceResponsible: { fields: { validPeriod: dateRangeTypePolicy, receivedDateTime: dateTypePolicy } },
  CapacitySettlementCalculation: {
    fields: {
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
  ChargeLinkHistory: { fields: { submittedAt: dateTypePolicy } },
  ChargeLinkPeriod: { fields: { interval: dateRangeTypePolicy } },
  ChargePeriod: { fields: { period: dateRangeTypePolicy } },
  ChargeSeriesPoint: { fields: { period: dateRangeTypePolicy } },
  ConversationInfo: { fields: { lastUpdated: dateTypePolicy } },
  ConversationMessage: { fields: { createdTime: dateTypePolicy } },
  ElectricalHeatingCalculation: {
    fields: {
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
  ElectricityMarketV2EventDto: { fields: { timestamp: dateTypePolicy } },
  ElectricityMarketViewCommercialRelationDto: { fields: { startDate: dateTypePolicy, endDate: dateTypePolicy } },
  ElectricityMarketViewElectricalHeatingDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  ElectricityMarketViewEnergySupplyPeriodDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  ElectricityMarketViewMeteringPointDto: {
    fields: {
      electricalHeatingStartDate: dateTypePolicy,
      createdDate: dateTypePolicy,
      connectionDate: dateTypePolicy,
      closedDownDate: dateTypePolicy,
      disconnectedDate: dateTypePolicy,
    },
  },
  ElectricityMarketViewMeteringPointMetadataDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  EsettOutgoingMessage: {
    fields: { period: dateRangeTypePolicy, created: dateTypePolicy, lastDispatched: dateTypePolicy },
  },
  ExchangeEventSearchResult: { fields: { created: dateTypePolicy, lastDispatched: dateTypePolicy } },
  GridAreaAuditedChangeAuditLogDto: { fields: { consolidatedAt: dateTypePolicy, timestamp: dateTypePolicy } },
  GridAreaDto: { fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy } },
  GridAreaOverviewItemDto: {
    fields: { validFrom: dateTypePolicy, validTo: dateTypePolicy, fullFlexDate: dateTypePolicy },
  },
  ImbalancePrice: { fields: { timestamp: dateTypePolicy } },
  ImbalancePriceDaily: { fields: { timeStamp: dateTypePolicy, importedAt: dateTypePolicy } },
  ImbalancePricePeriod: { fields: { name: dateTypePolicy } },
  ManuallyHandledExchangeEventMetaData: { fields: { manuallyHandledAt: dateTypePolicy } },
  MarketParticipantConsolidationAuditLog: { fields: { previousOwnerStopsAt: dateTypePolicy } },
  MeasurementAggregationByDateDto: { fields: { date: dateTypePolicy } },
  MeasurementPointDto: { fields: { persistedTime: dateTypePolicy, registrationTime: dateTypePolicy } },
  MeasurementPositionDto: { fields: { observationTime: dateTypePolicy } },
  MeasurementsReport: { fields: { period: dateRangeTypePolicy, createdDateTime: dateTypePolicy } },
  MessageDelegationType: { fields: { validPeriod: dateRangeTypePolicy } },
  MeteringGridAreaImbalancePerDayDto: {
    fields: { imbalanceDay: dateTypePolicy, firstOccurrenceOfImbalance: dateTypePolicy },
  },
  MeteringGridAreaImbalanceSearchResult: {
    fields: { period: dateRangeTypePolicy, documentDateTime: dateTypePolicy, receivedDateTime: dateTypePolicy },
  },
  MeteringPointProcess: { fields: { createdAt: dateTypePolicy, cutoffDate: dateTypePolicy } },
  MeteringPointProcessStep: { fields: { completedAt: dateTypePolicy, dueDate: dateTypePolicy } },
  MissingMeasurementsLogCalculation: {
    fields: {
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
  NetConsumptionCalculation: {
    fields: {
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
  NotificationDto: { fields: { occurredAt: dateTypePolicy, expiresAt: dateTypePolicy } },
  OrganizationAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  Permission: { fields: { created: dateTypePolicy } },
  PermissionAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  PermissionDetailsDto: { fields: { created: dateTypePolicy } },
  RelatedMeteringPointDto: {
    fields: {
      createdDate: dateTypePolicy,
      connectionDate: dateTypePolicy,
      closedDownDate: dateTypePolicy,
      disconnectionDate: dateTypePolicy,
    },
  },
  RequestCalculatedEnergyTimeSeriesResult: {
    fields: {
      period: dateRangeTypePolicy,
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
  RequestCalculatedWholesaleServicesResult: {
    fields: {
      period: dateRangeTypePolicy,
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
  RequestSettlementReportGridAreaCalculation: { fields: { calculationDate: dateTypePolicy } },
  SendMeasurementsInstanceDto: {
    fields: {
      createdAt: dateTypePolicy,
      businessValidationSucceededAt: dateTypePolicy,
      sentToMeasurementsAt: dateTypePolicy,
      receivedFromMeasurementsAt: dateTypePolicy,
      sentToEnqueueActorMessagesAt: dateTypePolicy,
      receivedFromEnqueueActorMessagesAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
      failedAt: dateTypePolicy,
    },
  },
  SettlementReport: { fields: { period: dateRangeTypePolicy, executionTime: dateRangeTypePolicy } },
  User: { fields: { createdDate: dateTypePolicy, latestLoginAt: dateTypePolicy } },
  UserAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  UserOverviewItemDto: { fields: { createdDate: dateTypePolicy, latestLoginAt: dateTypePolicy } },
  UserRoleAuditedChangeAuditLogDto: { fields: { timestamp: dateTypePolicy } },
  WholesaleAndEnergyCalculation: {
    fields: {
      period: dateRangeTypePolicy,
      createdAt: dateTypePolicy,
      scheduledAt: dateTypePolicy,
      startedAt: dateTypePolicy,
      terminatedAt: dateTypePolicy,
    },
  },
};
