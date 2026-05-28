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
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, translate } from '@jsverse/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet/watt/chip';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet/watt/data';
import { WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';

import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';
import { DhEmDashFallbackPipe, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { RouterOutlet } from '@angular/router';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
import { WorkflowAction } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/util-release-toggle';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';

import { MeteringPointProcess } from '../types';
import { DhProcessStateBadge } from './process-state-badge';
import { DhActionsRegistry } from '../actions/registry';
import { SupportedActionsPipe } from '../actions/supported-actions.pipe';
import { RequestIncorrectMoveIn } from '../actions/customer-move-in/request-incorrect-move-in';
import { DhMeteringPointProcessOverviewStore } from './metering-point-process-overview.store';

@Component({
  selector: 'dh-metering-point-process-overview-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    WattDatePipe,
    WattFormChipDirective,
    DhEmDashFallbackPipe,
    DhProcessStateBadge,
    DhReleaseToggleDirective,
    SupportedActionsPipe,
  ],
  providers: [DhNavigationService],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'meteringPoint.processOverview'"
      vater
      inset="ml"
      [error]="store.error()"
      [ready]="store.called() && !store.loading()"
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
        </form>
      </watt-data-filters>
      <watt-table
        variant="zebra"
        sortBy="createdAt"
        sortDirection="desc"
        *transloco="let resolveHeader; prefix: 'meteringPoint.processOverview.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="store.loading()"
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
          <dh-process-state-badge
            [status]="process.state"
            *transloco="let t; prefix: 'shared.states'"
          >
            {{ t(process.state) }}
          </dh-process-state-badge>
        </ng-container>
        <ng-container *wattTableCell="columns.initiator; let process">
          {{ initiatorLabel(process) | dhEmDashFallback }}
        </ng-container>
        <ng-container *wattTableCell="columns.actions; let process">
          <vater-stack
            direction="row"
            gap="s"
            *transloco="let t; prefix: 'meteringPoint.processOverview.actions'"
          >
            @let visibleActions =
              process.availableActions
                | supportedActions
                  : process.businessReason
                  : isEnergySupplierResponsible()
                  : process.initiator?.glnOrEicNumber;
            @if (isFas()) {
              @if (visibleActions.length > 0) {
                <em>{{ t('fasGenericActions') }}</em>
              }
            } @else {
              @for (action of visibleActions; track action) {
                <watt-button
                  variant="secondary"
                  (click)="onActionClick($event, process, action)"
                  size="small"
                >
                  {{ t(process.businessReason + '.' + action) }}
                </watt-button>
              }

              <ng-container *dhReleaseToggle="'BRS011-INCOMING-MESSAGES'">
                @if (isEnergySupplierResponsible() && process.businessReason === 'CustomerMoveIn') {
                  <watt-button
                    variant="secondary"
                    size="small"
                    (click)="onRequestCorrectionClick($event, process)"
                    >{{ t('CustomerMoveIn.REQUEST_CORRECTION') }}</watt-button
                  >
                }
              </ng-container>
            }
          </vater-stack>
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhMeteringPointProcessOverviewTable {
  protected readonly navigation = inject(DhNavigationService);
  protected readonly store = inject(DhMeteringPointProcessOverviewStore);
  private readonly actionService = inject(DhActionsRegistry);
  private readonly permissionService = inject(PermissionService);
  private readonly requestIncorrectMoveIn = inject(RequestIncorrectMoveIn);

  readonly meteringPointId = input.required<string>();
  readonly internalMeteringPointId = input.required<string>();
  readonly isEnergySupplierResponsible = input.required<boolean>();
  readonly id = input<string>();

  protected isFas = toSignal(this.permissionService.isFas(), { initialValue: false });

  dataSource = dataSource(() => this.store.processes());

  columns: WattTableColumnDef<MeteringPointProcess> = {
    createdAt: { accessor: 'createdAt' },
    cutoffDate: { accessor: 'cutoffDate' },
    businessReason: { accessor: 'businessReason' },
    state: { accessor: (process) => translate(`shared.states.${process.state}`) },
    initiator: { accessor: (process) => this.initiatorLabel(process) },
    actions: { accessor: (process) => process.availableActions?.length ?? 0 },
  };

  form = new FormGroup({
    created: dhMakeFormControl(this.store.dateRange()),
  });

  selection = computed(() => this.dataSource.data.find((r) => r.id === this.navigation.id()));

  constructor() {
    // Bridge the route-bound metering point id into the store that owns the overview query.
    // The list itself stays a pure derivation inside the store, so it cannot drift.
    effect(() => this.store.meteringPointId.set(this.meteringPointId()));

    // The date-range chip is an event stream, so sync it into the store via RxJS
    // (the appropriate use of valueChanges, not an effect).
    this.form.controls.created.valueChanges
      .pipe(
        filter((created): created is NonNullable<typeof created> => Boolean(created?.end)),
        takeUntilDestroyed()
      )
      .subscribe((created) => this.store.dateRange.set(created));
  }

  // Show the initiator's GLN/name (displayName) when it is resolved (own actor / FAS);
  // otherwise fall back to the translated initiator role for masked actors.
  initiatorLabel(process: MeteringPointProcess): string | undefined {
    if (process.initiator?.displayName) return process.initiator.displayName;
    if (process.initiatorRole) {
      return translate('marketParticipant.marketRoles.' + process.initiatorRole);
    }
    return undefined;
  }

  onActionClick(event: Event, process: MeteringPointProcess, action: WorkflowAction) {
    event.stopPropagation();
    this.actionService.execute(
      action,
      process.businessReason,
      {
        meteringPointId: this.meteringPointId(),
        internalMeteringPointId: this.internalMeteringPointId(),
        processId: process.id,
        cutoffDate: process.cutoffDate,
      },
      this.isEnergySupplierResponsible(),
      process.initiator?.glnOrEicNumber
    );
  }

  onRequestCorrectionClick(event: Event, process: MeteringPointProcess) {
    event.stopPropagation();

    assertIsDefined(process.cutoffDate);

    this.requestIncorrectMoveIn.request(process.id, this.meteringPointId(), process.cutoffDate);
  }
}
