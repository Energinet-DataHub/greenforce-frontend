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
import { Component, computed, inject } from '@angular/core';

import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';

import { WATT_CARD } from '@energinet/watt/card';
import { WattModalService } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { VaterUtilityDirective } from '@energinet/watt/vater';
import { WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { WATT_MENU } from '@energinet/watt/menu';
import { WattIconComponent } from '@energinet/watt/icon';

import {
  WattDataTableComponent,
  WattDataFiltersComponent,
  WattDataActionsComponent,
} from '@energinet/watt/data';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhMarketParticipantStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/ui-shared';

import { DhMarketParticipant } from '@energinet-datahub/dh/market-participant/domain';
import { GetPaginatedMarketParticipantsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

import { Variables } from '../types';
import { DownloadMarketParticipants } from './download.component';
import { DhMergeMarketParticipantsComponent } from './dh-merge-market-participants.component';
import { DhMarketParticipantsFiltersComponent } from './market-participants-filters.component';

@Component({
  selector: 'dh-market-participants',
  templateUrl: './market-participants.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }
    `,
  ],
  providers: [DhNavigationService],
  imports: [
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WATT_MENU,
    WattIconComponent,
    WattButtonComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    VaterUtilityDirective,
    DhEmDashFallbackPipe,
    DownloadMarketParticipants,
    DhPermissionRequiredDirective,
    DhMarketParticipantsFiltersComponent,
    DhMarketParticipantStatusBadgeComponent,
  ],
})
export class DhMarketParticipantsComponent {
  private readonly navigationService = inject(DhNavigationService);
  private readonly modalService = inject(WattModalService);
  private readonly appInsights = inject(DhApplicationInsights);

  dataSource = new GetPaginatedMarketParticipantsDataSource();

  variables = computed(() => this.dataSource.query.getOptions().variables);

  columns: WattTableColumnDef<DhMarketParticipant> = {
    glnOrEicNumber: { accessor: 'glnOrEicNumber' },
    name: { accessor: 'name' },
    marketRole: {
      sort: false,
      accessor: (m) =>
        (m.marketRole && translate(`marketParticipant.marketRoles.${m.marketRole}`)) || '',
    },
    status: {
      accessor: (m) => translate(`marketParticipant.status.${m.status}`),
    },
  };

  navigate(id: string) {
    this.navigationService.navigate('details', id);
  }

  selection = () => {
    return this.dataSource.filteredData.find((row) => row.id === this.navigationService.id());
  };

  createMarketParticipant() {
    this.appInsights.trackEvent('Button: Create market participant');
    this.navigationService.navigate('create');
  }

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
  };

  mergeMarketParticipants() {
    this.appInsights.trackEvent('Button: Merge market participants');
    this.modalService.open({
      component: DhMergeMarketParticipantsComponent,
    });
  }
}
