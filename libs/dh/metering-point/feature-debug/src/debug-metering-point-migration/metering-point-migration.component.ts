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
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { VATER } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCardComponent } from '@energinet/watt/card';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WATT_MODAL } from '@energinet/watt/modal';

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
    TranslocoDirective,
    VATER,
    WATT_MODAL,
    WattButtonComponent,
    WattCardComponent,
    WattDatepickerComponent,
    WattFieldHintComponent,
    WattHeadingComponent,
  ],
  styles: `
    .result-box {
      padding: var(--watt-space-m);
      background-color: var(--watt-color-neutral-grey-100);
      border-radius: var(--watt-space-xs);
      font-family: monospace;
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPointDebug.migration'">
      <div vater inset="ml">
        <vater-flex direction="column" gap="ml">
          <watt-card>
            <vater-flex direction="column" gap="m">
              <h3 watt-heading>{{ t('countsComparison.title') }}</h3>

              <vater-flex direction="row" gap="m">
                <div class="result-box">
                  <strong>{{ t('countsComparison.em1Label') }}</strong>
                  <br />
                  @if (em1Count.loading()) {
                    {{ t('countsComparison.loading') }}
                  } @else if (em1Count.hasError()) {
                    {{ t('countsComparison.error') }}
                  } @else if (em1Count.data()?.meteringPointCount; as data) {
                    {{ t('countsComparison.total') }} {{ data.totalCount | number }}<br />
                    {{ t('countsComparison.quarantined') }} {{ data.quarantinedCount | number }}
                  }
                </div>
                <div class="result-box">
                  <strong>{{ t('countsComparison.em2Label') }}</strong
                  ><br />
                  @if (em2Count.loading()) {
                    {{ t('countsComparison.loading') }}
                  } @else if (em2Count.hasError()) {
                    {{ t('countsComparison.error') }}
                  } @else if (em2Count.data(); as data) {
                    {{ data.meteringPointMigratedCount | number }}
                  }
                </div>
              </vater-flex>

              <vater-flex direction="row" gap="m">
                <watt-button variant="secondary" (click)="refreshCounts()">
                  {{ t('countsComparison.refreshButton') }}
                </watt-button>
              </vater-flex>
            </vater-flex>
          </watt-card>

          <vater-flex direction="row" gap="ml">
            <watt-card>
              <vater-flex direction="column" gap="m">
                <h3 watt-heading>{{ t('dlq.title') }}</h3>

                <vater-stack direction="row" gap="m">
                  <watt-button
                    variant="secondary"
                    [loading]="replayDlq.loading()"
                    (click)="replayDlqModal.open()"
                  >
                    {{ t('dlq.replayButton') }}
                  </watt-button>

                  <watt-button
                    variant="secondary"
                    [loading]="clearDlq.loading()"
                    (click)="clearDlqModal.open()"
                  >
                    {{ t('dlq.clearButton') }}
                  </watt-button>
                </vater-stack>

                @if (dlqResult()) {
                  <div class="result-box">
                    <strong>{{ t('dlq.lastOperationResult') }}</strong>
                    <br />
                    {{ t('dlq.dlqCount') }} {{ dlqResult()?.dlqCount }}<br />
                    {{ t('dlq.processedCount') }} {{ dlqResult()?.processedCount }}
                  </div>
                }
              </vater-flex>
            </watt-card>

            <watt-card>
              <vater-flex direction="column" gap="m">
                <h3 watt-heading>{{ t('syncJob.title') }}</h3>

                <watt-datepicker
                  [formControl]="versionDateControl"
                  [label]="t('syncJob.startTimeLabel')"
                >
                  <watt-field-hint>
                    {{ t('syncJob.hint') }}
                  </watt-field-hint>
                </watt-datepicker>

                <watt-button
                  variant="secondary"
                  [loading]="syncJob.loading()"
                  (click)="syncJobModal.open()"
                >
                  {{ t('syncJob.setStartTimeButton') }}
                </watt-button>

                @if (syncJob.data(); as data) {
                  <div class="result-box">
                    <strong>{{ t('result') }}</strong>
                    {{
                      data.syncJobSetJobVersionEventStoreExport.success ? t('success') : t('failed')
                    }}
                  </div>
                }

                @if (syncJob.error(); as error) {
                  <div class="result-box">
                    <strong>{{ t('error') }}</strong> {{ error.message }}
                  </div>
                }
              </vater-flex>
            </watt-card>
          </vater-flex>
        </vater-flex>
      </div>

      <watt-modal
        #replayDlqModal
        size="small"
        [title]="t('dlq.modal.replayTitle')"
        (closed)="onReplayDlqConfirm($event)"
      >
        <p>{{ t('dlq.modal.replayMessage') }}</p>
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="replayDlqModal.close(false)">
            {{ t('modal.cancel') }}
          </watt-button>
          <watt-button (click)="replayDlqModal.close(true)">
            {{ t('modal.confirm') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>

      <watt-modal
        #clearDlqModal
        size="small"
        [title]="t('dlq.modal.clearTitle')"
        (closed)="onClearDlqConfirm($event)"
      >
        <p>{{ t('dlq.modal.clearMessage') }}</p>
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="clearDlqModal.close(false)">
            {{ t('modal.cancel') }}
          </watt-button>
          <watt-button (click)="clearDlqModal.close(true)">
            {{ t('modal.confirm') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>

      <watt-modal
        #syncJobModal
        size="small"
        [title]="t('syncJob.modal.title')"
        (closed)="onSyncJobConfirm($event)"
      >
        <p>{{ t('syncJob.modal.message') }}</p>
        <watt-modal-actions>
          <watt-button variant="secondary" (click)="syncJobModal.close(false)">
            {{ t('modal.cancel') }}
          </watt-button>
          <watt-button (click)="syncJobModal.close(true)">
            {{ t('modal.confirm') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    </ng-container>
  `,
})
export class DhMeteringPointMigrationComponent {
  em1Count = query(GetMeteringPointCountDocument);
  em2Count = query(GetMeteringPointMigratedCountDocument);
  replayDlq = mutation(ReplayMigrationEventsDlqDocument);
  clearDlq = mutation(ClearMigrationEventsDlqDocument);
  syncJob = mutation(SyncJobSetVersionDocument);
  versionDateControl = new FormControl<Date | null>(dayjs().subtract(1, 'month').toDate());

  dlqResult = computed(() => {
    const replayResult = this.replayDlq.data()?.replayMigrationEventsDeadLetterQueue;
    const clearResult = this.clearDlq.data()?.clearMigrationEventsDeadLetterQueue;
    return replayResult ?? clearResult;
  });

  refreshCounts() {
    this.em1Count.refetch();
    this.em2Count.refetch();
  }

  onReplayDlqConfirm(confirmed: boolean): void {
    if (!confirmed) return;
    this.replayDlq.mutate();
  }

  onClearDlqConfirm(confirmed: boolean): void {
    if (!confirmed) return;
    this.clearDlq.mutate();
  }

  onSyncJobConfirm(confirmed: boolean): void {
    if (!confirmed) return;
    const versionDate = this.versionDateControl.value;
    this.syncJob.mutate({
      variables: {
        input: { version: versionDate ?? undefined },
      },
    });
  }
}
