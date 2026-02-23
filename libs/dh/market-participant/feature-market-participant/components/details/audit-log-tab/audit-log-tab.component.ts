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
import { input, computed, Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective, translate } from '@jsverse/transloco';

import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
  WattTableCellDirective,
} from '@energinet/watt/table';

import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe, wattFormatDate } from '@energinet/watt/date';

import {
  ActorAuditedChange,
  MarketParticipantStatus,
  GetMarketParticipantAuditLogsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  DhMarketParticipantDetails,
  DhMarketParticipantAuditLog,
} from '@energinet-datahub/dh/market-participant/domain';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-market-participant-audit-log-tab',
  template: `
    <watt-data-table
      vater
      inset="0"
      variant="solid"
      *transloco="let t; prefix: 'marketParticipant.actorsOverview.drawer'"
      [enableSearch]="false"
      [enablePaginator]="false"
      [enableCount]="false"
      [error]="hasError()"
      [ready]="ready()"
    >
      <watt-table
        [columns]="columns"
        [dataSource]="dataSource()"
        sortBy="timestamp"
        [loading]="isLoading()"
        sortDirection="desc"
        [sortClear]="false"
        [hideColumnHeaders]="true"
        [suppressRowHoverHighlight]="true"
      >
        <ng-container *wattTableCell="columns.timestamp; let element">
          {{ element.timestamp | wattDate: 'long' }}
        </ng-container>

        <ng-container *wattTableCell="columns.currentValue; let entry">
          @if (entry.change === ActorAuditedChange.Status) {
            <div
              [innerHTML]="
                t(
                  'tabs.history.changeTypes.' +
                    entry.change +
                    (entry.previousValue ? '' : '_NO_PREVIOUS'),
                  {
                    auditedBy: entry.auditedBy,
                    status: t('tabs.history.status.' + entry.currentValue),
                  }
                )
              "
            ></div>
          } @else if (entry.change === ActorAuditedChange.ClientSecretCredentials) {
            <div
              [innerHTML]="
                t(
                  'tabs.history.changeTypes.' +
                    entry.change +
                    (entry.previousValue ? '' : '_NO_PREVIOUS'),
                  {
                    auditedBy: entry.auditedBy,
                    currentValue: entry.currentValue | wattDate,
                    previousValue: entry.previousValue | wattDate,
                  }
                )
              "
            ></div>
          } @else if (
            entry.change === ActorAuditedChange.DelegationStart ||
            entry.change === ActorAuditedChange.DelegationStop
          ) {
            <div
              [innerHTML]="
                t('tabs.history.changeTypes.' + entry.change, formatDelegationEntry(entry))
              "
            ></div>
          } @else if (
            entry.change === ActorAuditedChange.ConsolidationCompleted ||
            entry.change === ActorAuditedChange.ConsolidationRequested
          ) {
            @if (entry.change === ActorAuditedChange.ConsolidationRequested) {
              <div
                [innerHTML]="
                  t(
                    'tabs.history.changeTypes.' +
                      marketParticipant().status +
                      '.CONSOLIDATION_REQUESTED',
                    {
                      auditedBy: entry.auditedBy,
                      currentOwner: entry.consolidation?.currentOwner,
                      currentOwnerGln: entry.consolidation?.currentOwnerGln,
                      previousOwner: entry.consolidation?.previousOwner,
                      previousOwnerGln: entry.consolidation?.previousOwnerGln,
                      previousOwnerStopsAt: entry.consolidation?.previousOwnerStopsAt | wattDate,
                    }
                  )
                "
              ></div>
            } @else if (entry.change === ActorAuditedChange.ConsolidationCompleted) {
              <div
                [innerHTML]="
                  t(
                    'tabs.history.changeTypes.' +
                      marketParticipant().status +
                      '.CONSOLIDATION_COMPLETED',
                    {
                      currentOwner: entry.consolidation?.currentOwner,
                      currentOwnerGln: entry.consolidation?.currentOwnerGln,
                      previousOwner: entry.consolidation?.previousOwner,
                      previousOwnerGln: entry.consolidation?.previousOwnerGln,
                      previousOwnerStopsAt: entry.consolidation?.previousOwnerStopsAt | wattDate,
                    }
                  )
                "
              ></div>
            }
          } @else {
            <div
              [innerHTML]="
                t(
                  'tabs.history.changeTypes.' +
                    entry.change +
                    (entry.previousValue ? '' : '_NO_PREVIOUS'),
                  entry
                )
              "
            ></div>
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
  imports: [
    TranslocoDirective,
    WattDatePipe,
    WattTableComponent,
    WattTableCellDirective,
    WattDataTableComponent,
    VaterUtilityDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhMarketParticipantAuditLogTabComponent {
  private getMarketParticipantAuditLogsQuery = query(GetMarketParticipantAuditLogsDocument, () => ({
    variables: { id: this.marketParticipant().id },
  }));

  ActorAuditedChange = ActorAuditedChange;
  MarketParticipantStatus = MarketParticipantStatus;

  marketParticipant = input.required<DhMarketParticipantDetails>();

  dataSource = computed(
    () =>
      new WattTableDataSource<DhMarketParticipantAuditLog>(
        this.getMarketParticipantAuditLogsQuery.data()?.marketParticipantById.auditLogs || []
      )
  );
  hasError = this.getMarketParticipantAuditLogsQuery.hasError;
  isLoading = this.getMarketParticipantAuditLogsQuery.loading;
  ready = this.getMarketParticipantAuditLogsQuery.called;

  columns: WattTableColumnDef<DhMarketParticipantAuditLog> = {
    timestamp: { accessor: 'timestamp' },
    currentValue: { accessor: 'currentValue' },
  };

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
