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
import { Observable, forkJoin, map, of } from 'rxjs';

import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

export type activityLogEntityType =
  | 'TransferAgreement'
  | 'MeteringPoint'
  | 'TransferAgreementProposal';

type actionType =
  | 'Created'
  | 'Accepted'
  | 'Declined'
  | 'Activated'
  | 'Deactivated'
  | 'ChangeEndDate';

export interface ActivityLogEntryResponse {
  id: string;
  timestamp: string;
  actorId: string;
  actorType: string;
  actorName: string;
  organizationTin: string;
  organizationName: string;
  entityType: activityLogEntityType;
  actionType: actionType;
  entityId: string;
}

interface ActivityLogListEntryResponse {
  activityLogEntries: ActivityLogEntryResponse[];
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EoActivityLogService {
  private http = inject(HttpClient);
  private apiBase: string = inject(eoApiEnvironmentToken).apiBase;

  getLogs(options: {
    period: { start: number; end: number };
    eventTypes: activityLogEntityType[];
  }): Observable<ActivityLogEntryResponse[]> {
    return forkJoin({
      transfers: options.eventTypes.includes('TransferAgreement')
        ? this.getTransferLogs(options.period)
        : of({ activityLogEntries: [], hasMore: false } as ActivityLogListEntryResponse),
      certificates: options.eventTypes.includes('MeteringPoint')
        ? this.getCertificateLogs(options.period)
        : of({ activityLogEntries: [], hasMore: false } as ActivityLogListEntryResponse),
    }).pipe(
      // Merge the logs
      map((logs) => {
        return logs.transfers.activityLogEntries.concat(logs.certificates.activityLogEntries);
      }),
      // Sort by timestamp
      map((logs) => {
        return logs.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      })
    );
  }

  getTransferLogs(period: { start: number; end: number }): Observable<ActivityLogListEntryResponse> {
    return this.http.post<ActivityLogListEntryResponse>(`${this.apiBase}/transfer/activity-log`, {
      start: period.start / 1000,
      end: period.end / 1000,
      entityType: null,
    });
  }

  getCertificateLogs(period: { start: number; end: number }): Observable<ActivityLogListEntryResponse> {
    return this.http.post<ActivityLogListEntryResponse>(
      `${this.apiBase}/certificates/activity-log`,
      {
        start: period.start / 1000,
        end: period.end / 1000,
        entityType: 'MeteringPoint',
      }
    );
  }
}
