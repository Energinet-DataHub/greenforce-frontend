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
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { Subscription, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipe, emDash } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { EicFunction, GetActorByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';

import { DhDelegationTabComponent } from '@energinet-datahub/dh/market-participant/actors/feature-delagation';

import { DhActorExtended, dhActorAuditLogEntry } from '../dh-actor';
import { DhActorStatusBadgeComponent } from '../status-badge/dh-actor-status-badge.component';
import { DhActorsEditActorModalComponent } from '../edit/dh-actors-edit-actor-modal.component';
import { DhB2bAccessTabComponent } from './b2b-access-tab/dh-b2b-access-tab.component';

import { DhActorAuditLogService } from './dh-actor-audit-log.service';

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

    WATT_DRAWER,
    WATT_TABS,
    WATT_CARD,
    WATT_TABLE,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattDatePipe,
    VaterStackComponent,

    DhFeatureFlagDirective,
    DhEmDashFallbackPipe,
    DhPermissionRequiredDirective,
    DhActorsEditActorModalComponent,
    DhActorStatusBadgeComponent,
    DhB2bAccessTabComponent,
    DhDelegationTabComponent,
  ],
})
export class DhActorDrawerComponent {
  private readonly apollo = inject(Apollo);
  private readonly auditLogService = inject(DhActorAuditLogService);
  private readonly permissionService = inject(PermissionService);

  private subscription?: Subscription;
  private actorAuditLogSubscription?: Subscription;

  private getActorByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorByIdDocument,
  });

  actor: DhActorExtended | undefined = undefined;
  hasActorAccess = false;

  isLoadingAuditLog = false;
  auditLogFailedToLoad = false;

  auditLog = new WattTableDataSource<dhActorAuditLogEntry>([]);
  auditLogColumns: WattTableColumnDef<dhActorAuditLogEntry> = {
    timestamp: { accessor: 'timestamp' },
    currentValue: { accessor: 'currentValue' },
  };

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(actorId: string): void {
    this.drawer?.open();

    this.loadActor(actorId);
    this.loadAuditLog(actorId);
  }

  onClose(): void {
    this.closed.emit();
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

  private loadActor(id: string): void {
    this.subscription?.unsubscribe();

    this.getActorByIdQuery$.setVariables({ id });

    this.subscription = this.getActorByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.actor = result.data?.actorById;
        },
      });

    this.permissionService
      .hasActorAccess(id)
      .pipe(takeUntil(this.closed))
      .subscribe((hasAccess) => (this.hasActorAccess = hasAccess));
  }

  private loadAuditLog(actorId: string): void {
    this.actorAuditLogSubscription?.unsubscribe();

    this.auditLogService.getActorAuditLogByIdQuery$.setVariables({ actorId });

    this.actorAuditLogSubscription = this.auditLogService.getActorAuditLogByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.isLoadingAuditLog = result.loading;
          this.auditLogFailedToLoad =
            !result.loading && (!!result.error || !!result.errors?.length);

          this.auditLog.data = [...(result.data?.actorAuditLogs ?? [])].reverse();
        },
        error: () => {
          this.auditLogFailedToLoad = true;
          this.isLoadingAuditLog = false;
        },
      });
  }
}
