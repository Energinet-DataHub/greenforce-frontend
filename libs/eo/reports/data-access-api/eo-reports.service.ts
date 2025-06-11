//#region License
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
//#endregion
import { HttpClient } from '@angular/common/http';
import { computed, inject, Inject, Injectable, OnDestroy, signal } from '@angular/core';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { EoReportRequest, EoReport, EoReportResponse } from './report.types';
import { catchError, EMPTY, exhaustMap, retry, Subject, takeUntil, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EoReportsService implements OnDestroy {
  #apiBase: string;

  private http = inject(HttpClient);
  private apiEnv = inject(eoApiEnvironmentToken);
  private destroy$ = new Subject<void>();

  readonly #reports = signal<EoReport[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);

  readonly reports = computed(() => this.#reports());
  readonly loading = computed(() => this.#loading());
  readonly error = computed(() => this.#error());
  private readonly POLLING_INTERVAL = 10000; // 10 seconds

  constructor(@Inject(eoApiEnvironmentToken) apiEnvironment: EoApiEnvironment) {
    this.#apiBase = `${apiEnvironment.apiBase}`;
  }

  startReportGeneration(newReportRequest: EoReportRequest) {
    return this.http.post<EoReportRequest>(`${this.#apiBase}/reports`, {
      startDate: newReportRequest.startDate / 1000, // Convert to seconds
      endDate: newReportRequest.endDate / 1000, // Convert to seconds
    });
  }

  startPolling(): void {
    this.#loading.set(true);

    timer(0, this.POLLING_INTERVAL)
      .pipe(
        takeUntil(this.destroy$),
        exhaustMap(() =>
          this.getReports().pipe(
            retry({
              count: 3,
              delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000),
              resetOnSuccess: true,
            }),
            catchError((error) => {
              this.#error.set(error.message);
              this.#loading.set(false);
              this.destroy$.next(); // Stop polling on final failure
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: (response) => {
          const reportsFromApi = response.result;
          this.#reports.set(Array.isArray(reportsFromApi) ? reportsFromApi : [reportsFromApi]);
          this.#loading.set(false);
          this.#error.set(null);
        },
        complete: () => {
          this.#loading.set(false);
        },
      });
  }

  getReports() {
    return this.http.get<EoReportResponse>(`${this.#apiBase}/reports`);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
