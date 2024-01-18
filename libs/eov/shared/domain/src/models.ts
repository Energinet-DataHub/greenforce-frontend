export type Series = {
  startDate: Date;
  name: string;
  data: Datum[];
  // internals
  color?: string;
  colorByPoint?: boolean;
}

export type Datum = {
  name: number;
  drilldown?: string;
  y: number;
}


export type GraphData = {
  message?: string;
  graphAggregation: GraphAggregation;
  series: Series[];
}

export enum GraphAggregation {
  None,
  Yearly,
  Monthly,
  Daily,
  Hourly,
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

export type BaseResponse<T> = {
  result: T;
  success: boolean;
  errorCode: number;
  errorText: string;
  id: string;
}

export type ChildMeteringPointDto = {
  parentMeteringPointId: string;
  meteringPointId: string;
  typeOfMP: string;
  meteringPointAlias: string;
  meterReadingOccurrence: string;
  meterNumber: string;
}

export type MeteringPointBaseDto = {
  meteringPointId: string;
  typeOfMP: string;
  balanceSupplierName: string;
  postcode: string;
  cityName: string;
  hasRelation: boolean;
  consumerCVR: string;
  dataAccessCVR: string;
  childMeteringPoints: ChildMeteringPointDto[];
}

export type MeteringPointDto = MeteringPointBaseDto & {
  meteringPointAlias: string;
  address: string;
  cvr: string;
}
