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
import { getUnixTime } from 'date-fns';

import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

export type activityLogEntityType =
  | 'TransferAgreement'
  | 'MeteringPoint'
  | 'TransferAgreementProposal';

export type activityLogActionType =
  | 'Created'
  | 'Accepted'
  | 'Declined'
  | 'Activated'
  | 'Deactivated'
  | 'EndDateChanged'
  | 'Expired';

export type activityLogActorType = 'User' | 'System';

export interface ActivityLogEntryResponse {
  id: string;
  timestamp: number;
  actorId: string;
  actorType: string;
  actorName: string;
  organizationTin: string;
  organizationName: string;
  entityType: activityLogEntityType;
  actionType: activityLogActionType;
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
    const period = {
      start: getUnixTime(options.period.start),
      end: getUnixTime(options.period.end),
    };
    return forkJoin({
      transfers: options.eventTypes?.includes('TransferAgreement')
        ? this.getTransferLogs(period)
        : of({ activityLogEntries: [], hasMore: false } as ActivityLogListEntryResponse),
      certificates: options.eventTypes?.includes('MeteringPoint')
        ? this.getCertificateLogs(period)
        : of({ activityLogEntries: [], hasMore: false } as ActivityLogListEntryResponse),
    }).pipe(
      // Merge the logs
      map((logs) => {
        return logs.transfers.activityLogEntries.concat(logs.certificates.activityLogEntries);
      }),
      // Format the timestamp
      map((logs) => {
        return logs.map((log) => ({ ...log, timestamp: log.timestamp * 1000 }));
      }),
      // Sort by timestamp
      map((logs) => {
        return logs.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      })
    );
  }

  getTransferLogs(period: {
    start: number;
    end: number;
  }): Observable<ActivityLogListEntryResponse> {
    return this.http.post<ActivityLogListEntryResponse>(`${this.apiBase}/transfer/activity-log`, {
      start: period?.start,
      end: period?.end,
      entityType: null,
    });
  }

  getCertificateLogs(period: {
    start: number;
    end: number;
  }): Observable<ActivityLogListEntryResponse> {
    return this.http.post<ActivityLogListEntryResponse>(
      `${this.apiBase}/certificates/activity-log`,
      {
        start: period.start,
        end: period.end,
        entityType: 'MeteringPoint',
      }
    );
  }
}
