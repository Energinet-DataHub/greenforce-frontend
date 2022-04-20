import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  EoApiEnvironment,
  eoApiEnvironmentToken,
} from '@energinet-datahub/eo/shared/environments';
import { Observable } from 'rxjs';

export interface MeteringPointsResponse {
  /**
   * Unique ID of the metering point - Global Service Relation Number
   */
  readonly gsrn: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoMeteringPointsService {
  #apiBase: string;

  getMeteringPoints(): Observable<Array<MeteringPointsResponse>> {
    return this.http.get<MeteringPointsResponse[]>(
      `${this.#apiBase}/meteringpoints/list`
    );
  }

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }
}
