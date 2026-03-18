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
import { Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, translate } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet/watt/chip';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { dayjs, WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';

import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  DhEmDashFallbackPipe,
  DhStateBadge,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { RouterOutlet } from '@angular/router';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  EicFunction,
  GetMeteringPointProcessOverviewDocument,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { MeteringPointProcess } from './types';
import { DhActionsRegistry } from './actions/registry';
import { SupportedActionsPipe } from './actions/supported-actions.pipe';

@Component({
  selector: 'dh-metering-point-process-overview-table',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    TranslocoDirective,
    VaterUtilityDirective,
    VaterStackComponent,
    WATT_TABLE,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDateRangeChipComponent,
    WattIconComponent,
    WattDatePipe,
    WattFormChipDirective,
    DhEmDashFallbackPipe,
    DhStateBadge,
    SupportedActionsPipe,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'meteringPoint.processOverview'"
      vater
      inset="ml"
      [error]="query.error()"
      [ready]="query.called() && !query.loading()"
      [header]="false"
      [pageSize]="100"
    >
      <watt-data-filters>
        <form
          vater-stack
          scrollable
          direction="row"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
          *transloco="let t; prefix: 'meteringPoint.processOverview.filters'"
        >
          <watt-date-range-chip [formControl]="form.controls.created">
            {{ t('created') }}
          </watt-date-range-chip>
          <vater-stack direction="row" offset="ml" gap="l">
            <!--<watt-checkbox [formControl]="form.controls.includeViews">
              {{ t('includeViews') }}
            </watt-checkbox>-->
            <!--<watt-checkbox [formControl]="form.controls.includeMasterMeasurementAndPriceRequests">
              {{ t('includeMasterMeasurementAndPriceRequests') }}
            </watt-checkbox>-->
          </vater-stack>
        </form>
      </watt-data-filters>
      <watt-table
        variant="zebra"
        sortBy="createdAt"
        sortDirection="desc"
        *transloco="let resolveHeader; prefix: 'meteringPoint.processOverview.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="query.loading()"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigation.navigate('details', $event.id)"
      >
        <ng-container *wattTableCell="columns.createdAt; let process">
          {{ process.createdAt | wattDate: 'long' | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.cutoffDate; let process">
          {{ process.cutoffDate | wattDate | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.businessReason; let process">
          {{ t('processType.' + process.businessReason) }}
        </ng-container>
        <ng-container *wattTableCell="columns.state; let process">
          <dh-state-badge [status]="process.state" *transloco="let t; prefix: 'shared.states'">
            {{ t(process.state) }}
          </dh-state-badge>
        </ng-container>
        <ng-container *wattTableCell="columns.initiator; let process">
          {{ process.initiator?.displayName | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.actions; let process">
          @if (canPerformActions() || isFas()) {
            <vater-stack
              direction="row"
              gap="s"
              *transloco="let t; prefix: 'meteringPoint.processOverview.actions'"
            >
              @for (
                action of process.availableActions | supportedActions: process.businessReason;
                track action
              ) {
                @if (canPerformActions()) {
                  <watt-button
                    variant="secondary"
                    (click)="onActionClick($event, process, action)"
                    size="small"
                  >
                    {{ t(action) }}
                  </watt-button>
                } @else if (isFas()) {
                  <vater-stack direction="row" gap="xs">
                    <watt-icon name="warning" size="s" />
                    <span>{{ t('FAS_' + action) }}</span>
                  </vater-stack>
                }
              }
            </vater-stack>
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhMeteringPointProcessOverviewTable {
  protected readonly navigation = inject(DhNavigationService);
  private readonly actionService = inject(DhActionsRegistry);
  private readonly permissionService = inject(PermissionService);

  readonly meteringPointId = input.required<string>();
  readonly internalMeteringPointId = input.required<string>();
  readonly id = input<string>();

  protected isFas = toSignal(this.permissionService.isFas(), { initialValue: false });
  protected canPerformActions = toSignal(
    combineLatest([
      this.permissionService.hasMarketRole(EicFunction.GridAccessProvider),
      this.permissionService.hasMarketRole(EicFunction.EnergySupplier),
    ]).pipe(map(([isNet, isEl]) => isNet || isEl)),
    { initialValue: false }
  );

  initialDateRange = {
    start: dayjs().subtract(3, 'months').startOf('day').toDate(),
    end: dayjs().endOf('day').toDate(),
  };

  query = query(GetMeteringPointProcessOverviewDocument, () => ({
    variables: {
      meteringPointId: this.meteringPointId(),
      created: this.initialDateRange,
    },
  }));

  dataSource = dataSource(() => this.query.data()?.meteringPointProcessOverview ?? []);

  columns: WattTableColumnDef<MeteringPointProcess> = {
    createdAt: { accessor: 'createdAt' },
    cutoffDate: { accessor: 'cutoffDate' },
    businessReason: { accessor: 'businessReason' },
    state: { accessor: (process) => translate(`shared.states.${process.state}`) },
    initiator: { accessor: (process) => process.initiator?.displayName },
    actions: { accessor: (process) => process.availableActions?.length ?? 0 },
  };

  form = new FormGroup({
    created: dhMakeFormControl(this.initialDateRange),
    includeViews: dhMakeFormControl(false),
    includeMasterMeasurementAndPriceRequests: dhMakeFormControl(false),
  });

  selection = computed(() => this.dataSource.data.find((r) => r.id === this.navigation.id()));
  filters = toSignal(this.form.valueChanges.pipe(filter((v) => Boolean(v.created?.end))));
  variables = computed(() => ({ ...this.filters(), meteringPointId: this.meteringPointId() }));
  refetch = effect(() => this.query.refetch(this.variables()));

  onActionClick(event: Event, process: MeteringPointProcess, action: WorkflowAction) {
    event.stopPropagation();
    this.actionService.execute(action, process.businessReason, {
      meteringPointId: this.meteringPointId(),
      internalMeteringPointId: this.internalMeteringPointId(),
      processId: process.id,
    });
  }
}
