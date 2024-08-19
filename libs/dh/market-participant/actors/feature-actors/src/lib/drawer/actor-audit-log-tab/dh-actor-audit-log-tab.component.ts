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
import { Component, input, inject, effect } from '@angular/core';

import { TranslocoDirective, translate } from '@ngneat/transloco';

import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { RxPush } from '@rx-angular/template/push';
import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/utils/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhActorAuditLogService } from '../dh-actor-audit-log.service';
import { Subscription } from 'rxjs';
import { dhActorAuditLogEntry } from '@energinet-datahub/dh/market-participant/actors/domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'dh-actor-audit-log-tab',
  templateUrl: './dh-actor-audit-log-tab.component.html',
  imports: [
    VaterStackComponent,
    VaterFlexComponent,
    WattDatePipe,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WATT_CARD,
    WATT_TABLE,
    TranslocoDirective,
    RxPush,
  ],
})
export class DhActorAuditLogTabComponent {
  private readonly auditLogService = inject(DhActorAuditLogService);

  private actorAuditLog$ =
    this.auditLogService.getActorAuditLogByIdQuery$.valueChanges.pipe(takeUntilDestroyed());

  private subscription: Subscription | null = null;

  actorId = input.required<string>();
  actorNumberNameLookup = input.required<{
    [Key: string]: {
      number: string;
      name: string;
    };
  }>();
  gridAreaCodeLookup = input.required<{
    [Key: string]: string;
  }>();

  isLoadingAuditLog = false;
  auditLogFailedToLoad = false;

  auditLog = new WattTableDataSource<dhActorAuditLogEntry>([]);
  auditLogColumns: WattTableColumnDef<dhActorAuditLogEntry> = {
    timestamp: { accessor: 'timestamp' },
    currentValue: { accessor: 'currentValue' },
  };

  constructor() {
    effect(() => {
      this.isLoadingAuditLog = true;
      this.loadAuditLog(this.actorId());
    });
  }

  private loadAuditLog(actorId: string): void {
    if (!actorId) return;

    this.auditLogService.getActorAuditLogByIdQuery$.setVariables({
      actorId,
    });

    if (this.subscription) return;

    this.subscription = this.actorAuditLog$.subscribe({
      next: (result) => {
        this.isLoadingAuditLog = result.loading;
        this.auditLogFailedToLoad = !result.loading && (!!result.error || !!result.errors?.length);

        this.auditLog.data = [...(result.data?.actorAuditLogs ?? [])].reverse();
      },
      error: () => {
        this.auditLogFailedToLoad = true;
        this.isLoadingAuditLog = false;
      },
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
