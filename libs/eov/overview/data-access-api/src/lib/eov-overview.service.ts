import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { MeteringPointDto } from "@energinet-datahub/eov/shared/domain";
import { EovApiEnvironment, eovApiEnvironmentToken } from "@energinet-datahub/eov/shared/environments";



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
    return this.http.get<MeteringPointDto[]>(`${this.#apiBase}/api/MeteringPoint`);
  }
}
