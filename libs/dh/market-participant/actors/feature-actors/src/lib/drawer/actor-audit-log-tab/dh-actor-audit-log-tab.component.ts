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
import { Component, input, effect, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { dhActorAuditLogEntry } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhActorAuditLogService } from '../dh-actor-audit-log.service';

@Component({
  standalone: true,
  selector: 'dh-actor-audit-log-tab',
  templateUrl: './dh-actor-audit-log-tab.component.html',
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WattDatePipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WATT_CARD,
    WATT_TABLE,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhActorAuditLogTabComponent {
  private auditLogService = inject(DhActorAuditLogService);

  auditLogLoading = this.auditLogService.auditLogQuery.loading;
  auditLogHasError = computed(() => this.auditLogService.auditLogQuery.error() !== undefined);

  actorId = input.required<string>();
  actorNumberNameLookup = input.required<{
    [key: string]: {
      number: string;
      name: string;
    };
  }>();
  gridAreaCodeLookup = input.required<{
    [key: string]: string;
  }>();

  auditLogDataSource = new WattTableDataSource<dhActorAuditLogEntry>([]);
  auditLogColumns: WattTableColumnDef<dhActorAuditLogEntry> = {
    timestamp: { accessor: 'timestamp' },
    currentValue: { accessor: 'currentValue' },
  };

  constructor() {
    effect(() => {
      const logs = structuredClone(this.auditLogService.auditLogQuery.data()?.actorAuditLogs ?? []);

      this.auditLogDataSource.data = logs.reverse();
    });

    effect(() => {
      this.auditLogService.auditLogQuery.refetch({ actorId: this.actorId() });
    });
  }

  formatDelegationEntry(payload: dhActorAuditLogEntry) {
    const values = payload.currentValue
      ?.replace('(', '')
      .replace(')', '')
      .split(';')
      .map((x) => x.trim());

    if (!values) return {};

    const [payloadGln, payloadStartsAt, payloadGridArea, payloadProcessType, payloadStopsAt] =
      values;
    const actorNumberName = this.actorNumberNameLookup()[payloadGln];

    return {
      auditedBy: payload.auditedBy,
      actor: `${actorNumberName.number} • ${actorNumberName.name}`,
      startsAt: wattFormatDate(payloadStartsAt),
      gridArea: this.gridAreaCodeLookup()[payloadGridArea],
      processType: translate(
        'marketParticipant.actorsOverview.drawer.tabs.history.processTypes.' + payloadProcessType
      ),
      stopsAt: payloadStopsAt !== undefined ? wattFormatDate(payloadStopsAt) : undefined,
    };
  }
}
