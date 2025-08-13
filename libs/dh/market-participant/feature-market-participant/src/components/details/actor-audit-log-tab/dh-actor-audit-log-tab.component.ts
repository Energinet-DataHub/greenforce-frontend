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
import { input, effect, inject, computed, Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective, translate } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import {
  ActorAuditedChange,
  MarketParticipantStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  DhMarketParticipantAuditLog,
  DhMarketParticipantDetails,
} from '@energinet-datahub/dh/market-participant/domain';
import { DhMarketParticipantAuditLogService } from '../dh-actor-audit-log.service';

@Component({
  selector: 'dh-actor-audit-log-tab',
  templateUrl: './dh-actor-audit-log-tab.component.html',
  imports: [TranslocoDirective, WATT_CARD, WATT_TABLE, WattDatePipe, DhResultComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhActorAuditLogTabComponent {
  private auditLogService = inject(DhMarketParticipantAuditLogService);

  ActorAuditedChange = ActorAuditedChange;
  MarketParticipantStatus = MarketParticipantStatus;

  loading = this.auditLogService.auditLogQuery.loading;
  hasError = this.auditLogService.auditLogQuery.hasError;
  auditLogs = computed(
    () => this.auditLogService.auditLogQuery.data()?.marketParticipantById.auditLogs ?? []
  );
  empty = computed(() => this.auditLogs().length === 0);

  actor = input.required<DhMarketParticipantDetails>();

  dataSource = new WattTableDataSource<DhMarketParticipantAuditLog>([]);

  columns: WattTableColumnDef<DhMarketParticipantAuditLog> = {
    timestamp: { accessor: 'timestamp' },
    currentValue: { accessor: 'currentValue' },
  };

  constructor() {
    effect(() => {
      const logEntries = structuredClone(this.auditLogs());

      this.dataSource.data = logEntries.reverse();
    });

    effect(() => {
      this.auditLogService.auditLogQuery.refetch({ id: this.actor().id });
    });
  }

  formatDelegationEntry(payload: DhMarketParticipantAuditLog) {
    return {
      auditedBy: payload.auditedBy,
      actor: `${payload.delegation?.gln} • ${payload.delegation?.marketParticipantName}`,
      startsAt: wattFormatDate(payload.delegation?.startsAt),
      gridArea: payload.delegation?.gridAreaName,
      processType: translate(
        'marketParticipant.actorsOverview.drawer.tabs.history.processTypes.' +
          payload.delegation?.processType
      ),
      stopsAt:
        payload.delegation?.stopsAt == undefined
          ? undefined
          : wattFormatDate(payload.delegation?.stopsAt),
    };
  }
}
