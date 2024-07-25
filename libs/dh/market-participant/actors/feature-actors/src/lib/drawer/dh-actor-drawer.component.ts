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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, inject, input, signal, computed, viewChild, DestroyRef } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { EicFunction, GetActorByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { DhEmDashFallbackPipe, emDash } from '@energinet-datahub/dh/shared/ui-util';
import { DhDelegationTabComponent } from '@energinet-datahub/dh/market-participant/actors/feature-delagation';

import { DhActorAuditLogService } from './dh-actor-audit-log.service';
import { DhCanDelegateForDirective } from './util/dh-can-delegates-for.directive';
import { DhB2bAccessTabComponent } from './b2b-access-tab/dh-b2b-access-tab.component';
import { DhActorStatusBadgeComponent } from '../status-badge/dh-actor-status-badge.component';
import { DhActorsEditActorModalComponent } from '../edit/dh-actors-edit-actor-modal.component';
import { DhActorAuditLogTabComponent } from './actor-audit-log-tab/dh-actor-audit-log-tab.component';
import { DhBalanceResponsibleRelationTabComponent } from './balance-responsible-relation-tab/dh-balance-responsible-relation-tab.component';

@Component({
  selector: 'dh-actor-drawer',
  standalone: true,
  templateUrl: './dh-actor-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .actor-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .actor-metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .actor-metadata__item {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
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
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattButtonComponent,
    WattSpinnerComponent,

    VaterStackComponent,

    DhEmDashFallbackPipe,
    DhFeatureFlagDirective,
    DhB2bAccessTabComponent,
    DhDelegationTabComponent,
    DhCanDelegateForDirective,
    DhActorAuditLogTabComponent,
    DhActorStatusBadgeComponent,
    DhPermissionRequiredDirective,
    DhActorsEditActorModalComponent,
    DhBalanceResponsibleRelationTabComponent,
  ],
})
export class DhActorDrawerComponent {
  private readonly permissionService = inject(PermissionService);
  private readonly destroyRef = inject(DestroyRef);

  actorQuery = lazyQuery(GetActorByIdDocument);

  actor = computed(() => this.actorQuery.data()?.actorById);

  hasActorAccess = signal(false);

  isLoading = this.actorQuery.loading;

  drawer = viewChild.required<WattDrawerComponent>(WattDrawerComponent);

  actorNumberNameLookup = input.required<{
    [Key: string]: {
      number: string;
      name: string;
    };
  }>();

  gridAreaCodeLookup = input.required<{
    [Key: string]: string;
  }>();

  showBalanceResponsibleRelationTab = computed(
    () =>
      this.actor()?.marketRole === EicFunction.EnergySupplier ||
      this.actor()?.marketRole === EicFunction.BalanceResponsibleParty
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
    const stringList = this.actor()
      ?.gridAreas?.map((gridArea) => gridArea.code)
      .join(', ');

    return stringList ?? emDash;
  });

  public open(actorId: string): void {
    this.drawer().open();

    console.log("open called for actor ", actorId)

    this.permissionService
      .hasActorAccess(actorId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((hasAccess) => {
        console.log("access set to ", hasAccess, " for actor ", actorId)
        return this.hasActorAccess.set(hasAccess);
      });

    this.actorQuery.query({ variables: { id: actorId } });
  }
}
