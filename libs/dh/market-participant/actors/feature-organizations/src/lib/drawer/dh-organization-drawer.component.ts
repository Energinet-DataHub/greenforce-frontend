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
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, input, effect, viewChild, output, computed } from '@angular/core';

import { map } from 'rxjs';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  ActorStatus,
  EicFunction,
  GetActorsByOrganizationIdDocument,
  GetOrganizationByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActorStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/actors/feature-actors';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattModalService } from '@energinet-datahub/watt/modal';
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

import { DhOrganizationEditModalComponent } from '../edit/dh-edit-modal.component';
import { DhOrganizationHistoryComponent } from './tabs/dh-organization-history.component';

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
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABS,
    WATT_CARD,
    WATT_TABLE,
    WATT_DRAWER,

    VaterStackComponent,

    WattDatePipe,
    WattButtonComponent,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
    DhActorStatusBadgeComponent,
    DhPermissionRequiredDirective,

    DhOrganizationHistoryComponent,
    DhOrganizationEditModalComponent,
  ],
})
export class DhOrganizationDrawerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(WattModalService);
  private getOrganizationByIdQuery = lazyQuery(GetOrganizationByIdDocument);
  private getActorsByOrganizationIdQuery = lazyQuery(GetActorsByOrganizationIdDocument);

  id = input<string>();

  isLoadingOrganization = this.getOrganizationByIdQuery.loading;
  organizationFailedToLoad = computed(() => this.getOrganizationByIdQuery.error !== undefined);

  isLoadingActors = this.getActorsByOrganizationIdQuery.loading;
  actorsFailedToLoad = computed(() => this.getActorsByOrganizationIdQuery.error !== undefined);

  organization = computed(() => this.getOrganizationByIdQuery.data()?.organizationById);

  actors: WattTableDataSource<Actor> = new WattTableDataSource<Actor>([]);

  edit = toSignal<string>(this.route.queryParams.pipe(map((p) => p.edit ?? false)));

  openEditModal = effect(() => {
    if (this.edit() && this.organization()) {
      this.modalService.open({
        component: DhOrganizationEditModalComponent,
        data: this.organization(),
        onClosed: () =>
          this.router.navigate([], {
            queryParamsHandling: 'merge',
            relativeTo: this.route,
            queryParams: { edit: null },
          }),
      });
    }
  });

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

  drawer = viewChild(WattDrawerComponent);

  closed = output<void>();

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
    this.closed.emit();
  }

  navigateEdit(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { edit: true },
      queryParamsHandling: 'merge',
    });
  }
}
