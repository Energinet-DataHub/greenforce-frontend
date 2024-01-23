import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { MeteringPointDetails, MeteringPointDto } from "@energinet-datahub/eov/shared/domain";
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
    this.#apiBase = `${apiEnvironment.apiUrl}`;
  }

  getMeteringPoints() {
    return this.http.get<MeteringPointDto[]>(`${this.#apiBase}/customer/api/MeteringPoint`);
  }

  getMeteringPoint(meteringPointId: string) {
    return this.http.get<MeteringPointDetails>(this.#apiBase + '/customer/api/MeteringPoint/' + meteringPointId);
  }

  updateAlias(meteringPointId: string, alias: string) {
    return this.http.patch(this.#apiBase + '/customer/api/MeteringPoint/' + meteringPointId, { MeteringPointAlias: alias });
  }
}
