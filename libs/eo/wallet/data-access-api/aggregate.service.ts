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
import { EMPTY, ReplaySubject, catchError, map, shareReplay, tap } from 'rxjs';

import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { EoTimeAggregate } from '@energinet-datahub/eo/shared/domain';
import { eachDayOfInterval, fromUnixTime, isSameDay } from 'date-fns';

interface AggregatedResponse {
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
export class EoAggregateService {
  #apiEnvironment: EoApiEnvironment = inject(eoApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);

  #apiBase = `${this.#apiEnvironment.apiBase}/v1`.replace('/api', '/wallet-api');
  #timeZone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #cache = new Map<string, ReplaySubject<any>>();

  getAggregatedClaims(timeAggregate: EoTimeAggregate, start: number, end: number) {
    const cacheKey = `claims-${timeAggregate}-${start}-${end}`;

    if (!this.#cache.has(cacheKey)) {
      const subject = new ReplaySubject(1);
      this.#cache.set(cacheKey, subject);

      const dates = eachDayOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (date) => {
          return {
            date,
            quantity: 0,
          };
        }
      );

      this.#http
        .get<AggregatedResponse>(
          `${this.#apiBase}/aggregate-claims?timeAggregate=${timeAggregate}&timeZone=${this.#timeZone}&start=${start}&end=${end}`
        )
        .pipe(
          map((response) => response.result),
          map((claims) =>
            dates.map((date) => {
              const claim = claims.find((c) => isSameDay(fromUnixTime(c.start), date.date));
              return claim ? { ...date, quantity: claim.quantity } : date;
            })
          ),
          map((result) => result.map((x) => x.quantity)),
          tap((result) => {
            subject.next(result);
            subject.complete();
          }),
          catchError((error) => {
            this.#cache.delete(cacheKey);
            subject.error(error);
            return error;
          }),
          shareReplay(1)
        )
        .subscribe();
    }

    return this.#cache.get(cacheKey)?.asObservable() ?? EMPTY;
  }

  clearCache() {
    this.#cache.clear();
  }

  getAggregatedTransfers(timeAggregate: EoTimeAggregate, start: number, end: number) {
    const dates = eachDayOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
      (date) => {
        return {
          date,
          quantity: 0,
        };
      }
    );

    return this.#http
      .get<AggregatedResponse>(
        `${this.#apiBase}/aggregate-transfers?timeAggregate=${timeAggregate}&timeZone=${this.#timeZone}&start=${start}&end=${end}`
      )
      .pipe(
        map((response) => response.result),
        map((transfers) =>
          dates.map((date) => {
            const transfer = transfers.find((c) => isSameDay(fromUnixTime(c.start), date.date));
            return transfer ? { ...date, quantity: transfer.quantity } : date;
          })
        ),
        map((result) => result.map((x) => x.quantity))
      );
  }
}
