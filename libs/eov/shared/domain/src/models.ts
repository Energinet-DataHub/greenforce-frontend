/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddGroupRequest {
  groupName?: string | null;
}

/** @format int32 */
export enum Aggregation {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
}

/** @format int32 */
export enum ApplicationEnum {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
  Value11 = 11,
  Value12 = 12,
  Value13 = 13,
}

export interface BooleanResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: boolean;
}

export interface ChildMeteringPointDto {
  parentMeteringPointId?: string | null;
  meteringPointId?: string | null;
  typeOfMP?: string | null;
  meterReadingOccurrence?: string | null;
  meterNumber?: string | null;
}

export interface ConsentDto {
  applicationId?: ApplicationEnum;
  consentText?: string | null;
  /** @format date-time */
  consentDate?: string;
}

export interface ConsentDtoArrayResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: ConsentDto[] | null;
}

export interface DataSeries {
  /** @format date-time */
  startDate?: string;
  name?: string | null;
  data?: Datum[] | null;
}

export interface Datum {
  id?: string | null;
  graphAggregation?: GraphAggregation;
  name?: string | null;
  drilldown?: string | null;
  /** @format double */
  y?: number;
}

/** @format int32 */
export enum ExportFormat {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface Faq {
  question?: string | null;
  answer?: string | null;
}

/** @format int32 */
export enum GraphAggregation {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
}

export interface GraphDTO {
  message?: string | null;
  series?: DataSeries[] | null;
}

export interface GraphDTOResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: GraphDTO;
}

export interface Group {
  id?: string | null;
  groupName?: string | null;
  /** @format date-time */
  created?: string;
  meteringPoints?: MeteringPoint[] | null;
}

export interface GroupListResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: Group[] | null;
}

export interface GroupMeteringPointRequest {
  groupId?: string | null;
  meteringPointId?: string | null;
}

export interface GroupMeteringPointsRequest {
  groupId?: string | null;
  meteringPointIds?: string[] | null;
}

export interface GroupResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: Group;
}

export interface IdentityDetail {
  /** @format int32 */
  id?: number;
  displayName?: string | null;
  status?: RoleUserStatus;
  roles?: SelectedRole[] | null;
  /** @format date-time */
  lastAttemptedLogin?: string | null;
}

/** @format int32 */
export enum IdentityRoles {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
}

export interface Int32Response {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  /** @format int32 */
  result?: number;
}

export interface MarketEvaluationPoint {
  meteringPoint?: string | null;
  typeOfMp?: string | null;
}

export interface MeterDataExportRequest {
  format?: ExportFormat;
  language?: string | null;
  meteringPoints?: string[] | null;
  /** @format date-time */
  fromDate?: string;
  /** @format date-time */
  toDate?: string;
  aggregation?: Aggregation;
}

export interface MeterDataReadingExportRequest {
  format?: ExportFormat;
  language?: string | null;
  /** @format date-time */
  fromDate?: string;
  /** @format date-time */
  toDate?: string;
  meteringPoints?: string[] | null;
}

export interface MeterDataReadingObject {
  /** @format date-time */
  readingDate?: string;
  /** @format date-time */
  registrationDate?: string;
  meterNumber?: string | null;
  /** @format double */
  meterReading?: number;
  measurementUnit?: string | null;
}

export interface MeterDataReadingsObject {
  meteringPointId?: string | null;
  readings?: MeterDataReadingObject[] | null;
}

export interface MeterDataReadingsObjectResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: MeterDataReadingsObject;
}

export interface MeteringPoint {
  id?: string | null;
}

export interface MeteringPointDto {
  meteringPointId?: string | null;
  typeOfMP?: string | null;
  balanceSupplierName?: string | null;
  postcode?: string | null;
  cityName?: string | null;
  hasRelation?: boolean;
  consumerCVR?: string | null;
  dataAccessCVR?: string | null;
  childMeteringPoints?: ChildMeteringPointDto[] | null;
  meteringPointAlias?: string | null;
  address?: string | null;
  cvr?: string | null;
}

export interface MeteringPointExportRequest {
  format?: ExportFormat;
  language?: string | null;
  meteringPoints?: string[] | null;
  isSimpleExport?: boolean;
}

export interface MeteringPointRelation {
  meteringPointId?: string | null;
  webAccessCode?: string | null;
}

export interface MissingTranslation {
  key?: string | null;
  language?: string | null;
}

export interface MyEnergyDataMarketDocument {
  uuid?: string | null;
  senderName?: string | null;
  /** @format date-time */
  createdDate?: string;
  eic?: string | null;
  meteringPointType?: string | null;
  timePeriod?: PeriodtimeInterval;
  timeSeriesProfiled?: TimeSeries[] | null;
  timeSeriesNonProfiled?: TimeSeries[] | null;
}

export interface MyEnergyDataMarketDocumentResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: MyEnergyDataMarketDocument;
}

export interface NemidClientConfiguration {
  iFrameSrc?: string | null;
  jsLoginParameters?: string | null;
}

export interface NemidClientConfigurationResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: NemidClientConfiguration;
}

export interface NemidClientLoginRequest {
  base64?: string | null;
  webApp?: ApplicationEnum;
}

export interface Period {
  resolution?: string | null;
  timeInterval?: PeriodtimeInterval;
  points?: Point[] | null;
}

export interface PeriodtimeInterval {
  /** @format date-time */
  dateFrom?: string;
  /** @format date-time */
  dateTo?: string;
}

export interface Point {
  position?: string | null;
  /** @format double */
  quantity?: number;
  quality?: string | null;
}

export interface PortalTokenResponse {
  token?: string | null;
  refreshToken?: string | null;
  /** @format date-time */
  expireTime?: string;
}

export interface PortalTokenResponseResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: PortalTokenResponse;
}

export interface PowerOfAttorneyDetails {
  thirdPartyId?: string | null;
  thirdPartyName?: string | null;
  thirdPartyCVR?: string | null;
  thirdPartyStreet?: string | null;
  thirdPartyStreetnumber?: string | null;
  thirdPartyPostcode?: string | null;
  thirdPartyCity?: string | null;
  thirdPartyEmail?: string | null;
  thirdPartyPhone?: string | null;
  cvr?: string | null;
  customerKey?: string | null;
  returnUrl?: string | null;
  terms?: string | null;
  /** @format date-time */
  validFrom?: string;
  /** @format date-time */
  validTo?: string;
  /** @format date-time */
  minValidFrom?: string;
  /** @format date-time */
  maxValidFrom?: string;
  /** @format date-time */
  minValidTo?: string;
  /** @format date-time */
  maxValidTo?: string;
  /** @format date-time */
  expireDate?: string;
  includeAllMeteringPoints?: boolean;
  includeFutureMeteringPointsRelatedToCVR?: boolean | null;
  includedMeteringPoints?: MeteringPointDto[] | null;
  allMeteringPointIds?: string[] | null;
  /** @format int32 */
  consentId?: number | null;
}

export interface PowerOfAttorneyDetailsResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: PowerOfAttorneyDetails;
}

export interface PowerOfAttorneyThirdPartyAddress {
  street?: string | null;
  postcode?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface PowerOfAttorneyWithThirdPartyInfoDto {
  id?: string | null;
  thirdPartyName?: string | null;
  thirdPartyCVR?: string | null;
  status?: string | null;
  /** @format date-time */
  validFrom?: string;
  /** @format date-time */
  validTo?: string;
  /** @format date-time */
  signedDate?: string;
  isActive?: boolean;
  isSingleUse?: boolean;
  /** @format int32 */
  powerOfAttorneyNumber?: number;
  includeFutureMeteringPoints?: boolean | null;
  thirdPartyAddress?: PowerOfAttorneyThirdPartyAddress;
  /** @format date-time */
  deletedDate?: string | null;
  deletedBy?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface Response<T> {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result: T;
}

/** @format int32 */
export enum RoleUserStatus {
  Value1 = 1,
  Value2 = 2,
  Value4 = 4,
}

export interface SelectedRole {
  enabled?: boolean;
  label?: IdentityRoles;
}

export interface SetMeteringPointAlias {
  meteringPointAlias?: string | null;
}

export interface Setting {
  /** @format int32 */
  enumIndex?: number;
  settingEnum?: SettingValue;
  type?: string | null;
  domain?: string | null;
  key?: string | null;
  value?: string | null;
}

export interface SettingArrayResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: Setting[] | null;
}

export interface SettingResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: Setting;
}

/** @format int32 */
export enum SettingValue {
  Value0 = 0,
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
  Value11 = 11,
  Value12 = 12,
  Value13 = 13,
  Value14 = 14,
  Value15 = 15,
  Value16 = 16,
  Value17 = 17,
  Value18 = 18,
  Value19 = 19,
  Value20 = 20,
  Value21 = 21,
  Value22 = 22,
  Value23 = 23,
  Value24 = 24,
  Value25 = 25,
  Value26 = 26,
  Value27 = 27,
  Value28 = 28,
  Value29 = 29,
  Value30 = 30,
  Value31 = 31,
  Value32 = 32,
  Value33 = 33,
  Value34 = 34,
  Value35 = 35,
  Value36 = 36,
  Value37 = 37,
  Value38 = 38,
  Value39 = 39,
  Value40 = 40,
  Value41 = 41,
  Value42 = 42,
}

