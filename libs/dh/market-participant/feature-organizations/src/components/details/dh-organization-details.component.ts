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
import { RouterOutlet } from '@angular/router';
import { input, inject, effect, computed, Component, viewChild } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import {
  MarketParticipantStatus,
  EicFunction,
  GetOrganizationByIdDocument,
  GetMarketParticipantsByOrganizationIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhResultComponent } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { DhOrganizationHistoryComponent } from './tabs/dh-organization-history.component';
import { DhMarketParticipantStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/ui-shared';

type MarketParticipant = {
  actorNumberAndName: string;
  marketRole: EicFunction | null | undefined;
  status: MarketParticipantStatus;
};

@Component({
  selector: 'dh-organization-details',
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
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhResultComponent,
    DhMarketParticipantStatusBadgeComponent,
    DhPermissionRequiredDirective,
    DhOrganizationHistoryComponent,
  ],
})
export class DhOrganizationDetailsComponent {
  private readonly navigationService = inject(DhNavigationService);
  private readonly getOrganizationByIdQuery = query(GetOrganizationByIdDocument, () => ({
    variables: { id: this.id() },
  }));
  private readonly getMarketParticipantsByOrganizationIdQuery = query(
    GetMarketParticipantsByOrganizationIdDocument,
    () => ({ variables: { organizationId: this.id() } })
  );

  isLoadingOrganization = this.getOrganizationByIdQuery.loading;
  organizationFailedToLoad = this.getOrganizationByIdQuery.hasError;

  isLoadingMarketParticipants = this.getMarketParticipantsByOrganizationIdQuery.loading;
  actorsFailedToLoad = this.getMarketParticipantsByOrganizationIdQuery.hasError;

  organization = computed(() => this.getOrganizationByIdQuery.data()?.organizationById);

  actors = new WattTableDataSource<MarketParticipant>([]);

  // Router param
  id = input.required<string>();

  setMarketParticipantDataSource = effect(() => {
    const data =
      this.getMarketParticipantsByOrganizationIdQuery.data()?.marketParticipantsByOrganizationId;

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

  actorColumns: WattTableColumnDef<MarketParticipant> = {
    actorNumberAndName: { accessor: 'actorNumberAndName' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  drawer = viewChild.required(WattDrawerComponent);

  onClose(): void {
    this.navigationService.navigate('list');
    this.drawer().close();
  }

  navigateEdit(): void {
    this.navigationService.navigate('edit', this.id());
  }
}
