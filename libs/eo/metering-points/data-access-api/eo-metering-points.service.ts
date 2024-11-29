import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

interface MeteringPointsResponse {
  result: [];
}

interface StartClaimResponse {
  subjectId: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoMeteringPointsService {
  #apiBase: string;

  getMeteringPoints() {
    return this.http.get<MeteringPointsResponse>(`${this.#apiBase}/measurements/meteringpoints`);
  }

  startClaim() {
    return this.http.post<StartClaimResponse>(`${this.#apiBase}/claim-automation/start`, {});
  }

  stopClaim() {
    return this.http.delete(`${this.#apiBase}/claim-automation/stop`);
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