export interface SignedPowerOfAttorney {
  id?: string | null;
}

export interface SignedPowerOfAttorneyResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: SignedPowerOfAttorney;
}

export interface StringResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: string | null;
}

export interface ThirdpartyWebsiteValidationRequest {
  thirdpartyId?: string | null;
  thirdpartyWebsite?: string | null;
}

export interface TimeSeries {
  timeSeriesUUID?: string | null;
  businessType?: string | null;
  curveType?: string | null;
  measurementUnit?: string | null;
  marketEvaluationPointTS?: MarketEvaluationPoint;
  periodTS?: Period;
}

export interface TokenInput {
  /** @format int32 */
  userId?: number;
  nameId?: string | null;
  cvr?: string | null;
  thirdPartyId?: string | null;
  password?: string | null;
  fullName?: string | null;
  webApp?: ApplicationEnum;
}

export interface TokenRegistrationDto {
  tokenId?: string | null;
  name?: string | null;
  cvr?: string | null;
  nameId?: string | null;
  /** @format date-time */
  deactivatedDate?: string | null;
  /** @format date-time */
  expireDate?: string | null;
  /** @format date-time */
  deletedDate?: string | null;
}

export interface TokenRegistrationDtoListResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: TokenRegistrationDto[] | null;
}

export interface TokenRegistrationDtoResponse {
  success?: boolean;
  /** @format int32 */
  errorCode?: number;
  errorText?: string | null;
  id?: string | null;
  stackTrace?: string | null;
  result?: TokenRegistrationDto;
}

export interface UpdateGroupRequest {
  id?: string | null;
  groupName?: string | null;
}

export type ContactAddressInfo = {
  addressCode: string;
  city: string;
  contactEmailAddress: string;
  contactMobileNumber: string;
  contactName1: string;
  contactName2: string;
  contactPhoneNumber: string;
  contactType: string;
  countryName: string;
  street: string;
}

export type ContactAddress = {
  street: string;
  city: string;
  countryName: string;
  D01: ContactAddressInfo;
  D04: ContactAddressInfo;
}

export type MeteringPointContactDetails = {
  firstConsumerPartyName: string;
  secondConsumerPartyName: string;
  contactAddresses: ContactAddress;
}

export type MeteringPointDetails = {
  address: string;
  childMeteringPoints: ChildMeteringPoint[];
  cityName: string;
  meteringPointContactDetails: MeteringPointContactDetails;
  meteringPointId: string;
  meteringPointMainDetails: MeteringPointMainDetails;
  postcode: string;
  validFrom: Date;
  validTo: Date;
}

export type ChildMeteringPoint = {
  meteringPointId: string;
  typeOfMP: string;
}

export type MeteringPointMainDetails = {
  parentMeteringPointId: string;
  meteringPointAlias: string;
  typeOfMP: string;
  meteringGridAreaIdentification: string;
  netSettlementGroup: string;
  physicalStatusOfMP: string;
  consumerCategory: string;
  powerLimitKW: string;
  powerLimitA: string;
  subTypeOfMP: string;
  productionObligation: string;
  mPCapacity: string;
  mPConnectionType: string;
  disconnectionType: string;
  product: string;
  energyTimeSeriesMeasureUnit: string;
  streetCode: string;
  streetName: string;
  buildingNumber: string;
  floorId: string;
  roomId: string;
  postcode: string;
  cityName: string;
  citySubDivisionName: string;
  municipalityCode: string;
  locationDescription: string;
  firstConsumerPartyName: string;
  secondConsumerPartyName: string;
  consumerCVR: string;
  dataAccessCVR: string;
  settlementMethod: string;
  balanceSupplierName: string;
  balanceSupplierStartDate: string;
  consumerStartDate: string;
  meterReadingOccurrence: string;
  estimatedAnnualVolume: string;
  mPReadingCharacteristics: string;
  meterNumber: string;
  meterCounterDigits: string;
  meterCounterMultiplyFactor: string;
  meterCounterUnit: string;
  meterCounterType: string;
  taxReduction: string;
  taxSettlementDate: string;
  gridOperatorName: string;
}

export type SupplierSwitchHistory = {
  currentSupplier: any;
  meteringPoint: any;
  supplierHistory: SupplierHistory[];
}

export type SupplierHistory = {
  balanceSupplier: string;
  endDate: string;
  isCurrent: boolean;
  startDate: string;
  status: string;
}
