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
import { Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';
import { MatMenuModule } from '@angular/material/menu';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef } from '@energinet-datahub/watt/table';
import { GetPaginatedMarketParticipantsQueryVariables } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhEmDashFallbackPipe, exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhMarketParticipantsFiltersComponent } from './market-participants-filters.component';
import { DhActorsCreateActorModalComponent } from './create/dh-actors-create-actor-modal.component';
import { DhMergeMarketParticipantsComponent } from './dh-merge-market-participants.component';
import { DhMarketParticipant } from '@energinet-datahub/dh/market-participant/domain';
import { GetPaginatedMarketParticipantsDataSource } from '@energinet-datahub/dh/shared/domain/graphql/data-source';
import {
  WattDataActionsComponent,
  WattDataFiltersComponent,
  WattDataTableComponent,
} from '@energinet-datahub/watt/data';
import { RouterOutlet } from '@angular/router';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhMarketParticipantStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/ui-shared';

type Variables = Partial<GetPaginatedMarketParticipantsQueryVariables>;

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
    TranslocoDirective,
    TranslocoPipe,
    MatMenuModule,
    RouterOutlet,
    WATT_CARD,
    DhEmDashFallbackPipe,
    DhMarketParticipantStatusBadgeComponent,
    WattDataTableComponent,
    WattDataActionsComponent,
    WattDataFiltersComponent,
    WATT_TABLE,
    VaterUtilityDirective,
    WattButtonComponent,
    DhMarketParticipantsFiltersComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhMarketParticipantsComponent {
  private readonly navigationService = inject(DhNavigationService);
  private readonly modalService = inject(WattModalService);

  dataSource = new GetPaginatedMarketParticipantsDataSource();

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

  createMarketParticipant(): void {
    this.modalService.open({
      component: DhActorsCreateActorModalComponent,
      disableClose: true,
    });
  }

  fetch = (variables: Variables) => {
    this.dataSource.refetch(variables);
  };

  mergeMarketParticipants(): void {
    this.modalService.open({
      component: DhMergeMarketParticipantsComponent,
    });
  }

  download(): void {
    if (!this.dataSource.sort) {
      return;
    }

    const marketParticipantsPath = 'marketParticipant.actorsOverview';

    const headers = [
      `"ID"`,
      `"${translate(marketParticipantsPath + '.columns.glnOrEic')}"`,
      `"${translate(marketParticipantsPath + '.columns.name')}"`,
      `"${translate(marketParticipantsPath + '.columns.marketRole')}"`,
      `"${translate(marketParticipantsPath + '.columns.status')}"`,
      `"${translate(marketParticipantsPath + '.columns.mail')}"`,
    ];

    const lines = this.dataSource.filteredData.map((marketParticipant) => [
      `"${marketParticipant.id}"`,
      `"""${marketParticipant.glnOrEicNumber}"""`,
      `"${marketParticipant.name}"`,
      `"${
        marketParticipant.marketRole == null
          ? ''
          : translate('marketParticipant.marketRoles.' + marketParticipant.marketRole)
      }"`,
      `"${marketParticipant.status == null ? '' : translate('marketParticipant.status.' + marketParticipant.status)}"`,
      `"${marketParticipant.publicMail?.mail ?? ''}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Market Participants' });
  }
}
