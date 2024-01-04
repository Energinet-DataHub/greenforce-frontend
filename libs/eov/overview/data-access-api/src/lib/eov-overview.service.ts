import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EovApiEnvironment, eovApiEnvironmentToken } from "@energinet-datahub/eov/shared/environments";
import { BaseResponse } from "@energinet-datahub/eov/shared/domain";



@Injectable({
  providedIn: 'root',
})
export class EovOverviewService {

  #apiBase: string;
  constructor(
    private http: HttpClient,
    @Inject(eovApiEnvironmentToken) apiEnvironment: EovApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.customerApiUrl}`;
  }

  getMeteringPoints() {
    return this.http.get<BaseResponse<MeteringPoint[]>>(`${this.#apiBase}/api/MeteringPoints`);
  }
}

export type MeteringPoint = {
  address: string;
  postcode: string;
  cityName: string;
  meteringPointId: string;
  typeOfMP: string;
  meteringPointAlias: string;
  balanceSupplierName: string;
  childMeteringPoints: ChildMeteringPoint[];
  expanded: boolean;
  authorization: boolean;
  group: boolean;
  consumerCVR: string;
  dataAccessCVR: string;
}

export type ChildMeteringPoint = {
  parentMeteringPointId: string;
  meteringPointId: string;
  typeOfMP: string;
  authorization: boolean;
}
