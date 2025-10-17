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
import { Component, computed, input } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { GetMeteringPointProcessByIdQuery } from '@energinet-datahub/dh/shared/domain/graphql';
import { emDash } from '@energinet-datahub/dh/shared/ui-util';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { RouterLink } from '@angular/router';

type MeteringPointProcessStep = NonNullable<
  GetMeteringPointProcessByIdQuery['meteringPointProcessById']
>['steps'][number];

@Component({
  selector: 'dh-metering-point-process-overview-steps',
  imports: [
    RouterLink,
    TranslocoDirective,
    TranslocoPipe,
    VaterFlexComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattDatePipe,
    WattIconComponent,
  ],
  template: `
    <watt-table
      *transloco="let resolveHeader; read: 'meteringPoint.processOverview.details.columns'"
      [dataSource]="dataSource()"
      [columns]="columns"
      [resolveHeader]="resolveHeader"
    >
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
          @if (process.messageId) {
            <a target="_blank" [routerLink]="['/message-archive/details', process.messageId]">
              <watt-icon size="xs" name="forwardMessage" />
            </a>
          }
        </vater-flex>
      </ng-container>
      <ng-container *wattTableCell="columns.createdAt; let process">
        {{ process.createdAt | wattDate: 'long' }}
      </ng-container>
      <ng-container *wattTableCell="columns.dueDate; let process">
        {{ process.dueDate | wattDate: 'long' }}
      </ng-container>
      <ng-container *wattTableCell="columns.state; let process">
        {{ 'shared.states.' + process.state | transloco }}
      </ng-container>
    </watt-table>
  `,
})
export class DhMeteringPointProcessOverviewSteps {
  readonly steps = input.required<MeteringPointProcessStep[]>();
  dataSource = computed(() => new WattTableDataSource<MeteringPointProcessStep>(this.steps()));
  columns: WattTableColumnDef<MeteringPointProcessStep> = {
    step: { accessor: 'step', size: '1fr' },
    createdAt: { accessor: 'createdAt' },
    dueDate: { accessor: 'dueDate' },
    actor: { accessor: 'actor', cell: (r) => r.actor?.name ?? emDash },
    state: { accessor: 'state' },
  };
}
