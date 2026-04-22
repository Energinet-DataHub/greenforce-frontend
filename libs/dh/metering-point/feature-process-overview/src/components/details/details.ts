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
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_DESCRIPTION_LIST } from '@energinet/watt/description-list';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { WattDatePipe } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';

import { DhStateBadge, DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  GetMeteringPointProcessByIdDocument,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';

import { DhMeteringPointProcessOverviewSteps } from './steps';
import { DhActionsRegistry } from '../../actions/registry';
import { SupportedActionsPipe } from '../../actions/supported-actions.pipe';

@Component({
  selector: 'dh-metering-point-process-overview-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslocoDirective,
    WATT_DESCRIPTION_LIST,
    WATT_DRAWER,
    WattDatePipe,
    DhEmDashFallbackPipe,
    DhStateBadge,
    DhMeteringPointProcessOverviewSteps,
    WattButtonComponent,
    SupportedActionsPipe,
  ],
  styles: `
    dh-metering-point-process-overview-details .watt-drawer header > vater-flex {
      flex-wrap: wrap;
      row-gap: var(--watt-space-m);
    }
  `,
  template: `
    <watt-drawer size="large" autoOpen [key]="id()" (closed)="navigation.navigate('list')">
      <watt-drawer-topbar>
        @if (isLoading() || state()) {
          <dh-state-badge [status]="state()" *transloco="let t; prefix: 'shared.states'">
            {{ t(state() ?? 'indeterminate') }}
          </dh-state-badge>
        }
      </watt-drawer-topbar>
      <watt-drawer-heading>
        <h3 class="watt-space-stack-s" *transloco="let t; prefix: 'meteringPoint.processOverview'">
          {{ businessReason() && t('processType.' + businessReason()) | dhEmDashFallback }}
        </h3>
        <watt-description-list
          [groupsPerRow]="4"
          *transloco="let t; prefix: 'meteringPoint.processOverview'"
        >
          <watt-description-list-item
            [label]="t('details.list.createdAt')"
            [value]="createdAt() | wattDate: 'long' | dhEmDashFallback"
          />

          <watt-description-list-item
            [label]="t('details.list.cutoff')"
            [value]="cutoffDate() | wattDate | dhEmDashFallback"
          />

          @if (businessReason() !== 'ProductionObligation') {
            <watt-description-list-item
              [label]="t('details.list.businessReason')"
              [value]="
                businessReason()
                  ? t('businessReason.' + businessReason())
                  : (null | dhEmDashFallback)
              "
            />
          }

          <watt-description-list-item
            [label]="t('details.list.initiator')"
            [value]="initiator() | dhEmDashFallback"
          />
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-actions *transloco="let t; prefix: 'meteringPoint.processOverview'">
        @if (canShowActions()) {
          @for (
            action of process.data()?.meteringPointProcessById?.availableActions
              | supportedActions: businessReason();
            track action
          ) {
            <watt-button variant="secondary" [disabled]="isFas()" (click)="executeAction(action)">
              {{ t('actions.' + businessReason() + '.' + action) }}
            </watt-button>
          }
        }
      </watt-drawer-actions>
      <watt-drawer-content>
        <dh-metering-point-process-overview-steps
          [steps]="steps()"
          [businessReason]="businessReason()"
          [loading]="isLoading()"
          [error]="process.error()"
        />
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhMeteringPointProcessOverviewDetails {
  readonly id = input.required<string>();
  readonly meteringPointId = input.required<string>();
  readonly internalMeteringPointId = input.required<string>();
  readonly isEnergySupplierResponsible = input.required<boolean>();
  protected navigation = inject(DhNavigationService);
  private readonly actionService = inject(DhActionsRegistry);
  private readonly permissionService = inject(PermissionService);
  private readonly actor = inject(DhActorStorage).getSelectedActor();

  protected isFas = toSignal(this.permissionService.isFas(), { initialValue: false });
  // Market role comes from the currently selected actor, not from token claims,
  // so it is known synchronously at component creation. This avoids a brief
  // flicker where a non-responsible supplier would see action buttons before
  // the token-based role signal resolves.
  private readonly hasEnergySupplierRole = this.actor.marketRole === EicFunction.EnergySupplier;

  private readonly isNonResponsibleSupplier = computed(
    () => this.hasEnergySupplierRole && !this.isEnergySupplierResponsible()
  );

  // A non-responsible supplier sees no actions at all, not even the disabled
  // FAS-style buttons, since they have no legitimate relation to this metering point.
  protected readonly canShowActions = computed(() => !this.isNonResponsibleSupplier());

  process = query(GetMeteringPointProcessByIdDocument, () => ({
    fetchPolicy: 'cache-and-network',
    returnPartialData: true,
    variables: {
      id: this.id(),
    },
  }));

  state = computed(() => this.process.data()?.meteringPointProcessById?.state);
  createdAt = computed(() => this.process.data()?.meteringPointProcessById?.createdAt);
  cutoffDate = computed(() => this.process.data()?.meteringPointProcessById?.cutoffDate);
  businessReason = computed(() => this.process.data()?.meteringPointProcessById?.businessReason);
  initiator = computed(() => this.process.data()?.meteringPointProcessById?.initiator?.displayName);

  steps = computed(() => {
    const data = this.process.data();
    if (!data?.meteringPointProcessById) return [];
    return data.meteringPointProcessById.steps ?? [];
  });

  isLoading = computed(() => {
    return !this.process.called() || this.process.loading();
  });

  executeAction(action: WorkflowAction) {
    const reason = this.businessReason();
    if (!reason) return;
    if (!this.canShowActions()) return;

    this.actionService.execute(action, reason, {
      meteringPointId: this.meteringPointId(),
      internalMeteringPointId: this.internalMeteringPointId(),
      processId: this.id(),
      cutoffDate: this.cutoffDate(),
      onSuccess: () => this.navigation.navigate('list'),
    });
  }
}
