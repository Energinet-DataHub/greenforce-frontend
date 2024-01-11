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
