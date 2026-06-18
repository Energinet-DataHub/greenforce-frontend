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
import { computed, effect, Injectable, signal } from '@angular/core';

import type { WattRange } from '@energinet/watt/date';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetMeteringPointProcessOverviewDocument,
  MeteringPointProcessState,
  OnMeteringPointProcessUpdatedDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

/**
 * Route-scoped owner of the metering-point process OVERVIEW query. Provided at the
 * parent (`path: ''`) route so the overview table and the `details/:id` drawer share
 * one instance: the overview renders the list, while the drawer uses the visible list
 * to decide whether the cross-cancellation banner links to the cancelling process.
 */
@Injectable()
export class DhMeteringPointProcessOverviewStore {
  // Set by the overview from its route-bound `meteringPointId` input. A route-`providers`
  // service two levels below the resolver does not reliably see the inherited value on its
  // own ActivatedRoute, so the overview (which gets it via withComponentInputBinding) feeds it.
  readonly meteringPointId = signal<string | undefined>(undefined);

  // Owned filter state. The period starts BLANK: when null, no `created` range is sent and
  // the BFF applies its hidden default period (2016-01-01 -> now+1year).
  readonly dateRange = signal<WattRange<Date> | null>(null);

  // Holds `processType` composite keys (e.g. Brs_002_EndOfSupply), not raw business reasons.
  readonly processTypes = signal<string[]>([]);
  readonly states = signal<MeteringPointProcessState[]>([]);

  private readonly query = query(GetMeteringPointProcessOverviewDocument, () => {
    const meteringPointId = this.meteringPointId();
    if (!meteringPointId) return { skip: true };
    return { variables: { meteringPointId, created: this.dateRange() } };
  });

  readonly processes = computed(() => this.query.data()?.meteringPointProcessOverview ?? []);
  readonly visibleProcessIds = computed(() => new Set(this.processes().map((p) => p.id)));

  // Derived list for the TABLE. `processes()` / `visibleProcessIds` stay the FULL fetched set
  // because the details drawer's cross-cancellation logic depends on the full visible list.
  readonly filteredProcesses = computed(() => {
    const selectedTypes = this.processTypes();
    const states = this.states();
    return this.processes().filter(
      (p) =>
        (selectedTypes.length === 0 ||
          (p.processType != null && selectedTypes.includes(p.processType))) &&
        (states.length === 0 || states.includes(p.state))
    );
  });
  readonly loading = computed(() => this.query.loading());
  readonly error = computed(() => this.query.error());
  readonly called = computed(() => this.query.called());

  constructor() {
    // The overview's live-update subscription belongs with the query that owns its cache.
    effect((onCleanup) => {
      const variables = this.query.variables();
      const meteringPointId = variables.meteringPointId;
      const created = variables.created;

      // `created` may legitimately be null now (the BFF applies its hidden default period),
      // so only the metering point id is required for live updates to work.
      if (!meteringPointId) return;

      const unsubscribe = this.query.subscribeToMore({
        document: OnMeteringPointProcessUpdatedDocument,
        variables: { meteringPointId, created: created ?? null },
        updateQuery: (prev, options) => ({
          ...prev,
          meteringPointProcessOverview: prev.meteringPointProcessOverview.map((x) =>
            x.id === options.subscriptionData.data.meteringPointProcessUpdated.id
              ? options.subscriptionData.data.meteringPointProcessUpdated
              : x
          ),
        }),
      });
      onCleanup(unsubscribe);
    });
  }
}
