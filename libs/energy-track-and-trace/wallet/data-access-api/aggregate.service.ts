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
import { EMPTY, ReplaySubject, catchError, map, of, shareReplay, tap } from 'rxjs';
import {
  addDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  format,
  fromUnixTime,
  isSameDay,
  isSameHour,
  isSameMonth,
  startOfDay,
} from 'date-fns';
import { da, enGB } from 'date-fns/locale';
import { TranslocoService } from '@ngneat/transloco';

import { EttApiEnvironment, EttApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { EttTimeAggregate } from '@energinet-datahub/ett/shared/domain';

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
export class EttAggregateService {
  #apiEnvironment: EttApiEnvironment = inject(EttApiEnvironmentToken);
  #http: HttpClient = inject(HttpClient);
  #transloco = inject(TranslocoService);

  #apiBase = `${this.#apiEnvironment.apiBase}/v1`.replace('/api', '/wallet-api');
  #timeZone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #cache = new Map<string, ReplaySubject<any>>();

  getAggregatedClaims(timeAggregate: EttTimeAggregate, start: number, end: number) {
    const cacheKey = `claims-${timeAggregate}-${start}-${end}`;

    if (!this.#cache.has(cacheKey)) {
      const subject = new ReplaySubject(1);
      this.#cache.set(cacheKey, subject);

      const intervals = this.getIntervals(timeAggregate, start, end) ?? [];
      const endDate = startOfDay(addDays(fromUnixTime(end), 1)).getTime() / 1000; // Add one day to end date
      this.#http
        .get<AggregatedResponse>(
          `${this.#apiBase}/aggregate-claims?timeAggregate=${timeAggregate}&timeZone=${this.#timeZone}&start=${start}&end=${endDate}`
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
            subject.next(result);
            subject.complete();
          }),
          catchError((error) => {
            this.#cache.delete(cacheKey);
            subject.error(error);
            return of(error);
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

  getAggregatedTransfers(timeAggregate: EttTimeAggregate, start: number, end: number) {
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
    timeAggregate: EttTimeAggregate,
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
              return this.matchInterval(timeAggregate, fromUnixTime(c.start), interval);
            });
            return certificate ? { ...interval, quantity: certificate.quantity } : interval;
          })
        ),
        map((result) => result.map((x) => x.quantity))
      );
  }

  getLabels(timeAggregate: EttTimeAggregate, start: number, end: number) {
    const locale = this.#transloco.getActiveLang() === 'da' ? da : enGB;

    if (timeAggregate === EttTimeAggregate.QuarterHour) {
      return eachMinuteOfInterval(
        { start: fromUnixTime(start), end: fromUnixTime(end) },
        { step: 15 }
      ).map((timestamp) => {
        return format(timestamp, 'HH:mm', { locale });
      });
    }
    if (timeAggregate === EttTimeAggregate.Hour) {
      return eachHourOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return format(timestamp, 'HH:mm', { locale });
        }
      );
    } else if (timeAggregate === EttTimeAggregate.Month) {
      return eachMonthOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return format(timestamp, 'MMM', { locale });
        }
      );
      // Default to day
    } else {
      return eachDayOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return format(timestamp, 'dd MMM', { locale });
        }
      );
    }
  }

  private getIntervals(timeAggregate: EttTimeAggregate, start: number, end: number) {
    if (timeAggregate === EttTimeAggregate.QuarterHour) {
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
    if (timeAggregate === EttTimeAggregate.Hour) {
      return eachHourOfInterval({ start: fromUnixTime(start), end: fromUnixTime(end) }).map(
        (timestamp) => {
          return {
            timestamp,
            quantity: 0,
          };
        }
      );
    } else if (timeAggregate === EttTimeAggregate.Month) {
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
    timeAggregate: EttTimeAggregate,
    timestamp: Date,
    interval: { timestamp: Date; quantity: number }
  ) {
    if (timeAggregate === EttTimeAggregate.QuarterHour) {
      return (
        isSameHour(timestamp, interval.timestamp) &&
        Math.floor(timestamp.getMinutes() / 15) === Math.floor(interval.timestamp.getMinutes() / 15)
      );
    } else if (timeAggregate === EttTimeAggregate.Hour) {
      return isSameHour(timestamp, interval.timestamp);
    } else if (timeAggregate === EttTimeAggregate.Month) {
      return isSameMonth(timestamp, interval.timestamp);
    } else {
      return isSameDay(timestamp, interval.timestamp);
    }
  }
}
