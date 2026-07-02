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
import { computed, Injectable, signal } from '@angular/core';

import type { WattRange } from '@energinet/watt/date';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  FailedProcessSuspendReason,
  GetFailedProcessesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

/**
 * Route-scoped owner of the failed processes query. Provided at the parent (`path: ''`)
 * route so the overview table and the `details/:id` drawer share one instance: there is
 * no by-id query, so the drawer finds its row in the loaded list.
 */
@Injectable()
export class DhFailedProcessesStore {
  // Client-side filter state. All filtering happens locally since the query
  // returns the full result set.
  readonly dateRange = signal<WattRange<Date> | null>(null);
  readonly suspendReasons = signal<FailedProcessSuspendReason[]>([]);

  // Holds `processType` composite keys (e.g. BRS_002_EndOfSupply).
  readonly processTypes = signal<string[]>([]);

  // Holds `createdBy` MarketParticipant ids.
  readonly owners = signal<string[]>([]);

  private readonly query = query(GetFailedProcessesDocument);

  readonly processes = computed(() => this.query.data()?.failedProcesses.items ?? []);

  readonly filteredProcesses = computed(() => {
    const range = this.dateRange();
    const reasons = this.suspendReasons();
    const types = this.processTypes();
    const owners = this.owners();
    return this.processes().filter(
      (p) =>
        (!range ||
          (p.createdAt >= range.start && (range.end === null || p.createdAt <= range.end))) &&
        (reasons.length === 0 || reasons.includes(p.suspendReason)) &&
        (types.length === 0 || (p.processType != null && types.includes(p.processType))) &&
        (owners.length === 0 || (p.createdBy != null && owners.includes(p.createdBy.id)))
    );
  });

  readonly loading = computed(() => this.query.loading());
  readonly error = computed(() => this.query.error());
  readonly called = computed(() => this.query.called());
}
