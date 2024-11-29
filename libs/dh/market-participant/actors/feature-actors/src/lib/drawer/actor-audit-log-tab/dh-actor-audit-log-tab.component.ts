import {
  Component,
  input,
  effect,
  computed,
  inject,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { TranslocoDirective, translate } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDatePipe, wattFormatDate } from '@energinet-datahub/watt/date';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { dhActorAuditLogEntry } from '@energinet-datahub/dh/market-participant/actors/domain';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetActorsDocument,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

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

  private gridAreasQuery = query(GetGridAreasDocument);
  private actorsQuery = query(GetActorsDocument);

  private gridAreaCodeLookup: Signal<{ [key: string]: string }> = computed(() =>
    this.getGridAreaCodes()
  );

  private actorNumberNameLookup: Signal<{ [key: string]: { number: string; name: string } }> =
    computed(() => this.getActorNumberNames());

  isLoading = computed(
    () => this.auditLogService.auditLogQuery.loading() || this.gridAreasQuery.loading()
  );
  hasError = computed(
    () => this.auditLogService.auditLogQuery.hasError() || this.gridAreasQuery.hasError()
  );

  actorId = input.required<string>();

  dataSource = new WattTableDataSource<dhActorAuditLogEntry>([]);
  columns: WattTableColumnDef<dhActorAuditLogEntry> = {
    timestamp: { accessor: 'timestamp' },
    currentValue: { accessor: 'currentValue' },
  };

  constructor() {
    effect(() => {
      const logEntries = structuredClone(
        this.auditLogService.auditLogQuery.data()?.actorAuditLogs ?? []
      );

      this.dataSource.data = logEntries.reverse();
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

    const [payloadGln, payloadStartsAt, payloadGridAreaId, payloadProcessType, payloadStopsAt] =
      values;
    const actorNumberName = this.actorNumberNameLookup()[payloadGln];

    return {
      auditedBy: payload.auditedBy,
      actor: `${actorNumberName.number} • ${actorNumberName.name}`,
      startsAt: wattFormatDate(payloadStartsAt),
      gridArea: this.gridAreaCodeLookup()[payloadGridAreaId],
      processType: translate(
        'marketParticipant.actorsOverview.drawer.tabs.history.processTypes.' + payloadProcessType
      ),
      stopsAt: payloadStopsAt == undefined ? undefined : wattFormatDate(payloadStopsAt),
    };
  }

  private getActorNumberNames() {
    const actors = this.actorsQuery.data()?.actors ?? [];

    return actors.reduce(
      (acc, actor) => {
        acc[actor.id] = {
          number: actor.glnOrEicNumber,
          name: actor.name,
        };

        return acc;
      },
      {} as { [key: string]: { number: string; name: string } }
    );
  }

  private getGridAreaCodes() {
    const gridAreas = this.gridAreasQuery.data()?.gridAreas ?? [];

    return gridAreas.reduce(
      (acc, gridArea) => {
        acc[gridArea.id] = gridArea.code;

        return acc;
      },
      {} as { [key: string]: string }
    );
  }
}
