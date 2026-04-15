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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WATT_SEGMENTED_BUTTONS } from '@energinet/watt/segmented-buttons';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';
import { WattDataIntlService, WattDataTableComponent } from '@energinet/watt/data';

import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { VaterStackComponent } from '@energinet/watt/vater';
import { wattFormatDate } from '@energinet/watt/core/date';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { dhFormControlToSignal } from '@energinet-datahub/dh/shared/ui-util';
import {
  GetActorMessageQueuesDocument,
  GetMarketParticipantsDocument,
  MessageCategoryV1,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { QueuedMessage } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-message-queue-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: WattDataIntlService,
      useFactory: () => {
        const intl = new WattDataIntlService();
        const transloco = inject(TranslocoService);
        intl.emptyTitle = transloco.translate('messageQueue.emptyState.title');
        intl.emptyText = transloco.translate('messageQueue.emptyState.message');
        return intl;
      },
    },
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_SEGMENTED_BUTTONS,
    WATT_TABLE,
    WattDataTableComponent,
    WattDropdownComponent,
    VaterStackComponent,
  ],
  styles: [
    `
      .table-info {
        margin-top: var(--watt-space-m);
        font-style: italic;
        color: var(--watt-on-light--medium);
      }

      .actor-select {
        width: 384px;
        margin-bottom: var(--watt-space-m);
      }

      watt-segmented-buttons {
        margin-bottom: var(--watt-space-m);
      }

      watt-data-table {
        width: 987px;
        max-width: 100%;
        height: 618px;
      }
    `,
  ],
  template: `
    <vater-stack
      direction="column"
      gap="s"
      align="start"
      *transloco="let t; prefix: 'messageQueue'"
    >
      @if (isFas()) {
        <div class="actor-select">
          <watt-dropdown
            [label]="t('selectActor')"
            [options]="actorOptions()"
            [formControl]="actorControl"
          />
        </div>
      }

      @if (hasActor()) {
        <watt-segmented-buttons [(selected)]="selectedCategory">
          @for (queue of queues(); track queue.category) {
            <watt-segmented-button [value]="queue.category">
              {{ getCategoryLabel(queue.category) }} ({{ queue.count }})
            </watt-segmented-button>
          }
        </watt-segmented-buttons>

        <watt-data-table
          [enablePaginator]="false"
          [enableSearch]="false"
          [enableCount]="false"
          [header]="false"
          [ready]="!loading()"
        >
          <watt-table
            *transloco="let resolveHeader; prefix: 'messageQueue.table'"
            [dataSource]="activeDataSource()"
            [columns]="columns"
            [resolveHeader]="resolveHeader"
            [loading]="loading()"
          />
        </watt-data-table>

        <p class="table-info">{{ t('tableInfo') }}</p>
      }
    </vater-stack>
  `,
})
export class DhMessageQueueOverview {
  private readonly actorStorage = inject(DhActorStorage);
  private readonly permissionService = inject(PermissionService);
  private readonly transloco = inject(TranslocoService);

  private readonly marketParticipantsQuery = lazyQuery(GetMarketParticipantsDocument);
  private readonly messageQueuesQuery = lazyQuery(GetActorMessageQueuesDocument);

  readonly isFas = toSignal(this.permissionService.isFas(), { initialValue: false });
  readonly actorControl = new FormControl<string | null>(null);
  private readonly actorValue = dhFormControlToSignal(this.actorControl);

  readonly selectedCategory = signal<string>(MessageCategoryV1.Processes);
  private readonly dataSources = new Map<string, WattTableDataSource<QueuedMessage>>();

  readonly columns: WattTableColumnDef<QueuedMessage> = {
    messageId: { accessor: 'messageId', sort: false },
    documentType: {
      accessor: (row) => this.transloco.translate(`messageQueue.documentTypes.${row.documentType}`),
      sort: false,
    },
    businessReason: {
      accessor: (row) =>
        this.transloco.translate(`messageQueue.businessReasons.${row.businessReason}`),
      sort: false,
    },
    enqueuedAt: {
      accessor: (row) => wattFormatDate(row.enqueuedAt, 'long'),
      sort: false,
    },
  };

  readonly hasActor = computed(() => !this.isFas() || !!this.actorValue());
  readonly queues = computed(() => {
    const order = [
      MessageCategoryV1.Processes,
      MessageCategoryV1.MeasureData,
      MessageCategoryV1.Aggregations,
    ];
    return (this.messageQueuesQuery.data()?.actorMessageQueues.queues ?? []).toSorted(
      (a, b) => order.indexOf(a.category) - order.indexOf(b.category)
    );
  });
  readonly loading = this.messageQueuesQuery.loading;
  readonly activeDataSource = computed(() => this.getDataSource(this.selectedCategory()));

  readonly actorOptions = computed<WattDropdownOptions>(() => {
    const participants = this.marketParticipantsQuery.data()?.marketParticipants ?? [];
    return participants.map((p) => ({
      displayValue: p.displayName,
      value: `${p.glnOrEicNumber}|${p.marketRole}`,
    }));
  });

  private readonly loadDataEffect = effect(() => {
    const fas = this.isFas();
    if (fas) {
      this.marketParticipantsQuery.query({});
    } else {
      const actor = this.actorStorage.getSelectedActor();
      this.fetchQueues(actor.gln, actor.marketRole);
    }
  });

  private readonly actorSelectionEffect = effect(() => {
    const value = this.actorValue();
    if (!value) return;
    const [gln, role] = value.split('|');
    this.fetchQueues(gln, role);
  });

  private readonly updateDataSourcesEffect = effect(() => {
    const queues = this.queues();
    this.dataSources.clear();

    for (const queue of queues) {
      const ds = new WattTableDataSource<QueuedMessage>();
      ds.data = queue.messages;
      this.dataSources.set(queue.category, ds);
    }

    if (queues.length > 0) {
      this.selectedCategory.set(queues[0].category);
    }
  });

  getCategoryLabel(category: string): string {
    const keyMap: Record<string, string> = {
      [MessageCategoryV1.Processes]: 'messageQueue.tabs.masterdata',
      [MessageCategoryV1.MeasureData]: 'messageQueue.tabs.measureData',
      [MessageCategoryV1.Aggregations]: 'messageQueue.tabs.aggregations',
    };
    return this.transloco.translate(keyMap[category] ?? category);
  }

  getDataSource(category: string): WattTableDataSource<QueuedMessage> {
    return this.dataSources.get(category) ?? new WattTableDataSource<QueuedMessage>();
  }

  private fetchQueues(actorNumber: string, actorRole: string): void {
    this.messageQueuesQuery.query({
      variables: { actorNumber, actorRole },
    });
  }
}
