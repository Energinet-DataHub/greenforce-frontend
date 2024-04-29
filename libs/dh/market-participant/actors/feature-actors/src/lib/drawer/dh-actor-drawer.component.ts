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
import { Component, inject, ViewChild, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { Subject, Subscription, takeUntil } from 'rxjs';

import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { EicFunction, GetActorByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

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
import { DhBalanceResponsibleRelationTabComponent } from './balance-responsible-relation-tab/dh-balance-responsible-relation-tab.component';
import { DhActorAuditLogTabComponent } from './actor-audit-log-tab/dh-actor-audit-log-tab.component';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { RxPush } from '@rx-angular/template/push';

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
    TranslocoDirective,
    TranslocoPipe,
    RxPush,
    WATT_DRAWER,
    WATT_TABS,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    VaterStackComponent,
    DhFeatureFlagDirective,
    DhEmDashFallbackPipe,
    DhPermissionRequiredDirective,
    DhActorsEditActorModalComponent,
    DhActorStatusBadgeComponent,
    DhB2bAccessTabComponent,
    DhDelegationTabComponent,
    DhCanDelegateForDirective,
    DhBalanceResponsibleRelationTabComponent,
    DhActorAuditLogTabComponent,
  ],
})
export class DhActorDrawerComponent {
  private readonly apollo = inject(Apollo);
  private readonly permissionService = inject(PermissionService);
  private readonly closed$ = new Subject<void>();

  private subscription?: Subscription;

  private getActorByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    query: GetActorByIdDocument,
  });

  actor: DhActorExtended | undefined = undefined;
  hasActorAccess = false;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  closed = outputFromObservable(this.closed$);

  actorNumberNameLookup = input.required<{
    [Key: string]: {
      number: string;
      name: string;
    };
  }>();
  gridAreaCodeLookup = input.required<{
    [Key: string]: string;
  }>();

  public open(actorId: string): void {
    this.drawer?.open();
    this.loadActor(actorId);
  }

  onClose(): void {
    this.closed$.next();
  }

  get marketRoleOrFallback(): string {
    if (this.actor?.marketRole) {
      return translate('marketParticipant.marketRoles.' + this.actor.marketRole);
    }

    return emDash;
  }

  get isGridAccessProvider(): boolean {
    return this.actor?.marketRole === EicFunction.GridAccessProvider;
  }

  get gridAreaOrFallback() {
    const stringList = this.actor?.gridAreas?.map((gridArea) => gridArea.code).join(', ');
    return stringList ?? emDash;
  }

  public showBalanceResponsibleRelationTab(): boolean {
    return (
      this.actor?.marketRole === EicFunction.EnergySupplier ||
      this.actor?.marketRole === EicFunction.BalanceResponsibleParty
    );
  }

  private loadActor(id: string): void {
    this.subscription?.unsubscribe();

    this.getActorByIdQuery$.setVariables({ id });

    this.subscription = this.getActorByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed$))
      .subscribe({
        next: (result) => {
          this.actor = result.data?.actorById;
        },
      });

    this.permissionService
      .hasActorAccess(id)
      .pipe(takeUntil(this.closed$))
      .subscribe((hasAccess) => (this.hasActorAccess = hasAccess));
  }
}
