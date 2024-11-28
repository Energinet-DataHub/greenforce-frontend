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
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Component, inject, effect, viewChild, computed, input } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  ActorStatus,
  EicFunction,
  GetActorsByOrganizationIdDocument,
  GetOrganizationByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActorStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/actors/feature-actors';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhOrganizationHistoryComponent } from './tabs/dh-organization-history.component';

type Actor = {
  actorNumberAndName: string;
  marketRole: EicFunction | null | undefined;
  status: ActorStatus;
};

@Component({
  selector: 'dh-organization-details',
  standalone: true,
  templateUrl: './dh-organization-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    RouterOutlet,

    TranslocoPipe,
    TranslocoDirective,

    WATT_TABS,
    WATT_CARD,
    WATT_TABLE,
    WATT_DRAWER,

    VaterStackComponent,

    WattButtonComponent,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhActorStatusBadgeComponent,
    DhPermissionRequiredDirective,

    DhOrganizationHistoryComponent,
  ],
})
export class DhOrganizationDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private getOrganizationByIdQuery = lazyQuery(GetOrganizationByIdDocument);
  private getActorsByOrganizationIdQuery = lazyQuery(GetActorsByOrganizationIdDocument);

  isLoadingOrganization = this.getOrganizationByIdQuery.loading;
  organizationFailedToLoad = computed(() => this.getOrganizationByIdQuery.error() !== undefined);

  isLoadingActors = this.getActorsByOrganizationIdQuery.loading;
  actorsFailedToLoad = computed(() => this.getActorsByOrganizationIdQuery.error() !== undefined);

  organization = computed(() => this.getOrganizationByIdQuery.data()?.organizationById);

  actors = new WattTableDataSource<Actor>([]);

  // Router param
  id = input.required<string>();

  setActorDataSource = effect(() => {
    const data = this.getActorsByOrganizationIdQuery.data()?.actorsByOrganizationId;

    this.actors.data = data
      ? [...data]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((x) => ({
            actorNumberAndName: `${x.glnOrEicNumber} ${x.name}`,
            marketRole: x.marketRole,
            status: x.status,
          }))
      : [];
  });

  actorColumns: WattTableColumnDef<Actor> = {
    actorNumberAndName: { accessor: 'actorNumberAndName' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  drawer = viewChild.required(WattDrawerComponent);

  constructor() {
    effect(() => {
      const id = this.id();
      const drawer = this.drawer();

      if (!id || !drawer) return;
      this.getOrganizationByIdQuery.refetch({ id });
      this.getActorsByOrganizationIdQuery.refetch({ organizationId: id });
      drawer.open();
    });
  }

  onClose(): void {
    this.router.navigate(['../../'], {
      relativeTo: this.route,
    });
    this.drawer().close();
  }

  navigateEdit(): void {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
    });
  }
}
