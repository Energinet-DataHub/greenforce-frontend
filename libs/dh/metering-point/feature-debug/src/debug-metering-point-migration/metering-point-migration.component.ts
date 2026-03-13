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
import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { VATER } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCardComponent } from '@energinet/watt/card';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { query, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  GetMeteringPointMigratedCountDocument,
  GetMeteringPointCountDocument,
  ReplayMigrationEventsDlqDocument,
  ClearMigrationEventsDlqDocument,
  SyncJobSetVersionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattFieldHintComponent } from '@energinet/watt/field';
import { dayjs } from '@energinet/watt/date';
import { WattHeadingComponent } from '@energinet/watt/heading';

@Component({
  selector: 'dh-metering-point-migration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    VATER,
    WattButtonComponent,
    WattCardComponent,
    WattDatepickerComponent,
    WattFieldHintComponent,
    WattHeadingComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    .result-box {
      padding: var(--watt-space-m);
      background-color: var(--watt-color-neutral-grey-100);
      border-radius: var(--watt-space-xs);
      font-family: monospace;
    }

    .counts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--watt-space-m);
    }
  `,
  template: `
    <div vater inset="ml">
      <vater-flex direction="column" gap="ml">
        <watt-card>
          <vater-flex direction="column" gap="m">
            <h3 watt-heading>Migration Counts Comparison</h3>

            <div class="counts-grid">
              <div class="result-box">
                <strong>Migrated Count (EM1):</strong><br />
                @if (v1CountQuery.loading()) {
                  Loading...
                } @else if (v1CountQuery.hasError()) {
                  Error loading count
                } @else {
                  Total: {{ v1TotalCount() | number }}<br />
                  Quarantined: {{ v1QuarantinedCount() | number }}
                }
              </div>
              <div class="result-box">
                <strong>Migrated Count (EM2):</strong><br />
                @if (migratedCountQuery.loading()) {
                  Loading...
                } @else if (migratedCountQuery.hasError()) {
                  Error loading count
                } @else {
                  {{ migratedCount() | number }}
                }
              </div>
            </div>

            <vater-flex direction="row" gap="m">
              <watt-button variant="secondary" (click)="refreshCounts()">
                Refresh Counts
              </watt-button>
            </vater-flex>
          </vater-flex>
        </watt-card>

        <vater-flex direction="row" gap="ml">
          <watt-card>
            <vater-flex direction="column" gap="m">
              <h3 watt-heading>Dead Letter Queue for Migration Events</h3>

              <vater-stack direction="row" gap="m">
                <watt-button
                  variant="secondary"
                  [loading]="replayDlqMutation.loading()"
                  (click)="replayDlq()"
                >
                  Replay DLQ Events
                </watt-button>

                <watt-button
                  variant="secondary"
                  [loading]="clearDlqMutation.loading()"
                  (click)="clearDlq()"
                >
                  Clear DLQ
                </watt-button>
              </vater-stack>

              @if (dlqResult()) {
                <div class="result-box">
                  <strong>Last Operation Result:</strong><br />
                  DLQ Count: {{ dlqResult()?.dlqCount }}<br />
                  Processed Count: {{ dlqResult()?.processedCount }}
                </div>
              }
            </vater-flex>
          </watt-card>

          <watt-card>
            <vater-flex direction="column" gap="m">
              <h3 watt-heading>Set start time for migration job in EM1</h3>

              <watt-datepicker [formControl]="versionDateControl" [label]="'Start time (optional)'">
                <watt-field-hint>
                  If no start time is provided, everything will be migrated!
                </watt-field-hint>
              </watt-datepicker>

              <watt-button
                variant="secondary"
                [loading]="syncJobMutation.loading()"
                (click)="runSyncJob()"
              >
                Set start time
              </watt-button>

              @if (syncJobResult()) {
                <div class="result-box"><strong>Result:</strong> {{ syncJobResult() }}</div>
              }
            </vater-flex>
          </watt-card>
        </vater-flex>
      </vater-flex>
    </div>
  `,
})
export class DhMeteringPointMigrationComponent {
  migratedCountQuery = query(GetMeteringPointMigratedCountDocument);
  v1CountQuery = query(GetMeteringPointCountDocument);
  replayDlqMutation = mutation(ReplayMigrationEventsDlqDocument);
  clearDlqMutation = mutation(ClearMigrationEventsDlqDocument);
  syncJobMutation = mutation(SyncJobSetVersionDocument);

  versionDateControl = new FormControl<Date | null>(dayjs().subtract(1, 'month').toDate());

  migratedCount = computed(() => this.migratedCountQuery.data()?.meteringPointMigratedCount ?? 0);
  v1TotalCount = computed(() => this.v1CountQuery.data()?.meteringPointCount?.totalCount ?? 0);
  v1QuarantinedCount = computed(
    () => this.v1CountQuery.data()?.meteringPointCount?.quarantinedCount ?? 0
  );

  dlqResult = computed(() => {
    const replayResult =
      this.replayDlqMutation.data()?.replayMigrationEventsDeadLetterQueue
        ?.replayMigrationEventsDeadLetterQueueResultDtoV1;
    const clearResult =
      this.clearDlqMutation.data()?.clearMigrationEventsDeadLetterQueue
        ?.clearMigrationEventsDeadLetterQueueResultDtoV1;
    return replayResult ?? clearResult;
  });

  syncJobResult = signal<string | null>(null);

  refreshCounts(): void {
    this.migratedCountQuery.refetch();
    this.v1CountQuery.refetch();
  }

  replayDlq(): void {
    this.replayDlqMutation.mutate();
  }

  clearDlq(): void {
    this.clearDlqMutation.mutate();
  }

  runSyncJob(): void {
    const versionDate = this.versionDateControl.value;
    this.syncJobMutation.mutate({
      variables: {
        input: { version: versionDate ?? undefined },
      },
      onCompleted: (data) => {
        const success = data.syncJobSetJobVersionEventStoreExport.success;
        this.syncJobResult.set(success ? 'Success' : 'Failed');
      },
      onError: (error) => {
        this.syncJobResult.set(`Error: ${error.message}`);
      },
    });
  }
}
