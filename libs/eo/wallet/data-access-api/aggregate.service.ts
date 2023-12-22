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
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  format,
  fromUnixTime,
  isSameDay,
  isSameHour,
  isSameMonth,
} from 'date-fns';

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

      const intervals = this.getIntervals(timeAggregate, start, end) ?? [];

      this.#http
        .get<AggregatedResponse>(
          `${this.#apiBase}/aggregate-claims?timeAggregate=${timeAggregate}&timeZone=${this.#timeZone}&start=${start}&end=${end}`
        )
        .pipe(
          map((response) => response.result),
          map((claims) =>
            intervals.map((interval) => {
              const claim = claims.find((c) => {
                return this.matchInterval(timeAggregate, fromUnixTime(c.start), interval);
              });
              return claim ? { ...interval, quantity: claim.quantity } : interval;
            })
          ),
          map((result) => result.map((x) => x.quantity)),
          tap((result) => {
            console.log(result);
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
    const intervals = this.getIntervals(timeAggregate, start, end) ?? [];

    return this.#http
      .get<AggregatedResponse>(
        `${this.#apiBase}/aggregate-transfers?timeAggregate=${timeAggregate}&timeZone=${this.#timeZone}&start=${start}&end=${end}`
      )
      .pipe(
        map((response) => response.result),
        map((transfers) =>
          intervals.map((interval) => {
            const transfer = transfers.find((c) =>
              this.matchInterval(timeAggregate, fromUnixTime(c.start), interval)
            );
            return transfer ? { ...interval, quantity: transfer.quantity } : interval;
          })
        ),
        map((result) => result.map((x) => x.quantity))
      );
  }

  getAggregatedCertificates(
    timeAggregate: EoTimeAggregate,
    start: number,
    end: number,
    type: 'consumption' | 'production' = 'consumption'
  ) {
    const intervals = this.getIntervals(timeAggregate, start, end) ?? [];

    return this.#http
      .get<AggregatedResponse>(
        `${this.#apiBase}/aggregate-certificates?timeAggregate=${timeAggregate}&timeZone=${this.#timeZone}&start=${start}&end=${end}&type=${type}`
      )
      .pipe(
        map((response) => response.result),
        map((certificates) =>
          intervals.map((interval) => {
            const certificate = certificates.find((c) => {
              this.matchInterval(timeAggregate, fromUnixTime(c.start), interval)
            });
            return certificate ? { ...interval, quantity: certificate.quantity } : interval;
          })
        ),
        map((result) => result.map((x) => x.quantity))
      );
  }

  getLabels(timeAggregate: EoTimeAggregate, start: number, end: number) {
    if (timeAggregate === EoTimeAggregate.QuarterHour) {
      return eachMinuteOfInterval(
        { start: fromUnixTime(start), end: fromUnixTime(end) },
        { step: 15 }
      ).map((timestamp) => {
        return format(timestamp, 'HH:mm');
      });
    }
    if (timeAggregate === EoTimeAggregate.Hour) {
      return eachHourOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return format(timestamp, 'HH:mm');
        }
      );
    } else if (timeAggregate === EoTimeAggregate.Month) {
      return eachMonthOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return format(timestamp, 'MMM');
        }
      );
      // Default to day
    } else {
      return eachDayOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return format(timestamp, 'dd MMM');
        }
      );
    }
  }

  private getIntervals(timeAggregate: EoTimeAggregate, start: number, end: number) {
    if (timeAggregate === EoTimeAggregate.QuarterHour) {
      return eachMinuteOfInterval(
        { start: fromUnixTime(start), end: fromUnixTime(end) },
        { step: 15 }
      ).map((timestamp) => {
        return {
          timestamp,
          quantity: 0,
        };
      });
    }
    if (timeAggregate === EoTimeAggregate.Hour) {
      return eachHourOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return {
            timestamp,
            quantity: 0,
          };
        }
      );
    } else if (timeAggregate === EoTimeAggregate.Month) {
      return eachMonthOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return {
            timestamp,
            quantity: 0,
          };
        }
      );
      // Default to day
    } else {
      return eachDayOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return {
            timestamp,
            quantity: 0,
          };
        }
      );
    }
  }

  private matchInterval(
    timeAggregate: EoTimeAggregate,
    timestamp: Date,
    interval: { timestamp: Date; quantity: number }
  ) {
    if (timeAggregate === EoTimeAggregate.QuarterHour) {
      return (
        isSameHour(timestamp, interval.timestamp) &&
        Math.floor(timestamp.getMinutes() / 15) === Math.floor(interval.timestamp.getMinutes() / 15)
      );
    } else if (timeAggregate === EoTimeAggregate.Hour) {
      return isSameHour(timestamp, interval.timestamp);
    } else if (timeAggregate === EoTimeAggregate.Month) {
      return isSameMonth(timestamp, interval.timestamp);
    } else {
      return isSameDay(timestamp, interval.timestamp);
    }
  }
}
