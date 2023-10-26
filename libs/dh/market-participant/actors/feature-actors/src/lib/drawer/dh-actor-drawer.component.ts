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
import { NgIf } from '@angular/common';
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoModule, translate } from '@ngneat/transloco';
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
import {
  ActorAuditLogType,
  ContactCategory,
  GetActorByIdDocument,
  GetAuditLogByActorIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActorExtended, dhActorAuditLogEntry } from '../dh-actor';
import { DhActorStatusBadgeComponent } from '../status-badge/dh-actor-status-badge.component';
import { DhActorsEditActorModalComponent } from '../edit/dh-actors-edit-actor-modal.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';

type ActorAuditLogEntry = {
  changeType: ActorAuditLogType;
  currentValue: string;
  previousValue: string;
  category: ContactCategory;
  identity: string;
  timestamp: Date;
};

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
  imports: [
    NgIf,
    TranslocoModule,

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

    DhEmDashFallbackPipe,
    DhPermissionRequiredDirective,
    DhActorsEditActorModalComponent,
    DhActorStatusBadgeComponent,
    VaterStackComponent,
  ],
})
export class DhActorDrawerComponent {
  private apollo = inject(Apollo);
  private subscription?: Subscription;
  private actorAuditLogSubscription?: Subscription;

  private getActorByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorByIdDocument,
  });

  private getActorAuditLogByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetAuditLogByActorIdDocument,
  });

  actor: DhActorExtended | undefined = undefined;
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

  get gridAreaOrFallback() {
    return this.actor?.gridAreas?.[0]?.code ?? emDash;
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
  }

  private loadAuditLog(actorId: string): void {
    this.actorAuditLogSubscription?.unsubscribe();

    this.getActorAuditLogByIdQuery$.setVariables({ actorId });

    this.actorAuditLogSubscription = this.getActorAuditLogByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.isLoadingAuditLog = result.loading;
          this.auditLogFailedToLoad =
            !result.loading && (!!result.error || !!result.errors?.length);

          this.auditLog.data = result.data?.actorAuditLogs;
        },
        error: () => {
          this.auditLogFailedToLoad = true;
          this.isLoadingAuditLog = false;
        },
      });
  }
}
