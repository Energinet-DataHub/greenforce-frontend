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
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';
import { eachDayOfInterval, fromUnixTime, isSameDay } from 'date-fns';

export interface Claim {
  claimId: string;
  quantity: number;
  productionCertificate: {
    federatedStreamId: {
      registry: string;
      streamId: string;
    };
    start: number;
    end: number;
    gridArea: string;
    consumptionCertificate: {
      federatedStreamId: {
        registry: string;
        streamId: string;
      };
      start: number;
      end: number;
      gridArea: string;
    };
  };
}

interface ClaimsResponse {
  result: Claim[];
}

interface AggregateClaimResponse {
  result: [
    {
      start: number;
      end: number;
      quantity: number;
    },
  ];
}

@Injectable({
  providedIn: 'root',
})
export class EoClaimsService {
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);

  #apiBase = `${this.#apiEnvironment.apiBase}/v1`.replace('/api', '/wallet-api');

  getClaims() {
    return this.#http
      .get<ClaimsResponse>(`${this.#apiBase}/claims`)
      .pipe(map((response) => response.result));
  }

  getAggregatedClaims(timeAggregate: EoTimeAggregate, start: number, end: number) {
    const dates = eachDayOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
      (date) => {
        return {
          date,
          quantity: 0,
        };
      }
    );
    const timeZone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

    return this.#http
      .get<AggregateClaimResponse>(
        `${this.#apiBase}/aggregate-claims?timeAggregate=${timeAggregate}&timeZone=${timeZone}&start=${start}&end=${end}`
      )
      .pipe(
        map((response) => response.result),
        map((claims) =>
          dates.map((date) => {
            const claim = claims.find((c) => isSameDay(fromUnixTime(c.start), date.date));
            return claim ? { ...date, quantity: claim.quantity } : date;
          })
        ),
        map((result) => result.map((x) => x.quantity))
      );
  }
}
