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
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WATT_TABS } from '@energinet/watt/tabs';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { VaterStackComponent } from '@energinet/watt/vater';
import { wattFormatDate } from '@energinet/watt/core/date';

import { lazyQuery, query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import {
  GetActorMessageQueuesDocument,
  GetMarketParticipantsDocument,
  MessageCategoryV1,
} from '@energinet-datahub/dh/shared/domain/graphql';
import type { QueuedMessageDto } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-message-queue-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_TABS,
    WATT_TABLE,
    WattDropdownComponent,
    WattSpinnerComponent,
    VaterStackComponent,
  ],
  styles: [
    `
      :host {
        display: block;
        padding: var(--watt-space-ml);
      }

      .table-info {
        margin-top: var(--watt-space-s);
        font-style: italic;
        color: var(--watt-on-light--medium);
      }

      .actor-select {
        max-width: 400px;
        margin-bottom: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <ng-container *transloco="let t; prefix: 'messageQueue'">
      <vater-stack direction="column" gap="m">
        <h2>{{ t('topBarTitle') }}</h2>

        @if (isAdmin()) {
          <div class="actor-select">
            <watt-dropdown
              [label]="t('selectActor')"
              [options]="actorOptions()"
              [formControl]="actorControl"
            />
          </div>
        }

        @if (loading()) {
          <watt-spinner />
        }

        @if (queues().length > 0) {
          <watt-tabs>
            @for (queue of queues(); track queue.category) {
              <watt-tab [label]="getCategoryLabel(queue.category) + ' (' + queue.count + ')'">
                <watt-table
                  *transloco="let resolveHeader; prefix: 'messageQueue.table'"
                  [dataSource]="getDataSource(queue.category)"
                  [columns]="columns"
                  [resolveHeader]="resolveHeader"
                />
              </watt-tab>
            }
          </watt-tabs>

          <p class="table-info">{{ t('tableInfo') }}</p>
        }
      </vater-stack>
    </ng-container>
  `,
})
export class DhMessageQueueOverview {
  private readonly actorStorage = inject(DhActorStorage);
  private readonly permissionService = inject(PermissionService);
  private readonly transloco = inject(TranslocoService);

  private readonly marketParticipantsQuery = query(GetMarketParticipantsDocument, {
    skip: true,
  });
  private readonly messageQueuesQuery = lazyQuery(GetActorMessageQueuesDocument);

  isAdmin = signal(false);
  actorControl = new FormControl<string | null>(null);

  private readonly dataSources = new Map<string, WattTableDataSource<QueuedMessageDto>>();

  columns: WattTableColumnDef<QueuedMessageDto> = {
    messageId: { accessor: 'messageId' },
    documentType: { accessor: 'documentType' },
    businessReason: { accessor: 'businessReason' },
    enqueuedAt: {
      accessor: (row) => wattFormatDate(row.enqueuedAt, 'long'),
    },
  };

  queues = computed(() => this.messageQueuesQuery.data()?.actorMessageQueues.queues ?? []);
  loading = this.messageQueuesQuery.loading;

  actorOptions = computed<WattDropdownOptions>(() => {
    const participants = this.marketParticipantsQuery.data()?.marketParticipants ?? [];
    return participants.map((p) => ({
      displayValue: p.displayName,
      value: `${p.glnOrEicNumber}|${p.marketRole}`,
    }));
  });

  constructor() {
    this.permissionService.hasPermission('fas').subscribe((isFas) => {
      this.isAdmin.set(isFas);

      if (isFas) {
        this.marketParticipantsQuery.setOptions({ skip: false });
      } else {
        const actor = this.actorStorage.getSelectedActor();
        this.fetchQueues(actor.gln, actor.marketRole);
      }
    });

    this.actorControl.valueChanges.subscribe((value) => {
      if (value) {
        const [gln, role] = value.split('|');
        this.fetchQueues(gln, role);
      }
    });

    effect(() => {
      const data = this.messageQueuesQuery.data();
      if (!data) return;

      for (const queue of data.actorMessageQueues.queues) {
        const ds =
          this.dataSources.get(queue.category) ??
          new WattTableDataSource<QueuedMessageDto>();
        ds.data = queue.messages;
        this.dataSources.set(queue.category, ds);
      }
    });
  }

  getCategoryLabel(category: MessageCategoryV1): string {
    const keyMap: Record<string, string> = {
      [MessageCategoryV1.Processes]: 'messageQueue.tabs.masterdata',
      [MessageCategoryV1.MeasureData]: 'messageQueue.tabs.measureData',
      [MessageCategoryV1.Aggregations]: 'messageQueue.tabs.aggregations',
    };
    return this.transloco.translate(keyMap[category] ?? category);
  }

  getDataSource(category: MessageCategoryV1): WattTableDataSource<QueuedMessageDto> {
    return this.dataSources.get(category) ?? new WattTableDataSource<QueuedMessageDto>();
  }

  private fetchQueues(actorNumber: string, actorRole: string): void {
    this.messageQueuesQuery.query({
      variables: { actorNumber, actorRole },
    });
  }
}
