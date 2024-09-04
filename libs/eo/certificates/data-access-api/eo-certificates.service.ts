/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { EoCertificate, EoCertificateContract } from '@energinet-datahub/eo/certificates/domain';
import { EoMeteringPoint } from '@energinet-datahub/eo/metering-points/domain';
import { SortDirection } from '@angular/material/sort';

interface EoCertificateResponse {
  result: EoCertificate[];
  metadata: {
    count: number;
    offset: number;
    limit: number;
    total: number;
  };
}

interface EoContractResponse {
  result: EoCertificateContract[];
}

export type sortCertificatesBy = 'end' | 'quantity' | 'type';

@Injectable({
  providedIn: 'root',
})
export class EoCertificatesService {
  private apiBase: string;
  private certificateCache: { [key: string]: EoCertificate } = {};
  private certificateNotFoundCache: { [key: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    @Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment
  ) {
    this.apiBase = `${apiEnvironment.apiBase}`;
  }

  exportCertificates() {
    return this.http.get(`${this.apiBase}/certificates/spreadsheet`, {
      responseType: 'blob',
    });
  }

  getCertificates(pageNumber = 1, pageSize = 10, sortBy: sortCertificatesBy, sort: SortDirection) {
    const walletApiBase = `${this.apiBase}`.replace('/api', '/wallet-api');
    return this.http
      .get<EoCertificateResponse>(
        `${walletApiBase}/certificates?sortBy=${sortBy}&sort=${sort}&limit=${pageSize}&skip=${(pageNumber - 1) * pageSize}`
      )
      .pipe(
        map((response) => {
          return {
            ...response,
            result: response.result.map((certificate) => {
              return {
                ...certificate,
                start: certificate.start * 1000,
                end: certificate.end * 1000,
              };
            }),
          };
        })
      );
  }

  getCertificate(registry: string, streamId: string): Observable<EoCertificate | null> {
    const walletApiBase = `${this.apiBase}`.replace('/api', '/wallet-api');
    const cacheKey = `${registry}-${streamId}`;
    const cachedCertificate = this.getCachedCertificate(cacheKey);

    if (cachedCertificate) {
      return of(cachedCertificate);
    } else {
      const cachedNotFound = this.getCachedNotFound(cacheKey);
      if (cachedNotFound) {
        return of(null);
      } else {
        return this.http
          .get<EoCertificate>(`${walletApiBase}/certificates/${registry}/${streamId}`)
          .pipe(
            tap((certificate) => {
              if (certificate.attributes.energyTag_GcIssuanceDatestamp) {
                this.cacheCertificate(cacheKey, {
                  ...certificate,
                  attributes: {
                    ...certificate.attributes,
                    energyTag_GcIssuanceDatestamp: new Date(
                      certificate.attributes.energyTag_GcIssuanceDatestamp
                    ).getTime(),
                  },
                });
              } else {
                this.cacheCertificate(cacheKey, certificate);
              }
            }),
            catchError(() => {
              this.cacheNotFound(cacheKey);
              return of(null);
            })
          );
      }
    }
  }

  private getCachedCertificate(cacheKey: string): EoCertificate | null {
    return this.certificateCache[cacheKey] || null;
  }

  private cacheCertificate(cacheKey: string, certificate: EoCertificate): void {
    this.certificateCache[cacheKey] = {
      ...certificate,
      start: certificate.start * 1000,
      end: certificate.end * 1000,
    };
  }

  private getCachedNotFound(cacheKey: string): boolean {
    return this.certificateNotFoundCache[cacheKey] || false;
  }

  private cacheNotFound(cacheKey: string): void {
    this.certificateNotFoundCache[cacheKey] = true;
  }

  /**
   * Array of all the user's contracts for issuing granular certificates
   */
  getContracts() {
    return this.http.get<EoContractResponse>(`${this.apiBase}/certificates/contracts`);
  }

  getContract(id: string): Observable<EoContractResponse> {
    return this.http.get<EoContractResponse>(`/api/certificates/contracts/${id}`);
  }

  /**
   * @param gsrn ID of meteringpoint
   * Sends request to create a GC contract for a specific meteringpoint
   */
  createContracts(meteringPoints: EoMeteringPoint[]) {
    return this.http
      .post<{ result: EoCertificateContract[] }>(`${this.apiBase}/certificates/contracts`, {
        contracts: meteringPoints.map((mp) => ({
          gsrn: mp.gsrn,
          startDate: Math.floor(new Date().getTime() / 1000),
        })),
      })
      .pipe(map((response) => response.result));
  }

  patchContracts(meteringPoints: EoMeteringPoint[]) {
    return this.http.put(`${this.apiBase}/certificates/contracts`, {
      contracts: meteringPoints.map((mp) => ({
        id: mp.contract?.id,
        endDate: Math.floor(Date.now() / 1000),
      })),
    });
  }
}
