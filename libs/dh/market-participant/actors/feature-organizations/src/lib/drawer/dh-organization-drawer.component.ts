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
import { TranslocoModule } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';
import { Subscription, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_CARD } from '@energinet-datahub/watt/card';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  ActorStatus,
  EicFunction,
  GetActorsByOrganizationIdDocument,
  GetOrganizationByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { DhActorStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/actors/feature-actors';

type Actor = {
  actorNumberAndName: string;
  marketRole: EicFunction | null | undefined;
  status: ActorStatus;
};

@Component({
  selector: 'dh-organization-drawer',
  standalone: true,
  templateUrl: './dh-organization-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .organization-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .organization-metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .organization-metadata__item {
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
    WATT_TABLE,
    WATT_TABS,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattButtonComponent,

    DhActorStatusBadgeComponent,
    DhEmDashFallbackPipe,
    DhPermissionRequiredDirective,
  ],
})
export class DhOrganizationDrawerComponent {
  private apollo = inject(Apollo);
  private organizationSubscription?: Subscription;
  private actorsSubscription?: Subscription;

  private getOrganizationByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetOrganizationByIdDocument,
  });

  private getActorsByOrganizationIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorsByOrganizationIdDocument,
  });

  organization:
    | { organizationId: string; name: string; businessRegisterIdentifier: string; domain: string }
    | undefined = undefined;

  actors!: WattTableDataSource<Actor>;

  columns: WattTableColumnDef<Actor> = {
    actorNumberAndName: { accessor: 'actorNumberAndName' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(organizationId: string): void {
    this.drawer?.open();
    this.loadOrganization(organizationId);
    this.loadActors(organizationId);
  }

  onClose(): void {
    this.closed.emit();
  }

  private loadOrganization(id: string): void {
    this.organizationSubscription?.unsubscribe();

    this.getOrganizationByIdQuery$.setVariables({ id });

    this.organizationSubscription = this.getOrganizationByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.organization = { ...result.data.organizationById, organizationId: id };
        },
      });
  }

  private loadActors(organizationId: string): void {
    this.actorsSubscription?.unsubscribe();

    this.getActorsByOrganizationIdQuery$.setVariables({ organizationId });

    this.actorsSubscription = this.getActorsByOrganizationIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.actors = new WattTableDataSource<Actor>(
            [...result.data.actorsByOrganizationId]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((x) => ({
                actorNumberAndName: `${x.glnOrEicNumber} ${x.name}`,
                marketRole: x.marketRole,
                status: x.status,
              }))
          );
        },
      });
  }
}
