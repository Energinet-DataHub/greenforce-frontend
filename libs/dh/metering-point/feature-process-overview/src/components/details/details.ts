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
import { WattButtonComponent } from '@energinet/watt/button';
import { WattCopyToClipboardDirective } from '@energinet/watt/clipboard';
import { WattDatePipe } from '@energinet/watt/date';
import { WattExpandableLinkComponent } from '@energinet/watt/expandable-link';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattModalService } from '@energinet/watt/modal';
import { VaterGridComponent, VaterStackComponent } from '@energinet/watt/vater';

import { DhStateBadge, DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';
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
import { DhFasActionInfoModal } from '../fas-action-info-modal';

@Component({
  selector: 'dh-metering-point-process-overview-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    TranslocoDirective,
    WATT_DESCRIPTION_LIST,
    WATT_DRAWER,
    WattButtonComponent,
    WattCopyToClipboardDirective,
    WattDatePipe,
    WattExpandableLinkComponent,
    WattIconComponent,
    DhEmDashFallbackPipe,
    DhStateBadge,
    DhMeteringPointProcessOverviewSteps,
    VaterGridComponent,
    VaterStackComponent,
    SupportedActionsPipe,
  ],
  styles: `
    dh-metering-point-process-overview-details .watt-drawer header > vater-flex {
      flex-wrap: wrap;
      row-gap: var(--watt-space-m);
    }

    dh-metering-point-process-overview-details watt-expandable-link {
      // Gap from the description list above to the disclosure toggle.
      // Spec is 10px; watt-space-sm (12px) is the closest available token.
      margin-top: var(--watt-space-sm);
    }

    dh-metering-point-process-overview-details .fas-action-groups {
      // vater-grid handles display: grid and grid-template-columns; the gaps
      // and the surrounding inset are asymmetric so they stay as inline rules
      // rather than going through vater-grid's symmetric gap input.
      column-gap: var(--watt-space-m);
      row-gap: var(--watt-space-s);
      padding-top: var(--watt-space-s);
      padding-bottom: var(--watt-space-m);
    }

    dh-metering-point-process-overview-details .fas-action-group__title {
      margin: 0;
    }

    dh-metering-point-process-overview-details .dh-copy-process-id {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--watt-space-xs);
      color: var(--watt-color-primary);
    }

    dh-metering-point-process-overview-details .dh-copy-process-id:hover {
      color: var(--watt-color-primary-dark);
    }

    dh-metering-point-process-overview-details .dh-copy-process-id:focus-visible {
      outline: 2px solid var(--watt-color-primary);
      outline-offset: 2px;
      color: var(--watt-color-primary-dark);
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
          variant="inline-flow"
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

          <watt-description-list-item [label]="t('details.list.processId')">
            <button type="button" class="dh-copy-process-id" [wattCopyToClipboard]="id()">
              <watt-icon size="xs" name="contentCopy" />
              {{ t('details.list.copy') }}
            </button>
          </watt-description-list-item>

          @if (businessReason() !== 'ProductionObligation') {
            <watt-description-list-item
              [forceNewRow]="true"
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
        @if (isFas() && fasActionGroups().length > 0) {
          <watt-expandable-link
            *transloco="let t; prefix: 'meteringPoint.processOverview'"
            [labelCollapsed]="t('details.showPossibleActions')"
            [labelExpanded]="t('details.hidePossibleActions')"
          >
            <vater-grid class="fas-action-groups" columns="auto 1fr" align="center">
              @for (group of fasActionGroups(); track group.role) {
                <h4
                  class="watt-label fas-action-group__title"
                  *transloco="let tRole; prefix: 'marketParticipant.marketRoles'"
                >
                  {{ tRole(group.role) }}
                </h4>
                <vater-stack
                  direction="row"
                  gap="s"
                  *transloco="let t; prefix: 'meteringPoint.processOverview.actions'"
                >
                  @for (action of group.actions; track action) {
                    <watt-button
                      variant="secondary"
                      size="small"
                      (click)="openFasActionInfoModal()"
                    >
                      {{ t(businessReason() + '.' + action) }}
                    </watt-button>
                  }
                </vater-stack>
              }
            </vater-grid>
          </watt-expandable-link>
        }
      </watt-drawer-heading>
      @if (!isFas()) {
        <watt-drawer-actions *transloco="let t; prefix: 'meteringPoint.processOverview'">
          @for (
            action of process.data()?.meteringPointProcessById?.availableActions
              | supportedActions
                : businessReason()
                : isEnergySupplierResponsible()
                : initiatorGlnOrEic();
            track action
          ) {
            <watt-button variant="secondary" size="small" (click)="executeAction(action)">
              {{ t('actions.' + businessReason() + '.' + action) }}
            </watt-button>
          }
        </watt-drawer-actions>
      }
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
  private readonly modalService = inject(WattModalService);

  protected isFas = toSignal(this.permissionService.isFas(), { initialValue: false });

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
  initiatorGlnOrEic = computed(
    () => this.process.data()?.meteringPointProcessById?.initiator?.glnOrEicNumber
  );

  steps = computed(() => {
    const data = this.process.data();
    if (!data?.meteringPointProcessById) return [];
    return data.meteringPointProcessById.steps ?? [];
  });

  isLoading = computed(() => {
    return !this.process.called() || this.process.loading();
  });

  /**
   * For FAS users: actions supported by the current process grouped by actor role.
   * Rendered in the fixed order [EnergySupplier, GridAccessProvider]. An action that
   * belongs to multiple roles appears under each role's group (no deduplication).
   */
  fasActionGroups = computed<{ role: EicFunction; actions: WorkflowAction[] }[]>(() => {
    const reason = this.businessReason();
    if (!reason) return [];

    const availableActions = this.process.data()?.meteringPointProcessById?.availableActions ?? [];
    const supported = this.actionService.getSupportedActions(
      availableActions,
      reason,
      this.isEnergySupplierResponsible(),
      this.initiatorGlnOrEic()
    );

    const fasRoleOrder: EicFunction[] = [
      EicFunction.EnergySupplier,
      EicFunction.GridAccessProvider,
    ];

    return fasRoleOrder
      .map((role) => ({
        role,
        actions: supported.filter((action) =>
          this.actionService.getActorRolesForAction(action, reason).includes(role)
        ),
      }))
      .filter((group) => group.actions.length > 0);
  });

  openFasActionInfoModal() {
    this.modalService.open({ component: DhFasActionInfoModal });
  }

  executeAction(action: WorkflowAction) {
    const reason = this.businessReason();
    if (!reason) return;

    this.actionService.execute(
      action,
      reason,
      {
        meteringPointId: this.meteringPointId(),
        internalMeteringPointId: this.internalMeteringPointId(),
        processId: this.id(),
        cutoffDate: this.cutoffDate(),
        onSuccess: () => this.navigation.navigate('list'),
      },
      this.isEnergySupplierResponsible(),
      this.initiatorGlnOrEic()
    );
  }
}
