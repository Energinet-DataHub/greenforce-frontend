import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

export interface MeteringPoint {
  /**
   * Unique ID of the metering point - Global Service Relation Number
   */
  readonly gsrn: string;
}
export interface MeteringPointsResponse {
  meteringpoints: MeteringPoint[];
}

@Injectable({
  providedIn: 'root',
})
export class EoMeteringPointsService {
  #apiBase: string;

  getMeteringPoints(): Observable<MeteringPointsResponse> {
    return this.http.get<MeteringPointsResponse>(
      `${this.#apiBase}/meteringpoints/list`,
      { withCredentials: true }
    );
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
