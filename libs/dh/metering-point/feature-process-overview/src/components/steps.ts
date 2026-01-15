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
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet/watt/table';
import { WattDataTableComponent } from '@energinet/watt/data';
import {
  GetMeteringPointProcessByIdQuery,
  ProcessStepState,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattDatePipe } from '@energinet/watt/date';
import { WattToastService } from '@energinet/watt/toast';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

type MeteringPointProcessStep = NonNullable<
  GetMeteringPointProcessByIdQuery['meteringPointProcessById']
>['steps'][number];

@Component({
  selector: 'dh-metering-point-process-overview-steps',
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    VaterFlexComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattDataTableComponent,
    WattDatePipe,
    WattIconComponent,
    DhEmDashFallbackPipe,
  ],
  styles: `
    tr.pending-step {
      color: var(--watt-on-light-low-emphasis);
    }
  `,
  encapsulation: ViewEncapsulation.None,
  template: `
    <watt-data-table
      vater
      [ready]="!loading()"
      [error]="error()"
      [header]="false"
      [enableSearch]="false"
      [enablePaginator]="false"
      [enableCount]="false"
    >
      <watt-table
        *transloco="let resolveHeader; prefix: 'meteringPoint.processOverview.details.columns'"
        [dataSource]="dataSource()"
        [columns]="columns"
        [displayedColumns]="displayedColumns()"
        [resolveHeader]="resolveHeader"
        [loading]="loading()"
        [rowClass]="getRowClass"
      >
        <ng-container *wattTableCell="columns.documentUrl; let process">
          @if (process.documentUrl; as documentUrl) {
            <a href="#" (click)="openRawMessage(documentUrl, $event)">
              <watt-icon size="xs" name="email" />
            </a>
          }
        </ng-container>
        <ng-container *wattTableCell="columns.step; let process">
          <vater-flex
            fill="horizontal"
            direction="row"
            gap="s"
            align="center"
            justify="space-between"
          >
            <div vater fill="horizontal">
              {{ 'meteringPoint.processOverview.steps.' + process.step | transloco }}
              @if (process.comment) {
                <div class="watt-text-s-highlighted">{{ process.comment }}</div>
              }
            </div>
          </vater-flex>
        </ng-container>
        <ng-container *wattTableCell="columns.completedAt; let process">
          {{ process.completedAt | wattDate: 'long' | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.dueDate; let process">
          {{ process.dueDate | wattDate: 'long' | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.actor; let process">
          {{ process.actor?.name | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.state; let process">
          {{ 'meteringPoint.processOverview.details.stepStates.' + process.state | transloco }}
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeteringPointProcessOverviewSteps {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  readonly steps = input.required<MeteringPointProcessStep[]>();
  readonly reasonCode = input<string>();
  readonly loading = input(false);
  readonly error = input<unknown>();

  dataSource = computed(() => new WattTableDataSource<MeteringPointProcessStep>(this.steps()));

  columns: WattTableColumnDef<MeteringPointProcessStep> = {
    documentUrl: { accessor: 'documentUrl', sort: false, header: '' },
    step: { accessor: 'step', size: '1fr', sort: false },
    completedAt: { accessor: 'completedAt', sort: false },
    dueDate: { accessor: 'dueDate', sort: false },
    actor: { accessor: 'actor', sort: false },
    state: { accessor: 'state', sort: false },
  };

  displayedColumns = computed(() => {
    const reasonCode = this.reasonCode();

    const allColumns = Object.keys(this.columns);

    if (!reasonCode) {
      return allColumns;
    }

    const shortLivedProcessesByReasonCode = ['NewMeteringPoint', 'ConnectMeteringPoint'];
    const isShortLivedProcess = shortLivedProcessesByReasonCode.includes(reasonCode);

    return allColumns.filter((column) => !(isShortLivedProcess && column === 'dueDate'));
  });

  getRowClass = (step: MeteringPointProcessStep) => {
    return step.state === ProcessStepState.Pending ? 'pending-step' : '';
  };

  async openRawMessage(documentUrl: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const content = await firstValueFrom(this.http.get(documentUrl, { responseType: 'text' }));
      assertIsDefined(content);

      const type = this.detectContentType(content);
      const blob = new Blob([content], { type });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');

      // Note: We don't revoke the blob URL immediately as the new tab needs time to load it.
      // The browser will automatically clean it up when the tab is closed.
    } catch {
      this.toastService.open({
        type: 'danger',
        message: this.transloco.translate('messageArchive.document.loadFailed'),
      });
    }
  }

  private detectContentType(content: string): string {
    const trimmed = content.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'application/json';
    }
    if (trimmed.startsWith('<')) {
      return 'application/xml';
    }
    return 'text/plain';
  }
}
