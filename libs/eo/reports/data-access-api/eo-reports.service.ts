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
import { EoActorService } from '@energinet-datahub/eo/auth/data-access';
import { wattFormatDate } from '@energinet-datahub/watt/date';

@Injectable({
  providedIn: 'root',
})
export class EoReportsService implements OnDestroy {
  #apiBase: string;

  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  readonly #reports = signal<EoReport[]>([]);
  readonly #loading = signal(false);
  readonly #error = signal<string | null>(null);

  readonly reports = computed(() => this.#reports());
  readonly loading = computed(() => this.#loading());
  readonly error = computed(() => this.#error());

  private readonly POLLING_INTERVAL = 5000; // 10 seconds
  private actorService = inject(EoActorService);

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
          const reportsInMilliseconds = reportsFromApi.map((report) => ({
            ...report,
            createdAt: report.createdAt * 1000, // Convert seconds to milliseconds
          }));
          this.#reports.set(
            Array.isArray(reportsInMilliseconds) ? reportsInMilliseconds : [reportsInMilliseconds]
          );
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

  downloadReport(report: EoReport): void {
    this.http
      .get(`${this.#apiBase}/reports/${report.id}/download`, { responseType: 'blob' })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const organizationName = this.actorService.actor()?.org_name ?? 'Unknown-Organization-Name';
        const organizationTin = this.actorService.actor()?.tin ?? 'Unknown-Organization-TIN';
        const createdAtDate = wattFormatDate(new Date(report.createdAt));
        const fileName = `ETT-Report-${organizationName}-${organizationTin}-${createdAtDate}.pdf`;
        a.href = url;
        a.download = fileName; // Set the file name
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
