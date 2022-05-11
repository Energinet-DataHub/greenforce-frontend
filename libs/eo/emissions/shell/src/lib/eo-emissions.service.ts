import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

export interface EmissionPoint {
  pointId: string;
  amount: string;
}

export interface EoEmissionsResponse {
  emissions: EmissionPoint[];
  totalEmissions: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoEmissionsService {
  #apiBase: string;

  getEmissions(): Observable<EoEmissionsResponse> {
    return this.http.get<EoEmissionsResponse>(
      `${this.#apiBase}/emissions/list`,
      {
        withCredentials: true,
      }
    );
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
