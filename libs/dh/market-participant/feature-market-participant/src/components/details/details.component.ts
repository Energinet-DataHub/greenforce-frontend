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
  input,
  inject,
  signal,
  output,
  effect,
  computed,
  Component,
  viewChild,
  DestroyRef,
  viewChildren,
} from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { combinePaths, MarketParticipantSubPaths } from '@energinet-datahub/dh/core/routing';

import {
  PermissionService,
  DhPermissionRequiredDirective,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  MarketParticipantStatus,
  GetMarketParticipantDetailsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattChipComponent } from '@energinet-datahub/watt/chip';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_TABS, WattTabComponent } from '@energinet-datahub/watt/tabs';
import { WATT_DRAWER, WattDrawerComponent, WattDrawerSize } from '@energinet-datahub/watt/drawer';
import { DhDelegationTabComponent } from '@energinet-datahub/dh/market-participant/feature-delegation';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe, emDash } from '@energinet-datahub/dh/shared/ui-util';
import { DhReleaseToggleDirective } from '@energinet-datahub/dh/shared/release-toggle';
import { DhMarketParticipantStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/ui-shared';

import { DhMarketParticipantAuditLogService } from './audit-log.service';
import { DhCanDelegateForDirective } from './util/dh-can-delegates-for.directive';
import { DhB2bAccessTabComponent } from './b2b-access-tab/dh-b2b-access-tab.component';
import { DhAccessToMeasurementsTab } from './access-to-measurements-tab/access-to-measurements-tab';
import { DhMarketParticipantAuditLogTabComponent } from './audit-log-tab/audit-log-tab.component';
import { DhBalanceResponsibleRelationTabComponent } from './balance-responsible-relation-tab/dh-balance-responsible-relation-tab.component';

@Component({
  selector: 'dh-market-participant-details',
  templateUrl: './details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  viewProviders: [DhMarketParticipantAuditLogService],
  imports: [
    RouterOutlet,
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
    DhReleaseToggleDirective,
    DhDelegationTabComponent,
    DhCanDelegateForDirective,
    DhAccessToMeasurementsTab,
    DhMarketParticipantAuditLogTabComponent,
    DhPermissionRequiredDirective,
    DhMarketParticipantStatusBadgeComponent,
    DhBalanceResponsibleRelationTabComponent,
  ],
})
export class DhMarketParticipantComponentDetails {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly navigation = inject(DhNavigationService);
  private readonly permissionService = inject(PermissionService);

  private readonly tabs = viewChildren(WattTabComponent);
  private readonly query = query(GetMarketParticipantDetailsDocument, () => ({
    variables: { id: this.id() },
  }));

  marketParticipant = computed(() => this.query.data()?.marketParticipantById);

  // Param
  id = input.required<string>();

  hasMarketParticipantAccess = signal(false);

  canEdit = computed(
    () =>
      this.hasMarketParticipantAccess() &&
      this.marketParticipant()?.status !== MarketParticipantStatus.Inactive &&
      this.marketParticipant()?.status !== MarketParticipantStatus.Passive &&
      this.marketParticipant()?.status !== MarketParticipantStatus.Discontinued
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
      this.marketParticipant()?.marketRole === EicFunction.EnergySupplier ||
      (this.marketParticipant()?.marketRole === EicFunction.BalanceResponsibleParty &&
        this.marketParticipant()?.status !== MarketParticipantStatus.Inactive &&
        this.marketParticipant()?.status !== MarketParticipantStatus.Passive &&
        this.marketParticipant()?.status !== MarketParticipantStatus.Discontinued)
  );

  showAdditionalRecipientsTab = computed(
    () => this.marketParticipant()?.marketRole !== EicFunction.EnergySupplier
  );

  marketRoleOrFallback = computed(() => {
    if (this.marketParticipant()?.marketRole) {
      return translate('marketParticipant.marketRoles.' + this.marketParticipant()?.marketRole);
    }

    return emDash;
  });

  isGridAccessProvider = computed(
    () => this.marketParticipant()?.marketRole === EicFunction.GridAccessProvider
  );

  gridAreaOrFallback = computed(() => {
    const gridAreaCodes = this.marketParticipant()
      ?.gridAreas?.map((gridArea) => gridArea.code)
      .join(', ');

    if (!gridAreaCodes || gridAreaCodes.length === 0) {
      return emDash;
    }

    return gridAreaCodes;
  });

  /**
   *
   */
  constructor() {
    effect(() => {
      this.permissionService
        .hasMarketParticipantAccess(this.id())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((hasAccess) => this.hasMarketParticipantAccess.set(hasAccess));
    });
  }

  editOrganization(id: string | undefined): void {
    const getLink = (path: MarketParticipantSubPaths) => combinePaths('market-participant', path);

    this.router.navigate([getLink('organizations'), 'details', id, 'edit']);
  }

  editMarketParticipant(): void {
    this.navigation.navigate('edit', this.id());
  }
}
