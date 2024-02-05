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
import { Inject, Injectable, inject } from '@angular/core';
import { EoApiEnvironment, eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

type entityType =
  |'TransferAgreement'
  | 'MeteringPoint'
  | 'TransferAgreementProposal';

type actionType =
  | 'Created'
  | 'Accepted'
  | 'Declined'
  | 'Activated'
  | 'Deactivated'
  | 'ChangeEndDate';

interface ActivityLogEntryFilterRequest {
  start: string;
  end: string;
  entityType: entityType;
}

interface ActivityLogEntryResponse {
  id: string;
  timestamp: string;
  actorId: string;
  actorType: string;
  actorName: string;
  organizationTin: string;
  organizationName: string;
  entityType: entityType;
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

  getLogs(options: ActivityLogEntryFilterRequest) {
    return this.http.post<ActivityLogListEntryResponse>(
      `${this.apiBase}/transfer/activity-log`,
      options
    );
  }
}
