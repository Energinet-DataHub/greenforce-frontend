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
  Component,
  inject,
  signal,
  computed,
  viewChild,
  DestroyRef,
  output,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { combinePaths, MarketParticipantSubPaths } from '@energinet-datahub/dh/core/routing';

import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import {
  ActorStatus,
  EicFunction,
  GetActorDetailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABS, WattTabComponent } from '@energinet-datahub/watt/tabs';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattChipComponent } from '@energinet-datahub/watt/chip';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_DRAWER, WattDrawerComponent, WattDrawerSize } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipe, emDash } from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhDelegationTabComponent } from '@energinet-datahub/dh/market-participant/actors/feature-delegation';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/release-toggle';
import { DhMarketParticipantStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/status-badge';

import { DhActorAuditLogService } from './dh-actor-audit-log.service';
import { DhCanDelegateForDirective } from './util/dh-can-delegates-for.directive';
import { DhB2bAccessTabComponent } from './b2b-access-tab/dh-b2b-access-tab.component';
import { DhActorsEditActorModalComponent } from '../edit/dh-actors-edit-actor-modal.component';
import { DhActorAuditLogTabComponent } from './actor-audit-log-tab/dh-actor-audit-log-tab.component';
import { DhBalanceResponsibleRelationTabComponent } from './balance-responsible-relation-tab/dh-balance-responsible-relation-tab.component';
import { DhAccessToMeasurementsTab } from './access-to-measurements-tab/access-to-measurements-tab';

@Component({
  selector: 'dh-actor-drawer',
  templateUrl: './dh-actor-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  viewProviders: [DhActorAuditLogService],
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABS,
    WATT_CARD,
    WATT_DRAWER,
    WattChipComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    VaterStackComponent,
    DhEmDashFallbackPipe,
    DhB2bAccessTabComponent,
    DhDelegationTabComponent,
    DhCanDelegateForDirective,
    DhActorAuditLogTabComponent,
    DhMarketParticipantStatusBadgeComponent,
    DhPermissionRequiredDirective,
    DhBalanceResponsibleRelationTabComponent,
    DhAccessToMeasurementsTab,
    DhReleaseToggleDirective,
  ],
})
export class DhActorDrawerComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private modalService = inject(WattModalService);
  private permissionService = inject(PermissionService);

  private readonly tabs = viewChildren(WattTabComponent);
  private readonly query = lazyQuery(GetActorDetailsDocument);

  actor = computed(() => this.query.data()?.actorById);

  hasActorAccess = signal(false);
  canEdit = computed(
    () =>
      this.hasActorAccess() &&
      this.actor()?.status !== ActorStatus.Inactive &&
      this.actor()?.status !== ActorStatus.Passive &&
      this.actor()?.status !== ActorStatus.Discontinued
  );
  closed = output();

  drawerSize = computed<WattDrawerSize>(() => {
    const largeSizeIfTabsCount = 6;

    return this.tabs().length >= largeSizeIfTabsCount ? 'large' : 'normal';
  });

  isLoading = this.query.loading;

  drawer = viewChild.required(WattDrawerComponent);

  showBalanceResponsibleRelationTab = computed(
    () =>
      this.actor()?.marketRole === EicFunction.EnergySupplier ||
      (this.actor()?.marketRole === EicFunction.BalanceResponsibleParty &&
        this.actor()?.status !== ActorStatus.Inactive &&
        this.actor()?.status !== ActorStatus.Passive &&
        this.actor()?.status !== ActorStatus.Discontinued)
  );

  showAdditionalRecipientsTab = computed(
    () => this.actor()?.marketRole !== EicFunction.EnergySupplier
  );

  marketRoleOrFallback = computed(() => {
    if (this.actor()?.marketRole) {
      return translate('marketParticipant.marketRoles.' + this.actor()?.marketRole);
    }

    return emDash;
  });

  isGridAccessProvider = computed(
    () => this.actor()?.marketRole === EicFunction.GridAccessProvider
  );

  gridAreaOrFallback = computed(() => {
    const gridAreaCodes = this.actor()
      ?.gridAreas?.map((gridArea) => gridArea.code)
      .join(', ');

    if (!gridAreaCodes || gridAreaCodes.length === 0) {
      return emDash;
    }

    return gridAreaCodes;
  });

  open(actorId: string): void {
    this.drawer().open();

    this.permissionService
      .hasActorAccess(actorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((hasAccess) => this.hasActorAccess.set(hasAccess));

    this.query.query({ variables: { id: actorId } });
  }

  editOrganization(id: string | undefined): void {
    const getLink = (path: MarketParticipantSubPaths) => combinePaths('market-participant', path);

    this.router.navigate([getLink('organizations'), 'details', id, 'edit']);
  }

  editActor(): void {
    this.modalService.open({ component: DhActorsEditActorModalComponent, data: this.actor() });
  }
}
